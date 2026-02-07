// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')
// Route to build default account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));
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
    utilities.handleErrors(accountController.accountLogin)
)
// Route to build account update view
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate));
// Process account info update
router.post(
  "/update-info",
  regValidate.updateInfoRules(),
  regValidate.checkUpdateInfoData,
  utilities.handleErrors(accountController.updateAccountInfo)
)
// Process password update
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)
// Logout process
router.get("/logout", utilities.handleErrors(accountController.logOut));
// Route to build user permission management view
router.get("/manage", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(accountController.buildPermissionManagement));
// Route to build permission update view
router.get("/update-permissions/:accountId", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(accountController.buildPermissionUpdate));
// Process account permissions update
router.post(
  "/update-permissions",
  regValidate.updatePermissionRules(),
  regValidate.checkPermissionData,
  utilities.handleErrors(accountController.updatePermission)
)
module.exports = router;