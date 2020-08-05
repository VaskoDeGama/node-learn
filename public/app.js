const toCurrency = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency',
  }).format(price)
}

const toDateFormat = (date) => {
  return new Intl.DateTimeFormat('ru-Ru', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date))
}

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach((node) => {
  node.textContent = toDateFormat(node.textContent)
})

const $cart = document.querySelector('#cart')
if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      fetch(`/cart/remove/${id}`, {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((cart) => {
          console.log(cart)
          if (cart.courses.length) {
            $cart.querySelector('tbody').innerHTML = cart.courses
              .map((c) => {
                return `
                          <tr>
                    <td>${c.title}</td>
                    <td>${c.count}</td>
                    <td>
                      <button class="btn btn-small js-remove" data-id="${c.id}">Remove</button>
                    </td>
                  </tr>`
              })
              .join('')
            $cart.querySelector('.price').textContent = toFormat(cart.price)
          } else {
            $cart.innerHTML = '<p>cart is empty</p>'
          }
        })
    }
  })
}
