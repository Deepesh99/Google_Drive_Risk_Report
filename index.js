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
        scope: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
      });

    res.redirect(authorizationUrl);
});

app.get('/oauth2callback', async (req,res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync("creds.json", JSON.stringify(tokens));
    res.send('done');
});

// app.get('/drive', (req, res) => {
// //drive logic
// try{
//     const creds = fs.readFileSync("creds.json");

// oauth2Client.setCredentials(JSON.parse(creds));

// drive.files.list({auth: oauth2Client,pageSize: 10,fields: 'nextPageToken, files(id, name)',}, (err1, res1) => {
//     if (err1) return console.log('The API returned an error: ' + err1);
//     console.log("here");
//     const files = res1.data.files;
//     if (files.length) {
//       console.log('Files:');
//       files.map((file) => {
//         console.log(`${file.name} (${file.id})`);
//       });
//     } else {
//       console.log('No files found.');
//     }
//   });
//   res.send("done");

// } catch (err){
//     console.log(err);
// }

// })


app.listen(3000);
