const updateOrderFormElements = document.querySelectorAll('.order-actions form')

async function updateOrder(event) {
  event.preventDefault()
  form = event.target

  const formData = new FormData(form);
  const newStatus = formData.get('status');
  const orderId = formData.get('orderid');
  const csrfToken = formData.get('_csrf');

  let response
  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        newStatus: newStatus,
        _csrf: csrfToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    alert('something went wrong')
    return
  }

  if (!response.ok) {
    alert('something is wrong')
    return
  }

  const responseData = await response.json()

  document.querySelector('.badge').textContent = responseData.newStatus.toUpperCase()

}

for (const formElement of updateOrderFormElements) {
  formElement.addEventListener('submit', updateOrder)
}