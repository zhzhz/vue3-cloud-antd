import { defineStore } from 'pinia';

type devData = {
    state:number
}

export const useDevDataStore = defineStore({
    id: 'devData',
    state: (): devData => ({
        state:-1
    }),
    getters: {
      getDevData(state): number {
        return state.state;
      },
    },
    actions: {
        /** 初始化标签页 */
        initDevData(devData:number) {
            this.state = devData;
        },
        
        setDevData(devData:number) {
            this.state = devData;
        },
    }
})