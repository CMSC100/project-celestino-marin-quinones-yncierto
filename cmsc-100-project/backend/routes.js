import { signUp, login, checkIfLoggedIn, editApprover, getApproverDetails, getApproverAccounts, deleteApprover, getLoggedInUserData, getPendingAccounts, approveAccount, rejectAccount, getStudents, getAdvisers, assignAdviser } from "./auth-controller.js";
import { createApplication, getApplications, closeApplication, submitApplication, approveApplication, getApplicationsApprover, returnApplication } from "./app-controller.js"

const setUpRoutes = (app) => {
  app.get("/", (req, res) => { res.send("API Home") });
  app.get("/getapproverdetails", getApproverDetails),
  app.get("/getapproveraccounts", getApproverAccounts)
  app.get("/getpendingaccounts", getPendingAccounts)
  app.get("/getstudents", getStudents)
  app.get("/getadvisers", getAdvisers)
  app.get("/getapplications", getApplications)
  app.post("/getapplicationsapprover", getApplicationsApprover)

  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);
  app.post("/editapprover", editApprover)
  app.post("/deleteapprover", deleteApprover)
  app.post("/getloggedinuserdata", getLoggedInUserData)

  app.post("/createapplication", createApplication)
  app.post("/closeapplication", closeApplication)
  app.post("/submitapplication", submitApplication)
  
  app.post("/approveaccount", approveAccount)
  app.post("/rejectaccount", rejectAccount)
  app.post("/assignadviser", assignAdviser)

  app.post("/approveapplication", approveApplication)
  app.post("/returnapplication", returnApplication)
}

export default setUpRoutes;