const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vv22h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req, res) => {
  res.send('Database is working')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const volunteerWorks = client.db(`${process.env.DB_NAME}`).collection("volunteer");
//   const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");

  app.post('/addVolunteerWork', (req, res)=>{
    const volunteers = req.body;
    console.log(volunteers);
    volunteerWorks.insertMany(volunteers)
    .then(result => {
    res.send(result.insertedCount)
    })
  })

  app.get('/volunteers', (req, res) => {
      volunteerWorks.find({})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

  app.get('volunteers/:workdetailkey', (req, res) => {
      volunteerWorks.find({key: req.params.key})
      console.log(req.params.key)
      .toArray( (err, documents) => {
          res.send(documents[0])
      })
  })

  // app.post('/productsByKeys', (req, res) => {
  //   const productKeys = req.body;
  //   volunteerWorks.find({key: {$in: productKeys}})
  //   .toArray( (err, documents) => {
  //   res.send(documents);
  //   })
  // })

//   app.post('/addOrder', (req, res)=>{
//     const order = req.body;
//     ordersCollection.insertOne(order)
//     .then(result => {
//     res.send(result.insertedCount > 0)
//     })
//   })


});




app.listen(process.env.PORT || port)

 