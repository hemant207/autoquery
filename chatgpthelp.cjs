const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.chatGPTAPIKey,
});
  
const openai = new OpenAIApi(configuration);

async function runCompletion () {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "How are you today?",
    });
    console.log(completion.data);
    console.log(completion.data.choices[0].text);
}

runCompletion();