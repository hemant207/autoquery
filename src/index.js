require('dotenv').config();
const express = require('express');
const app  = express();


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
  


app.post('/whatsapp/getmsg', (req, res) => {
    console.log("Message received:");
    console.log(req.body); // Assuming WhatsApp sends the message payload in the request body
    // Handle the incoming WhatsApp message here
  
    // Send a response back to WhatsApp if needed
  
    res.status(200).send("Message received and processed.");
  });

app.listen(3000,()=>{
    console.log('app is running on 3000')
})