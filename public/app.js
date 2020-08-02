const toFormat = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency',
  }).format(price)
}

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toFormat(node.textContent)
})

const $card = document.querySelector('#card')
if ($card) {
  $card.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      fetch(`/card/remove/${id}`, {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            $card.querySelector('tbody').innerHTML = card.courses
              .map((c) => {
                return `
                          <tr>
                    <td>${c.title}</td>
                    <td>${c.count}</td>
                    <td>
                      <button class="btn btn-  small js-remove" data-id="${c.id}">Remove</button>
                    </td>
                  </tr>`
              })
              .join('')
            $card.querySelector('.price').textContent = toFormat(card.price)
          } else {
            $card.innerHTML = '<p>Card is empty</p>'
          }
        })
    }
  })
}
