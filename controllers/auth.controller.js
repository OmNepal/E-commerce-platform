const User = require('../models/user.model')
const authUtil = require('../util/authentication')
const validation = require('../util/validation')
const sessionFlash = require('../util/session-flash')
const session = require('express-session')

function getSignup(req, res) {
  sessionData = sessionFlash.getSessionData(req)

  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullName: '',
      street: '',
      postal: '',
      city: ''
    }
  }

  res.render('customer/auth/signup', {
    inputData: sessionData
  })
}

async function signup(req, res, next) {
  const userData = req.body

  const enteredData = {
    email: userData.email,
    confirmEmail: userData['confirm-email'],
    password: userData.password,
    fullName: userData.fullName,
    street: userData.street,
    postal: userData.postalCode,
    city: userData.city
  }

  if (
    !validation.userDetailsAreValid(
      userData.email,
      userData.password,
      userData.fullName,
      userData.street,
      userData.postalCode,
      userData.city
    ) || !validation.emailIsConfirmed(userData.email, userData['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: 'Please check your inputs.',
        ...enteredData
      },
      function () {
        res.redirect('/signup')
      })
    return

  }

  const user = new User(
    userData.email,
    userData.password,
    userData.fullName,
    userData.street,
    userData.postalCode,
    userData.city)

  try {
    const existsAlready = await user.existsAlready()

    if (existsAlready) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: 'User exists already. Try loggin in!',
        ...enteredData
      },
        function () {
          res.redirect('/signup')
        })

      return;
    }

    await user.signup()
  } catch (error) {
    return next(error)
  }

  res.redirect('/login')

}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req)

  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }

  res.render('customer/auth/login', {
    inputData: sessionData
  })
}

async function login(req, res) {
  const loginInfo = req.body

  const user = new User(loginInfo.email, loginInfo.password)
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail()
  } catch (error) {
    next(error)
    return
  }

  sessionErrorData = {
    errorMessage: 'Invalid credentials. Please double check your email and password',
    email: user.email,
    password: user.password
  }


  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData,
      function () {
        res.redirect('/login')
      })

    return;
  }

  const passwordIsCorrect = await user.comparePassword(existingUser.password)

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData,
      function () {
        res.redirect('/login')
      })

    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/')
  })

}

function logout(req, res) {
  authUtil.deleteUserAuthSession(req)
  res.redirect('/login')
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout
}