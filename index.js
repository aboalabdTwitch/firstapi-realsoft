const express = require('express');

const app=express();

const fs = require('fs');


app.get('/', function (req, res) {
    res.send('GET request to homepage')
  })

  
  app.get('/surveys', function (req, res) {
    fs.readFile('data.json','utf8', (err,data)=>{res.json(data)})    
  })

  app.listen(3000,()=>{
      console.log('Running');
  })

console.log()

//fs model
//https://www.heroku.com/
//express server 
//CRUD operation
