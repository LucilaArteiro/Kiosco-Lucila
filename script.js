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
  resultado.textContent = '📷 Apuntá la cámara al código de barras...'

  try {
    const dispositivos = await codeReader.listVideoInputDevices()

    if (dispositivos.length === 0) {
      resultado.textContent = '❌ No se encontró ninguna cámara.'
      return
    }

    const camara = dispositivos[dispositivos.length - 1].deviceId

    codeReader.decodeFromVideoDevice(camara, video, (result, error) => {
      if (result) {
        const codigo = result.text

        resultado.textContent = `✅ Código detectado: ${codigo}`

        codeReader.reset()

        lector.style.display = 'none'

        buscarProducto(codigo)
      }
    })
  } catch (error) {
    console.error(error)

    resultado.textContent =
      '❌ No se pudo acceder a la cámara. Revisá los permisos.'
  }
})

// ==============================
// BUSCAR PRODUCTO
// ==============================

function buscarProducto (codigo) {
  const productos = {
    7791234567890: {
      nombre: 'Ravioles La Morocha',
      precio: '$500'
    },

    7791627000032: {
      nombre: 'Tomate Triturado',
      precio: '$1900'
    }
  }

  const producto = productos[codigo]

  if (producto) {
    resultado.innerHTML = `
      <strong>🛒 ${producto.nombre}</strong><br>
      Precio: ${producto.precio}
    `
  } else {
    resultado.textContent = `❌ No tenemos registrado el producto con código ${codigo}.`
  }
}
