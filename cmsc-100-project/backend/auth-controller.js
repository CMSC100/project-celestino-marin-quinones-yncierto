import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


// get user model registered in Mongoose
const User = mongoose.model("User");

const signUp = async (req, res) => {
  // const { firstName, middleName, lastName, studentNumber, userType, email, password, applications, adviser } = req.body;
  const { firstName, middleName, lastName, userType, email, password } = req.body
  let user = await User.findOne({email: email})
  console.log(user)
  if (user) {
    console.log("lmao")
    return res.send({success: false, emailExists: true})
  }

  if (userType === "user") {
    var { studentNumber, applications, adviser } = req.body
    var newuser = new User({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      fullName: `${firstName} ${middleName} ${lastName}`,
      studentNumber: studentNumber,
      userType: userType,
      email: email,
      password: password,
      applications: applications,
      adviser: adviser,
    });
  } else {
    var newuser = new User({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      fullName: `${firstName} ${middleName} ${lastName}`,
      email: email,
      password: password,
      userType: userType
    });
  }

  console.log(newuser)

  const result = await newuser.save();

  if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false, emailExists: false})
	}
}

// get all approver accounts based on search w/ sorting
const getApproverAccounts = async (req, res) => {
  let { searchName, sort } = req.query
  let approverAccounts; // store approver accounts
  if (searchName == "") {
    // if empty query
    // collation is for adjusting how the database sorts (makes it case-insensitive)
    approverAccounts = await User.find({
      $or: [
        {userType: "adviser"},
        {userType: "officer"}
      ]
    }).collation({locale: "en"}).sort({fullName: sort});
  } else {
    approverAccounts = await User.find(
      // use conditional operators
      {
        $and: [
          // used regex to filter out names
          {fullName: {$regex: new RegExp(`${searchName}`, "gi")}},
          {
            $or:
            [
              {userType: "adviser"},
              {userType: "officer"}
            ]
          }
        ]
      }
    ).collation({locale: "en"}).sort({fullName: sort});
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

const getPendingAccounts = async(req, res) => {
  let { sort } = req.query
  let pendingAccounts = await User.find({userType: "user"}).collation({locale: "en"}).sort({[`${sort}`]: 1})
  res.send(pendingAccounts)
}

const login = async (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  // Check if email exists
  const user = await User.findOne({ email })

  //  Scenario 1: FAIL - User doesn't exist
  if (!user) {
    return res.send({ success: false, userExists: false })
  }

  // Check if password is correct using the Schema method defined in User Schema
   user.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) {
      // Scenario 2: FAIL - Wrong password
      return res.send({ success: false });
    } else if (isMatch && user.userType === "user") {
      return res.send({success: false, userExists: true})
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

// get user data based from cookie
const getLoggedInUserData = async (req, res) => {
  const tokenPayload = jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET_STRING');
  const user = await User.findById(tokenPayload._id)

  res.send(user)
}

export { signUp, login, checkIfLoggedIn, editApprover, getApproverDetails, getApproverAccounts, deleteApprover, getLoggedInUserData, getPendingAccounts }