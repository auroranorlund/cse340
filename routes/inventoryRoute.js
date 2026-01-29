// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const invValidate = require("../utilities/inv-validation")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByinvId));
// Route to build management view
router.get("/management", utilities.handleErrors(invController.buildManagementView));
// Route to build new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView));
// Process add new classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)
// Route to build add new inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInvView));
// Process add new inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;