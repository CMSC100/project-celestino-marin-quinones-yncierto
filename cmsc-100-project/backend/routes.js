import { signUp, login, checkIfLoggedIn, createApprover, editApprover, getApproverDetails, getApproverAccounts, deleteApprover, getLoggedInUserData } from "./auth-controller.js";

const setUpRoutes = (app) => {
  app.get("/", (req, res) => { res.send("API Home") });
  app.get("/getapproverdetails", getApproverDetails),
  app.get("/getapproveraccounts", getApproverAccounts)

  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);
  app.post("/createapprover", createApprover);
  app.post("/editapprover", editApprover)
  app.post("/deleteapprover", deleteApprover)
  app.post("/getloggedinuserdata", getLoggedInUserData)
}

export default setUpRoutes;