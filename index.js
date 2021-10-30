const express = require('express');
const { MongoClient } = require('mongodb');
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