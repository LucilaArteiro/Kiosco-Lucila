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
  if (!panelDueno || !btnModoDueno) {
    return
  }

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

let codeReader = null
let escanerActivo = false

if (typeof ZXing !== 'undefined') {
  try {
    codeReader = new ZXing.BrowserMultiFormatReader()

    console.log('📷 ZXing cargado correctamente')
  } catch (error) {
    console.error('❌ Error inicializando ZXing:', error)
  }
} else {
  console.error(
    '❌ ZXing no está cargado. Verificá que la librería ZXing esté incluida en el HTML.'
  )
}

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
  try {
    return JSON.parse(localStorage.getItem('productosPendientes')) || []
  } catch (error) {
    console.warn('⚠️ No se pudieron leer los productos pendientes:', error)

    return []
  }
}

function guardarProductosPendientes (lista) {
  try {
    localStorage.setItem('productosPendientes', JSON.stringify(lista))
  } catch (error) {
    console.error('❌ No se pudieron guardar los productos pendientes:', error)
  }
}

// ======================================================
// NORMALIZAR PRECIO
// ======================================================

function normalizarPrecio (precio) {
  precio = String(precio || '').trim()

  precio = precio.replace(/\$/g, '')

  precio = precio.trim()

  if (!precio) {
    return ''
  }

  return `$${precio}`
}

// ======================================================
// ESCAPAR HTML
// ======================================================

