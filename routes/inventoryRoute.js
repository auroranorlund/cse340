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
router.get("/management", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));
// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
// Route to build new classification view
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassView));
// Process add new classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);
// Route to build add new inventory view
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInvView));
// Process add new inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);
// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildEditInvView));
// Process edit inventory
router.post(
  "/edit/",
  invValidate.inventoryRules(),
  invValidate.checkEditData,
  utilities.handleErrors(invController.editInventory)
);
// Route to build delete inventory view
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInvView));
// Process delete inventory
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;