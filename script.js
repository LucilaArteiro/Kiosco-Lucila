// ======================================================
// FIREBASE
// ======================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js'

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js'

// ======================================================
// CONFIGURACIÓN DE TU PROYECTO FIREBASE
// ======================================================

const firebaseConfig = {
  apiKey: 'AIzaSyBKFXiic9HlwRv_5tQpx8sZ4plg3IfRiqQ',
  authDomain: 'kiosco-lucila.firebaseapp.com',
  projectId: 'kiosco-lucila',
  storageBucket: 'kiosco-lucila.firebasestorage.app',
  messagingSenderId: '1067429487710',
  appId: '1:1067429487710:web:1b2eabc0d9670532ca40cf',
  measurementId: 'G-32YNFES0DP'
}

// ======================================================
// INICIALIZAR FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

console.log('🔥 Firebase conectado correctamente')

// ======================================================
// CONFIGURACIÓN DEL MODO DUEÑO
// ======================================================

const CONTRASENA_DUENO = '44775546'

let modoDuenoActivo = false

// ======================================================
// FUNCIÓN PARA BUSCAR ELEMENTOS HTML
// ======================================================

const $ = id => document.getElementById(id)

// ======================================================
// ELEMENTOS HTML
// ======================================================

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
const nombreProducto = $('nombreProducto')
const precioProducto = $('precioProducto')
const imagenProducto = $('imagenProducto')
const categoriaProducto = $('categoriaProducto')

// ======================================================
// ESCÁNER ZXING
// ======================================================

const codeReader = new ZXing.BrowserMultiFormatReader()

// ======================================================
// PRODUCTOS LOCALES DE RESPALDO
// ======================================================

const productos = {
  7791234567890: {
    nombre: 'Ravioles La Morocha',
    precio: '$500',
    imagen: 'imagenes/Ravioles-La-Morocha.webp',
    categoria: 'comidas'
  },

  7790070933652: {
    nombre: 'Café Arlistán',
    precio: '$2500',
    imagen: 'imagenes/cafe-arlistan.webp',
    categoria: 'bebidas'
  },

  8445291121867: {
    nombre: 'Nesquik',
    precio: '$500',
    imagen: 'imagenes/nesquik.webp',
    categoria: 'bebidas'
  },

  7790150006306: {
    nombre: 'Café La Virginia',
    precio: '$2500',
    imagen: 'imagenes/cafe-la-virginia.webp',
    categoria: 'bebidas'
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

// ======================================================
// LOCALSTORAGE - RESPALDO
// ======================================================

function obtenerProductosPendientes () {
  return JSON.parse(localStorage.getItem('productosPendientes')) || []
}

function guardarProductosPendientes (lista) {
  localStorage.setItem('productosPendientes', JSON.stringify(lista))
}

// ======================================================
// COMPROBAR MODO DUEÑO
// ======================================================

function comprobarModoDueno () {
  if (!modoDuenoActivo) {
    alert('🔒 Esta función es exclusiva del modo dueño.')

    return false
  }

  return true
}

// ======================================================
// ACTIVAR MODO DUEÑO
// ======================================================

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

// ======================================================
// CERRAR MODO DUEÑO
// ======================================================

btnCerrarModoDueno.addEventListener('click', () => {
  modoDuenoActivo = false

  panelDueno.style.display = 'none'

  btnModoDueno.textContent = '🔐 Modo dueño'

  formularioProducto.style.display = 'none'

  listaProductosGuardados.innerHTML = ''
})

// ======================================================
// MENÚ
// ======================================================

document.querySelector('.boton-menu').addEventListener('click', () => {
  const menu = document.querySelector('.lista-menu')

  menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
})

// ======================================================
// BOTÓN ESCANEAR
// ======================================================

btnEscanear.addEventListener('click', () => {
  iniciarEscaner('catalogo')
})

// ======================================================
// BOTÓN AGREGAR PRODUCTO
// ======================================================

btnAgregarProducto.addEventListener('click', () => {
  if (!comprobarModoDueno()) return

  formularioProducto.style.display =
    formularioProducto.style.display === 'block' ? 'none' : 'block'
})

// ======================================================
// ESCANEAR CÓDIGO PARA AGREGAR PRODUCTO
// ======================================================

btnEscanearParaAgregar.addEventListener('click', () => {
  if (!comprobarModoDueno()) return

  iniciarEscaner('agregar')
})

// ======================================================
// INICIAR ESCÁNER
// ======================================================

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

      // AGREGAR PRODUCTO

      if (modo === 'agregar') {
        codigoProducto.value = codigo

        resultado.textContent = '✅ Código detectado correctamente.'

        return
      }

      // CONSULTAR PRODUCTO

      buscarProducto(codigo)
    })
  } catch (error) {
    console.error('Error de cámara:', error)

    lector.style.display = 'none'

    resultado.textContent =
      '❌ No se pudo acceder a la cámara. Revisá los permisos.'
  }
}

