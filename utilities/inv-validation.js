const utilities = require(".")
const invModel = require("../models/inventory-model")
  const { body, validationResult } = require("express-validator")
const validate = {}
  
/*  **********************************
  *  Classification Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      // classification name is required and must be string and cannot already exist
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
            .isLength({ min: 1 })
            .isAlpha()
        .withMessage("Please provide a classification name that does not contain spaces or special characters.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
            throw new Error("Classification already exists.")
        }
      }),
    ]
}
  
/* ******************************
 * Check data and return errors or add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [
      // Make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle make."), // on error this message is sent.
  
      // Model is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle model."), // on error this message is sent.
      
      // Year is required and must be string containing only 4 digits
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max: 4 }).withMessage("Please provide a vehicle year using 4 digits.")
        .isNumeric()
        .withMessage("Please provide a vehicle year using 4 digits."), // on error this message is sent.
      
      // Description is required and must be string
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle description."), // on error this message is sent.
      
      // Price is required and must be string containing only digits up to 9 characters total
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1, max: 9 }).withMessage("Please provide a vehicle price using only digits and a max of 9 numbers.")
        .isNumeric()
        .withMessage("Please provide a vehicle price using only digits and a max of 9 numbers."), // on error this message is sent.
      
      // Mileage is required and must be string containing only digits
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 }).withMessage("Please provide a vehicle mileage using only digits.")
        .isNumeric()
        .withMessage("Please provide a vehicle mileage using only digits."), // on error this message is sent.
      
      // Color is required and must be string
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle color."), // on error this message is sent.
      
      // Classification type is required
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please select a classification type."), // on error this message is sent.
      
    ]
}
  
/* ******************************
 * Check data and return errors or add inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classificationList
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or edit inventory
 * ***************************** */
validate.checkEditData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classificationList,
      inv_id
    })
    return
  }
  next()
}

module.exports = validate