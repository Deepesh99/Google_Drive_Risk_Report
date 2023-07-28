
# jarviot-challenge-full-stack-backend

## Setup
- Download .zip folder

- Open the folder in vscode

- Run 'npm i' in terminal

- Create .env file with below details

## Start the app
- Run 'npm run dev' or 'num start'

## Database setup
- In MySQL workbench create a schema 

- Insert Schema name, username and password in env file

## Routing
- To authenticate and authorize: `GET http://localhost:3000/auth/google` will return a link which is for the google Oauth2 consent page. Paste the link in browser and complete the sign in
![2](https://github.com/Deepesh99/media/blob/main/drive-app/auth1.JPG?raw=true)
![3](https://github.com/Deepesh99/media/blob/main/drive-app/auth2.JPG?raw=true)

- To get the analytics: `GET http://localhost:3000/drive` and set headers where key=email and value=useremail
![1](https://github.com/Deepesh99/media/blob/main/drive-app/result.JPG?raw=true) 

- To revoke access: `GET http://localhost:3000/revoke` and set headers where key=email and value=useremail
![4](https://github.com/Deepesh99/media/blob/main/drive-app/revoke.JPG?raw=true)
