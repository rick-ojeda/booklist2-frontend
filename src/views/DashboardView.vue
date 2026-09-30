<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import iconoLibros from '@/assets/img/libros.png'
import iconoLibro from '@/assets/img/libro_abierto.png'
import iconoLeer from '@/assets/img/libro_cerrado.png'

const router = useRouter()
const store = useStore()

const libros = computed(() => store.getters['productos/libros'])
const enRevision = computed(() => libros.value.filter(libro => !libro.publicado))
const publicados = computed(() => libros.value.filter(libro => libro.publicado))

const tarjetas = computed(() => [
{ icono: iconoLibros, numero: libros.value.length, etiqueta: 'Libros registrados' },
{ icono: iconoLibro, numero: enRevision.value.length, etiqueta: 'En revisión' },
{ icono: iconoLeer, numero: publicados.value.length, etiqueta: 'Publicados' }
])

function irAlCatalogo() {
router.push({ name: 'libros' })
}

function alternarPublicado(id) {
store.dispatch('productos/alternarPublicado', id)
}
</script>

<template>
  <div class="dashboard">
    <div class="fila-superior">
      <div>
        <h1>Panel de control</h1>
      </div>
      <button class="boton-nuevo" @click="irAlCatalogo">+ Registrar libro</button>
    </div>

    <section class="cuadricula-tarjetas">
      <article v-for="tarjeta in tarjetas" :key="tarjeta.etiqueta" class="tarjeta">
        <img :src="tarjeta.icono" alt="" class="tarjeta-icono">
        <p class="tarjeta-numero">{{ tarjeta.numero }}</p>
        <p class="tarjeta-etiqueta">{{ tarjeta.etiqueta }}</p>
      </article>
    </section>

    <div class="bloques-lado-a-lado">
      <section class="bloque">
        <h2>En revisión</h2>
        <ul v-if="enRevision.length">
          <li v-for="libro in enRevision" :key="libro.id">
            <div class="libro-info">
              <router-link :to="`/libros/${libro.id}`" class="libro-titulo">{{ libro.titulo }}</router-link>
              <span class="libro-autor">{{ libro.autor }}</span>
            </div>
            <button class="boton-accion" @click="alternarPublicado(libro.id)">Publicar</button>
          </li>
        </ul>
        <div v-else class="vacio">
          <img src="@/assets/img/no-libros.png" alt="" class="vacio-img">
          <p>No hay libros pendientes de revisión.</p>
        </div>
      </section>

      <section class="bloque">
        <h2>Publicados</h2>
        <ul v-if="publicados.length">
          <li v-for="libro in publicados" :key="libro.id">
            <div class="libro-info">
              <router-link :to="`/libros/${libro.id}`" class="libro-titulo">{{ libro.titulo }}</router-link>
              <span class="libro-autor">{{ libro.autor }}</span>
            </div>
            <button class="boton-accion secundario" @click="alternarPublicado(libro.id)">Volver a revisión</button>
          </li>
        </ul>
        <div v-else class="vacio">
          <img src="@/assets/img/libro-publicado.png" alt="" class="vacio-img">
          <p>Todavía no hay libros publicados.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.fila-superior {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
h1 {
  margin: 0;
  font-size: 2.1rem;
  color: #1a2e28;
}

.boton-nuevo {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 999px;
  background: #059669;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.boton-nuevo:hover {
  background: #064e3b;
  transform: translateY(-1px);
}

.cuadricula-tarjetas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}
.tarjeta {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(6, 78, 59, 0.08);
  padding: 1.5rem 1.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.tarjeta:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(6, 78, 59, 0.14);
}
.tarjeta-icono {
  display: block;
  width: 48px;
  height: 48px;
  margin-bottom: 0.6rem;
}
.tarjeta-numero {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  color: #1a2e28;
}
.tarjeta-etiqueta {
  margin: 0.5rem 0 0;
  color: #5b7a6e;
  font-size: 0.85rem;
}

.bloques-lado-a-lado {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.bloque {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(6, 78, 59, 0.08);
  padding: 1.75rem;
}
.bloque h2 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #1a2e28;
}
.bloque ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.bloque li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e6f4ef;
}
.bloque li:last-child {
  border-bottom: none;
}

.libro-info {
  display: flex;
  flex-direction: column;
}
.libro-titulo {
  color: #1a2e28;
  font-weight: 600;
  text-decoration: none;
}
.libro-titulo:hover {
  color: #059669;
}
.libro-autor {
  color: #7a9a8c;
  font-size: 0.85rem;
}

.boton-accion {
  flex-shrink: 0;
  padding: 0.4rem 0.9rem;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
.boton-accion:hover {
  background: #bbf7d0;
}
.boton-accion.secundario {
  border-color: #d1e7df;
  background: transparent;
  color: #5b7a6e;
}
.boton-accion.secundario:hover {
  border-color: #059669;
  color: #059669;
}

.vacio {
  padding: 1.5rem 1rem;
  border: 1px dashed #d1e7df;
  border-radius: 14px;
  background: #f7fdf9;
  text-align: center;
}
.vacio-img {
  width: 100%;
  max-width: 110px;
}
.vacio p {
  margin: 0.5rem 0 0;
  color: #5b7a6e;
  font-size: 0.9rem;
}

@media (max-width: 780px) {
  .bloques-lado-a-lado {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .cuadricula-tarjetas {
    grid-template-columns: 1fr;
  }
  .fila-superior {
    flex-direction: column;
    align-items: flex-start;
  }
  h1 {
    font-size: 1.7rem;
  }
}
</style>
