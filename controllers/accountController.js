const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountController = {}

/* ****************************************
*  Deliver account management view
* *************************************** */

accountController.buildAccountManagement = async function(req, res){
  let nav = await utilities.getNav()
  let clientName = res.locals.accountData.account_firstname
  let clientType = res.locals.accountData.account_type
  res.render("account/account-management", {
    title: "Account",
    nav,
    clientName,
    clientType
  })
}

/* ****************************************
*  Deliver login view
* *************************************** */

accountController.buildLogin = async function(req, res){
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */

accountController.buildRegistration = async function(req, res){
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Registration",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname}, you\'re registered! Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account update view
* *************************************** */

accountController.buildAccountUpdate = async function(req, res){
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
  })
}

/* ****************************************
*  Process Update Account Info
* *************************************** */
accountController.updateAccountInfo = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

    const regResult = await accountModel.updateAccountInfo(
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    )

    if (regResult) {
      req.flash(
        "notice",
        `Account information updated. Please log in again to apply changes.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email
      })
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      })
    }
}
  
/* ****************************************
*  Process Password Update
* *************************************** */
accountController.updatePassword = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null
    })
  }

  const regResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (regResult) {
    req.flash(
      "notice",
      `Password updated.`
    )
    res.status(201).render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
  })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      account_id: res.locals.accountData.account_id,
    })
  }
}

accountController.logOut = async function (req, res) {
  res.clearCookie('jwt')
  res.redirect("/")
}

/* ****************************************
*  Deliver user permission management view
* *************************************** */

accountController.buildPermissionManagement = async function(req, res){
  let nav = await utilities.getNav()
  const data = await accountModel.getUserList()
  let accountTable = await utilities.buildPermissionTable(data)
  res.render("account/manage", {
    title: "Manage User Permissions",
    nav,
    accountTable
  })
}

/* ****************************************
*  Deliver update permissions view by account id
* *************************************** */

accountController.buildPermissionUpdate = async function(req, res){
  let nav = await utilities.getNav()
  const account_id = req.params.accountId
  const data = await accountModel.getUserById(account_id)
  const account_firstname = data.account_firstname
  const account_lastname = data.account_lastname
  const account_email = data.account_email
  res.render("account/update-permissions", {
    title: account_firstname + " " + account_lastname + " " + "User Permissions",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  })
}

/* ****************************************
*  Process Update Permissions
* *************************************** */
accountController.updatePermission = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_type, account_id } = req.body

    const updateResult = await accountModel.updatePermission(
      account_type,
      account_id
    )

    if (updateResult) {
      req.flash(
        "notice",
        `User Permissions Updated`
      )
      const data = await accountModel.getUserList()
      let accountTable = await utilities.buildPermissionTable(data)
      res.status(201).render("account/manage", {
        title: "Manage User Permissions",
        nav,
        accountTable
      })
    } else {
      req.flash("notice", "Sorry, the update failed.")
      const data = await accountModel.getUserById(account_id)
      const account_firstname = data.account_firstname
      const account_lastname = data.account_lastname
      const account_email = data.account_email
      res.status(501).render("account/update-permissions", {
        title: account_firstname + " " + account_lastname + " " + "User Permissions",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }
}

module.exports = accountController