import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import DashboardView from '../views/DashboardView.vue'
import ListaLibros from '../views/ListaLibros.vue'
import DetalleLibro from '../views/DetalleLibro.vue'
import NoEncontradoView from '../views/NoEncontradoView.vue'

const routes = [
  { path: '/', name: 'inicio', component: InicioView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/libros', name: 'libros', component: ListaLibros, meta: { requiresAuth: true } },
  {
    path: '/libros/:id',
    name: 'detalle-libro',
    component: DetalleLibro,
    props: true,
    meta: { requiresAuth: true }
  },
  // 404, siempre al final
  { path: '/:pathMatch(.*)*', name: 'no-encontrado', component: NoEncontradoView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})


export default router
