require('dotenv').config();
// const fs = require('fs');
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

        if(!user ) {
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
        
        //req.setHeaders('email', user.email);
        // res.headers('email', `${user.email}`);
        // res.redirect('drive');
        res.send("authentication done");

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
        if(!user) throw "User not registered";
        const token = JSON.parse(user.authCred);
        oauth2Client.setCredentials(token);
        const d = await drive.files.list({auth: oauth2Client,
            fields: 'nextPageToken, files(shared, webViewLink, id, name, owners, permissions)'
        });

        files = d.data.files
        let publicFiles = [];
        let peopleWithAccess = new Set();
        let sharedExternally = [];

    
  
    let riskScore = 0;
    files.forEach((file) => {
      const permissions = file.permissions;
      const owners = file.owners;      
      let creators = [];
      if(typeof(owners) === "object"){
          owners.forEach((owner) => {

                const owners = {
                    name: owner.displayName,
                    email: owner.emailAddress
                }
                creators.push(owners)
          })  
      }

      let sharedWith = [];
      if(typeof(permissions) === 'object'){
          permissions.forEach((permission) => {

            if(permission.displayName && permission.emailAddress){
                const share = {
                    name: permission.displayName,
                    email: permission.emailAddress
                }
                sharedWith.push(share);
            }
          })
      }
       if (permissions && permissions.length > 0) {
        permissions.forEach((permission) => {
            if(permission.type === 'anyone' && permission.role === 'reader'){
                const newFile = {
                    type: "Public File",
                    fileName: file.name,
                    webViewLink: file.webViewLink,
                    accessSetting: "Anyone with Link",
                    sharedWith: sharedWith,
                    createdBy: creators,    
                }
                
                publicFiles.push(newFile);
                riskScore += 5;
            }
            else if(permission.type === 'domain' || (permission.type === 'user' && permission.emailAddress != email && permission.role === 'writer')){
                const newFile = {
                    type: "Externally Shared",
                    fileName: file.name,
                    webViewLink: file.webViewLink,
                    accessSetting: "Files shared Externally",
                    sharedWith: sharedWith,
                    createdBy: creators,    
                }
                
                sharedExternally.push(newFile);
                peopleWithAccess.add(permission.emailAddress);
                riskScore += 3;
            }
        });
      }
    });

    let ownedByMe = []
    sharedExternally.forEach((file) => {
        if(file.createdBy[0].email === email) {
            ownedByMe.push(file);
        }
    })

    let result = []
    result.push({sharedExternally: sharedExternally.length});
    result.push({publicFiles: publicFiles.length});
    result.push({peopleWithAccess: peopleWithAccess.size});

    riskScore = riskScore - sharedExternally.length + ownedByMe.length;


    result.push({riskScore});
    result.push({PublicFiles: publicFiles});
    result.push({sharedExternally: sharedExternally});


    res.json(result);
    } catch(err) {
        res.send(err);
    }
    
}

exports.revoke = async (req,res) => {

    try {
        const { email } = req.headers;
        const user = await UserAuth.findOne({ where: { email } });
        if(!user) throw "User not registered";
        const tokens = JSON.parse(user.authCred);
        const token = tokens.access_token;
        oauth2Client.revokeToken(token);
        res.send("access revoked!!");
    } catch(err) {
        res.send(err);
    }
    
}