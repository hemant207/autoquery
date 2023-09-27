require('dotenv').config();
const express = require('express');
const app  = express();

app.get('/',(req,res)=>{
    res.send("running............")
})

app.get('/whatsapp/getmsg', (req, res) => {
    console.log("Message received:");
    console.log(req.body); // Assuming WhatsApp sends the message payload in the request body
    // Handle the incoming WhatsApp message here
  
    // Send a response back to WhatsApp if needed
  
    res.status(200).send("Message received and processed.");
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