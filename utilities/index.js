const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildInvDetail = async function(data){
  let detail
  if (data.length > 0) {
    product = data[0]
    detail = ''
    detail += '<img src="' + product.inv_image 
      +'" alt="Image of '+ product.inv_make + ' ' + product.inv_model 
      + ' on CSE Motors" />'
    detail += '<div class="detail-text"><p><span>Price:</span> $' + new Intl.NumberFormat('en-US').format(product.inv_price) + '</p>'
    detail += '<p><span>Description:</span> ' + product.inv_description + '</p>'
    detail += '<p><span>Color:</span> ' + product.inv_color + '</p>'
    detail += '<p><span>Miles:</span> ' + new Intl.NumberFormat('en-US').format(product.inv_miles) + '</p></div>'
  } else { 
    detail += '<p class="notice">Sorry, that vehicle could not be found in our inventory.</p>'
  }
  return detail
}

/* **************************************
* Build the classification list HTML for add classification form
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}
 
/* ****************************************
 *  Check Account Type
 * ************************************ */
 Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin") {
    next()
  } else {
    req.flash("notice", "That page is restricted to employees only. If you are an employee, please log in with the correct account.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check for admin permissions
 * ************************************ */
 Util.checkAdmin = (req, res, next) => {
  if (res.locals.accountData.account_type == "Admin") {
    next()
  } else {
    req.flash("notice", "That page is restricted to admins only. If you are an admin, please log in with the correct account.")
    return res.redirect("/account/login")
  }
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildPermissionTable = async function(data){
  let permissionTable = '<thead>'; 
  permissionTable += '<tr><th>First Name</th><th>Last Name</th><th>User Type</th><td>&nbsp;</td></tr>'; 
  permissionTable += '</thead>'; 
 // Set up the table body 
 permissionTable += '<tbody>'; 
 // Iterate over all vehicles in the array and put each in a row 
 data.forEach(function (element) { 
  permissionTable += `<tr><td>${element.account_firstname}</td><td>${element.account_lastname}</td><td>${element.account_type}</td>`; 
  permissionTable += `<td><a href='/account/update-permissions/${element.account_id}'>Edit</a></td></tr>`; 
 }) 
 permissionTable += '</tbody>';
  return permissionTable
}

module.exports = Util