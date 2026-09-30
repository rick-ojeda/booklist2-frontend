<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
libro: { type: Object, required: true },
vistaPrevia: { type: Boolean, default: false },
esFavorito: { type: Boolean, default: false }
})

const emit = defineEmits(['eliminar', 'alternar-publicado', 'alternar-agotado', 'favorito'])

const precioFormateado = computed(() =>
props.libro.precio != null ? '$' + Number(props.libro.precio).toLocaleString('es-CL') : ''
)

const mostrarDescripcion = ref(props.vistaPrevia)
</script>

<template>
<li class="tarjeta-libro" :class="{ 'es-vista-previa': vistaPrevia }">
<div class="fila-titulo">
<span v-if="vistaPrevia" class="titulo-libro">{{ libro.titulo }}</span>
<router-link v-else :to="`/libros/${libro.id}`" class="titulo-libro">{{ libro.titulo }}</router-link>
<button v-if="!vistaPrevia" class="boton-favorito" @click="emit('favorito', libro.id)">
{{ esFavorito ? '★' : '☆' }}
</button>
</div>
<p class="autor-libro">{{ libro.autor }}</p>
<p v-if="precioFormateado" class="precio">{{ precioFormateado }}</p>
<div class="chips">
<span class="chip-categoria">{{ libro.categoria }}</span>
<span v-if="!vistaPrevia" class="chip-estado" :class="{ publicado: libro.publicado }">
{{ libro.publicado ? 'Publicado' : 'En revisión' }}
</span>
<span v-if="!vistaPrevia" class="chip-stock" :class="{ agotado: libro.agotado }">
{{ libro.agotado ? 'Agotado' : 'Disponible' }}
</span>
</div>

<p v-show="mostrarDescripcion && libro.descripcion" class="descripcion">{{ libro.descripcion }}</p>

<div v-if="!vistaPrevia" class="acciones">
<button
v-if="libro.descripcion"
class="boton-descripcion"
@click="mostrarDescripcion = !mostrarDescripcion"
>
{{ mostrarDescripcion ? 'Ocultar descripción' : 'Ver descripción' }}
</button>
<button class="boton-estado" @click="emit('alternar-publicado', libro.id)">
{{ libro.publicado ? 'Volver a revisión' : 'Publicar' }}
</button>
<button class="boton-stock" @click="emit('alternar-agotado', libro.id)">
{{ libro.agotado ? 'Marcar disponible' : 'Marcar agotado' }}
</button>
<button class="boton-eliminar" @click.once="emit('eliminar', libro.id)">Eliminar</button>
</div>
</li>
</template>

<style scoped>
.tarjeta-libro {
background: white;
border-radius: 14px;
padding: 1.2rem;
box-shadow: 0 4px 16px rgba(6, 78, 59, 0.08);
display: flex;
flex-direction: column;
gap: 0.4rem;
}
.es-vista-previa {
box-shadow: none;
border: 1.5px dashed #a7d4c0;
}
.fila-titulo {
display: flex;
align-items: center;
justify-content: space-between;
gap: 0.5rem;
}
.titulo-libro {
font-weight: 700;
color: #1a2e28;
text-decoration: none;
font-size: 1.05rem;
}
a.titulo-libro:hover {
color: #059669;
}
.boton-favorito {
border: none;
background: none;
font-size: 1.15rem;
line-height: 1;
cursor: pointer;
color: #f5a623;
padding: 0;
flex-shrink: 0;
}
.autor-libro {
color: #5b7a6e;
margin: 0;
font-size: 0.9rem;
}
.chips {
display: flex;
flex-wrap: wrap;
gap: 0.4rem;
}
.chip-estado {
font-size: 0.75rem;
font-weight: 700;
padding: 0.2rem 0.6rem;
border-radius: 20px;
background: #fff4e0;
color: #b45309;
}
.chip-estado.publicado {
background: #dcfce7;
color: #15803d;
}
.chip-categoria {
background: #ecfdf5;
color: #059669;
font-size: 0.75rem;
font-weight: 700;
padding: 0.2rem 0.6rem;
border-radius: 20px;
}
.chip-stock {
font-size: 0.75rem;
font-weight: 700;
padding: 0.2rem 0.6rem;
border-radius: 20px;
background: #dcfce7;
color: #15803d;
}
.chip-stock.agotado {
background: #fee2e2;
color: #dc2626;
}
.precio {
margin: 0;
font-weight: 700;
color: #059669;
}
.boton-stock {
border: none;
font-weight: 600;
font-size: 0.85rem;
padding: 0.4rem 0.8rem;
border-radius: 8px;
cursor: pointer;
background: #fff4e0;
color: #b45309;
}
.boton-stock:hover {
background: #fde9c4;
}
.descripcion {
margin: 0.3rem 0 0;
color: #3d5a4e;
font-size: 0.85rem;
line-height: 1.5;
}
.acciones {
display: flex;
flex-wrap: wrap;
gap: 0.5rem;
margin-top: 0.5rem;
}
.boton-descripcion,
.boton-estado,
.boton-eliminar {
border: none;
font-weight: 600;
font-size: 0.85rem;
padding: 0.4rem 0.8rem;
border-radius: 8px;
cursor: pointer;
}
.boton-descripcion {
background: #ecfdf5;
color: #059669;
}
.boton-descripcion:hover {
background: #d1fae5;
}
.boton-estado {
background: #dcfce7;
color: #15803d;
}
.boton-estado:hover {
background: #bbf7d0;
}
.boton-eliminar {
background: #fee2e2;
color: #dc2626;
}
.boton-eliminar:hover {
background: #fecaca;
}
</style>
