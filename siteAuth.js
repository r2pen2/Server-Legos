const express = require('express');
const router = express.Router();

const db = require('../../firebase.js');

/** Site text by ID, initialized to an empty dictionary */
let sitePermissionsData = {}

// On launch, fetch testimonial, offering, and staff data from Firebase
const usersCollectionRef = db.collection("users");
usersCollectionRef.onSnapshot((data) => {
  console.log("Found updated users data");
  sitePermissionsData = {}; // Clear data
  for (const doc of data.docs) {
      sitePermissionsData[doc.id] = doc.data();
  }
})

router.get('/' , (req, res) => {
  const userPermissions = sitePermissionsData[req.query.id];
  if (userPermissions) {
    if (userPermissions.op) {
      for (const key of Object.keys(userPermissions)) {
        userPermissions[key] = true;
      }
    }
    res.json(userPermissions);
  } else {
    res.sendStatus(404);
  }
});

router.post("/", (req, res) => {
  const permissions = req.body.permissions;
  const docRef = db.doc(`users/${req.body.userId}`);
  const newUserData = {};
  newUserData.displayName = req.body.displayName;
  for (const permission of Object.values(permissions)) {
    newUserData[permission] = false;
  }
  
  docRef.get().then(snap => {
    if (snap.exists) {
      res.sendStatus(200);
    } else {
      docRef.set(newUserData).then(() => {
        res.sendStatus(200);
      });
    }
  })
})

module.exports = router;