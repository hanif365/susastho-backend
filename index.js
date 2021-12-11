const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Welcome to Hanif! DB Working!')
})

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_NAME)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwfp8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const doctorsCollection = client.db("susastho").collection("doctors");
    const appointmentCollection = client.db("susastho").collection("appointment");


    // Insert a doctor info in the DB
    app.post('/addDoctor', (req, res) => {
        const addDoctor = req.body;
        console.log('Adding new Doctor', addDoctor);
        doctorsCollection.insertOne(addDoctor)
            .then(result => {
                console.log('Inserted Count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Get doctor info from DB
    app.get('/doctors', (req, res) => {
        doctorsCollection.find()
            .toArray((err, doctorsInfo) => {
                console.log("Doctors Info : ",doctorsInfo);
                res.send(doctorsInfo);
            })
    })

    // Insert appointment info in the DB
    app.post('/addAppointment', (req, res) => {
        const addAppointment = req.body;
        console.log('Adding new Appointment', addAppointment);
        appointmentCollection.insertOne(addAppointment)
            .then(result => {
                console.log('Inserted Count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Get appointment info from the DB
    app.get('/appointment', (req, res) => {
        appointmentCollection.find()
            .toArray((err, appointmentInfo) => {
                console.log("Doctors Info : ",appointmentInfo);
                res.send(appointmentInfo);
            })
    })


    // console.log(err);
    console.log('DB connection successfully!');
    // perform actions on the collection object
    // client.close();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})