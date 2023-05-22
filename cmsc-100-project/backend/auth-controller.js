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

const createApprover = async (req, res) => {
  const { firstName, middleName, lastName, email, password, userType } = req.body;

  const newapprover = new User({
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    email: email,
    password: password,
    userType: userType
  });

  const result = await newapprover.save();

  if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

const getApproverAccounts = async (req, res) => {
  let { searchName, filter } = req.query
  console.log(filter)
  let approverAccounts;
  if (searchName == "") {
    approverAccounts = await User.find({userType: "approver"}).sort({firstName: filter, middleName: filter, lastName: filter});
  } else {
    approverAccounts = await User.find(
      {
        $and: [
          { $or: 
            [
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
    ).sort({firstName: filter, middleName: filter, lastName: filter});
  }

  console.log(approverAccounts)

  res.send(approverAccounts)
}

const getApproverDetails = async (req, res) => {
  console.log(req.query.docRef)
  const approver = await User.find({_id: req.query.docRef});
  console.log(approver)
  res.send(approver)
}

const editApprover = async (req, res) => {
  const newDetails = req.body;

  let { docRef } = newDetails
  console.log(docRef)
  if (docRef) {
    let update = await User.updateOne({_id: docRef}, {$set: {
      firstName: newDetails.firstName,
      middleName: newDetails.middleName,
      lastName: newDetails.lastName,     
    }})

    if (update["acknowledged"] && update["matchedCount"] != 0) res.send({edited: true})
    else res.send({edited: false});
  } else res.send({edited: false})
}

const deleteApprover = async (req, res) => {
  let del = await User.deleteOne({_id: req.body.docRef})
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
      return res.send({ isLoggedIn: true })
    } else {
      // FAIL Scenario 2 - Token is valid but user id not found
      return res.send({ isLoggedIn: false })
    }
  } catch {
    // FAIL Scenario 3 - Error in validating token / Token is not valid
    return res.send({ isLoggedIn: false });
  }
}

export { signUp, login, checkIfLoggedIn, createApprover, editApprover, getApproverDetails, getApproverAccounts, deleteApprover }