function escaparHTML (texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
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

if (btnModoDueno) {
  btnModoDueno.addEventListener('click', () => {
    if (modoDuenoActivo) {
      return
    }

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
}

// ======================================================
// CERRAR MODO DUEÑO
// ======================================================

if (btnCerrarModoDueno) {
  btnCerrarModoDueno.addEventListener('click', () => {
    modoDuenoActivo = false

    localStorage.removeItem('modoDuenoActivo')

    detenerEscaner()

    actualizarModoDuenoVisual()

    if (formularioProducto) {
      formularioProducto.style.display = 'none'
    }

    if (listaProductosGuardados) {
      listaProductosGuardados.innerHTML = ''
    }

    console.log('🔒 Modo dueño cerrado manualmente.')
  })
}

// ======================================================
// MENÚ
// ======================================================

const botonMenu = document.querySelector('.boton-menu')

const listaMenu = document.querySelector('.lista-menu')

if (botonMenu && listaMenu) {
  botonMenu.addEventListener('click', event => {
    event.stopPropagation()

    listaMenu.style.display =
      listaMenu.style.display === 'block' ? 'none' : 'block'
  })

  document.addEventListener('click', event => {
    if (
      !listaMenu.contains(event.target) &&
      !botonMenu.contains(event.target)
    ) {
      listaMenu.style.display = 'none'
    }
  })
}

// ======================================================
// CONSULTA MANUAL DEL CLIENTE
// ======================================================

if (btnConsultarManual && codigoConsulta) {
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

if (btnEscanear) {
  btnEscanear.addEventListener('click', () => {
    iniciarEscaner('catalogo')
  })
}

// ======================================================
// BOTÓN AGREGAR PRODUCTO
// ======================================================

if (btnAgregarProducto) {
  btnAgregarProducto.addEventListener('click', () => {
    if (!comprobarModoDueno()) {
      return
    }

    if (!formularioProducto) {
      return
    }

    formularioProducto.style.display =
      formularioProducto.style.display === 'block' ? 'none' : 'block'
  })
}

// ======================================================
// ESCANEAR CÓDIGO PARA AGREGAR PRODUCTO
// ======================================================

if (btnEscanearParaAgregar) {
  btnEscanearParaAgregar.addEventListener('click', () => {
    if (!comprobarModoDueno()) {
      return
    }

    iniciarEscaner('agregar')
  })
}

// ======================================================
// DETENER ESCÁNER
// ======================================================

function detenerEscaner () {
  escanerActivo = false

  if (codeReader) {
    try {
      codeReader.reset()
    } catch (error) {
      console.warn('⚠️ No se pudo reiniciar ZXing:', error)
    }
  }

  if (video && video.srcObject) {
    try {
      video.srcObject.getTracks().forEach(track => {
        track.stop()
      })
    } catch (error) {
      console.warn('⚠️ No se pudieron detener las pistas de video:', error)
    }

    video.srcObject = null
  }

  if (lector) {
    lector.style.display = 'none'
  }
}

// ======================================================
// INICIAR ESCÁNER
// ======================================================

async function iniciarEscaner (modo) {
  if (!lector || !video) {
    console.error('❌ No se encontraron los elementos del escáner.')

    return
  }

  if (!codeReader) {
    resultadoSeguro(
      '❌ El escáner no está disponible. Verificá que ZXing esté cargado.'
    )

    return
  }

  if (escanerActivo) {
    detenerEscaner()
  }

  lector.style.display = 'block'

  if (resultado) {
    resultado.textContent = '📷 Preparando el escáner...'
  }

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
          try {
            video.srcObject.getTracks().forEach(track => {
              track.stop()
            })
          } catch (trackError) {
            console.warn('⚠️ Error deteniendo cámara:', trackError)
          }

          video.srcObject = null
        }

        lector.style.display = 'none'

        // ==========================================
        // MODO AGREGAR
        // ==========================================

        if (modo === 'agregar') {
          if (codigoProducto) {
            codigoProducto.value = codigo
          }

          if (resultado) {
            resultado.textContent = '✅ Código detectado correctamente.'
          }

          return
        }

        // ==========================================
        // MODO CONSULTA
        // ==========================================

        buscarProducto(codigo)
      }
    })

    if (resultado) {
      resultado.textContent = '🔍 Apuntá al código de barras...'
    }
  } catch (error) {
    console.error('❌ Error iniciando escáner:', error)

    detenerEscaner()

    if (resultado) {
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
}

// ======================================================
// MOSTRAR MENSAJE SEGURO EN RESULTADO
// ======================================================

function resultadoSeguro (mensaje) {
  if (resultado) {
    resultado.innerHTML = `
      <div class="producto-encontrado">
        <p>${escaparHTML(mensaje)}</p>
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

  if (resultado) {
    resultado.innerHTML = `
      <div class="producto-encontrado">
        🔎 Buscando...
      </div>
    `
  }

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
  if (!resultado) {
    return
  }

  const nombre = escaparHTML(producto?.nombre || 'Producto')

  const imagen = String(producto?.imagen || '').trim()

  const imagenHTML = imagen
    ? `
      <img
        src="${escaparHTML(imagen)}"
        alt="${nombre}"
        onerror="this.style.display='none'"
      >
    `
    : ''

  const precio = normalizarPrecio(producto?.precio)

  resultado.innerHTML = `
    <div class="producto-encontrado">

      ${imagenHTML}

      <h3>
        🛒 ${nombre}
      </h3>

      <span class="precio">
        ${escaparHTML(precio)}
      </span>

      <p>
        Código:
        <strong>${escaparHTML(codigo)}</strong>
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
  if (!resultado) {
    return
  }

  resultado.innerHTML = `
    <div class="producto-encontrado">

      <h3>
        ❌ Producto no encontrado
      </h3>

      <p>
        No tenemos registrado:
        <strong>${escaparHTML(codigo)}</strong>
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

if (btnGuardarProducto) {
  btnGuardarProducto.addEventListener('click', async () => {
    if (!comprobarModoDueno()) {
      return
    }

    const codigo = codigoProducto?.value.trim() || ''

    const nombre = nombreProducto?.value.trim() || ''

    const precio = normalizarPrecio(precioProducto?.value)

    const imagen = imagenProducto?.value.trim() || ''

    const categoria = categoriaProducto?.value || ''

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
      nombre,
      precio,
      imagen: rutaImagen,
      categoria
    }

    console.log('📦 Producto que se va a guardar:', producto)

    try {
      if (resultado) {
        resultado.innerHTML = '💾 Guardando producto...'
      }

      await setDoc(doc(db, 'productos', codigo), producto)

      console.log('🔥 Producto guardado:', codigo)

      // ==============================================
      // RESPALDO LOCAL
      // ==============================================

      const lista = obtenerProductosPendientes().filter(
        productoGuardado => productoGuardado.codigo !== codigo
      )

      lista.push({
        codigo,
        ...producto
      })

      guardarProductosPendientes(lista)

      // ==============================================
      // CONFIRMACIÓN
      // ==============================================

      if (resultado) {
        resultado.innerHTML = `
            <div class="producto-encontrado">

              <h3>
                ✅ Producto guardado
              </h3>

              <strong>
                ${escaparHTML(nombre)}
              </strong>

              <p>
                💰 ${escaparHTML(precio)}
              </p>

              <p>
                📦 ${escaparHTML(categoria)}
              </p>

              <p>
                🔢 ${escaparHTML(codigo)}
              </p>

              <p>
                🔥 Firebase actualizado
              </p>

            </div>
          `
      }

      // ==============================================
      // LIMPIAR FORMULARIO
      // ==============================================

      if (codigoProducto) {
        codigoProducto.value = ''
      }

      if (nombreProducto) {
        nombreProducto.value = ''
      }

      if (precioProducto) {
        precioProducto.value = ''
      }

      if (imagenProducto) {
        imagenProducto.value = ''
      }

      if (categoriaProducto) {
        categoriaProducto.value = ''
      }

      await mostrarProductosFirebase()
    } catch (error) {
      console.error('❌ Error guardando producto:', error)

      if (resultado) {
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
    }
  })
}

// ======================================================
// VER PRODUCTOS GUARDADOS
// ======================================================

if (btnVerProductos) {
  btnVerProductos.addEventListener('click', async () => {
    if (!comprobarModoDueno()) {
      return
    }

    await mostrarProductosFirebase()
  })
}

// ======================================================
// OBTENER PRODUCTOS DE FIREBASE
// ======================================================

async function mostrarProductosFirebase () {
  if (!listaProductosGuardados) {
    return
  }

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
            const imagen = String(producto?.imagen || '').trim()

            const imagenHTML = imagen
              ? `
                  <img
                    src="${escaparHTML(imagen)}"
                    alt="${escaparHTML(producto?.nombre || 'Producto')}"
                    style="
                      width:80px;
                      height:80px;
                      object-fit:contain;
                      display:block;
                      margin:0 auto 8px;
                    "
                    onerror="this.style.display='none'"
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
                  ${escaparHTML(producto?.nombre || 'Sin nombre')}
                </strong>

                <br>

                Código:
                ${escaparHTML(producto.codigo)}

                <br>

                Precio:
                ${escaparHTML(normalizarPrecio(producto.precio))}

                <br>

                Categoría:
                ${escaparHTML(producto?.categoria || '')}

                <br><br>

                <button
                  class="boton-otro-escaneo"
                  data-codigo="${escaparHTML(producto.codigo)}"
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
          const codigo = boton.dataset.codigo

          if (codigo) {
            eliminarProductoFirebase(codigo)
          }
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
        ? ''
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
