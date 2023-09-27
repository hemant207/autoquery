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

  // WhatsApp Webhook to receive messages
app.post('/webhooks', async (req, res) => {
    try {
      const userMessage = req.body.message.text; // Extract user's message
      const sender = req.body.sender.id; // Extract sender's ID
  
      // Send the user's message to ChatGPT for a response
      const chatGPTResponse = await sendToChatGPT(userMessage);
  
      // Send the ChatGPT response back to the user
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
  
    const response = await axios.post(chatGPTAPIURL, requestBody, {
      headers: {
        'Authorization': `Bearer ${chatGPTAPIKey}`,
      },
    });
  
    return response.data.choices[0].text;
  }
  