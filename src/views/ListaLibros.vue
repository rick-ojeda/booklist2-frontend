<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import FormularioLibro from '../components/FormularioLibro.vue'
import LibroItem from '../components/LibroItem.vue'

const store = useStore()
const categorias = ['Novela', 'Ensayo', 'Fantasía', 'Ciencia', 'Biografía', 'Poesía']

onMounted(() => {
  store.dispatch('productos/cargarLibros')
})

const libros = computed(() => store.getters['productos/libros'])
const loading = computed(() => store.getters['productos/loading'])
const error = computed(() => store.getters['productos/error'])
const idsFavoritos = computed(() => store.getters['favoritos/ids'])

const filtroTitulo = computed({
  get: () => store.getters['filtros/titulo'],
  set: val => store.commit('filtros/SET_TITULO', val)
})
const filtroAutor = computed({
  get: () => store.getters['filtros/autor'],
  set: val => store.commit('filtros/SET_AUTOR', val)
})
const filtroCategoria = computed({
  get: () => store.getters['filtros/categoria'],
  set: val => store.commit('filtros/SET_CATEGORIA', val)
})
const soloFavoritos = computed({
  get: () => store.getters['filtros/soloFavoritos'],
  set: val => store.commit('filtros/SET_SOLO_FAVORITOS', val)
})

const precioDesde = computed({
  get: () => store.getters['filtros/precioDesde'],
  set: val => store.commit('filtros/SET_PRECIO_DESDE', val)
})

const PASO_PRECIO = 5000
const formatoPrecio = n => '$' + n.toLocaleString('es-CL')

const rangosPrecio = computed(() => {
  const precios = libros.value.map(l => Number(l.precio)).filter(p => !Number.isNaN(p))
  const maximo = precios.length ? Math.max(...precios) : 0
  const cantidad = Math.floor(maximo / PASO_PRECIO) + 1
  return Array.from({ length: cantidad }, (_, i) => {
    const desde = i * PASO_PRECIO
    return {
      valor: String(desde),
      etiqueta: `${formatoPrecio(desde)} - ${formatoPrecio(desde + PASO_PRECIO - 1)}`
    }
  })
})

function coincidePrecio(libro) {
  if (precioDesde.value === '') return true
  if (libro.precio == null) return false
  const desde = Number(precioDesde.value)
  const precio = Number(libro.precio)
  return precio >= desde && precio < desde + PASO_PRECIO
}

const normalizar = texto => texto.trim().toLowerCase()

const librosFiltrados = computed(() =>
  libros.value.filter(libro =>
    normalizar(libro.titulo).includes(normalizar(filtroTitulo.value)) &&
    normalizar(libro.autor).includes(normalizar(filtroAutor.value)) &&
    (filtroCategoria.value === '' || libro.categoria === filtroCategoria.value) &&
    (!soloFavoritos.value || idsFavoritos.value.includes(libro.id)) &&
    coincidePrecio(libro)
  )
)

function limpiarFiltros() {
  filtroTitulo.value = ''
  filtroAutor.value = ''
  filtroCategoria.value = ''
  precioDesde.value = ''
  soloFavoritos.value = false
}

function eliminar(id) {
  store.dispatch('productos/eliminarLibro', id)
}

function alternarPublicado(id) {
  store.dispatch('productos/alternarPublicado', id)
}

function alternarAgotado(id) {
  store.dispatch('productos/alternarAgotado', id)
}

function toggleFavorito(id) {
  store.commit('favoritos/TOGGLE_FAVORITO', id)
}
</script>

<template>
  <div class="pagina">
    <div class="encabezado">
      <span class="encabezado-icono">
        <img src="@/assets/img/libro_abierto.png" alt="">
      </span>
      <h1>Catálogo de libros</h1>
    </div>

    <FormularioLibro :categorias="categorias" />

    <div class="filtros">
      <input v-model="filtroTitulo" type="search" placeholder="Filtrar por título...">
      <input v-model="filtroAutor" type="search" placeholder="Filtrar por autor...">
      <select v-model="filtroCategoria">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="precioDesde">
        <option value="">Todos los precios</option>
        <option v-for="r in rangosPrecio" :key="r.valor" :value="r.valor">{{ r.etiqueta }}</option>
      </select>
    </div>

    <label class="filtro-favoritos">
      <input type="checkbox" v-model="soloFavoritos">
      Ver solo favoritos
    </label>

    <p v-if="loading">Cargando catálogo...</p>
    <p v-else-if="error" class="error-carga">{{ error }}</p>

    <template v-else>
      <p class="resultados">
        Mostrando {{ librosFiltrados.length }} de {{ libros.length }} libros
      </p>

      <div v-if="librosFiltrados.length === 0" class="vacio">
        <img src="@/assets/img/no-libros.png" alt="No hay libros" class="vacio-img">
        <template v-if="libros.length === 0">
          <p class="vacio-titulo">Aún no hay libros en el catálogo</p>
          <p class="vacio-texto">Completa el formulario de arriba para agregar el primero.</p>
        </template>
        <template v-else>
          <p class="vacio-titulo">No hay libros que coincidan con la búsqueda</p>
          <button type="button" class="boton-limpiar" @click="limpiarFiltros">Limpiar filtros</button>
        </template>
      </div>

      <ul v-else class="grilla-libros">
        <LibroItem
          v-for="libro in librosFiltrados"
          :key="libro.id"
          :libro="libro"
          :es-favorito="idsFavoritos.includes(libro.id)"
          @eliminar="eliminar"
          @alternar-publicado="alternarPublicado"
          @alternar-agotado="alternarAgotado"
          @favorito="toggleFavorito"
        />
      </ul>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  max-width: 900px;
  margin: 0 auto;
}
.encabezado {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.encabezado-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  background: white;
  box-shadow: 0 4px 16px rgba(6, 78, 59, 0.08);
  overflow: hidden;
}
.encabezado-icono img {
  display: block;
  width: 48px;
  height: 48px;
}
h1 {
  color: #1a2e28;
  margin: 0;
}
input, select {
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #d1e7df;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  box-sizing: border-box;
  width: 100%;
  background: white;
}
input:focus, select:focus {
  outline: none;
  border-color: #059669;
}
.filtros {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
  margin-bottom: 0.6rem;
}
.filtro-favoritos {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #5b7a6e;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.filtro-favoritos input {
  width: auto;
}
.error-carga {
  color: #dc2626;
  font-weight: 600;
}
.resultados {
  color: #7a9a8c;
  font-size: 0.85rem;
  margin: 0 0 1.2rem;
}
.vacio {
  text-align: center;
  color: #7a9a8c;
  padding: 2rem;
  background: white;
  border-radius: 14px;
}
.vacio-img {
  width: 100%;
  max-width: 200px;
}
.vacio-titulo {
  color: #1a2e28;
  font-weight: 700;
  font-size: 1.1rem;
  margin: 0.8rem 0 0.6rem;
}
.vacio-texto {
  margin: 0;
}
.boton-limpiar {
  border: 1.5px solid #059669;
  background: white;
  color: #059669;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.boton-limpiar:hover {
  background: #ecfdf5;
}
.grilla-libros {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
}
@media (max-width: 700px) {
  .filtros {
    grid-template-columns: 1fr;
  }
}
</style>
