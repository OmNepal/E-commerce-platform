const mongodb = require('mongodb')

const db = require('../data/database')

class Order {
  //Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date) //transform the string date into a date object which we can work with in our code
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', { //formatting the date to be human readable
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    this.id = orderId
  }

  static transformOrderDoc(orderDoc) { //convert each order into the Order class's object
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    )
  }

  static transformOrderDocs(orderDocsArray) {
    return orderDocsArray.map(this.transformOrderDoc) //call transformOrderDoc for each order in the orders array
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 }) //sort the orders in descending order using mongodb's sort method
      .toArray()

    return this.transformOrderDocs(orders)
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId)

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray()

    return this.transformOrderDocs(orders)
  }

  static async findById(orderId) {

    const order = await db.getDb().collection('orders').findOne({ _id: new mongodb.ObjectId(orderId) })

    return this.transformOrderDoc(order)
  }

  save() {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id)
      return db.getDb().collection('orders').updateOne({ _id: orderId }, {
        $set: { status: this.status }
      })
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        data: new Date(),
        status: this.status
      }

      return db.getDb().collection('orders').insertOne(orderDocument)
    }
  }

}

module.exports = Order