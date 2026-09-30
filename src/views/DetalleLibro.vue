<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import FormularioLibro from '../components/FormularioLibro.vue'

const props = defineProps({
  id: { type: [String, Number], required: true }
})

const router = useRouter()
const store = useStore()

const categorias = ['Novela', 'Ensayo', 'Fantasía', 'Ciencia', 'Biografía', 'Poesía']

const libro = computed(() => store.getters['productos/libroPorId'](props.id))
const idsFavoritos = computed(() => store.getters['favoritos/ids'])
const esFavorito = computed(() => (libro.value ? idsFavoritos.value.includes(libro.value.id) : false))

const editando = ref(false)

function alternarPublicado() {
  store.dispatch('productos/alternarPublicado', libro.value.id)
}

function alternarAgotado() {
  store.dispatch('productos/alternarAgotado', libro.value.id)
}

const precioFormateado = computed(() =>
  libro.value && libro.value.precio != null
    ? '$' + Number(libro.value.precio).toLocaleString('es-CL')
    : ''
)

function toggleFavorito() {
  store.commit('favoritos/TOGGLE_FAVORITO', libro.value.id)
}

function alGuardar() {
  editando.value = false
}

const imagenLibro = computed(() => {
  return libro.value.publicado
    ? require('@/assets/img/libro-publicado.png')
    : require('@/assets/img/libro-detalle.png')
})
</script>

<template>
  <div class="pagina">
    <div v-if="!libro" class="no-encontrado">
      <img src="@/assets/img/no-libros.png" alt="Lector caminando mientras lee" class="no-encontrado-img">
      <p class="no-encontrado-titulo">No encontramos ese libro</p>
      <p>Puede que el enlace esté mal o que el libro haya sido eliminado.</p>
      <router-link to="/libros" class="volver">← Volver al catálogo</router-link>
    </div>

    <template v-else>
      <FormularioLibro
        v-if="editando"
        :categorias="categorias"
        :libro-editar="libro"
        @guardado="alGuardar"
      />

      <div v-else class="detalle">
        <div class="detalle-texto">
          <button class="volver-boton" @click="router.back()">← Volver</button>
          <div class="chips">
            <span class="chip-categoria">{{ libro.categoria }}</span>
            <span class="chip-estado" :class="{ publicado: libro.publicado }">
              {{ libro.publicado ? 'Publicado' : 'En revisión' }}
            </span>
            <span class="chip-stock" :class="{ agotado: libro.agotado }">
              {{ libro.agotado ? 'Agotado' : 'Disponible' }}
            </span>
          </div>
          <div class="fila-titulo-detalle">
            <h1>{{ libro.titulo }}</h1>
            <button class="boton-favorito-detalle" @click="toggleFavorito">
              {{ esFavorito ? '★' : '☆' }}
            </button>
          </div>
          <p class="autor">de {{ libro.autor }}</p>
          <p v-if="precioFormateado" class="precio">{{ precioFormateado }}</p>
          <p class="descripcion">{{ libro.descripcion || 'Sin descripción disponible.' }}</p>
          <div class="acciones-detalle">
            <button class="boton-estado" @click="alternarPublicado">
              {{ libro.publicado ? 'Volver a revisión' : 'Publicar libro' }}
            </button>
            <button class="boton-stock" @click="alternarAgotado">
              {{ libro.agotado ? 'Marcar disponible' : 'Marcar agotado' }}
            </button>
            <button class="boton-editar" @click="editando = true">Editar</button>
          </div>
        </div>
        <img :src="imagenLibro" alt="" class="detalle-img">
      </div>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  max-width: 820px;
  margin: 0 auto;
}
.no-encontrado {
  text-align: center;
  background: white;
  padding: 2.5rem;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(6, 78, 59, 0.08);
  color: #5b7a6e;
}
.no-encontrado-img {
  width: 100%;
  max-width: 220px;
}
.no-encontrado-titulo {
  color: #1a2e28;
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0.8rem 0 0.3rem;
}
.volver {
  color: #059669;
  font-weight: 600;
  text-decoration: none;
}
.detalle {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(6, 78, 59, 0.1);
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 2rem;
  align-items: center;
}
.volver-boton {
  display: block;
  border: none;
  background: none;
  color: #059669;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.chip-categoria,
.chip-estado,
.chip-stock {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}
.chip-categoria {
  background: #ecfdf5;
  color: #059669;
}
.chip-estado {
  background: #fff4e0;
  color: #b45309;
}
.chip-estado.publicado {
  background: #dcfce7;
  color: #15803d;
}
.chip-stock {
  background: #dcfce7;
  color: #15803d;
}
.chip-stock.agotado {
  background: #fee2e2;
  color: #dc2626;
}
.precio {
  font-size: 1.4rem;
  font-weight: 700;
  color: #059669;
  margin: 0 0 1rem;
}
.boton-stock {
  margin-top: 0.5rem;
  border: none;
  background: #fff4e0;
  color: #b45309;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.boton-stock:hover {
  background: #fde9c4;
}
.fila-titulo-detalle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.boton-favorito-detalle {
  border: none;
  background: none;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  color: #f5a623;
  padding: 0;
}
.acciones-detalle {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.boton-estado {
  margin-top: 0.5rem;
  border: none;
  background: #dcfce7;
  color: #15803d;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.boton-estado:hover {
  background: #bbf7d0;
}
.boton-editar {
  margin-top: 0.5rem;
  border: none;
  background: #ecfdf5;
  color: #059669;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.boton-editar:hover {
  background: #d1fae5;
}
h1 {
  margin: 0 0 0.4rem;
  color: #1a2e28;
}
.autor {
  color: #7a9a8c;
  margin: 0 0 1.5rem;
  font-style: italic;
}
.descripcion {
  color: #3d5a4e;
  line-height: 1.7;
}
.detalle-img {
  width: 100%;
}
@media (max-width: 640px) {
  .detalle {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
  .detalle-img {
    max-width: 180px;
    justify-self: center;
    grid-row: 1;
  }
}
</style>
