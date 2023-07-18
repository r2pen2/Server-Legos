const express = require('express');
const router = express.Router();

const db = require('../../firebase.js');

const siteModelData = {};

router.get('/' , async (req, res) => {
  if (req.query.collection === "users") {
    res.sendStatus(403);
  }
  const resModels = siteModelData[req.query.collection];
  if (resModels) {
    res.json(resModels);
  } else {
    // Get once...
    let sendList = [];
    const snapshot = await db.collection(req.query.collection).get();
    snapshot.forEach((doc) => {
      console.log(doc)
      const dataWithId = doc.data();
      dataWithId.id = doc.id;
      sendList.push(dataWithId);
    });
    res.json(sendList);
    // Start listening to this collection
    console.log("Beginning to listen to collection: " + req.query.collection);
    db.collection(req.query.collection).onSnapshot((snap) => {
      console.log("Found updated data for collection: " + req.query.collection);
      let newList = [];
      for (const doc of snap.docs) {
        const dataWithId = doc.data();
        dataWithId.id = doc.id;
        newList.push(dataWithId);
      }
      siteModelData[req.query.collection] = newList;
    })
  }
});

router.post("/", (req, res) => {
  const docRef = db.doc(`${req.body.collection}/${req.body.documentId}`);
  docRef.set(req.body.documentData).then(() => {
    res.sendStatus(200);
  });
})

module.exports = router;