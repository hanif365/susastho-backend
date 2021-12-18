const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Welcome to Hanif! DB Working!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwfp8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const doctorsCollection = client.db("susastho").collection("doctors");
    const appointmentCollection = client.db("susastho").collection("appointment");
    const adminCollection = client.db("susastho").collection("admin");
    const superAdminCollection = client.db("susastho").collection("superadmin");
    const emergencyInfoCollection = client.db("susastho").collection("emergencyInfo");
    const bloodBankInfoCollection = client.db("susastho").collection("bloodBankInfo");
    const healthTipsDataCollection = client.db("susastho").collection("healthTipsData");


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
        doctorsCollection.find({ status: "confirmed" })
            .toArray((err, doctorsInfo) => {
                console.log("Doctors Info : ", doctorsInfo);
                res.send(doctorsInfo);
            })
    })

    // Doctors for confirmation(Super Admin Panel)
    app.get('/doctorsForConfirmation', (req, res) => {
        doctorsCollection.find()
            .toArray((err, doctorsForConfirmationInfo) => {
                console.log("Doctors Info : ", doctorsForConfirmationInfo);
                res.send(doctorsForConfirmationInfo);
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
                console.log("Doctors Info : ", appointmentInfo);
                res.send(appointmentInfo);
            })
    })

    // Make admin
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log('Inserted Count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Check an user admin or not
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

    // Make Super Admin
    app.post('/addSuperAdmin', (req, res) => {
        const newSuperAdmin = req.body;
        superAdminCollection.insertOne(newSuperAdmin)
            .then(result => {
                console.log('Inserted Count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Check an admin super-admin or not
    app.post('/isSuperAdmin', (req, res) => {
        const email = req.body.email;
        superAdminCollection.find({ email: email })
            .toArray((err, superadmin) => {
                res.send(superadmin.length > 0);
            })
    })

    // Emergency Info insert into DB
    app.post('/addemergencyinfo', (req, res) => {
        const addEmergencyInfo = req.body;
        console.log('Adding new Doctor', addEmergencyInfo);
        emergencyInfoCollection.insertOne(addEmergencyInfo)
            .then(result => {
                console.log('Inserted Count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Get Emergency Info From DB
    app.get('/emergencyInfo', (req, res) => {
        emergencyInfoCollection.find()
            .toArray((err, emergencyInfo) => {
                console.log("Doctors Info : ", emergencyInfo);
                res.send(emergencyInfo);
            })
    })

    // Blood Bank Info insert into DB
    app.post('/addbloodbankinfo', (req, res) => {
        const addbloodbankinfo = req.body;
        console.log('Adding new Doctor', addbloodbankinfo);
        bloodBankInfoCollection.insertOne(addbloodbankinfo)
            .then(result => {
                console.log('Inserted Count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Get Blood Bank Info from DB
    app.get('/bloodBankInfo', (req, res) => {
        bloodBankInfoCollection.find()
            .toArray((err, bloodBankInfo) => {
                console.log("Doctors Info : ", bloodBankInfo);
                res.send(bloodBankInfo);
            })
    })

    // Cancel Appointment
    app.delete('/cancelAppointment/:id', (req, res) => {
        console.log(req.params.id);
        appointmentCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
            })
    })

    // Health Tips Data insert into DB
    app.post('/addhealthtips', (req, res) => {
        const addhealthtips = req.body;
        console.log('Adding new Doctor', addhealthtips);
        healthTipsDataCollection.insertOne(addhealthtips)
            .then(result => {
                console.log('Inserted Count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Get Health Tips Data from DB
    app.get('/healthTipsData', (req, res) => {
        healthTipsDataCollection.find()
            .toArray((err, healthTipsData) => {
                console.log("healthTipsData : ", healthTipsData);
                res.send(healthTipsData);
            })
    })


    // code for status change

    app.patch('/confirmed/:id', (req, res) => {
        console.log('id', req.params.id);
        console.log('status', req.body.status);
        doctorsCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { 'status': 'Done' }
            })
            .then(result => {
                console.log(result);
            })
    })

    // app.patch('/ongoing/:id', (req, res) => {
    //     console.log('id', req.params.id);
    //     console.log('status', req.body.status);
    //     doctorsCollection.updateOne({ _id: ObjectId(req.params.id) },
    //         {
    //             $set: { 'status': 'Ongoing' }
    //         })
    //         .then(result => {
    //             console.log(result);
    //         })
    // })

    app.patch('/pending/:id', (req, res) => {
        console.log('id', req.params.id);
        console.log('status', req.body.status);
        doctorsCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { 'status': 'Pending' }
            })
            .then(result => {
                console.log(result);
            })
    })

    // console.log(err);
    console.log('DB connection successfully!');
    // perform actions on the collection object
    // client.close();
});


app.listen(port)