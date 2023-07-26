require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { google } = require('googleapis');

const drive = google.drive('v3');


//const getReport = require('./routes/report');
//oauth

const app = express()

//app.use('/report', getReport);

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUR_CLIENT_ID,
  process.env.YOUR_CLIENT_SECRET,
  process.env.YOUR_REDIRECT_URL
);

app.get('/auth/google', (req, res) => {

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/drive.metadata.readonly'],
      });

    res.send(authorizationUrl);
});

app.get('/report', async (req,res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // const d = await drive.files.list({auth: oauth2Client,
    //     pageSize: 10,
    //     fields: 'nextPageToken, files(id, name)'});
    // console.log(d);
    fs.writeFileSync("creds.json", JSON.stringify(tokens));
    res.send('done');
});

app.get('/drive', async (req, res) => {
    const tokens = fs.readFileSync("creds.json");
    const token = JSON.parse(tokens);
    oauth2Client.setCredentials(token);
    const d = await drive.files.list({auth: oauth2Client,
        fields: 'nextPageToken, files(fileExtension, shared, webViewLink, size, id, name, ownedByMe, capabilities, permissions)'});
    res.send(d.data.files);
})


app.listen(3000);
