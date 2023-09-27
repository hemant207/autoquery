require('dotenv').config();
const express = require('express');
const app  = express();
const { sendMessage, getTextMessageInput } = require("./messagehelper");
const cors = require('cors');

const axios = require('axios');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors());
app.use(bodyParser())
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

  // WhatsApp Webhook to receive messages
app.post('/webhooks', async (req, res) => {
    try {
        const entry = req.body.entry[0];
        const userMessage = entry.changes[0].value.messages;


        
          const message = userMessage[0]; // Get the first message
    
          // Extract message details
          const phoneNumber = message.from;
          const messageBody = message.text.body;
    
          // You can now use the extracted message details as needed
          console.log('Received WhatsApp Message:');
          console.log('Phone Number:', phoneNumber);
          console.log('Message Body:', messageBody);
    
      // Send the user's message to ChatGPT for a response
      const chatGPTResponse = await sendToChatGPT(messageBody);
  
      // Send the ChatGPT response back to the user
      var data = getTextMessageInput(process.env.RECIPIENT_WAID, chatGPTResponse);
        console.log(data);
        sendMessage(data)
        .then(function (res) {
            console.log(res);
            return;
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response.data);
            res.sendStatus(501);
            return;
        });
      res.status(200).end();
    } catch (error) {
      console.error('Error processing WhatsApp message:', error.message);
      res.status(500).end();
    }
  });
  
 
app.listen(3000,()=>{
    console.log('app is running on 3000')
})


async function sendToChatGPT(userMessage) {

    const requestBody = {
      prompt: userMessage,
      max_tokens: 50, // Adjust for desired response length
    };
  
    const response = await axios.post(process.env.chatGPTAPIURL, requestBody, {
      headers: {
        'Authorization': `Bearer ${process.env.chatGPTAPIKey}`,
      },
    });
  
    return response.data.choices[0].text;
  }
  