// ======================================================
// BUSCAR PRODUCTO
// ======================================================

async function buscarProducto (codigo) {
  resultado.innerHTML = '🔎 Buscando producto...'

  try {
    const referencia = doc(db, 'productos', codigo)

    const documento = await getDoc(referencia)

    if (documento.exists()) {
      const producto = documento.data()

      console.log('🔥 Producto encontrado en Firebase:', producto)

      mostrarProducto(producto, codigo)

      return
    }

    // BUSCAR PRODUCTO LOCAL

    const productoLocal = productos[codigo]

    if (productoLocal) {
      mostrarProducto(productoLocal, codigo)

      return
    }

    mostrarProductoNoEncontrado(codigo)
  } catch (error) {
    console.error('Error buscando en Firebase:', error)

    // RESPALDO LOCAL

    const productoLocal = productos[codigo]

    if (productoLocal) {
      mostrarProducto(productoLocal, codigo)
    } else {
      mostrarProductoNoEncontrado(codigo)
    }
  }
}

// ======================================================
// MOSTRAR PRODUCTO ENCONTRADO
// ======================================================

function mostrarProducto (producto, codigo) {
  // IMAGEN OPCIONAL
  const imagenHTML = producto.imagen
    ? `
        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
        >
      `
    : ''

  resultado.innerHTML = `

    <div class="producto-encontrado">

      ${imagenHTML}

      <h3>
        🛒 ${producto.nombre}
      </h3>

      <span class="precio">
        ${producto.precio}
      </span>

      <p>
        Código:
        <strong>
          ${codigo}
        </strong>
      </p>

      <button
        class="boton-otro-escaneo"
        id="btnOtroEscaneo"
      >
        📷 Escanear otro producto
      </button>

    </div>

  `

  const btnOtroEscaneo = document.getElementById('btnOtroEscaneo')

  btnOtroEscaneo.addEventListener('click', () => {
    resultado.innerHTML = ''

    iniciarEscaner('catalogo')
  })
}

// ======================================================
// PRODUCTO NO ENCONTRADO
// ======================================================

function mostrarProductoNoEncontrado (codigo) {
  resultado.innerHTML = `

    <div class="producto-encontrado">

      <h3>
        ❌ Producto no encontrado
      </h3>

      <p>
        No tenemos registrado el código:
        <strong>
          ${codigo}
        </strong>
      </p>

      <button
        class="boton-otro-escaneo"
        id="btnOtroEscaneo"
      >
        📷 Escanear otro producto
      </button>

    </div>

  `

  document.getElementById('btnOtroEscaneo').addEventListener('click', () => {
    resultado.innerHTML = ''

    iniciarEscaner('catalogo')
  })
}

// ======================================================
// GUARDAR PRODUCTO EN FIREBASE
// ======================================================

