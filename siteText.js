const express = require('express');
const router = express.Router();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, } = require('firebase-admin/firestore');
const serviceAccount = require('../../config/serviceAccountKey.json');

/** Site text by ID, initialized to an empty dictionary */
let siteTextData = {}

// Get text from firebase and start listening
// Init firebase
initializeApp({
  credential: cert(serviceAccount)
});
/** Firestore DB instance */
const db = getFirestore();

// On launch, fetch testimonial, offering, and staff data from Firebase
const siteTextCollectionRef = db.collection("siteText");
siteTextCollectionRef.onSnapshot((data) => {
  console.log("Found updated siteText data");
  siteTextData = {}; // Clear data
  for (const doc of data.docs) {
      const data = doc.data();
      siteTextData[doc.id] = data.text;
  }
})

router.get('/' , (req, res) => {
  const resText = siteTextData[req.query.id];
  if (resText) {
    res.send(resText);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;