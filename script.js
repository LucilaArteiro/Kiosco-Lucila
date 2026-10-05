/* =========================================================
   KIOSCO LUCILA
   JavaScript principal
   ========================================================= */

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

// IMPORTANTE:
// Más adelante reemplazamos este número por el WhatsApp real
// de Kiosco Lucila.

const numeroWhatsApp = '5493410000000'

/* =========================================================
   PRODUCTOS DE PRUEBA
   ========================================================= */

const productos = [
  {
    id: 1,
    nombre: 'Coca-Cola 500 ml',
    categoria: 'Bebidas',
    precio: 1800,
    imagen: '',
    descripcion: 'Gaseosa Coca-Cola de 500 ml.'
  },

  {
    id: 2,
    nombre: 'Agua Mineral 500 ml',
    categoria: 'Bebidas',
    precio: 1200,
    imagen: '',
    descripcion: 'Agua mineral sin gas.'
  },

  {
    id: 3,
    nombre: 'Jugo en Caja',
    categoria: 'Bebidas',
    precio: 1400,
    imagen: '',
    descripcion: 'Jugo individual.'
  },

  {
    id: 4,
    nombre: 'Papas Fritas',
    categoria: 'Comidas',
    precio: 1600,
    imagen: '',
    descripcion: 'Papas fritas clásicas.'
  },

  {
    id: 5,
    nombre: 'Alfajor de Chocolate',
    categoria: 'Dulces',
    precio: 1300,
    imagen: '',
    descripcion: 'Alfajor bañado en chocolate.'
  },

  {
    id: 6,
    nombre: 'Chocolate',
    categoria: 'Dulces',
    precio: 1700,
    imagen: '',
    descripcion: 'Tableta de chocolate.'
  },

  {
    id: 7,
    nombre: 'Caramelos',
    categoria: 'Dulces',
    precio: 900,
    imagen: '',
    descripcion: 'Caramelos surtidos.'
  },

  {
    id: 8,
    nombre: 'Detergente',
    categoria: 'Limpieza',
    precio: 2200,
    imagen: '',
    descripcion: 'Detergente para vajilla.'
  },

  {
    id: 9,
    nombre: 'Esponja',
    categoria: 'Limpieza',
    precio: 1000,
    imagen: '',
    descripcion: 'Esponja para limpieza.'
  },

  {
    id: 10,
    nombre: 'Encendedor',
    categoria: 'Otros',
    precio: 1500,
    imagen: '',
    descripcion: 'Encendedor descartable.'
  }
]

/* =========================================================
   ELEMENTOS DEL DOM
   ========================================================= */

const listaProductos = document.querySelector('#listaProductos')

const buscadorProductos = document.querySelector('#buscadorProductos')

const filtroCategoria = document.querySelector('#filtroCategoria')

const mensajeSinProductos = document.querySelector('#mensajeSinProductos')

const carrito = document.querySelector('#carrito')

const carritoProductos = document.querySelector('#carritoProductos')

const totalCarrito = document.querySelector('#totalCarrito')

const botonFinalizarPedido = document.querySelector('#botonFinalizarPedido')

const overlay = document.querySelector('#overlay')

const botonCarrito = document.querySelector('#botonCarrito')

const botonCerrarCarrito = document.querySelector('#botonCerrarCarrito')

const contadorCarrito = document.querySelector('#contadorCarrito')

const botonMenu = document.querySelector('#botonMenu')

const navegacion = document.querySelector('#navegacion')

/* =========================================================
   CARRITO
   ========================================================= */

let carritoActual = JSON.parse(localStorage.getItem('carritoKiosco')) || []

/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

function formatearPrecio (precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(precio)
}

/* =========================================================
   MOSTRAR PRODUCTOS
   ========================================================= */

function mostrarProductos (lista = productos) {
  listaProductos.innerHTML = ''

  if (lista.length === 0) {
    mensajeSinProductos.classList.add('visible')

    return
  }

  mensajeSinProductos.classList.remove('visible')

  lista.forEach(producto => {
    const tarjeta = document.createElement('article')

    tarjeta.classList.add('producto-card')

    let contenidoImagen = `
            <div class="producto-placeholder">
                🛒
            </div>
        `

    if (producto.imagen) {
      contenidoImagen = `
                <img 
                    src="${producto.imagen}" 
                    alt="${producto.nombre}"
                    loading="lazy"
                >
            `
    }

    tarjeta.innerHTML = `

            <div class="producto-imagen">
                ${contenidoImagen}
            </div>

            <div class="producto-contenido">

                <span class="producto-categoria">
                    ${producto.categoria}
                </span>

                <h3 class="producto-nombre">
                    ${producto.nombre}
                </h3>

                <p class="producto-descripcion">
                    ${producto.descripcion}
                </p>

                <div class="producto-pie">

                    <span class="producto-precio">
                        ${formatearPrecio(producto.precio)}
                    </span>

                    <button
                        class="boton-agregar"
                        type="button"
                        data-id="${producto.id}"
                        aria-label="Agregar ${producto.nombre}"
                    >
                        +
                    </button>

                </div>

            </div>
        `

    listaProductos.appendChild(tarjeta)
  })

  agregarEventosBotonesProducto()
}

