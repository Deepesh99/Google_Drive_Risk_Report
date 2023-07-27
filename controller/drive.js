require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const UserAuth = require('../model/userauth');
const drive = google.drive('v3');

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUR_CLIENT_ID,
  process.env.YOUR_CLIENT_SECRET,
  process.env.YOUR_REDIRECT_URL
);

exports.auth1 = (req, res) => {

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/drive.metadata.readonly'],
      });

    res.send(authorizationUrl);
}

exports.auth2 = async (req, res) => {

    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        const userInfo = jwt.decode(tokens.id_token, {complete: true});
        const userEmail = userInfo.payload.email;

        const user = await UserAuth.findOne({ where: { email: userEmail } });

        if(!user) {
            await UserAuth.create({
                email: userEmail,
                authCred: JSON.stringify(tokens)
            })
        } else {
            await UserAuth.update(
                {authCred: JSON.stringify(tokens)},
                {where: {email: user.email}}
            );
        };
        // req.setHeader( {email: userEmail});
        res.send("Authentication Completed");

        // console.log(userEmail);
        // oauth2Client.setCredentials(tokens);
        // fs.writeFileSync("creds.json", JSON.stringify(tokens));
        // res.send('done');
    } catch (err) {
        console.log(err);
    }
    
}

exports.analytics = async (req, res) => {
    
    try {
        const { email } = req.headers;
        const user = await UserAuth.findOne({ where: { email } });
        const token = JSON.parse(user.authCred);
        oauth2Client.setCredentials(token);
        const d = await drive.files.list({auth: oauth2Client,
            fields: 'nextPageToken, files(fileExtension, shared, webViewLink, size, id, name, ownedByMe, capabilities, permissions)'});
        res.send(d.data.files);
    } catch(err) {
        res.send(err.errors[0].message);
    }
    
}

exports.revoke = async (req,res) => {

    try {
        const { email } = req.headers;
        const user = await UserAuth.findOne({ where: { email } });
        const tokens = JSON.parse(user.authCred);
        const token = tokens.access_token;
        oauth2Client.revokeToken(token);
        res.send("access revoked!!");
    } catch(err) {
        res.send(err);
    }
    
}