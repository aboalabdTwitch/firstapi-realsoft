const express = require('express');

const app=express();

const fs = require('fs');
const path = require('path');

var cors = require('cors');

app.use(cors());


app.get('/', function (req, res) {
    res.send('GET request to homepage')
  })

  
  app.get('/surveys', function (req, res) {
    fs.readFile('data.json','utf8', (err,data)=>{res.json(data)})    
  })
  app.get('/surveys/:id', function (req, res) {
    //console.log(req.params.id);
     let rawdata = fs.readFileSync(path.resolve(__dirname, 'data.json'));
     let student = JSON.parse(rawdata);
     console.log(student);
 
  })

  app.listen(3000,()=>{
      console.log('Running');
  })

  app.put('/update/:surveyId', (req, res) => {
    const user = req.params.surveyId;
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'data.json'));
     let surveys = JSON.parse(rawdata);
    // let surveys = rawdata;

    // res.send(surveys);
    let user2=null;
     
   
    for(let x of surveys){
        for(let d of x){
            if(d.TEMPLATE_ID==user)
            {
              user2=d;
              d.TemplateNameEn='hello';
              //res.send(d);
              //console.log(d)
              break;
             }

           }       
    

    }
    
    if(user2){
        //fs.writeFile('data.json', JSON.stringify(surveys))
        fs.writeFile('/Users/joe/test.txt',  JSON.stringify(surveys), err => {
            if (err) {
                res.status(400).send(err);
              console.error(err)
              return
            }
            //file written successfully
          })
        res.send('found')

    }else{
        res.status(400).send('not found ');
    }






    
  });




//fs model
//https://www.heroku.com/
//express server 
//CRUD operation