/* =========================================================
   BOTONES AGREGAR
   ========================================================= */

function agregarEventosBotonesProducto () {
  const botones = document.querySelectorAll('.boton-agregar')

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const id = Number(boton.dataset.id)

      agregarAlCarrito(id)
    })
  })
}

/* =========================================================
   AGREGAR AL CARRITO
   ========================================================= */

function agregarAlCarrito (id) {
  const producto = productos.find(producto => producto.id === id)

  if (!producto) {
    return
  }

  const productoExistente = carritoActual.find(item => item.id === id)

  if (productoExistente) {
    productoExistente.cantidad++
  } else {
    carritoActual.push({
      id: producto.id,
      cantidad: 1
    })
  }

  guardarCarrito()

  mostrarCarrito()

  abrirCarrito()
}

/* =========================================================
   MOSTRAR CARRITO
   ========================================================= */

function mostrarCarrito () {
  carritoProductos.innerHTML = ''

  if (carritoActual.length === 0) {
    carritoProductos.innerHTML = `

            <div class="carrito-vacio">

                <div class="carrito-vacio-icono">
                    🛒
                </div>

                <h3>
                    Tu carrito está vacío
                </h3>

                <p>
                    Agregá productos para comenzar tu pedido.
                </p>

            </div>

        `

    actualizarTotal()

    actualizarContador()

    return
  }

  carritoActual.forEach(item => {
    const producto = productos.find(producto => producto.id === item.id)

    if (!producto) {
      return
    }

    const subtotal = producto.precio * item.cantidad

    const elemento = document.createElement('div')

    elemento.classList.add('carrito-item')

    let imagen = `
            <div class="carrito-item-imagen">
                <div class="producto-placeholder">
                    🛒
                </div>
            </div>
        `

    if (producto.imagen) {
      imagen = `
                <div class="carrito-item-imagen">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

                </div>
            `
    }

    elemento.innerHTML = `

            ${imagen}

            <div class="carrito-item-info">

                <h4>
                    ${producto.nombre}
                </h4>

                <span class="carrito-item-precio">
                    ${formatearPrecio(subtotal)}
                </span>

                <div class="carrito-item-controles">

                    <button
                        class="boton-cantidad"
                        data-accion="restar"
                        data-id="${producto.id}"
                        type="button"
                    >
                        −
                    </button>

                    <span class="cantidad-item">
                        ${item.cantidad}
                    </span>

                    <button
                        class="boton-cantidad"
                        data-accion="sumar"
                        data-id="${producto.id}"
                        type="button"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                class="boton-eliminar-item"
                data-id="${producto.id}"
                type="button"
                aria-label="Eliminar producto"
            >
                ✕
            </button>

        `

    carritoProductos.appendChild(elemento)
  })

  agregarEventosCarrito()

  actualizarTotal()

  actualizarContador()
}

/* =========================================================
   EVENTOS DEL CARRITO
   ========================================================= */

function agregarEventosCarrito () {
  const botonesCantidad = document.querySelectorAll('.boton-cantidad')

  botonesCantidad.forEach(boton => {
    boton.addEventListener('click', () => {
      const id = Number(boton.dataset.id)

      const accion = boton.dataset.accion

      cambiarCantidad(id, accion)
    })
  })

  const botonesEliminar = document.querySelectorAll('.boton-eliminar-item')

  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', () => {
      const id = Number(boton.dataset.id)

      eliminarDelCarrito(id)
    })
  })
}

/* =========================================================
   CAMBIAR CANTIDAD
   ========================================================= */

function cambiarCantidad (id, accion) {
  const item = carritoActual.find(item => item.id === id)

  if (!item) {
    return
  }

  if (accion === 'sumar') {
    item.cantidad++
  }

  if (accion === 'restar') {
    item.cantidad--
  }

  if (item.cantidad <= 0) {
    carritoActual = carritoActual.filter(producto => producto.id !== id)
  }

  guardarCarrito()

  mostrarCarrito()
}

/* =========================================================
   ELIMINAR DEL CARRITO
   ========================================================= */

function eliminarDelCarrito (id) {
  carritoActual = carritoActual.filter(producto => producto.id !== id)

  guardarCarrito()

  mostrarCarrito()
}

/* =========================================================
   CALCULAR TOTAL
   ========================================================= */

function calcularTotal () {
  return carritoActual.reduce(
    (total, item) => {
      const producto = productos.find(producto => producto.id === item.id)

      if (!producto) {
        return total
      }

      return total + producto.precio * item.cantidad
    },

    0
  )
}

/* =========================================================
   ACTUALIZAR TOTAL
   ========================================================= */

function actualizarTotal () {
  const total = calcularTotal()

  totalCarrito.textContent = formatearPrecio(total)
}

/* =========================================================
   ACTUALIZAR CONTADOR
   ========================================================= */

