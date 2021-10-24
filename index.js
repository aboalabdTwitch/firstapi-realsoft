const express = require('express');

const app=express();


const fs = require('fs');
const path = require('path');

var cors = require('cors');
app.use(express.json());

app.use(cors());

const port = process.env.PORT || 3000;


app.get('/', function (req, res) {
    res.send('GET request to homepage')
  })


  
  app.get('/surveys', function (req, res) {
    fs.readFile('data.json','utf8', (err,data)=>{res.json(data)})    
  })
 

  app.listen(port,()=>{
      console.log('Running ');
  })

  app.put('/update/:surveyId', (req, res) => {

    const surveyId = req.params.surveyId;
    let surveys = readData();
    let found=false;
     
   
    for(let arrayOfSurvey of surveys)
    {
      for(let survey of arrayOfSurvey)
      {
          if(survey.TEMPLATE_ID==surveyId)
          {
              found=true;
              survey.SurveyNameEn=req.body.name;
              break;
          }
      }       
    }

    if(found){
        writeData(surveys)
        res.send('found')
    }else{
        res.send('not found ');
    }
    
  });


  app.delete('/delete/:surveyId',(req, res) =>{

    const surveyId = req.params.surveyId;
    let surveys = readData();
    let newData=[];
    let arrayOfNewData=[];
    let found=false

    for(let arrayOfSurvey of surveys)
    {
      for(let survey of arrayOfSurvey)
      {
          if(survey.TEMPLATE_ID!=surveyId)
          {
            newData.push(survey);
      
          }else{
            found=true;
          }

      }       
    }

   arrayOfNewData.push(newData);

   if(found){
    writeData(arrayOfNewData);
    res.send('deleted')
   }else{
     res.send('not found')
   }
  })


  app.post('/add',(req,res)=>{
    let surveys=readData();
    surveys[0].push(req.body);
    writeData(surveys);
    res.send('done')
  })


  function writeData(data){
    fs.writeFile('data.json',  JSON.stringify(data), err => {
          if (err) {
              res.status(400).send(err);
            return
          }
        })
 

  }
  
  function readData()
  {
    let data = fs.readFileSync(path.resolve(__dirname, 'data.json'));
     return JSON.parse(data);
  }


  
//fs model
//https://www.heroku.com/
//express server 
//CRUD operation
