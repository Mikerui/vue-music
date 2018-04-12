const state = {
	loading:false, //全局loading
};
const getters = {	
	loading(state){
	 	return state.loading
	}
};
const mutations = {
	setLoading(state,status){
		state.loading = status;
	}
}

export default{
	state,
    getters,
    mutations
}
