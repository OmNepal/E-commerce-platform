const path = require('path')

const express = require('express')
const csrf = require('csurf')
const expressSession = require('express-session')

const createSessionConfig = require('./config/session')
const db = require('./data/database')
const addCsrfTokenMiddleware = require('./middlewares/csrf-token')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const checkAuthStatusMiddleware = require('./middlewares/check-auth')
const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/products.routes')
const baseRoutes = require('./routes/base.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.static('public'))
app.use('/products/assets', express.static('product-data'))

app.use(express.urlencoded({ extended: false }))

const sessionConfig = createSessionConfig()

app.use(expressSession(sessionConfig))
app.use(csrf())//checks for tokens, generate tokens when csrfToken module is called

app.use(checkAuthStatusMiddleware)

app.use(addCsrfTokenMiddleware)//just makes the token available for views using res.locals

app.use(baseRoutes)
app.use(authRoutes)
app.use(productRoutes)
app.use('/admin', adminRoutes) //only path that start with /admin will make it to the admin routes. so we don't have to add /admin to every admin routes

app.use(errorHandlerMiddleware)

db.connectToDatabase()
  .then(function () {
    app.listen(3000)
  }).catch(function (error) {
    console.log('Failed to connect to the database')
    console.log(error)
  })
