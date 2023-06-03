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
import { create } from "domain";

// char not necessary pala HAHAHA

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

const createAccountFromCSV = async () => {
  const filePath = './models/builtinusers.csv';
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

        results.forEach(async (object) => {
          let existingUser = await User.findOne({email: object.email});
          if (existingUser) {
            console.error(`${object.userType.toString()} account already exists.`);
          } else {
            let { firstName, middleName, lastName, userType, email, password } = object;
            let newUser = new User({
              firstName,
              middleName,
              lastName,
              fullName: `${firstName} ${middleName} ${lastName}`,
              userType,
              email,
              password,
            });
    
            let result = await newUser.save();
    
            if (result._id) {
              console.log(`${userType} account created successfully.`);
            } else {
              console.error(`Failed to create ${userType} account.`);
            }
          }
        })
      });
  });
};

// setup routes
setUpRoutes(app);

// create admin account from CSV file
createAccountFromCSV();

// start server
app.listen(3001, () => { console.log("API listening to port 3001 ")});