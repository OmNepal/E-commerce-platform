const addToCartButtonElement = document.querySelector('#product-details button')
const cartBadgeElement = document.querySelector('.nav-items .badge')

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid
  const csrfToken = addToCartButtonElement.dataset.csrf

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ //passing product id in the request body for the backend to use
        productId: productId,
        _csrf: csrfToken
      }),
      headers: { //must set headers if setting body manually bcoz backend looks for headers, form submission sets headers by default
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    alert('Something went wrong')
    return;
  }

  if (!response.ok) {
    alert('Something went wrong')
    return;
  }

  const responseData = await response.json()

  const newTotalQuantity = responseData.newTotalItems

  cartBadgeElement.textContent = newTotalQuantity
}

addToCartButtonElement.addEventListener('click', addToCart)