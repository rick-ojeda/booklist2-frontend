<script setup>
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
categorias: { type: Array, required: true },
libroEditar: { type: Object, default: null }
})

const emit = defineEmits(['guardado'])
const store = useStore()

const nuevoLibro = reactive({
titulo: '',
autor: '',
categoria: '',
descripcion: '',
precio: null,
agotado: false
})

const error = ref('')

watch(
() => props.libroEditar,
libro => {
if (libro) {
nuevoLibro.titulo = libro.titulo
nuevoLibro.autor = libro.autor
nuevoLibro.categoria = libro.categoria
nuevoLibro.descripcion = libro.descripcion
nuevoLibro.precio = libro.precio ?? null
nuevoLibro.agotado = libro.agotado ?? false
} else {
nuevoLibro.agotado = false
}
},
{ immediate: true }
)

function limpiarFormulario() {
nuevoLibro.titulo = ''
nuevoLibro.autor = ''
nuevoLibro.categoria = ''
nuevoLibro.descripcion = ''
nuevoLibro.precio = null
nuevoLibro.agotado = false
}

async function enviar() {
if (!nuevoLibro.titulo.trim() || !nuevoLibro.autor.trim() || !nuevoLibro.descripcion.trim()) {
    error.value = 'Todos los campos son obligatorios.'
    return
  }
if (nuevoLibro.precio === null || nuevoLibro.precio === '' || Number(nuevoLibro.precio) <= 0) {
    error.value = 'Ingresa un precio de venta válido.'
    return
  }
error.value = ''

if (props.libroEditar) {
await store.dispatch('productos/editarLibro', {
id: props.libroEditar.id,
...nuevoLibro,
publicado: props.libroEditar.publicado
})
} else {
await store.dispatch('productos/agregarLibro', { ...nuevoLibro, agotado: false })
limpiarFormulario()
}

emit('guardado')
}
</script>

<template>
<form class="formulario" @submit.prevent>
<div class="campos">
<div class="fila">
<input v-model="nuevoLibro.titulo" placeholder="Título" @keyup.enter="enviar">
<input v-model="nuevoLibro.autor" placeholder="Autor" @keyup.enter="enviar">
</div>
<div class="fila">
<label class="label-categoria">Categoría</label>
<select v-model="nuevoLibro.categoria">
<option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
</select>
<button type="button" class="boton-agregar" @click="enviar">
{{ libroEditar ? 'Guardar cambios' : '+ Agregar libro' }}
</button>
</div>
<div class="fila">
<input v-model.number="nuevoLibro.precio" type="number" min="0" step="1" placeholder="Precio de venta ($)" @keyup.enter="enviar">
<label v-if="libroEditar" class="check-agotado">
<input type="checkbox" v-model="nuevoLibro.agotado">
Agotado
</label>
</div>
<textarea v-model="nuevoLibro.descripcion" placeholder="Descripción breve"></textarea>

<p v-if="error" class="error">{{ error }}</p>
</div>

</form>
</template>

<style scoped>
.formulario {
background: white;
border-radius: 14px;
padding: 1.5rem;
box-shadow: 0 4px 16px rgba(6, 78, 59, 0.08);
margin-bottom: 1.5rem;
display: grid;
gap: 1.5rem;
}
.fila {
display: flex;
gap: 0.8rem;
margin-bottom: 0.8rem;
align-items: center;
}
.fila input, .fila select {
flex: 1;
}
input, select, textarea {
padding: 0.7rem 0.9rem;
border: 1.5px solid #d1e7df;
border-radius: 8px;
font-size: 0.95rem;
font-family: inherit;
box-sizing: border-box;
width: 100%;
background: white;
}
input:focus, select:focus, textarea:focus {
outline: none;
border-color: #059669;
}
textarea {
resize: vertical;
min-height: 60px;
display: block;
}
.boton-agregar {
flex: 0 0 auto;
padding: 0.7rem 1.3rem;
border: none;
border-radius: 8px;
background: linear-gradient(135deg, #059669, #10b981);
color: white;
font-weight: 700;
cursor: pointer;
white-space: nowrap;
}
.boton-agregar:hover {
opacity: 0.9;
}
.label-categoria {
flex: 0 0 auto;
display: flex;
align-items: center;
padding: 0 0.4rem;
color: #5b7a6e;
font-size: 0.95rem;
font-weight: 600;
white-space: nowrap;
}
.check-agotado {
flex: 0 0 auto;
display: inline-flex;
align-items: center;
gap: 0.5rem;
color: #5b7a6e;
font-size: 0.95rem;
white-space: nowrap;
margin-left: 0.5rem;
}
.check-agotado input[type="checkbox"] {
width: auto;
flex-shrink: 0;
margin: 0;
}
.error {
margin: 0.6rem 0 0;
color: #dc2626;
font-size: 0.85rem;
font-weight: 600;
}
@media (max-width: 760px) {
.formulario {
grid-template-columns: 1fr;
}
.fila {
flex-direction: column;
}
}
</style>