btnGuardarProducto.addEventListener('click', async () => {
  if (!comprobarModoDueno()) return

  const codigo = codigoProducto.value.trim()

  const nombre = nombreProducto.value.trim()

  const precio = precioProducto.value.trim()

  const imagen = imagenProducto.value.trim()

  const categoria = categoriaProducto.value

  // ==================================================
  // COMPROBAR CAMPOS
  // ==================================================
  //
  // LA IMAGEN YA NO ES OBLIGATORIA
  // ==================================================

  if (!codigo || !nombre || !precio || !categoria) {
    alert('⚠️ Completá código, nombre, precio y categoría.')

    return
  }

  // ==================================================
  // CREAR RUTA DE IMAGEN
  // ==================================================
  //
  // Si no hay imagen:
  // rutaImagen = ''
  //
  // Si hay imagen:
  // se agrega "imagenes/"
  // automáticamente.
  // ==================================================

  const rutaImagen = imagen
    ? imagen.startsWith('imagenes/')
      ? imagen
      : `imagenes/${imagen}`
    : ''

  // ==================================================
  // CREAR PRODUCTO
  // ==================================================

  const producto = {
    nombre: nombre,

    precio: precio,

    imagen: rutaImagen,

    categoria: categoria
  }

  try {
    resultado.innerHTML = '💾 Guardando producto en Firebase...'

    // ==================================================
    // GUARDAR EN FIRESTORE
    // ==================================================

    await setDoc(doc(db, 'productos', codigo), producto)

    console.log('🔥 Producto guardado:', codigo, producto)

    // ==================================================
    // GUARDAR COPIA LOCAL
    // ==================================================

    const lista = obtenerProductosPendientes().filter(
      productoGuardado => productoGuardado.codigo !== codigo
    )

    lista.push({
      codigo: codigo,

      ...producto
    })

    guardarProductosPendientes(lista)

    // ==================================================
    // MOSTRAR CONFIRMACIÓN
    // ==================================================

    resultado.innerHTML = `

        <div class="producto-encontrado">

          <h3>
            ✅ Producto guardado
          </h3>

          <p>
            <strong>
              ${nombre}
            </strong>
          </p>

          <p>
            💰 ${precio}
          </p>

          <p>
            📦 Categoría:
            ${categoria}
          </p>

          <p>
            🔢 Código:
            ${codigo}
          </p>

          ${
            imagen
              ? `
                <p>
                  🖼️ Imagen:
                  ${imagen}
                </p>
              `
              : `
                <p>
                  🖼️ Sin imagen por ahora
                </p>
              `
          }

          <p>
            🔥 Guardado correctamente en Firebase.
          </p>

        </div>

      `

    // ==================================================
    // LIMPIAR FORMULARIO
    // ==================================================

    codigoProducto.value = ''

    nombreProducto.value = ''

    precioProducto.value = ''

    imagenProducto.value = ''

    categoriaProducto.value = ''

    // ==================================================
    // ACTUALIZAR LISTA
    // ==================================================

    await mostrarProductosFirebase()
  } catch (error) {
    console.error('Error guardando producto:', error)

    resultado.innerHTML = `

        <div class="producto-encontrado">

          <h3>
            ❌ Error al guardar
          </h3>

          <p>
            No se pudo guardar el producto
            en Firebase.
          </p>

          <p>
            Revisá la consola del navegador.
          </p>

        </div>

      `
  }
})

// ======================================================
// VER PRODUCTOS GUARDADOS
// ======================================================

btnVerProductos.addEventListener('click', async () => {
  if (!comprobarModoDueno()) return

  await mostrarProductosFirebase()
})

// ======================================================
// OBTENER PRODUCTOS DE FIREBASE
// ======================================================

