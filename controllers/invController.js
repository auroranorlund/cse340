const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detail inventory view
 * ************************** */
invCont.buildByinvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const detail = await utilities.buildInvDetail(data)
  let nav = await utilities.getNav()
  const carYear = data[0].inv_year
  const carMake = data[0].inv_make
  const carModel = data[0].inv_model
  res.render("./inventory/detail", {
    title: carYear + " " + carMake + " " + carModel,
    nav,
    detail,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process add new classification
* *************************************** */
invCont.addClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classResult = await invModel.addClassification(
    classification_name
  )

  if (classResult) {
    req.flash(
      "notice",
      `Classification added`
    )
    nav = await utilities.getNav()
    res.status(201).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding the new classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/* ***************************
 *  Build add new inventory view
 * ************************** */
invCont.buildAddInvView = async function (req, res, next) {
  const classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Process Add New Inventory
* *************************************** */
invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const inv_image = "/images/vehicles/no-image.png"
  const inv_thumbnail = "/images/vehicles/no-image-tn.png"

  const invResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (invResult) {
    req.flash(
      "notice",
      "Inventory item added."
    )
    res.status(201).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: null,
      classificationList
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList
    })
  }
}


  module.exports = invCont