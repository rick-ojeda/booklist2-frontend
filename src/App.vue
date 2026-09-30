<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()

onMounted(() => {
  store.dispatch('productos/cargarLibros')
})

const esVistaPrivada = computed(() => route.meta.requiresAuth)

const libros = computed(() => store.getters['productos/libros'])
const librosEnRevision = computed(() => libros.value.filter(libro => !libro.publicado).length)
const librosPublicados = computed(() => libros.value.filter(libro => libro.publicado).length)

function publicarTodos() {
  store.dispatch('productos/publicarTodos')
}
</script>

<template>
  <div v-if="esVistaPrivada" class="app-privada">
    <header class="barra">
      <div class="barra-inner">
        <router-link :to="{ name: 'inicio' }" class="marca">
          <span class="logo">
            <img src="@/assets/img/icono-libros.png" alt="" width="28">
          </span>
          BookList
        </router-link>

        <nav class="enlaces">
          <router-link :to="{ name: 'dashboard' }" class="enlace">Panel</router-link>
          <router-link :to="{ name: 'libros' }" class="enlace">Catálogo</router-link>
        </nav>
        
        <div class="barra-derecha">
          <router-link :to="{ name: 'inicio' }" class="boton-inicio">
            Ir a Inicio
          </router-link>
        </div>
      </div>
    </header>

    <div class="barra-contador">
      <div class="barra-contador-inner">
        <span>Libros publicados: {{ librosPublicados }} de <strong>{{ libros.length }}</strong></span>
        <span>Libros en revisión: {{ librosEnRevision }} de <strong>{{ libros.length }}</strong></span>
        <button v-if="librosEnRevision > 0" class="boton-contador" @click="publicarTodos">
          Publicar todos
        </button>
      </div>
    </div>

    <main class="contenido">
      <router-view />
    </main>
  </div>

  <router-view v-else />
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #f0fdf4;
  color: #1a2e28;
}
img {
  max-width: 100%;
  height: auto;
}
</style>

<style scoped>
.app-privada {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.barra {
  background: white;
  box-shadow: 0 2px 12px rgba(6, 78, 59, 0.06);
  width: 100%;
}

.barra-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 2rem;
  width: 100%;
}

.marca {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1a2e28;
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 10px rgba(6, 78, 59, 0.12);
  overflow: hidden;
}
.logo img {
  display: block;
}

.enlaces {
  display: flex;
  gap: 0.5rem;
  margin-right: auto;
}
.enlace {
  color: #5b7a6e;
  text-decoration: none;
  font-weight: 600;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
}
.enlace:hover {
  color: #1a2e28;
}
.enlace.router-link-active {
  background: #ecfdf5;
  color: #059669;
}

.barra-derecha {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.boton-inicio {
  padding: 0.5rem 1.1rem;
  border: 1px solid #d1e7df;
  border-radius: 999px;
  background: transparent;
  color: #5b7a6e;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.boton-inicio:hover {
  border-color: #059669;
  color: #059669;
  background: #ecfdf5;
}

.barra-contador {
  background: #064e3b;
  color: #a7f3d0;
  width: 100%;
}

.barra-contador-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0.55rem 1rem;
  width: 100%;
  font-size: 0.9rem;
}
.barra-contador-inner strong {
  color: white;
  font-size: 1rem;
}

.boton-contador {
  border: none;
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  background: white;
  color: #064e3b;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
}

.contenido {
  flex: 1;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

@media (max-width: 760px) {
  .barra-inner {
    flex-wrap: wrap;
    padding: 1rem 1.25rem;
    gap: 0.8rem;
  }
  .enlaces {
    order: 3;
    width: 100%;
    margin-right: 0;
  }
  .contenido {
    padding: 1.5rem 1.25rem;
  }
}
</style>
