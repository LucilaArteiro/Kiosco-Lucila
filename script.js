// ==============================
// PROTECCIÓN BÁSICA - MODO DUEÑO
// ==============================

// ⚠️ CAMBIÁ ESTA CONTRASEÑA POR LA QUE VOS QUIERAS
const CONTRASENA_DUENO = '44775546'

let modoDuenoActivo = false

const btnModoDueno = document.getElementById('btnModoDueno')
const btnCerrarModoDueno = document.getElementById('btnCerrarModoDueno')
const panelDueno = document.getElementById('panelDueno')

// ==============================
// ABRIR MODO DUEÑO
// ==============================

btnModoDueno.addEventListener('click', () => {
  if (modoDuenoActivo) {
    return
  }

  const contrasena = prompt('🔐 Ingresá la contraseña de dueño:')

  if (contrasena === CONTRASENA_DUENO) {
    modoDuenoActivo = true

    panelDueno.style.display = 'block'

    btnModoDueno.textContent = '🔓 Modo dueño activo'

    alert('✅ Acceso autorizado')
  } else {
    alert('❌ Contraseña incorrecta')
  }
})

// ==============================
// CERRAR MODO DUEÑO
// ==============================

btnCerrarModoDueno.addEventListener('click', () => {
  modoDuenoActivo = false

  panelDueno.style.display = 'none'

  btnModoDueno.textContent = '🔐 Modo dueño'

  // Cerrar cámara si estaba funcionando
  codeReader.reset()

  lector.style.display = 'none'

  resultado.textContent = ''

  formularioProducto.style.display = 'none'

  listaProductosGuardados.innerHTML = ''

  alert('🔒 Modo dueño cerrado')
})

// ==============================
// COMPROBAR ACCESO
// ==============================

function comprobarModoDueno () {
  if (!modoDuenoActivo) {
    alert('🔒 Esta función es exclusiva del modo dueño.')

    return false
  }

  return true
}

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
// ELEMENTOS
// ==============================

const btnEscanear = document.getElementById('btnEscanear')
const btnAgregarProducto = document.getElementById('btnAgregarProducto')
const btnEscanearParaAgregar = document.getElementById('btnEscanearParaAgregar')

const btnVerProductos = document.getElementById('btnVerProductos')
const btnExportarProductos = document.getElementById('btnExportarProductos')
const btnImportarProductos = document.getElementById('btnImportarProductos')

const archivoProductos = document.getElementById('archivoProductos')

const listaProductosGuardados = document.getElementById(
  'listaProductosGuardados'
)

const lector = document.getElementById('lector')
const video = document.getElementById('video')
const resultado = document.getElementById('resultado')

const formularioProducto = document.getElementById('formularioProducto')

const codigoProducto = document.getElementById('codigoProducto')

const codeReader = new ZXing.BrowserMultiFormatReader()

// ==============================
// PRODUCTOS BASE
// ==============================

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

  7790415129047: {
    nombre: 'Vino Circus',
    precio: '$1900',
    imagen: 'imagenes/Vino-Circus.webp',
    categoria: 'bebidas'
  }
}

// ==============================
// PRODUCTOS PENDIENTES
// ==============================

function obtenerProductosPendientes () {
  return JSON.parse(localStorage.getItem('productosPendientes')) || []
}

// ==============================
// GUARDAR PRODUCTO PENDIENTE
// ==============================

function guardarProductoPendiente (producto) {
  if (!comprobarModoDueno()) {
    return
  }

  let productosPendientes = obtenerProductosPendientes()

  productosPendientes = productosPendientes.filter(
    p => p.codigo !== producto.codigo
  )

  productosPendientes.push(producto)

  localStorage.setItem(
    'productosPendientes',
    JSON.stringify(productosPendientes)
  )
}

// ==============================
// ELIMINAR PRODUCTO PENDIENTE
// ==============================

function eliminarProductoPendiente (codigo) {
  if (!comprobarModoDueno()) {
    return
  }

  let productosPendientes = obtenerProductosPendientes()

  productosPendientes = productosPendientes.filter(
    producto => producto.codigo !== codigo
  )

  localStorage.setItem(
    'productosPendientes',
    JSON.stringify(productosPendientes)
  )

  mostrarProductosPendientes()
}

// ==============================
// ESCANEAR PRODUCTO
// ==============================

btnEscanear.addEventListener('click', async () => {
  if (!comprobarModoDueno()) {
    return
  }

  await iniciarEscaner('catalogo')
})

// ==============================
// ABRIR FORMULARIO
// ==============================

btnAgregarProducto.addEventListener('click', () => {
  if (!comprobarModoDueno()) {
    return
  }

  if (formularioProducto.style.display === 'block') {
    formularioProducto.style.display = 'none'
  } else {
    formularioProducto.style.display = 'block'
  }
})

