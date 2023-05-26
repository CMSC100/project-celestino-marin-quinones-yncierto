import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import fs from "fs";
import csvParser from "csv-parser";

// import UserSchema from "./models/user.js";
import "./models/user.js";
import "./models/application.js";
import User from "./models/user.js";


import setUpRoutes from "./routes.js";



// connect to Mongo DB
await mongoose.connect("mongodb://127.0.0.1:27017/AUTH");

// register User model with Mongoose
// mongoose.model("User", UserSchema);


// initialize the server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type,X-Requested-With,Cookie");
  res.setHeader("Access-Control-Allow-Credentials","true");
  next();
});

const createAdminAccountFromCSV = async () => {
  const filePath = './models/admin.csv';
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error('Error accessing CSV file:', err);
      return;
    }

    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        if (results.length !== 1) {
          console.error('Invalid CSV file format');
          return;
        }

        const adminData = results[0];
        const { firstName, middleName, lastName, userType, email, password } = adminData;

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
          console.error('Admin account already exists');
          return;
        }

        const newAdmin = new User({
          firstName,
          middleName,
          lastName,
          fullName: `${firstName} ${middleName} ${lastName}`,
          userType,
          email,
          password,
        });

        const result = await newAdmin.save();

        if (result._id) {
          console.log('Admin account created successfully');
        } else {
          console.error('Failed to create admin account');
        }
      });
  });
};

// setup routes
setUpRoutes(app);

// create admin account from CSV file
createAdminAccountFromCSV();

// start server
app.listen(3001, () => { console.log("API listening to port 3001 ")});
