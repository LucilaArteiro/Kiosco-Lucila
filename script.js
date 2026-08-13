const CONTRASENA_DUENO = '44775546'

let modoDuenoActivo = false

const $ = id => document.getElementById(id)

const btnModoDueno = $('btnModoDueno')
const panelDueno = $('panelDueno')
const btnCerrarModoDueno = $('btnCerrarModoDueno')

const btnEscanear = $('btnEscanear')
const btnAgregarProducto = $('btnAgregarProducto')
const btnEscanearParaAgregar = $('btnEscanearParaAgregar')
const btnGuardarProducto = $('btnGuardarProducto')
const btnVerProductos = $('btnVerProductos')

const listaProductosGuardados = $('listaProductosGuardados')
const lector = $('lector')
const video = $('video')
const resultado = $('resultado')
const formularioProducto = $('formularioProducto')
const codigoProducto = $('codigoProducto')

const codeReader = new ZXing.BrowserMultiFormatReader()

const productos = {
  7791234567890: {
    nombre: 'Ravioles La Morocha',
    precio: '$500',
    imagen: 'imagenes/Ravioles-La-Morocha.webp',
    categoria: 'comidas'
  },

  7791627000032: {
    nombre: 'Tomate Triturado',
    precio: '$1900',
    imagen: 'imagenes/Tomate-Triturado.webp',
    categoria: 'comidas'
  },

  7790580131487: {
    nombre: 'Cobertura de Chocolate',
    precio: '$1900',
    imagen: 'imagenes/Cobertura-de-Chocolate.webp',
    categoria: 'dulces'
  },

  7790070413116: {
    nombre: 'Flan de Vainilla',
    precio: '$1900',
    imagen: 'imagenes/Flan-De-Vainilla.webp',
    categoria: 'dulces'
  },

  7790070432513: {
    nombre: 'Gelatina',
    precio: '$1900',
    imagen: 'imagenes/Gelatina.webp',
    categoria: 'dulces'
  },

  7790070760579: {
    nombre: 'Vino Benjamín',
    precio: '$1900',
    imagen: 'imagenes/Vino-Benjamin.webp',
    categoria: 'bebidas'
  },

  7790150160725: {
    nombre: 'Cappuccino',
    precio: '$3500',
    imagen: 'imagenes/cappuccino.webp',
    categoria: 'bebidas'
  },

  7790036973036: {
    nombre: 'Puré de tomate chico',
    precio: '$1500',
    imagen: 'imagenes/pure-de-tomate-chico.webp',
    categoria: 'comidas'
  },

  7790036567440: {
    nombre: 'Puré de tomate grande',
    precio: '$1500',
    imagen: 'imagenes/pure-de-tomate-grande.webp',
    categoria: 'comidas'
  },

  7790415129047: {
    nombre: 'Vino Circus',
    precio: '$1900',
    imagen: 'imagenes/Vino-Circus.webp',
    categoria: 'bebidas'
  }
}

function comprobarModoDueno () {
  if (!modoDuenoActivo) {
    alert('🔒 Esta función es exclusiva del modo dueño.')
    return false
  }

  return true
}

function obtenerProductosPendientes () {
  return JSON.parse(localStorage.getItem('productosPendientes')) || []
}

function guardarProductosPendientes (lista) {
  localStorage.setItem('productosPendientes', JSON.stringify(lista))
}

btnModoDueno.addEventListener('click', () => {
  if (modoDuenoActivo) return

  const contrasena = prompt('🔐 Ingresá la contraseña de dueño:')

  if (contrasena !== CONTRASENA_DUENO) {
    alert('❌ Contraseña incorrecta')
    return
  }

  modoDuenoActivo = true
  panelDueno.style.display = 'flex'
  btnModoDueno.textContent = '🔓 Modo dueño activo'
})

btnCerrarModoDueno.addEventListener('click', () => {
  modoDuenoActivo = false
  panelDueno.style.display = 'none'
  btnModoDueno.textContent = '🔐 Modo dueño'

  formularioProducto.style.display = 'none'
  listaProductosGuardados.innerHTML = ''
})

document.querySelector('.boton-menu').addEventListener('click', () => {
  const menu = document.querySelector('.lista-menu')

  menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
})

btnEscanear.addEventListener('click', () => {
  iniciarEscaner('catalogo')
})

btnAgregarProducto.addEventListener('click', () => {
  if (!comprobarModoDueno()) return

  formularioProducto.style.display =
    formularioProducto.style.display === 'block' ? 'none' : 'block'
})

btnEscanearParaAgregar.addEventListener('click', () => {
  if (!comprobarModoDueno()) return

  iniciarEscaner('agregar')
})

async function iniciarEscaner (modo) {
  lector.style.display = 'block'
  resultado.textContent = '📷 Preparando la cámara...'

  try {
    const dispositivos = await codeReader.listVideoInputDevices()

    if (dispositivos.length === 0) {
      throw new Error('No hay cámara disponible')
    }

    const camara = dispositivos[dispositivos.length - 1].deviceId

    resultado.textContent = '📷 Apuntá al código de barras...'

    codeReader.decodeFromVideoDevice(camara, video, result => {
      if (!result) return

      const codigo = result.text.trim()

      codeReader.reset()
      lector.style.display = 'none'

      if (modo === 'agregar') {
        codigoProducto.value = codigo
        resultado.textContent = '✅ Código detectado correctamente.'
        return
      }

      buscarProducto(codigo)
    })
  } catch (error) {
    console.error(error)
    lector.style.display = 'none'
    resultado.textContent =
      '❌ No se pudo acceder a la cámara. Revisá los permisos.'
  }
}