// ==============================
// ESCANEAR PARA AGREGAR
// ==============================

btnEscanearParaAgregar.addEventListener('click', async () => {
  if (!comprobarModoDueno()) {
    return
  }

  await iniciarEscaner('agregar')
})

// ==============================
// INICIAR ESCÁNER
// ==============================

async function iniciarEscaner (modo) {
  if (!comprobarModoDueno()) {
    return
  }

  lector.style.display = 'block'

  resultado.textContent = '📷 Preparando la cámara...'

  try {
    const dispositivos = await codeReader.listVideoInputDevices()

    if (dispositivos.length === 0) {
      resultado.textContent = '❌ No se encontró ninguna cámara.'

      lector.style.display = 'none'

      return
    }

    let camara = dispositivos[0].deviceId

    if (dispositivos.length > 1) {
      camara = dispositivos[dispositivos.length - 1].deviceId
    }

    resultado.textContent = '📷 Apuntá al código de barras...'

    codeReader.decodeFromVideoDevice(camara, video, (result, error) => {
      if (result) {
        const codigo = result.text.trim()

        console.log('Código detectado:', codigo)

        codeReader.reset()

        lector.style.display = 'none'

        if (modo === 'agregar') {
          codigoProducto.value = codigo

          resultado.textContent = '✅ Código detectado correctamente.'

          return
        }

        buscarProducto(codigo)
      }
    })
  } catch (error) {
    console.error('Error de cámara:', error)

    lector.style.display = 'none'

    resultado.textContent =
      '❌ No se pudo acceder a la cámara. Revisá los permisos.'
  }
}

// ==============================
// BUSCAR PRODUCTO
// ==============================

function buscarProducto (codigo) {
  if (!comprobarModoDueno()) {
    return
  }

  const productosPendientes = obtenerProductosPendientes()

  const productoPendiente = productosPendientes.find(
    producto => producto.codigo === codigo
  )

  const producto = productoPendiente || productos[codigo]

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

// ==============================
// GUARDAR PRODUCTO
// ==============================

const btnGuardarProducto = document.getElementById('btnGuardarProducto')

btnGuardarProducto.addEventListener('click', () => {
  if (!comprobarModoDueno()) {
    return
  }

  const codigo = codigoProducto.value.trim()

  const nombre = document.getElementById('nombreProducto').value.trim()

  const precio = document.getElementById('precioProducto').value.trim()

  const imagen = document.getElementById('imagenProducto').value.trim()

  const categoria = document.getElementById('categoriaProducto').value

  if (!codigo || !nombre || !precio || !imagen || !categoria) {
    alert('⚠️ Completá todos los campos antes de guardar.')

    return
  }

  const rutaImagen = `imagenes/${imagen}`

  const nuevoProducto = {
    codigo: codigo,
    nombre: nombre,
    precio: precio,
    imagen: rutaImagen,
    categoria: categoria
  }

  guardarProductoPendiente(nuevoProducto)

  const codigoGenerado = `${codigo}: {
  nombre: ${JSON.stringify(nombre)},
  precio: ${JSON.stringify(precio)},
  imagen: ${JSON.stringify(rutaImagen)},
  categoria: ${JSON.stringify(categoria)}
},`

  const codigoHTML = `<div class="producto">
  <img
    src="${rutaImagen}"
    alt="${nombre}"
  />

  <h3>${nombre}</h3>

  <p>${precio}</p>
</div>`

  resultado.innerHTML = `
      <div class="producto-encontrado">

        <h3>✅ Producto preparado</h3>

        <p>
          El producto quedó guardado
          como pendiente.
        </p>

        <p>
          Ahora podés copiar los códigos
          y pegarlos en Visual Studio Code.
        </p>

        <h3>📄 Código para script.js</h3>

        <textarea
          id="codigoGenerado"
          readonly
        ></textarea>

        <button
          id="btnCopiarCodigo"
          class="boton-otro-escaneo"
        >
          📋 Copiar código JS
        </button>

        <h3>
          📄 Código para index.html
        </h3>

        <p>
          Pegalo dentro de la categoría:
          <strong>${categoria}</strong>
        </p>

        <textarea
          id="codigoHTMLGenerado"
          readonly
        ></textarea>

        <button
          id="btnCopiarHTML"
          class="boton-otro-escaneo"
        >
          📋 Copiar HTML
        </button>

      </div>
    `

  document.getElementById('codigoGenerado').value = codigoGenerado

  document.getElementById('codigoHTMLGenerado').value = codigoHTML

  document
    .getElementById('btnCopiarCodigo')
    .addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codigoGenerado)

        document.getElementById('btnCopiarCodigo').textContent =
          '✅ Código JS copiado'
      } catch (error) {
        alert('No se pudo copiar el código.')
      }
    })

  document
    .getElementById('btnCopiarHTML')
    .addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codigoHTML)

        document.getElementById('btnCopiarHTML').textContent =
          '✅ Código HTML copiado'
      } catch (error) {
        alert('No se pudo copiar el código.')
      }
    })

  codigoProducto.value = ''

  document.getElementById('nombreProducto').value = ''

  document.getElementById('precioProducto').value = ''

  document.getElementById('imagenProducto').value = ''

  document.getElementById('categoriaProducto').value = ''

  mostrarProductosPendientes()
})

