import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


// get user model registered in Mongoose
const User = mongoose.model("User");

const signUp = async (req, res) => {
  const { firstName, middleName, lastName, studentNumber, userType, email, password, applications, adviser } = req.body;

  const newuser = new User({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    studentNumber: req.body.studentNumber,
    userType: req.body.userType,
    email: req.body.email,
    password: req.body.password,
    applications: req.body.applications,
    adviser: req.body.adviser,
  });

  const result = await newuser.save();

  if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

// create approver
const createApprover = async (req, res) => {
  // get details
  const { firstName, middleName, lastName, email, password, userType } = req.body;

  // create new user
  const newapprover = new User({
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    email: email,
    password: password,
    userType: userType
  });

  // save
  const result = await newapprover.save();

  if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

// get all approver accounts based on search w/ sorting
const getApproverAccounts = async (req, res) => {
  let { searchName, sort } = req.query
  let approverAccounts; // store approver accounts
  if (searchName == "") {
    // if empty query
    // collation is for adjusting how the database sorts (makes it case-insensitive)
    approverAccounts = await User.find({userType: "approver"}).collation({locale: "en"}).sort({firstName: sort, middleName: sort, lastName: sort});
  } else {
    approverAccounts = await User.find(
      // use conditional operators
      {
        $and: [
          { $or: 
            [
              // used regex to filter out names
              {firstName: {$regex: new RegExp(`${searchName}`, "gi")}},
              {middleName: {$regex: new RegExp(`${searchName}`, "gi")}},
              {lastName: {$regex: new RegExp(`${searchName}`, "gi")}}
            ]
          },
          {
            userType: "approver"
          }
        ]
      }
    ).collation({locale: "en"}).sort({firstName: sort, middleName: sort, lastName: sort});
  }

  res.send(approverAccounts)
}

// get specific details of approver
const getApproverDetails = async (req, res) => {
  let { docRef } = req.query // objectID of specific approver
  const approver = await User.findOne({_id: docRef});
  res.send(approver)
}

//edit approver details
const editApprover = async (req, res) => {
  // get details
  let { docRef, firstName, middleName, lastName} = req.body;
  if (docRef) {
    let update = await User.updateOne({_id: docRef}, {$set: {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,     
    }})

    if (update["acknowledged"] && update["modifiedCount"] != 0) res.send({edited: "edited"})
    else res.send({edited: "no fields changed"});
  } else res.send({edited: "failed"})
}

// delete approver account
const deleteApprover = async (req, res) => {
  let { docRef } = req.body // approver account document reference
  let del = await User.deleteOne({_id: docRef})
  if (del["deletedCount"] != 0 && del["acknowledged"]) res.send({deleted: true})
  else res.send({deleted: false})
}

const login = async (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  // Check if email exists
  const user = await User.findOne({ email })

  //  Scenario 1: FAIL - User doesn't exist
  if (!user) {
    return res.send({ success: false })
  }

  // Check if password is correct using the Schema method defined in User Schema
   user.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) {
      // Scenario 2: FAIL - Wrong password
      return res.send({ success: false });
    }

    // Scenario 3: SUCCESS - time to create a token
    const tokenPayload = {
      _id: user._id
    }

    const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

    // return the token to the client
    return res.send({ success: true, token, username: user.name });


  })
}

const checkIfLoggedIn = async (req, res) => {

  if (!req.cookies || !req.cookies.authToken) {
    // FAIL Scenario 1 - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  try {
    // try to verify the token
    const tokenPayload = jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET_STRING');

    // check if the _id in the payload is an existing user id
    const user = await User.findById(tokenPayload._id)

    if (user) {
      // SUCCESS Scenario - User is found
      return res.send({ isLoggedIn: true, userType: user.userType})
    } else {
      // FAIL Scenario 2 - Token is valid but user id not found
      return res.send({ isLoggedIn: false })
    }
  } catch {
    // FAIL Scenario 3 - Error in validating token / Token is not valid
    return res.send({ isLoggedIn: false });
  }
}

const getLoggedInUserData = async (req, res) => {
  const tokenPayload = jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET_STRING');
  const user = await User.findById(tokenPayload._id)

  res.send(user)
}

export { signUp, login, checkIfLoggedIn, createApprover, editApprover, getApproverDetails, getApproverAccounts, deleteApprover, getLoggedInUserData }