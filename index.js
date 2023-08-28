const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Hanif! DB Working!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwfp8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(async (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  const database = client.db("susastho");
  const doctorsCollection = database.collection("doctors");
  const appointmentCollection = database.collection("appointment");
  const adminCollection = database.collection("admin");
  const superAdminCollection = database.collection("superadmin");
  const emergencyInfoCollection = database.collection("emergencyInfo");
  const bloodBankInfoCollection = database.collection("bloodBankInfo");
  const healthTipsDataCollection = database.collection("healthTipsData");
  const testimonialsCollection = database.collection("testimonialsData");

  app.post("/addDoctor", async (req, res) => {
    const addDoctor = req.body;
    console.log("Adding new Doctor", addDoctor);
    try {
      const result = await doctorsCollection.insertOne(addDoctor);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/doctors", async (req, res) => {
    try {
      const doctorsInfo = await doctorsCollection
        .find({ status: "Confirmed" })
        .toArray();
      console.log("Doctors Info : ", doctorsInfo);
      res.send(doctorsInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Doctors for confirmation(Super Admin Panel)
  app.get("/doctorsForConfirmation", async (req, res) => {
    try {
      const doctorsForConfirmationInfo = await doctorsCollection
        .find()
        .toArray();
      console.log("Doctors Info : ", doctorsForConfirmationInfo);
      res.send(doctorsForConfirmationInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Insert appointment info in the DB
  app.post("/addAppointment", async (req, res) => {
    const addAppointment = req.body;
    console.log("Adding new Appointment", addAppointment);

    try {
      const result = await appointmentCollection.insertOne(addAppointment);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get appointment info from the DB
  app.get("/appointment", async (req, res) => {
    const uid = req.query.uid;

    try {
      const appointmentInfo = await appointmentCollection
        .find({ uid })
        .toArray();
      console.log("Appointment Info : ", appointmentInfo);
      res.send(appointmentInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get All Appointment (For Super Admin panel)
  app.get("/allAppointment", async (req, res) => {
    try {
      const allAppointmentInfo = await appointmentCollection.find().toArray();
      console.log("All Appointment Info : ", allAppointmentInfo);
      res.send(allAppointmentInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get appointment info from the DB in the Doctor Dashboard
  app.get("/appointmentpatients", async (req, res) => {
    const email = req.query.email;

    try {
      const appointmentPatientsInfo = await appointmentCollection
        .find({ Doctor_Email: email })
        .toArray();
      console.log("Appointment Patients Info : ", appointmentPatientsInfo);
      res.send(appointmentPatientsInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Make admin
  app.post("/addAdmin", async (req, res) => {
    const newAdmin = req.body;

    try {
      const result = await adminCollection.insertOne(newAdmin);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Check an user admin or not
  app.post("/isAdmin", async (req, res) => {
    const email = req.body.email;

    try {
      const admin = await adminCollection.find({ email }).toArray();
      res.send(admin.length > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Make Super Admin
  app.post("/addSuperAdmin", async (req, res) => {
    const newSuperAdmin = req.body;

    try {
      const result = await superAdminCollection.insertOne(newSuperAdmin);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Check an admin super-admin or not
  app.post("/isSuperAdmin", async (req, res) => {
    const email = req.body.email;

    try {
      const superadmin = await superAdminCollection.find({ email }).toArray();
      res.send(superadmin.length > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Check an admin doctor or not
  app.post("/isDoctor", async (req, res) => {
    const email = req.body.email;

    try {
      const doctor = await doctorsCollection
        .find({ Doctor_Email: email })
        .toArray();
      res.send(doctor.length > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Emergency Info insert into DB
  app.post("/addemergencyinfo", async (req, res) => {
    const addEmergencyInfo = req.body;

    try {
      const result = await emergencyInfoCollection.insertOne(addEmergencyInfo);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get Emergency Info From DB
  app.get("/emergencyInfo", async (req, res) => {
    try {
      const emergencyInfo = await emergencyInfoCollection.find().toArray();
      console.log("Emergency Info : ", emergencyInfo);
      res.send(emergencyInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Blood Bank Info insert into DB
  app.post("/addbloodbankinfo", async (req, res) => {
    const addbloodbankinfo = req.body;

    try {
      const result = await bloodBankInfoCollection.insertOne(addbloodbankinfo);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get Blood Bank Info from DB
  app.get("/bloodBankInfo", async (req, res) => {
    try {
      const bloodBankInfo = await bloodBankInfoCollection.find().toArray();
      console.log("Blood Bank Info : ", bloodBankInfo);
      res.send(bloodBankInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Cancel Appointment
  app.delete("/cancelAppointment/:id", async (req, res) => {
    const appointmentId = req.params.id;

    try {
      const result = await appointmentCollection.deleteOne({
        _id: ObjectId(appointmentId),
      });
      console.log(result);
      res.send(result.deletedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Health Tips Data insert into DB
  app.post("/addhealthtips", async (req, res) => {
    const addhealthtips = req.body;

    try {
      const result = await healthTipsDataCollection.insertOne(addhealthtips);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get Health Tips Data from DB
  app.get("/healthTipsData", async (req, res) => {
    try {
      const healthTipsData = await healthTipsDataCollection.find().toArray();
      console.log("Health Tips Data : ", healthTipsData);
      res.send(healthTipsData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // code for add testimonials
  app.post("/addTestimonial", async (req, res) => {
    const addTestimonial = req.body;

    try {
      const result = await testimonialsCollection.insertOne(addTestimonial);
      console.log("Inserted Count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get Testimonials info from DB
  app.get("/testimonials", async (req, res) => {
    try {
      const testimonialsInfo = await testimonialsCollection.find().toArray();
      console.log("Testimonials Info : ", testimonialsInfo);
      res.send(testimonialsInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // code for status change (***)
  app.patch("/doctorConfirmed/:id", async (req, res) => {
    // console.log('id', req.params.id);
    // console.log('status', req.body.status);
    const doctorId = req.params.id;
    const newStatus = "Confirmed";

    try {
      const result = await doctorsCollection.updateOne(
        { _id: ObjectId(doctorId) },
        { $set: { status: newStatus } }
      );
      console.log(result);
      res.send(result.modifiedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.patch("/doctorPending/:id", async (req, res) => {
    // console.log('id', req.params.id);
    // console.log('status', req.body.status);

    const doctorId = req.params.id;
    const newStatus = "Pending";

    try {
      const result = await doctorsCollection.updateOne(
        { _id: ObjectId(doctorId) },
        { $set: { status: newStatus } }
      );
      console.log(result);
      res.send(result.modifiedCount > 0);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
