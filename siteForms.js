const express = require('express');
const router = express.Router();

const db = require('../../firebase.js');

/** Site forms by ID, initialized to an empty dictionary */
let siteFormsData = {}

// On launch, fetch all forms from Firebase
const siteFormsCollectionRef = db.collection("siteForms");
siteFormsCollectionRef.onSnapshot((data) => {
  console.log("Found updated siteForms data");
  siteFormsData = {}; // Clear data
  for (const doc of data.docs) {
      const data = doc.data();
      siteFormsData[doc.id] = data.text;
  }
})

router.post("/", (req, res) => {
  if (req.body.action) {
    if (req.body.action === "delete") {
      const docRef = db.doc(`${"siteForms"}/${req.body.documentId}`);
      docRef.delete().then(() => {
        res.sendStatus(200);
      })
    }
  } else {
    db.collection("siteForms").add(req.body.documentData).then(() => {
      res.sendStatus(200);
    })
  }
})

module.exports = router;