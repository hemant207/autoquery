require('dotenv').config();
const express = require('express');
const app  = express();

app.get('/',(req,res)=>{
    res.send("running............")
})

app.get('https://autoquery.onrender.com/whatsapp/getmsg',(req,res)=>{
    console.log("msg recieved");
    console.log(req);
    res.send({'msg':req});
})

app.listen(3000,()=>{
    console.log('app is running on 3000')
})