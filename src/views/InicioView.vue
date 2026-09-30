<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const libros = computed(() => store.getters['productos/libros'])

const enRevision = computed(() => libros.value.filter(libro => !libro.publicado).length)
const publicados = computed(() => libros.value.filter(libro => libro.publicado).length)

</script>

<template>
  <div class="pagina">
    <header class="cabecera">
      <div class="contenedor cabecera-interior">
        <router-link :to="{ name: 'inicio' }" class="marca">
          <span class="logo">
            <img src="@/assets/img/icono-libros.png" alt="" width="28">
          </span>
          BookList
        </router-link>

        <div class="barra-derecha">
          <router-link :to="{ name: 'libros' }" class="barra-enlace">Ir al catalogo</router-link>
          <router-link :to="{ name: 'dashboard' }" class="barra-enlace">Ir al dashboard</router-link>
        </div>
      </div>
    </header>

    <main class="contenedor contenido-principal">
      <section>
        <aside class="tarjeta-vistaprevia">
          <p class="vistaprevia-titulo">Estado del catálogo</p>

          <div class="vistaprevia-fila">
            <span class="vistaprevia-etiqueta">Libros registrados</span>
            <span class="vistaprevia-numero">{{ libros.length }}</span>
          </div>
          <div class="vistaprevia-fila">
            <span class="vistaprevia-etiqueta">En revisión</span>
            <span class="vistaprevia-numero">{{ enRevision }}</span>
          </div>
          <div class="vistaprevia-fila">
            <span class="vistaprevia-etiqueta">Publicados</span>
            <span class="vistaprevia-numero">{{ publicados }}</span>
          </div>

          <router-link :to="{ name: 'dashboard' }" class="vistaprevia-boton">Ir al panel</router-link>
        </aside>
      </section>
    </main>

  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0fdf4;
}

.contenedor {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
}

.cabecera {
  background: white;
  border-bottom: 1px solid #ecfdf5;
}
.cabecera-interior {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding-top: 1.1rem;
  padding-bottom: 1.1rem;
}
.marca {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  font-size: 1.3rem;
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

.barra-derecha {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.barra-enlace {
  padding: 0.6rem 1.3rem;
  border-radius: 999px;
  color: #1a2e28;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.barra-enlace:hover {
  background: #064e3b;
  color: white;
}

.contenido-principal {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.tarjeta-vistaprevia {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
}
.vistaprevia-titulo {
  margin: 0 0 1.25rem;
  font-weight: 700;
  color: #1a2e28;
}
.vistaprevia-fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #ecfdf5;
}
.vistaprevia-fila:last-of-type {
  border-bottom: none;
}
.vistaprevia-etiqueta {
  color: #5b7a6e;
  font-size: 0.9rem;
}
.vistaprevia-numero {
  font-weight: 700;
  font-size: 1.2rem;
  color: #1a2e28;
}
.vistaprevia-boton {
  display: block;
  margin-top: 1.5rem;
  padding: 0.7rem;
  border-radius: 999px;
  background: #064e3b;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  text-decoration: none;
}
.vistaprevia-boton:hover {
  background: #059669;
}

@media (max-width: 780px) {
  .contenedor {
    padding: 0 1.25rem;
  }
  .barra-derecha {
    gap: 0.8rem;
  }
}
</style>
