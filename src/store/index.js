import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import AppConstants from '@/app-constants';
import Endpoints from '@/endpoints';
import dayjs from 'dayjs';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        masterJson: null
    },
    getters: {
        speakers (state) {
            return state.masterJson?.speakers || []
        },
        weeklyAgendas (state) {
            return state.masterJson?.weeklyAgendas;
        },
        agendasFlattened (state) {
            if (!state.masterJson) return [];
            return Object.values(state.masterJson.weeklyAgendas).map(x => x.allAgendas).flat()
        },

        closestUpcomingWeek (state) {
            if (!state.masterJson) return null;
            
            const now = dayjs();
            const weeksSorted = Object.values(state.masterJson.weeklyAgendas).sort((a, b) => {
                const startDateA = dayjs(a.week.startDate);
                const startDateB = dayjs(b.week.startDate);
                return startDateA.isBefore(startDateB) ? -1 : 1;
            })

            let theWeek;
            for (let item of weeksSorted) {
                if (now.isBefore(item.week.startDate)) {
                    theWeek = item;
                    break;
                }
            }

            return theWeek
        },

        categories (state) {
            if (!state.masterJson) return [];
            const categorisedAgendas = Object.values(state.masterJson.weeklyAgendas).map(x => x.categorisedAgendas).flat()
            const allCategories = categorisedAgendas.map(x => x.category).filter(Boolean);

            let uniqueMap = {};
            for (let category of allCategories) {
                if (!uniqueMap[category.id]) {
                    uniqueMap[category.id] = category
                }
            }

            return Object.values(uniqueMap)
        },

        latestAgendasFromNow (state, getters) {
            if (!state.masterJson) return []
            const agendasFlattened = getters.agendasFlattened;
            
            const agendasSorted = agendasFlattened.sort((a, b) => {
                const startDateA = dayjs(a.releaseDate || a.startDate);
                const startDateB = dayjs(b.releaseDate || b.startDate);
                return startDateA.isBefore(startDateB) ? -1 : 1;
            })

            const eventsNotPassed = agendasSorted.filter(x => {
                return dayjs(x.releaseDate || x.startDate).isAfter()
            })

            return eventsNotPassed
        }
    },
    mutations: {
        SET_MASTER_JSON (state, value) {
            state.masterJson = value;
        }
    },
    actions: {
        async retrieveMasterJSON (context) {
            const response = await axios.get(Endpoints.MASTER_JSON)
            context.commit('SET_MASTER_JSON', response.data)
        },
    }
})

export default store;