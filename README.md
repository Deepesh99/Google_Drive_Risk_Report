# jarviot-challenge-full-stack-backend

Setup
 Download .zip folder
 open the folder in vscode
 run 'npm i' in terminal
 create .env file with below details

Start the app
 run 'npm run dev' or 'num start'

Database setup

Routing
 To authenticate and authorize: GET http://localhost:3000/auth/google will return a link which is for the google Oauth2 consent page.
  paste the link in browser and complete the sign in
 To get the analytics: GET localhost:3000/drive and set headers where key=email and value=useremail
 To revoke access: GET localhost:3000/revoke and set headers where key=email and value=useremail
 