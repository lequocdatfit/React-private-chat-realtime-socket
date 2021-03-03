require('dotenv').config();
const firebase = require('firebase');

var firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECTID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();


module.exports = db;