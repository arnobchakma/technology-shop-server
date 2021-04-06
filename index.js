const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njuwm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`


const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

client.connect(err => {
   console.log(err);
   const productCollection = client
      .db('technology')
      .collection('products');
   const orderCollection = client
      .db('technology')
      .collection('orderProducts');

   app.get('/products', (req, res) => {
      productCollection.find({}).toArray((err, items) => {
         res.send(items);
      });
   });

   app.get('/product/:id', (req, res) => {
      const id = req.params.id;
      productCollection.find({ _id: ObjectID(id) }).toArray((err, items) => {
         res.send(items);
      });
   });

   app.post('/addProducts', (req, res) => {
      const products = req.body;
      productCollection.insertOne(products).then(result => {
         res.send(result.insertedCount > 0);
      });
   });

   app.post('/orderAdd', (req, res) => {
      const orderProducts = req.body;
      orderCollection.insertOne(orderProducts).then(result => {
         res.send(result.insertedCount > 1);
      });
   });

   app.get('/getOrder/:user', (req, res) => {
      const user = req.params.user;
      orderCollection.find({ email: user }).toArray((err, items) => {
         res.send(items);
      });
   });

   app.delete('/delete', (req, res) => {
      const id = req.body._id;
      productCollection
         .findOneAndDelete({ _id: ObjectID(id) })
         .then(result => console.log(result));
   });
});

app.get('/', (req, res) => {
   res.send('Technology Shop!');
});

app.listen(port);
