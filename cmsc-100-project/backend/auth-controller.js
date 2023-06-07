import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
import { parse } from "csv-parse";

// get user model registered in Mongoose
const User = mongoose.model("User");

const signUp = async (req, res) => {
  // const { firstName, middleName, lastName, studentNumber, userType, email, password, applications, adviser } = req.body;
  const { firstName, middleName, lastName, userType, email, password } =
    req.body;
  let user = await User.findOne({ email });
  console.log(user);
  if (user) {
    return res.send({ success: false, emailExists: true });
  }

  if (userType === "user") {
    var { studentNumber, adviser } = req.body;

    let student = await User.findOne({ studentNumber });
    if (student) return res.send({ success: false, studentNumberExists: true });

    var newuser = new User({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      fullName: `${firstName} ${middleName} ${lastName}`,
      studentNumber: studentNumber,
      userType: userType,
      email: email,
      password: password,
      adviser: adviser,
    });
  } else {
    let initials = "";
    firstName.split(" ").forEach((element) => {
      initials += element[0];
    });
    initials += middleName == "" ? "" : middleName[0];
    initials += lastName.replaceAll(" ", "");

    var newuser = new User({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      fullName: `${firstName} ${middleName} ${lastName}`,
      initials: initials.toUpperCase(),
      email: email,
      password: password,
      userType: userType,
    });
  }

  console.log(newuser);

  const result = await newuser.save();

  if (result._id) {
    res.send({ success: true });
  } else {
    res.send({ success: false, emailExists: false });
  }
};

// get all approver accounts based on search w/ sorting
const getApproverAccounts = async (req, res) => {
  let { searchName, sort } = req.query;
  let approverAccounts = await User.find(
    // use conditional operators
    {
      $and: [
        // used regex to filter out names
        { fullName: { $regex: new RegExp(`${searchName}`, "gi") } },
        {
          $or: [
            { userType: "adviser" },
            // {userType: "officer"}
          ],
        },
      ],
    }
  )
    .collation({ locale: "en" })
    .sort({ fullName: sort });

  res.send(approverAccounts);
};

// get specific details of approver
const getApproverDetails = async (req, res) => {
  try {
    const { docRef } = req.query; // _id of specific approver
    const approver = await User.findById(docRef);
    if (approver) {
      res.send(approver);
    } else {
      res.send({ error: "Approver not found" });
    }
  } catch (error) {
    console.error("Error fetching approver details:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

//edit approver details
const editApprover = async (req, res) => {
  // get details
  let { docRef, firstName, middleName, lastName } = req.body;
  let initials = "";

  firstName.split(" ").forEach((element) => {
    initials += element[0];
  });
  initials += middleName == "" ? "" : middleName[0];
  initials += lastName.replaceAll(" ", "");

  let fullName = firstName + " " + ((middleName == "") ? "" : middleName + " ") + lastName

  if (docRef) {
    let update = await User.updateOne(
      { _id: docRef },
      {
        $set: {
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          fullName: fullName,
          initials: initials.toUpperCase()
        },
      }
    );

    if (update["acknowledged"] && update["modifiedCount"] != 0)
      res.send({ edited: "edited" });
    else res.send({ edited: "no fields changed" });
  } else res.send({ edited: "failed" });
};

// delete approver account
const deleteApprover = async (req, res) => {
  let { docRef } = req.body; // approver account document reference
  await User.updateMany(
    { adviser: new mongoose.Types.ObjectId(docRef) },
    { $set: { adviser: null } }
  );
  let del = await User.deleteOne({ _id: docRef });
  if (del["deletedCount"] != 0 && del["acknowledged"])
    res.send({ deleted: true });
  else res.send({ deleted: false });
};

const getPendingAccounts = async (req, res) => {
  let { sort } = req.query;
  let pendingAccounts = await User.find({ userType: "user" })
    .collation({ locale: "en" })
    .sort({ [`${sort}`]: 1 });
  res.send(pendingAccounts);
};

const approveAccount = async (req, res) => {
  let { docRef } = req.body;
  let update = await User.updateOne(
    { _id: docRef },
    { $set: { userType: "student" } }
  );
  if (update["acknowledged"] && update["modifiedCount"] != 0)
    res.send({ success: true });
  else res.send({ success: false });
};

const rejectAccount = async (req, res) => {
  let { docRef } = req.body;
  let del = await User.deleteOne({ _id: docRef });
  if (del["deletedCount"] != 0 && del["acknowledged"])
    res.send({ deleted: true });
  else res.send({ deleted: false });
};

const getStudents = async (req, res) => {
  let { sort } = req.query;
  let students = await User.find({ userType: "student" })
    .collation({ locale: "en" })
    .sort({ [`${sort}`]: 1 });
  res.send(students);
};

const getAdvisers = async (req, res) => {
  let advisers = await User.find({ userType: "adviser" })
    .collation({ locale: "en" })
    .sort({ fullName: 1 });
  res.send(advisers);
};

const assignAdviser = async (req, res) => {
  let { studentIDAssign, adviserIDAssign } = req.body;
  let update = await User.updateOne(
    { _id: studentIDAssign },
    { $set: { adviser: new mongoose.Types.ObjectId(adviserIDAssign) } }
  );
  if (update["acknowledged"] && update["modifiedCount"] != 0)
    res.send({ success: "true" });
  else res.send({ success: "false" });
};

const login = async (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  // Check if email exists
  const user = await User.findOne({ email });

  //  Scenario 1: FAIL - User doesn't exist
  if (!user) {
    return res.send({ success: false, userExists: false });
  }

  // Check if password is correct using the Schema method defined in User Schema
  user.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) {
      // Scenario 2: FAIL - Wrong password
      return res.send({ success: false });
    } else if (isMatch && user.userType === "user") {
      return res.send({ success: false, userExists: true });
    }

    // Scenario 3: SUCCESS - time to create a token
    const tokenPayload = {
      _id: user._id,
    };

    const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

    // return the token to the client
    return res.send({
      success: true,
      token,
      username: user.name,
      userData: user,
    });
  });
};

