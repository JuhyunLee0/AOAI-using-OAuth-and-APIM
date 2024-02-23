apim-oauth-spa
============

single page application using react
connects to 1n5xj8 tenant
uses apim inside JuHyunLee subscription

Preperation
------------
* install Node.js
* to install depandency
```
npm install
```
* run the app
```
npm start
```

On Startup
------------
* Go to http://localhost:3000

* use the "Sign in" button on the top right
    * perferrably use the "Sign in using Redirect"
* sign in using the 1n5xj8 tenant account, other accounts will not work
* once logged in use the "Get Acceess Token" to generate the access token
    * keep in mind that token will expire when reaching the "Expires" time (typically an hour)
* use the "Call AOAI via APIM" to call the AOAI endpoint thru APIM layer

------------
Cloned and modified from code
https://learn.microsoft.com/en-us/samples/azure-samples/ms-identity-ciam-javascript-tutorial/ms-identity-ciam-javascript-tutorial-1-sign-in-react/
