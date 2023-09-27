require('dotenv').config();
//importing express
const express = require('express');
const app  = express();
//imprting files from messagerghelper.js for sending msg to whatsapp
const { sendMessage, getTextMessageInput } = require("./messagehelper");

//using cors for cross-origin-resourch-sharing
const cors = require('cors');

//import axios 
const axios = require('axios');
const bodyParser = require('body-parser');

//defining middelwares
app.use(express.json());
app.use(cors());

app.use(bodyParser())

//definging routes
app.get('/',(req,res)=>{
console.log("rend");
res.send("hello")
})

//endpoint for checking and verifyig whatsapp message.
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

  // WhatsApp Webhook to receive messages
app.post('/webhooks', async (req, res) => {

    try {
      const entry = req.body.entry && req.body.entry[0];
      const userMessage = entry && entry.changes && entry.changes[0].value.messages;
      const message = userMessage && userMessage[0];
      
    
        // Extract message details
        const phoneNumber = message.from;
        const messageBody = message.text.body;
    
        // You can now use the extracted message details as needed
        console.log('Received WhatsApp Message:');
        console.log('Phone Number:', phoneNumber);
        console.log('Message Body:', messageBody);
    
        // Send the user's message to ChatGPT for a response
        const chatGPTResponse = await sendToChatGPT(messageBody) ;
    
        // Send the ChatGPT response back to the user
        var data = getTextMessageInput(process.env.RECIPIENT_WAID, chatGPTResponse);
        console.log(data);
        sendMessage(data)
        .then(function (response) {
            console.log(response);
            // Respond with a success status code
            res.status(200).end();
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response.data);

            // Respond with an error status code (e.g., 501 for Not Implemented)
            res.status(501).end();
        });

        }catch(error){
            console.log(error);
        }
        })
  
 
app.listen(3000,()=>{
    console.log('app is running on 3000')
})


async function sendToChatGPT(userMessage) {
    const config = {
      type:'post',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${process.env.chatGPTAPIKey}`,
      },
      body:{
        prompt: userMessage,
        max_tokens: 50, // Adjust for desired response length
      }
    }
  
    const response = await axios('https://api.openai.com/v1/chat/completions',config);
  
    return response.data.choices[0].message.content;
  }
  