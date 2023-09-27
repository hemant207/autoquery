require('dotenv').config();
const express = require('express');
const app  = express();
const { sendMessage, getTextMessageInput } = require("./messagehelper");

const axios = require('axios');

app.use(express.json());
app.get('/',(req,res)=>{
    res.send("running............")
})

app.get('/webhooks', (req, res) => {
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = req.query['hub.verify_token'];
  
    if (mode === 'subscribe' && verifyToken === 'thisiswhatsappsecret') {
      // Respond to the challenge request by echoing the challenge value
      console.log(`Challenge received: ${challenge}`);
      res.status(200).send(challenge);
    } else {
      // Handle other scenarios or requests here
      res.status(403).send('Forbidden');
    }
  });

  app.post('/webhooks', (req, res) => {
    // Extract the incoming message and relevant context from the payload
    const message = req.body.message.text; // Assuming WhatsApp message text is in "message.text"
    const sender = req.body.sender.id; // Assuming WhatsApp sender ID is in "sender.id"
    const timestamp = req.body.timestamp; // Assuming message timestamp is in "timestamp"
  
    // Implement your logic to process and respond to the incoming WhatsApp message
    // You can also store this information for conversation management
  
    // Example: Log the incoming message
    console.log(`Received message from ${sender} at ${new Date(timestamp)}: ${message}`);
  
    // Example: Send a response (replace with your actual response logic)
    const responseMessage = 'Thank you for your message. We will get back to you soon.';

    var data = getTextMessageInput(process.env.RECIPIENT_WAID, responseMessage);
    console.log(data);
    sendMessage(data)
      .then(function (res) {
        res.redirect('/');
        res.sendStatus(200);
        return;
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response.data);
        res.sendStatus(500);
        return;
      });
    // Respond to the incoming webhook request
    res.status(200).send('Received message');
  });
  

app.listen(3000,()=>{
    console.log('app is running on 3000')
})