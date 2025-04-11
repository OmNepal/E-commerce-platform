const mongoDB = require('mongodb')

const db = require('../data/database')

class Product {
  constructor(productData) {
    this.title = productData.title,
      this.summary = productData.summary,
      this.price = +productData.price,
      this.description = productData.description
    this.image = productData.image //the name of the image
    this.updateImageData()
    if (productData._id) {
      this.id = productData._id.toString()
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongoDB.ObjectId(productId)
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const product = await db.getDb().collection('products').findOne({ _id: prodId })

    if (!product) {
      const error = new Error('Could not find a product with the provided id.')
      error.code = 404
      throw error;
    }

    return new Product(product)

  }

  static async findAll() { //used static bcoz we cant instantiate a product obj without having any product data
    const products = await db.getDb().collection('products').find().toArray()

    return products.map(function (productDocument) {
      return new Product(productDocument)
    })
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`
    this.imageUrl = `/products/assets/images/${this.image}`
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image
    }

    if (this.id) { //if the product has an id field already then it means that the product mus tbe updated
      const productId = new mongoDB.ObjectId(this.id)

      if (!this.image) { //if image is not updated, then we do not want to overwrite the existing image
        delete productData.image
      }

      await db.getDb().collection('products').updateOne({ _id: productId }, { //update existing product 
        $set: productData
      })
    } else {
      await db.getDb().collection('products').insertOne(productData) //add new product
    }
  }

  replaceImage(newImage) {
    this.image = newImage
    this.updateImageData()
  }

  remove() {
    const productId = new mongoDB.ObjectId(this.id)
    return db.getDb().collection('products').deleteOne({ _id: productId })
  }

}

module.exports = Product;