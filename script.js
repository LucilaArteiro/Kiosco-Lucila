const boton = document.querySelector('.boton-menu')
const menu = document.querySelector('.lista-menu')

boton.addEventListener('click', () => {
  if (menu.style.display === 'block') {
    menu.style.display = 'none'
  } else {
    menu.style.display = 'block'
  }
})
