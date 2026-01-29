// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));
// Process registration
router.post(
  "/registration",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;