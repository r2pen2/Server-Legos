const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');

router.post("/", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: req.body.fromAddress,
      pass: req.body.fromPassword
    }
  });
  var mailOptions = {
    from: req.body.fromAddress,
    to: req.body.toAddress,
    subject: req.body.subject,
    text: req.body.text
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
})

module.exports = router;