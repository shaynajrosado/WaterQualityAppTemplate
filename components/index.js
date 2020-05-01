const functions = require('firebase-functions');
const axios = require('axios');
const firebase = require('firebase');
require('firebase/database');
/**
 * Firebase Project Configuration
 */
const app = firebase.initializeApp({
  /*...*/
});

/**
 * Sends a salinity warning to registered users.
 */
async function sendNotification(registrationList) {
  if(registrationList.length == 0) {
    console.log('No new notifications sent out.');
    return;
  }
  const FIREBASE_API_KEY = 'abc';
  const message = {
    registration_ids: registrationList,
    notification: {
      title: 'Water Safety Alert!',
      body: 'A high _____ level has been detected!',
      vibrate: 1,
      sound: 1,
      show_in_foreground: true,
      show_in_background: true,
      priority: 'high',
      content_available: true,
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + FIREBASE_API_KEY,
  });

  let response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  response = await response.text();
  console.log(response);
  return;
}
/**
 * Retrieves all user registration tokens to send out a notification.
 * After this notification is sent, a second one will be sent out 
 * notifying users that it was just a test & prompts them to complete
 * the user feedback survey.
 */
async function getRegistrationTokens() {
  let registrationTokenList = [];
  let allTokens = firebase
    .firestore()
    .collection('users')
    .orderBy('tokenID', 'asc'); 
  let toks = await allTokens
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return null;
      } else {
        snapshot.forEach(doc => {     
          console.log(doc.id, '=>', doc.data());
          let currentDoc = doc.data();//firebase.firestore().collection('users').doc(doc.id);
          console.log('[', doc.id, '] salinityWarningSent = ', currentDoc['salinityWarningSent'] );
          if(currentDoc['salinityWarningSent'] == false) {   // only send out a salinity warning if they haven't received one already!
            registrationTokenList.push(doc.data()['tokenID']);
            let updateSingle = firebase.firestore().collection('users').doc(doc.id).update({
              salinityWarningSent: true,
            })
            console.log(doc.id, ' was just sent a salinity warning.');
          }
        });
        sendNotification(registrationTokenList);
        return;
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}
/**
 * Verifies whether the salinity value is in/out of range.
 */
async function checkValue(data) {
  console.log('Check Value was called.');
  let salinity = data['data'][3]['sensor_data'];
  let db = firebase
    .firestore()
    .collection('sensorData')
    .doc('flags');
  if (salinity >= 0.5) {    
    // set the salinity flag in firestore
    console.log('UNSAFE SALINITY LEVEL DETECTED!');
    db.set({
      salinityIsSafe: false,
    });
    console.log('salinityIsSafe set to false in firestore.');
    await getRegistrationTokens();
  } else {
    console.log('SALINITY IS SAFE');
    db.set({
      salinityIsSafe: true,
    });
    console.log('salinityIsSafe set to true in firestore.');
    // check to make sure everyone's salinityWarningSent flag is reset to false.
    let userSnapshot = await firebase
      .firestore()
      .collection('users')
      .get();
    // console.log('allUsers.data() => ', allUsers.data());
    if(userSnapshot.empty) {
      console.log('Unable to get users from firebase.');
    } else {
      userSnapshot.forEach(doc => {
        let feedbackRequested = doc.data()['feedbackRequested'];
        let salinityWarningSent = doc.data()['salinityWarningSent'];
        if(salinityWarningSent) {
          let salDoc = firebase.firestore().collection('users').doc(doc.id);
          let salReset = salDoc.update({
            salinityWarningSent: false,          
          });
        }
        if(feedbackRequested) {
          let fbReqDoc = firebase.firestore().collection('users').doc(doc.id);
          let fbReqReset = fbReqDoc.update({
            feedbackRequested: false,
          });
        }
        console.log('======== DATA FOR ', doc.id, '=========='); 
        console.log('salinityWarningSent =', salinityWarningSent);
        console.log('feedbackRequested =', feedbackRequested);
        console.log('================================================');
      });
    }
  }
  return;
}
/**
 * Place sensor data into Firestore.
 */
async function placeData(data) {
  let db = firebase
    .firestore()
    .collection('sensorData')
    .doc('data');
  db.set(data);
}
/**
 * This function fetches the sensor data and determines whether or not a notification
 * should be sent out.
 */
exports.evaluateSensorData = functions.pubsub      
  .schedule('0,30 7,9,11,13,15,17,19,21,23 * * *') 
  .onRun(async () => {
    const result = await axios.get(
      'www.fillthisin.com/sensorData.json',    
    );
    console.log(result.data);
    placeData(result.data);
    let salinityRef = firebase
      .firestore()
      .collection('sensorData')
      .doc('data');
    let getDoc = await salinityRef.get();
    checkValue(getDoc.data());                // check value
    return result.data;
  });