const checkIfLoggedIn = async (req, res) => {
  if (!req.cookies || !req.cookies.authToken) {
    // FAIL Scenario 1 - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  try {
    // try to verify the token
    const tokenPayload = jwt.verify(
      req.cookies.authToken,
      "THIS_IS_A_SECRET_STRING"
    );

    // check if the _id in the payload is an existing user id
    const user = await User.findById(tokenPayload._id);

    if (user) {
      // SUCCESS Scenario - User is found
      return res.send({ isLoggedIn: true, userType: user.userType });
    } else {
      // FAIL Scenario 2 - Token is valid but user id not found
      return res.send({ isLoggedIn: false });
    }
  } catch {
    // FAIL Scenario 3 - Error in validating token / Token is not valid
    return res.send({ isLoggedIn: false });
  }
};

// get user data based from cookie
const getLoggedInUserData = async (req, res) => {
  const tokenPayload = jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING"
  );
  const user = await User.findById(tokenPayload._id);

  res.send(user);
};

const uploadCSV = async (req, res) => {
  const fileString = req.file.buffer.toString().trim();
  console.log(fileString);
  try {
    if (!fileString || fileString == "")
      return res.status(400).json({ success: false });
    fileString.split("\r\n").forEach(async (pair) => {
      let split = pair.split(",");
      let adviser = await User.findOne({ initials: split[1] });
      let update = await User.findOneAndUpdate(
        { studentNumber: split[0] },
        { $set: { adviser: new mongoose.Types.ObjectId(adviser._id) } }
      );
      console.log(update);
    });
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

const getOfficerDetails = async (req, res) => {
  try {
    // Get the details of the users who have "officer" as their userType
    const officerUsers = await User.find({ userType: "officer" });

    // Extract the fullName from the officerUsers
    const officerDetails = officerUsers.map((user) => user.fullName);

    res.send(officerDetails);
  } catch (error) {
    console.error("Error fetching officer details:", error);
    res.status(500).json({ error: "Server error" });
  }
}


export {
  signUp,
  login,
  checkIfLoggedIn,
  editApprover,
  getApproverDetails,
  getApproverAccounts,
  deleteApprover,
  getLoggedInUserData,
  getPendingAccounts,
  approveAccount,
  rejectAccount,
  getStudents,
  getAdvisers,
  assignAdviser,
  uploadCSV,
  getOfficerDetails,
};