function buscarProducto (codigo) {
  const productoPendiente = obtenerProductosPendientes().find(
    producto => producto.codigo === codigo
  )

  const producto = productoPendiente || productos[codigo]

  if (producto) {
    resultado.innerHTML = `
      <div class="producto-encontrado">
        <img src="${producto.imagen}" alt="${producto.nombre}">

        <h3>🛒 ${producto.nombre}</h3>

        <span class="precio">${producto.precio}</span>

        <button class="boton-otro-escaneo" onclick="location.reload()">
          📷 Escanear otro producto
        </button>
      </div>
    `
  } else {
    resultado.innerHTML = `
      <div class="producto-encontrado">
        <h3>❌ Producto no encontrado</h3>

        <p>
          No tenemos registrado el código:
          <strong>${codigo}</strong>
        </p>

        <button class="boton-otro-escaneo" onclick="location.reload()">
          📷 Escanear otro producto
        </button>
      </div>
    `
  }
}

btnGuardarProducto.addEventListener('click', () => {
  if (!comprobarModoDueno()) return

  const codigo = codigoProducto.value.trim()
  const nombre = $('nombreProducto').value.trim()
  const precio = $('precioProducto').value.trim()
  const imagen = $('imagenProducto').value.trim()
  const categoria = $('categoriaProducto').value

  if (!codigo || !nombre || !precio || !imagen || !categoria) {
    alert('⚠️ Completá todos los campos antes de guardar.')
    return
  }

  const rutaImagen = `imagenes/${imagen}`

  const lista = obtenerProductosPendientes().filter(
    producto => producto.codigo !== codigo
  )

  lista.push({
    codigo,
    nombre,
    precio,
    imagen: rutaImagen,
    categoria
  })

  guardarProductosPendientes(lista)

  const codigoJS = `${codigo}: {
  nombre: ${JSON.stringify(nombre)},
  precio: ${JSON.stringify(precio)},
  imagen: ${JSON.stringify(rutaImagen)},
  categoria: ${JSON.stringify(categoria)}
},`

  const codigoHTML = `<div class="producto">
  <img src="${rutaImagen}" alt="${nombre}" />

  <h3>${nombre}</h3>

  <p>${precio}</p>
</div>`

  resultado.innerHTML = `
    <div class="producto-encontrado">
      <h3>✅ Producto preparado</h3>

      <p>Copiá estos códigos y pegálos en tus archivos.</p>

      <h3>📄 Código para script.js</h3>

      <textarea id="codigoGenerado" readonly></textarea>

      <button id="btnCopiarCodigo" class="boton-otro-escaneo">
        📋 Copiar código JS
      </button>

      <h3>📄 Código para index.html</h3>

      <p>
        Pegalo dentro de la categoría:
        <strong>${categoria}</strong>
      </p>

      <textarea id="codigoHTMLGenerado" readonly></textarea>

      <button id="btnCopiarHTML" class="boton-otro-escaneo">
        📋 Copiar código HTML
      </button>
    </div>
  `

  $('codigoGenerado').value = codigoJS
  $('codigoHTMLGenerado').value = codigoHTML

  $('btnCopiarCodigo').addEventListener('click', async () => {
    await navigator.clipboard.writeText(codigoJS)
    $('btnCopiarCodigo').textContent = '✅ Código JS copiado'
  })

  $('btnCopiarHTML').addEventListener('click', async () => {
    await navigator.clipboard.writeText(codigoHTML)
    $('btnCopiarHTML').textContent = '✅ Código HTML copiado'
  })

  formularioProducto.querySelectorAll('input').forEach(campo => {
    campo.value = ''
  })

  $('categoriaProducto').value = ''

  mostrarProductosPendientes()
})

btnVerProductos.addEventListener('click', () => {
  if (!comprobarModoDueno()) return

  mostrarProductosPendientes()
})

function mostrarProductosPendientes () {
  const lista = obtenerProductosPendientes()

  if (lista.length === 0) {
    listaProductosGuardados.innerHTML = `
      <div class="producto-encontrado">
        <h3>📦 No hay productos pendientes</h3>
      </div>
    `
    return
  }

  listaProductosGuardados.innerHTML = `
    <div class="producto-encontrado">
      <h3>📦 Productos pendientes</h3>

      ${lista
        .map(
          producto => `
        <div class="producto-pendiente">
          <strong>${producto.nombre}</strong><br>
          Código: ${producto.codigo}<br>
          Precio: ${producto.precio}<br>
          Categoría: ${producto.categoria}<br>

          <button
            class="boton-otro-escaneo"
            onclick="eliminarProductoPendiente('${producto.codigo}')"
          >
            🗑️ Eliminar
          </button>
        </div>
      `
        )
        .join('')}
    </div>
  `
}

window.eliminarProductoPendiente = codigo => {
  if (!comprobarModoDueno()) return

  const lista = obtenerProductosPendientes().filter(
    producto => producto.codigo !== codigo
  )

  guardarProductosPendientes(lista)
  mostrarProductosPendientes()
}

const buscadorProductos = $('buscadorProductos')

buscadorProductos.addEventListener('input', () => {
  const texto = buscadorProductos.value.toLowerCase().trim()

  document.querySelectorAll('.producto').forEach(producto => {
    producto.style.display = producto.textContent.toLowerCase().includes(texto)
      ? 'block'
      : 'none'
  })
})
