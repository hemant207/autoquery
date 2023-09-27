require('dotenv').config();
const express = require('express');
const app  = express();


app.use(express.json());
app.get('/',(req,res)=>{
    res.send("running............")
})

app.get('/whatsapp/getmsg', (req, res) => {
    console.log(req)
    if (req.body) {
        // Respond to the challenge request by echoing the challenge value
        console.log(req.body.entry.challenge)
        res.status(200).send(req.body.entry.challenge);
      } else {
        // Handle the incoming WhatsApp message here
        console.log(req.body); // Assuming WhatsApp sends the message payload in the request body
        // Implement your logic to process and respond to the message
        res.status(200).send(req.body.entry[0].challenge);
      }
})


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