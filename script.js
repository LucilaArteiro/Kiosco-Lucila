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
// CONFIGURACIÓN DE FIREBASE
// ======================================================

const firebaseConfig = {
  apiKey: 'AIzaSyBKFXiicH9lwRv_5tQpx8sZ4plg3IfRiqQ',
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

// ======================================================
// RECORDAR MODO DUEÑO
// ======================================================

let modoDuenoActivo = localStorage.getItem('modoDuenoActivo') === 'true'

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

// CORREGIDO:
// En el HTML el botón se llama btnConsultarCodigo
const btnConsultarManual = $('btnConsultarCodigo')

const codigoConsulta = $('codigoConsulta')

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
// ACTUALIZAR VISUAL DEL MODO DUEÑO
// ======================================================

function actualizarModoDuenoVisual () {
  if (modoDuenoActivo) {
    panelDueno.style.display = 'flex'

    btnModoDueno.textContent = '🔓 Modo dueño activo'
  } else {
    panelDueno.style.display = 'none'

    btnModoDueno.textContent = '🔐 Modo dueño'
  }
}

// ======================================================
// RESTAURAR MODO DUEÑO AL CARGAR
// ======================================================

actualizarModoDuenoVisual()

// ======================================================
// ESCÁNER ZXING
// ======================================================

const codeReader = new ZXing.BrowserMultiFormatReader()

let escanerActivo = false

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
// NORMALIZAR PRECIO
// ======================================================

function normalizarPrecio (precio) {
  precio = String(precio || '').trim()

  // Elimina todos los signos $
  precio = precio.replace(/\$/g, '')

  // Elimina espacios
  precio = precio.trim()

  // Si está vacío
  if (!precio) {
    return ''
  }

  // Devuelve siempre el precio con $
  return `$${precio}`
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

  localStorage.setItem('modoDuenoActivo', 'true')

  actualizarModoDuenoVisual()

  console.log('🔓 Modo dueño activado y guardado.')
})

// ======================================================
// CERRAR MODO DUEÑO
// ======================================================

btnCerrarModoDueno.addEventListener('click', () => {
  modoDuenoActivo = false

  localStorage.removeItem('modoDuenoActivo')

  detenerEscaner()

  actualizarModoDuenoVisual()

  formularioProducto.style.display = 'none'

  listaProductosGuardados.innerHTML = ''

  console.log('🔒 Modo dueño cerrado manualmente.')
})

// ======================================================
// MENÚ
// ======================================================

document.querySelector('.boton-menu').addEventListener('click', () => {
  const menu = document.querySelector('.lista-menu')

  menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
})

// ======================================================
// CONSULTA MANUAL DEL CLIENTE
// ======================================================

if (btnConsultarManual) {
  btnConsultarManual.addEventListener('click', () => {
    const codigo = codigoConsulta.value.trim()

    if (!codigo) {
      alert('⚠️ Ingresá un código de barras.')

      codigoConsulta.focus()

      return
    }

    detenerEscaner()

    buscarProducto(codigo)
  })
}

// ======================================================
// ENTER EN CONSULTA MANUAL
// ======================================================

if (codigoConsulta) {
  codigoConsulta.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (btnConsultarManual) {
        btnConsultarManual.click()
      }
    }
  })
}

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
// DETENER ESCÁNER
// ======================================================

function detenerEscaner () {
  try {
    codeReader.reset()
  } catch (error) {
    console.warn('⚠️ No se pudo reiniciar ZXing:', error)
  }

  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => {
      track.stop()
    })

    video.srcObject = null
  }

  escanerActivo = false

  if (lector) {
    lector.style.display = 'none'
  }
}

// ======================================================
// INICIAR ESCÁNER
// ======================================================

async function iniciarEscaner (modo) {
  if (escanerActivo) {
    detenerEscaner()
  }

  lector.style.display = 'block'

  resultado.textContent = '📷 Preparando el escáner...'

  try {
    escanerActivo = true

    const constraints = {
      video: {
        facingMode: {
          ideal: 'environment'
        },

        width: {
          ideal: 1280
        },

        height: {
          ideal: 720
        }
      },

      audio: false
    }

    codeReader.decodeFromConstraints(constraints, video, (result, error) => {
      if (!escanerActivo) {
        return
      }

      if (result) {
        const codigo = result.text.trim()

        if (!codigo) {
          return
        }

        console.log('📷 CÓDIGO DETECTADO:', codigo)

        escanerActivo = false

        try {
          codeReader.reset()
        } catch (resetError) {
          console.warn('⚠️ Error reiniciando ZXing:', resetError)
        }

        if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => {
            track.stop()
          })

          video.srcObject = null
        }

        lector.style.display = 'none'

        // ==========================================
        // MODO AGREGAR
        // ==========================================

        if (modo === 'agregar') {
          codigoProducto.value = codigo

          resultado.textContent = '✅ Código detectado correctamente.'

          return
        }

        // ==========================================
        // MODO CONSULTA
        // ==========================================

        buscarProducto(codigo)
      }
    })

    resultado.textContent = '🔍 Apuntá al código de barras...'
  } catch (error) {
    console.error('❌ Error iniciando escáner:', error)

    detenerEscaner()

    resultado.innerHTML = `

      <div class="producto-encontrado">

        <h3>
          ❌ No se pudo iniciar
        </h3>

        <p>
          Revisá los permisos de la cámara.
        </p>

      </div>

    `
  }
}

