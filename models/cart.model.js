class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalPrice = totalPrice;
    this.totalQuantity = totalQuantity
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price
    }

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (item.product.id === product.id) { //if product exists already then update product's quantity, price, totalprice and totalquantity
        cartItem.quantity += 1
        cartItem.totalPrice += product.price
        this.items[i] = cartItem

        this.totalQuantity++;
        this.totalPrice += product.price
        return
      }
    }
    this.items.push(cartItem) //if a new product is added, push the cartitem into the cart's items array and update total price, total quantity
    this.totalQuantity++;
    this.totalPrice += product.price
  }
}

module.exports = Cart