async function mostrarProductosFirebase () {
  listaProductosGuardados.innerHTML = `

    <div class="producto-encontrado">

      <h3>
        🔎 Cargando productos...
      </h3>

    </div>

  `

  try {
    const productosRef = collection(db, 'productos')

    const snapshot = await getDocs(productosRef)

    if (snapshot.empty) {
      listaProductosGuardados.innerHTML = `

        <div class="producto-encontrado">

          <h3>
            📦 No hay productos guardados
          </h3>

        </div>

      `

      return
    }

    const lista = snapshot.docs.map(documento => ({
      codigo: documento.id,

      ...documento.data()
    }))

    console.log('🔥 Productos de Firebase:', lista)

    listaProductosGuardados.innerHTML = `

      <div class="producto-encontrado">

        <h3>
          📦 Productos guardados
        </h3>

        <p>
          Total:
          <strong>
            ${lista.length}
          </strong>
        </p>

        ${lista
          .map(producto => {
            // IMAGEN OPCIONAL

            const imagenHTML = producto.imagen
              ? `
                    <img
                      src="${producto.imagen}"
                      alt="${producto.nombre}"
                      style="
                        width: 80px;
                        height: 80px;
                        object-fit: contain;
                        display: block;
                        margin-bottom: 10px;
                      "
                    >
                  `
              : `
                    <div
                      style="
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f2f2f2;
                        margin-bottom: 10px;
                        border-radius: 8px;
                      "
                    >
                      🖼️
                    </div>
                  `

            return `

                <div class="producto-pendiente">

                  ${imagenHTML}

                  <strong>
                    ${producto.nombre}
                  </strong>

                  <br>

                  Código:
                  ${producto.codigo}

                  <br>

                  Precio:
                  ${producto.precio}

                  <br>

                  Categoría:
                  ${producto.categoria}

                  <br>

                  ${
                    producto.imagen
                      ? `
                        Imagen:
                        ${producto.imagen}
                      `
                      : `
                        Imagen:
                        Sin imagen
                      `
                  }

                  <br><br>

                  <button
                    class="boton-otro-escaneo"
                    data-codigo="${producto.codigo}"
                  >
                    🗑️ Eliminar
                  </button>

                </div>

              `
          })
          .join('')}

      </div>

    `

    // ==================================================
    // BOTONES ELIMINAR
    // ==================================================

    document
      .querySelectorAll('#listaProductosGuardados .boton-otro-escaneo')
      .forEach(boton => {
        boton.addEventListener('click', () => {
          eliminarProductoFirebase(boton.dataset.codigo)
        })
      })
  } catch (error) {
    console.error('Error obteniendo productos:', error)

    listaProductosGuardados.innerHTML = `

      <div class="producto-encontrado">

        <h3>
          ❌ Error al cargar productos
        </h3>

        <p>
          No se pudo conectar con Firebase.
        </p>

        <p>
          Revisá la consola del navegador.
        </p>

      </div>

    `
  }
}

// ======================================================
// ELIMINAR PRODUCTO DE FIREBASE
// ======================================================

async function eliminarProductoFirebase (codigo) {
  if (!comprobarModoDueno()) return

  const confirmar = confirm(`¿Querés eliminar el producto ${codigo}?`)

  if (!confirmar) return

  try {
    await deleteDoc(doc(db, 'productos', codigo))

    // ==================================================
    // ELIMINAR TAMBIÉN DE LA COPIA LOCAL
    // ==================================================

    const lista = obtenerProductosPendientes().filter(
      producto => producto.codigo !== codigo
    )

    guardarProductosPendientes(lista)

    alert('✅ Producto eliminado correctamente.')

    await mostrarProductosFirebase()
  } catch (error) {
    console.error('Error eliminando producto:', error)

    alert('❌ No se pudo eliminar el producto.')
  }
}

// ======================================================
// BUSCADOR DE PRODUCTOS DEL HTML
// ======================================================

const buscadorProductos = $('buscadorProductos')

buscadorProductos.addEventListener('input', () => {
  const texto = buscadorProductos.value.toLowerCase().trim()

  document.querySelectorAll('.producto').forEach(producto => {
    producto.style.display = producto.textContent.toLowerCase().includes(texto)
      ? 'block'
      : 'none'
  })
})

// ======================================================
// PRUEBA DE CONEXIÓN
// ======================================================

async function probarConexionFirebase () {
  try {
    const productosRef = collection(db, 'productos')

    const snapshot = await getDocs(productosRef)

    console.log('🔥 Conexión con Firebase correcta.')

    console.log('📦 Productos encontrados en Firestore:', snapshot.size)
  } catch (error) {
    console.error('❌ Error conectando con Firebase:', error)
  }
}

// ======================================================
// INICIAR
// ======================================================

probarConexionFirebase()
