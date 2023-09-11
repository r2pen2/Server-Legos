const express = require('express');

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

class SiteAuthenticationManager {

  constructor(userKey) {
    this.userKey = userKey;
  }

  initialize() {
    console.log("Creating new SiteAuthenticationManager with user key: " + this.userKey)
    this.router = express.Router();

    this.router.get('/' , (req, res) => {
      const key = sitePermissionsData[req.query.key];
      if (key) {
        const key = req.query.key;
        if (key !== this.userKey || !this.userKey) {
          res.send(400)
        } else {
          res.json(siteFormsData);
        }
      } else {
        const user = sitePermissionsData[req.query.id];
        if (user) {
          if (user.permissions.op) {
            for (const key of Object.keys(user.permissions)) {
              user.permissions[key] = true;
            }
          }
          res.json(user.permissions);
        } else {
          res.sendStatus(404);
        }
      }
    });

    this.router.post("/", (req, res) => {
      const permissions = req.body.permissions;
      const adminPermissions = req.body.adminPermissions;
      const docRef = db.doc(`users/${req.body.userId}`);
      const newUserData = {};
      newUserData.displayName = req.body.displayName;
      newUserData.email = req.body.email;
      newUserData.permissions = {};
      newUserData.adminPermissions = {};
      for (const permission of Object.values(permissions)) {
        newUserData.permissions[permission] = false;
      }
      for (const admminPermission of Object.values(adminPermissions)) {
        newUserData.adminPermissions[admminPermission] = true;
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
  }

  getRouter() {
    this.initialize();
    return this.router;
  }
}

module.exports = SiteAuthenticationManager;