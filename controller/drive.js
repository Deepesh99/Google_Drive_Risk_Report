require('dotenv').config();
const fs = require('fs');
const { google } = require('googleapis');
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
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync("creds.json", JSON.stringify(tokens));
    res.send('done');
}

exports.analytics = async (req, res) => {
    const tokens = fs.readFileSync("creds.json");
    const token = JSON.parse(tokens);
    oauth2Client.setCredentials(token);
    const d = await drive.files.list({auth: oauth2Client,
        fields: 'nextPageToken, files(fileExtension, shared, webViewLink, size, id, name, ownedByMe, capabilities, permissions)'});
    res.send(d.data.files);
}

exports.revoke = (req,res) => {
    const creds = fs.readFileSync("creds.json");
    const tokens = JSON.parse(creds);
    const token = tokens.access_token
    oauth2Client.revokeToken(token);
    res.send("access revoked!!")
}