// ==============================
// VER PRODUCTOS
// ==============================

btnVerProductos.addEventListener('click', () => {
  if (!comprobarModoDueno()) {
    return
  }

  mostrarProductosPendientes()
})

// ==============================
// MOSTRAR PRODUCTOS
// ==============================

function mostrarProductosPendientes () {
  if (!comprobarModoDueno()) {
    return
  }

  const productosPendientes = obtenerProductosPendientes()

  if (productosPendientes.length === 0) {
    listaProductosGuardados.innerHTML = `
      <div class="producto-encontrado">

        <h3>
          📦 No hay productos pendientes
        </h3>

        <p>
          Los productos que cargues
          aparecerán acá.
        </p>

      </div>
    `

    return
  }

  let html = `
    <div class="producto-encontrado">

      <h3>
        📦 Productos pendientes
      </h3>

      <p>
        Tenés
        <strong>
          ${productosPendientes.length}
        </strong>
        producto(s) pendientes.
      </p>
  `

  productosPendientes.forEach(producto => {
    html += `
        <div
          style="
            background: white;
            padding: 15px;
            margin-top: 10px;
            border-radius: 12px;
            text-align: left;
          "
        >

          <strong>
            ${producto.nombre}
          </strong>

          <br><br>

          Código:
          ${producto.codigo}

          <br>

          Precio:
          ${producto.precio}

          <br>

          Categoría:
          ${producto.categoria}

          <br>

          Imagen:
          ${producto.imagen}

          <br><br>

          <button
            class="boton-otro-escaneo"
            onclick="
              eliminarProductoPendiente(
                '${producto.codigo}'
              )
            "
          >
            🗑️ Eliminar
          </button>

        </div>
      `
  })

  html += `
    </div>
  `

  listaProductosGuardados.innerHTML = html
}

// ==============================
// EXPORTAR
// ==============================

btnExportarProductos.addEventListener('click', () => {
  if (!comprobarModoDueno()) {
    return
  }

  const productosPendientes = obtenerProductosPendientes()

  if (productosPendientes.length === 0) {
    alert('⚠️ No tenés productos pendientes para exportar.')

    return
  }

  const datos = JSON.stringify(productosPendientes, null, 2)

  const archivo = new Blob([datos], {
    type: 'application/json'
  })

  const url = URL.createObjectURL(archivo)

  const enlace = document.createElement('a')

  enlace.href = url

  enlace.download = 'productos-kiosco-lucila.json'

  enlace.click()

  URL.revokeObjectURL(url)
})

// ==============================
// ABRIR IMPORTADOR
// ==============================

btnImportarProductos.addEventListener('click', () => {
  if (!comprobarModoDueno()) {
    return
  }

  archivoProductos.click()
})

// ==============================
// IMPORTAR PRODUCTOS
// ==============================

archivoProductos.addEventListener('change', event => {
  if (!comprobarModoDueno()) {
    return
  }

  const archivo = event.target.files[0]

  if (!archivo) {
    return
  }

  const lectorArchivo = new FileReader()

  lectorArchivo.onload = event => {
    try {
      const productosImportados = JSON.parse(event.target.result)

      if (!Array.isArray(productosImportados)) {
        throw new Error('El archivo no contiene una lista válida.')
      }

      localStorage.setItem(
        'productosPendientes',
        JSON.stringify(productosImportados)
      )

      mostrarProductosPendientes()

      alert(
        `✅ Se importaron ${productosImportados.length} productos pendientes.`
      )
    } catch (error) {
      console.error(error)

      alert('❌ El archivo no es válido o está dañado.')
    }
  }

  lectorArchivo.readAsText(archivo)

  archivoProductos.value = ''
})

// ==============================
// ESTADO INICIAL
// ==============================

// El modo dueño comienza cerrado.

panelDueno.style.display = 'none'

modoDuenoActivo = false

btnModoDueno.textContent = '🔐 Modo dueño'

const buscadorProductos = document.getElementById('buscadorProductos')
const tarjetasProductos = document.querySelectorAll('.producto')

buscadorProductos.addEventListener('input', () => {
  const textoBuscado = buscadorProductos.value.toLowerCase().trim()

  tarjetasProductos.forEach(producto => {
    const nombreProducto = producto.textContent.toLowerCase()

    producto.style.display = nombreProducto.includes(textoBuscado)
      ? 'block'
      : 'none'
  })
})
