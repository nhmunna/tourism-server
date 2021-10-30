const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;


//MIDDLEWARE
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d2gdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('online_tourism');
        const tourismCollection = database.collection('tourism');
        const orderCollection = database.collection('orders');

        //GET TOURISM API
        app.get('/tourism', async (req, res) => {
            const cursor = tourismCollection.find({});
            const tourism = await cursor.toArray();
            res.send(tourism);
        })

        //GET SINGLE SERVICE
        app.get('/tourism/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const tourism = await tourismCollection.findOne(query);
            res.json(tourism);
        })


        //POST API
        app.post('/tourism', async (req, res) => {
            const service = req.body;
            console.log('hitting api', service);

            const result = await tourismCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //UPDATE SERVICE
        app.put('/tourism/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updatedService = req.body;
            console.log(updatedService);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedService.name,
                    img: updatedService.img,
                    text: updatedService.text,
                    price: updatedService.price
                },
            };
            const result = await tourismCollection.updateOne(filter, updatedDoc, options)
            console.log('updating user', id);
            res.json(result);
        })

        //DELETE API
        app.delete('/tourism/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourismCollection.deleteOne(query);
            res.json(result);
        })

        //ORDER API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('order', order);
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}


run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tourism Server is running')
});

app.listen(port, () => {
    console.log('Server is running at port', port)
})