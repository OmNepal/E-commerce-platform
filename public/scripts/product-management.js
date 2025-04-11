const deleteProductButtonElements = document.querySelectorAll('.product-item button')

async function deleteProduct(event) { //we get event object automatically for all the functions that are triggered by events
  const buttonElement = event.target;//target is the element on which the event occured
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, { //sends request to the URL which will be handled in the backend
    method: 'DELETE', //can use post request as well but delete fits more because we are deleting a product
  })

  if (!response.ok) {
    alert('Something went wrong')
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove() //using DOM traversal to get the container containing the product (li) and using built in remove() method to remove that product from the page
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct)
}