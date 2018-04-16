// import VuexPersistence from 'vuex-persist'


// function getPlugins() {
//     let plugins = []

//     if (process.browser) {
//         const vuexLocal = new VuexPersistence({
//             key: 'timer',
//             storage: window.localforage,
//             asyncStorage: true
//         })        

//         plugins.push(vuexLocal.plugin)
//     }
//     return plugins
// }

// export const plugins = getPlugins()

export const state = () => ({
    minutes: 0,
    seconds: 0,
    clicked: false,
})

export const getters = {
    
}

export const mutations = {
    updateTimer(state, payload){
        state.seconds = payload.seconds < 10 ?  '0' + payload.seconds : payload.seconds
        state.minutes = payload.minutes < 10 ?  '0' + payload.minutes : payload.minutes
    },
    setFlag(state){
        state.clicked = true
    },
    removeFlag(state){
        state.clicked = false
    }
}

export const actions = {
  setTimeInterval({commit}, duration)  {
    let endTime = this.$moment(new Date()).add(duration, 'm').toDate()
    let timeinterval = setInterval(() => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const seconds = Math.floor( (total/1000) % 60 );
        const minutes = Math.floor( (total/1000/60) % 60 );
        // const hours = Math.floor( (total/(1000*60*60)) % 24 );
        // const days = Math.floor( total/(1000*60*60*24) );
        commit('updateTimer', {seconds, minutes})
        if(total <= 0 ){
            clearInterval(timeinterval)
            commit('removeFlag')
        }
    }, 1000)
    commit('setFlag')
  }
}