function actualizarContador () {
  const cantidad = carritoActual.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  contadorCarrito.textContent = cantidad
}

/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function guardarCarrito () {
  localStorage.setItem('carritoKiosco', JSON.stringify(carritoActual))
}

/* =========================================================
   ABRIR CARRITO
   ========================================================= */

function abrirCarrito () {
  carrito.classList.add('abierto')

  overlay.classList.add('visible')

  document.body.classList.add('carrito-abierto')
}

/* =========================================================
   CERRAR CARRITO
   ========================================================= */

function cerrarCarrito () {
  carrito.classList.remove('abierto')

  overlay.classList.remove('visible')

  document.body.classList.remove('carrito-abierto')
}

/* =========================================================
   BOTÓN CARRITO
   ========================================================= */

botonCarrito.addEventListener('click', abrirCarrito)

/* =========================================================
   BOTÓN CERRAR CARRITO
   ========================================================= */

botonCerrarCarrito.addEventListener('click', cerrarCarrito)

/* =========================================================
   OVERLAY
   ========================================================= */

overlay.addEventListener('click', cerrarCarrito)

/* =========================================================
   BUSCADOR
   ========================================================= */

buscadorProductos.addEventListener('input', aplicarFiltros)

/* =========================================================
   FILTRO CATEGORÍA
   ========================================================= */

filtroCategoria.addEventListener('change', aplicarFiltros)

/* =========================================================
   APLICAR FILTROS
   ========================================================= */

function aplicarFiltros () {
  const texto = buscadorProductos.value.toLowerCase().trim()

  const categoria = filtroCategoria.value

  const productosFiltrados = productos.filter(producto => {
    const coincideTexto =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.categoria.toLowerCase().includes(texto)

    const coincideCategoria =
      categoria === 'todas' || producto.categoria === categoria

    return coincideTexto && coincideCategoria
  })

  mostrarProductos(productosFiltrados)
}

/* =========================================================
   CATEGORÍAS
   ========================================================= */

const tarjetasCategoria = document.querySelectorAll('.categoria-card')

tarjetasCategoria.forEach(tarjeta => {
  tarjeta.addEventListener('click', () => {
    const categoria = tarjeta.dataset.categoria

    if (!categoria) {
      return
    }

    filtroCategoria.value = categoria

    aplicarFiltros()

    document.querySelector('#productos').scrollIntoView({
      behavior: 'smooth'
    })
  })
})

/* =========================================================
   MENÚ MÓVIL
   ========================================================= */

if (botonMenu) {
  botonMenu.addEventListener('click', () => {
    navegacion.classList.toggle('activa')
  })
}

/* =========================================================
   CERRAR MENÚ AL HACER CLICK
   ========================================================= */

const enlacesNavegacion = document.querySelectorAll('.navegacion a')

enlacesNavegacion.forEach(enlace => {
  enlace.addEventListener('click', () => {
    navegacion.classList.remove('activa')
  })
})

/* =========================================================
   FINALIZAR PEDIDO POR WHATSAPP
   ========================================================= */

botonFinalizarPedido.addEventListener('click', finalizarPedido)

function finalizarPedido () {
  if (carritoActual.length === 0) {
    alert('Tu carrito está vacío. Agregá al menos un producto.')

    return
  }

  let mensaje = 'Hola! Quiero realizar un pedido en Kiosco Lucila.%0A%0A'

  carritoActual.forEach(item => {
    const producto = productos.find(producto => producto.id === item.id)

    if (!producto) {
      return
    }

    const subtotal = producto.precio * item.cantidad

    mensaje += `• ${producto.nombre} x${item.cantidad} - ${formatearPrecio(
      subtotal
    )}%0A`
  })

  const total = calcularTotal()

  mensaje += `%0A*Total: ${formatearPrecio(total)}*`

  mensaje += '%0A%0A📍 Retiro en Kiosco Lucila - Ciudadela 1847'

  mensaje += '%0A🛍️ El pedido será retirado en el kiosco.'

  const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`

  window.open(url, '_blank')
}

/* =========================================================
   BOTONES DE CATEGORÍAS
   ========================================================= */

function configurarCategorias () {
  const categorias = document.querySelectorAll('.categoria-card')

  categorias.forEach(categoria => {
    const titulo = categoria.querySelector('h3')

    if (!titulo) {
      return
    }

    categoria.style.cursor = 'pointer'

    categoria.addEventListener('click', () => {
      const nombreCategoria = titulo.textContent.trim()

      const existeCategoria = productos.some(
        producto => producto.categoria === nombreCategoria
      )

      if (!existeCategoria) {
        return
      }

      filtroCategoria.value = nombreCategoria

      aplicarFiltros()

      document.querySelector('#productos').scrollIntoView({
        behavior: 'smooth'
      })
    })
  })
}

/* =========================================================
   INICIALIZAR
   ========================================================= */

function iniciarPagina () {
  mostrarProductos()

  mostrarCarrito()

  configurarCategorias()
}

iniciarPagina()