// ======================================================
// BUSCAR PRODUCTO
// ======================================================

async function buscarProducto (codigo) {
  codigo = String(codigo).trim()

  if (!codigo) {
    return
  }

  resultado.innerHTML = `

    <div class="producto-encontrado">

      🔎 Buscando...

    </div>

  `

  try {
    // ================================================
    // FIREBASE
    // ================================================

    const referencia = doc(db, 'productos', codigo)

    const documento = await getDoc(referencia)

    if (documento.exists()) {
      const producto = documento.data()

      console.log('🔥 Producto encontrado:', producto)

      mostrarProducto(producto, codigo)

      return
    }

    // ================================================
    // RESPALDO LOCAL
    // ================================================

    const productoLocal = productos[codigo]

    if (productoLocal) {
      mostrarProducto(productoLocal, codigo)

      return
    }

    mostrarProductoNoEncontrado(codigo)
  } catch (error) {
    console.error('❌ Error buscando en Firebase:', error)

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
  const imagenHTML = producto.imagen
    ? `

        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
          onerror="this.style.display='none'"
        >

      `
    : ''

  const precio = normalizarPrecio(producto.precio)

  resultado.innerHTML = `

    <div class="producto-encontrado">

      ${imagenHTML}

      <h3>
        🛒 ${producto.nombre}
      </h3>

      <span class="precio">
        ${precio}
      </span>

      <p>
        Código:
        <strong>${codigo}</strong>
      </p>

      <div class="acciones-consulta">

        <button
          class="boton-otro-escaneo"
          id="btnNuevaConsulta"
        >
          🔎 Nueva consulta
        </button>

      </div>

    </div>

  `

  const btnNuevaConsulta = document.getElementById('btnNuevaConsulta')

  if (btnNuevaConsulta) {
    btnNuevaConsulta.addEventListener('click', () => {
      resultado.innerHTML = ''

      if (codigoConsulta) {
        codigoConsulta.value = ''

        codigoConsulta.focus()
      }
    })
  }
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
        No tenemos registrado:
        <strong>${codigo}</strong>
      </p>

      <button
        class="boton-otro-escaneo"
        id="btnNuevaConsulta"
      >
        🔎 Nueva consulta
      </button>

    </div>

  `

  const btnNuevaConsulta = document.getElementById('btnNuevaConsulta')

  if (btnNuevaConsulta) {
    btnNuevaConsulta.addEventListener('click', () => {
      resultado.innerHTML = ''

      if (codigoConsulta) {
        codigoConsulta.value = ''

        codigoConsulta.focus()
      }
    })
  }
}

// ======================================================
// GUARDAR PRODUCTO EN FIREBASE
// ======================================================

btnGuardarProducto.addEventListener('click', async () => {
  if (!comprobarModoDueno()) {
    return
  }

  const codigo = codigoProducto.value.trim()

  const nombre = nombreProducto.value.trim()

  // ================================================
  // PRECIO
  // ================================================

  const precio = normalizarPrecio(precioProducto.value)

  const imagen = imagenProducto.value.trim()

  const categoria = categoriaProducto.value

  if (!codigo || !nombre || !precio || !categoria) {
    alert('⚠️ Completá código, nombre, precio y categoría.')

    return
  }

  // ================================================
  // RUTA DE IMAGEN
  // ================================================

  let rutaImagen = ''

  if (imagen) {
    if (imagen.startsWith('imagenes/')) {
      rutaImagen = imagen
    } else {
      rutaImagen = `imagenes/${imagen}`
    }
  }

  // ================================================
  // PRODUCTO
  // ================================================

  const producto = {
    nombre: nombre,

    precio: precio,

    imagen: rutaImagen,

    categoria: categoria
  }

  console.log('📦 Producto que se va a guardar:', producto)

  try {
    resultado.innerHTML = '💾 Guardando producto...'

    await setDoc(doc(db, 'productos', codigo), producto)

    console.log('🔥 Producto guardado:', codigo)

    // ==============================================
    // RESPALDO LOCAL
    // ==============================================

    const lista = obtenerProductosPendientes().filter(
      productoGuardado => productoGuardado.codigo !== codigo
    )

    lista.push({
      codigo: codigo,

      ...producto
    })

    guardarProductosPendientes(lista)

    // ==============================================
    // CONFIRMACIÓN
    // ==============================================

    resultado.innerHTML = `

        <div class="producto-encontrado">

          <h3>
            ✅ Producto guardado
          </h3>

          <strong>
            ${nombre}
          </strong>

          <p>
            💰 ${precio}
          </p>

          <p>
            📦 ${categoria}
          </p>

          <p>
            🔢 ${codigo}
          </p>

          <p>
            🔥 Firebase actualizado
          </p>

        </div>

      `

    // ==============================================
    // LIMPIAR FORMULARIO
    // ==============================================

    codigoProducto.value = ''

    nombreProducto.value = ''

    precioProducto.value = ''

    imagenProducto.value = ''

    categoriaProducto.value = ''

    await mostrarProductosFirebase()
  } catch (error) {
    console.error('❌ Error guardando producto:', error)

    resultado.innerHTML = `

        <div class="producto-encontrado">

          <h3>
            ❌ Error al guardar
          </h3>

          <p>
            No se pudo guardar el producto.
          </p>

        </div>

      `
  }
})

// ======================================================
// VER PRODUCTOS GUARDADOS
// ======================================================

btnVerProductos.addEventListener('click', async () => {
  if (!comprobarModoDueno()) {
    return
  }

  await mostrarProductosFirebase()
})

// ======================================================
// OBTENER PRODUCTOS DE FIREBASE
// ======================================================

async function mostrarProductosFirebase () {
  listaProductosGuardados.innerHTML = `

    <div class="producto-encontrado">

      🔎 Cargando productos...

    </div>

  `

  try {
    const productosRef = collection(db, 'productos')

    const snapshot = await getDocs(productosRef)

    if (snapshot.empty) {
      listaProductosGuardados.innerHTML = `

        <div class="producto-encontrado">

          <h3>
            📦 No hay productos
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
            const imagenHTML = producto.imagen
              ? `

                  <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    style="
                      width:80px;
                      height:80px;
                      object-fit:contain;
                      display:block;
                      margin:0 auto 8px;
                    "
                  >

                `
              : `

                  <div
                    style="
                      width:80px;
                      height:80px;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      background:#f2f2f2;
                      margin:0 auto 8px;
                      border-radius:8px;
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
                ${normalizarPrecio(producto.precio)}

                <br>

                Categoría:
                ${producto.categoria}

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

    document
      .querySelectorAll('#listaProductosGuardados .boton-otro-escaneo')
      .forEach(boton => {
        boton.addEventListener('click', () => {
          eliminarProductoFirebase(boton.dataset.codigo)
        })
      })
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error)

    listaProductosGuardados.innerHTML = `

      <div class="producto-encontrado">

        <h3>
          ❌ Error al cargar
        </h3>

        <p>
          No se pudo conectar con Firebase.
        </p>

      </div>

    `
  }
}

// ======================================================
// ELIMINAR PRODUCTO DE FIREBASE
// ======================================================

async function eliminarProductoFirebase (codigo) {
  if (!comprobarModoDueno()) {
    return
  }

  const confirmar = confirm(`¿Querés eliminar el producto ${codigo}?`)

  if (!confirmar) {
    return
  }

  try {
    await deleteDoc(doc(db, 'productos', codigo))

    const lista = obtenerProductosPendientes().filter(
      producto => producto.codigo !== codigo
    )

    guardarProductosPendientes(lista)

    alert('✅ Producto eliminado correctamente.')

    await mostrarProductosFirebase()
  } catch (error) {
    console.error('❌ Error eliminando producto:', error)

    alert('❌ No se pudo eliminar el producto.')
  }
}

// ======================================================
// BUSCADOR DE PRODUCTOS
// ======================================================

const buscadorProductos = $('buscadorProductos')

if (buscadorProductos) {
  buscadorProductos.addEventListener('input', () => {
    const texto = buscadorProductos.value.toLowerCase().trim()

    document.querySelectorAll('.producto').forEach(producto => {
      producto.style.display = producto.textContent
        .toLowerCase()
        .includes(texto)
        ? 'block'
        : 'none'
    })
  })
}

// ======================================================
// PRUEBA DE CONEXIÓN FIREBASE
// ======================================================

async function probarConexionFirebase () {
  try {
    const productosRef = collection(db, 'productos')

    const snapshot = await getDocs(productosRef)

    console.log('🔥 Conexión con Firebase correcta.')

    console.log('📦 Productos encontrados:', snapshot.size)
  } catch (error) {
    console.error('❌ Error conectando con Firebase:', error)
  }
}

// ======================================================
// INICIAR
// ======================================================

probarConexionFirebase()
