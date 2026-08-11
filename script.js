// ==============================
// MENÚ
// ==============================

const boton = document.querySelector('.boton-menu')
const menu = document.querySelector('.lista-menu')

boton.addEventListener('click', () => {
  if (menu.style.display === 'block') {
    menu.style.display = 'none'
  } else {
    menu.style.display = 'block'
  }
})

// ==============================
// ESCÁNER DE CÓDIGOS DE BARRAS
// ==============================

const btnEscanear = document.getElementById('btnEscanear')
const lector = document.getElementById('lector')
const video = document.getElementById('video')
const resultado = document.getElementById('resultado')

const codeReader = new ZXing.BrowserMultiFormatReader()

btnEscanear.addEventListener('click', async () => {
  lector.style.display = 'block'

  resultado.textContent = '📷 Preparando la cámara...'

  try {
    const dispositivos = await codeReader.listVideoInputDevices()

    if (dispositivos.length === 0) {
      resultado.textContent = '❌ No se encontró ninguna cámara.'

      return
    }

    // Elegimos la última cámara disponible
    const camara = dispositivos[dispositivos.length - 1].deviceId

    resultado.textContent = '📷 Apuntá al código de barras...'

    codeReader.decodeFromVideoDevice(camara, video, (result, error) => {
      if (result) {
        const codigo = result.text

        console.log('Código detectado:', codigo)

        codeReader.reset()

        lector.style.display = 'none'

        buscarProducto(codigo)
      }
    })
  } catch (error) {
    console.error('Error de cámara:', error)

    lector.style.display = 'none'

    resultado.textContent =
      '❌ No se pudo acceder a la cámara. Revisá los permisos.'
  }
})

// ==============================
// PRODUCTOS
// ==============================

const productos = {
  7791234567890: {
    nombre: 'Ravioles La Morocha',
    precio: '$500',
    imagen: 'imagenes/Ravioles-La-Morocha.webp'
  },

  7791627000032: {
    nombre: 'Tomate Triturado',
    precio: '$1900',
    imagen: 'imagenes/Tomate-Triturado.webp'
  },

  7790580131487: {
    nombre: 'Cobertura de Chocolate',
    precio: '$1900',
    imagen: 'imagenes/Cobertura-de-Chocolate.webp'
  },

  7790070413116: {
    nombre: 'Flan de Vainilla',
    precio: '$1900',
    imagen: 'imagenes/Flan-De-Vainilla.webp'
  },

  7790070432513: {
    nombre: 'Gelatina',
    precio: '$1900',
    imagen: 'imagenes/Gelatina.webp'
  },

  7790070760579: {
    nombre: 'Vino Benjamín',
    precio: '$1900',
    imagen: 'imagenes/Vino-Benjamin.webp'
  },

  7790415129047: {
    nombre: 'Vino Circus',
    precio: '$1900',
    imagen: 'imagenes/Vino-Circus.webp'
  }
}

// ==============================
// BUSCAR PRODUCTO
// ==============================

function buscarProducto (codigo) {
  const producto = productos[codigo]

  if (producto) {
    resultado.innerHTML = `

      <div class="producto-encontrado">

        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
        >

        <h3>🛒 ${producto.nombre}</h3>

        <span class="precio">
          ${producto.precio}
        </span>

        <button
          class="boton-otro-escaneo"
          onclick="location.reload()"
        >
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

        <button
          class="boton-otro-escaneo"
          onclick="location.reload()"
        >
          📷 Escanear otro producto
        </button>

      </div>

    `
  }
}
