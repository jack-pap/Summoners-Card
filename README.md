
<p align="center">
   <img alt="logo" src="./frontend/docs/logo.png">
</p>
 
<p align="center">
  
  <img src="https://img.shields.io/badge/Riot_API-%23EB0029?logo=riotgames" alt="Riot API Badge">
  <img src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs" alt="Next.js Badge">
  <img src="https://img.shields.io/badge/Express.js-black?logo=express" alt="Express.js Badge">
  <img src="https://img.shields.io/badge/Vercel-black?logo=vercel" alt="Vercel Badge">
  <img src="https://img.shields.io/badge/Jest.js-%2366C026?logo=jest" alt="Jest Badge">
  <img src="https://img.shields.io/badge/React.js-gray?logo=react&logoColor=%2361DAFB" alt="React.js Badge">
  <img src="https://img.shields.io/badge/Node.js-gray?logo=nodedotjs&logoColor=%235FA04E" alt="Node.js Badge" style="display: inline-block;">
  <img src="https://img.shields.io/badge/MySQL-gray?logo=mysql&logoColor=orange" alt="MySQL Badge" style="display: inline-block;">
  <img src="https://img.shields.io/github/actions/workflow/status/jack-pap/Summoners-Card/node.js.yml?branch=main&logo=githubactions&logoColor=white" alt="GitHub Actions Workflow Status" style="display: inline-block;">
  
</p>

<p align="center">
  A stats viewing fullstack web application using the Riot API
</p>

## Requirements 

- Node.js
- Next.js
- Express.js
- MySQL server on AWS RDS
- Riot.txt file for authentication
- Riot API key
- Separate deployments for backend server and frontend (e.g. Vercel)

## Environment Variables (Frontend)
```js
NEXT_PUBLIC_SERVER_URL= Your server URL used when sending requests for data (e.g. https://summonerscardserver.com)
NEXT_PUBLIC_BASE_URL= Your URL used when using this build (e.g. https://summonerscard.com)
SQL_PASSWORD= MySQL database server password
AWS_ENDPOINT= Amazon endpoint for AWS RDS
```
>Ensure these variables are within a .env file inside the root directory

## Environment Variables (Server)
```js
API_KEY= Riot API key
ALLOWED_ORIGIN= The URL used to host the frontend (e.g. https://summonerscard.com)
```
>Ensure these variables are within a .env file inside the root directory
## Installing

```bash
> git clone https://github.com/jack-pap/Summoners-Card.git
> npm install 
```

## Running locally

```bash
> cd frontend
> npm run dev
```
```bash
> cd server
> npm start
```
## Documentation

Documentation for all methods can be found [here](https://jack-pap.github.io/Summoners-Card/index.html)

## Features

- Stylish modern front-end design
- Vercel deployment
- Express.js backend server that sends and receives API requests
- MySQL database hosted on [AWS RDS](https://aws.amazon.com/rds/)
- Extensive testing (unit, component tests) using [Jest](https://jestjs.io/)
- Thorough documentation using [JSDoc](https://jsdoc.app/)

## Screenshots
![homepage](https://github.com/user-attachments/assets/6191574a-2d2e-4fbe-955f-8b30944513d3)

![dashboard](https://github.com/user-attachments/assets/4f45a4f3-3993-4e60-ba3e-adeb72b28bfa)



