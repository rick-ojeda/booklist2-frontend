export default {
  namespaced: true,
  state: () => ({
    titulo: "",
    autor: "",
    categoria: "",
    soloFavoritos: false,
    precioDesde: "",
  }),
  mutations: {
    SET_TITULO(state, val) {
      state.titulo = val;
    },
    SET_AUTOR(state, val) {
      state.autor = val;
    },
    SET_CATEGORIA(state, val) {
      state.categoria = val;
    },
    SET_SOLO_FAVORITOS(state, val) {
      state.soloFavoritos = val;
    },
    SET_PRECIO_DESDE(state, val) {
      state.precioDesde = val;
    },
  },
  getters: {
    titulo: (state) => state.titulo,
    autor: (state) => state.autor,
    categoria: (state) => state.categoria,
    soloFavoritos: (state) => state.soloFavoritos,
    precioDesde: (state) => state.precioDesde,
  },
};
