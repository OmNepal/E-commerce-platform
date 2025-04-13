const path = require('path')

const express = require('express')
const csrf = require('csurf')
const expressSession = require('express-session')

const createSessionConfig = require('./config/session')
const db = require('./data/database')
const addCsrfTokenMiddleware = require('./middlewares/csrf-token')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const checkAuthStatusMiddleware = require('./middlewares/check-auth')
const protectRoutesMiddleware = require('./middlewares/protect-routes')
const cartMiddleware = require('./middlewares/cart')
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/products.routes')
const baseRoutes = require('./routes/base.routes')
const adminRoutes = require('./routes/admin.routes')
const cartRoutes = require('./routes/cart.routes')
const ordersRoutes = require('./routes/orders.routes')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.static('public'))
app.use('/products/assets', express.static('product-data'))

app.use(express.urlencoded({ extended: false })) //parses form submission data
app.use(express.json())// parses JSON data in incoming requests

const sessionConfig = createSessionConfig()

app.use(expressSession(sessionConfig))
app.use(csrf())//checks for tokens, generate tokens when csrfToken module is called

app.use(cartMiddleware)
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware)//just makes the token available for views using res.locals
app.use(checkAuthStatusMiddleware)

app.use(baseRoutes)
app.use(authRoutes)
app.use(productRoutes)
app.use('/cart', cartRoutes) //cart should be accessible even to unauthenticated users so adding it before route protection

//app.use(protectRoutesMiddleware);//makes sure that protected routes can only be accessed by authenticated and authorized users

app.use('/orders', protectRoutesMiddleware, ordersRoutes)
app.use('/admin', protectRoutesMiddleware, adminRoutes) //only path that start with /admin will make it to the admin routes. so we don't have to add /admin to every admin routes

app.use(notFoundMiddleware)


app.use(errorHandlerMiddleware)

db.connectToDatabase()
  .then(function () {
    app.listen(3000)
  }).catch(function (error) {
    console.log('Failed to connect to the database')
    console.log(error)
  })
