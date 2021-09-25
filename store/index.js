import Vue from 'vue';

export const state = () => ({
    beers: [],
    breweries: [],
    reviews: [],
    topBeers: [],
    loading: false,
    breweryInfo: {},
    bMessage: null,
    loginPopup: false,
    loginPopupObj: { title: 'Login', text: 'Enter your email and password to login' },
    searchResults: null,
    searchQuery: '',
    authContact: null,
    routeBack: false,

    prefersDarkScheme: false,
    darkModeCookie: null,
    preferencesInCookies: false,
    setDMListener: false,

    navigationItems: [
        { name: 'Home', route: { name: 'index' } },
        { name: 'Discover', route: { name: 'Discover' } },
        { name: 'Profile', route: { name: 'Profile' } },
    ],
    socialItems: [
        { name: 'Instagram', icon: require('@/assets/icons/nav/instagram.svg'), route: 'https://google.com' },
        { name: 'Facebook', icon: require('@/assets/icons/nav/facebook.svg'), route: 'https://google.com' },
        { name: 'Google', icon: require('@/assets/icons/nav/google.svg'), route: 'https://google.com' },
    ],
    footerItems: [
        { name: 'Privacy', route: { name: 'index' } },
        { name: 'Terms', route: { name: 'index' } },
        { name: 'Advertising', route: { name: 'index' } },
        { name: 'Ad choices', route: { name: 'index' } },
        { name: 'Cookies', route: { name: 'index' } },
    ],
    stockPhotos: ['b6_k7y5gk', 'b5_tpwqfg', 'b4_xsn93f', 'b3_ytdxaa', 'b2_koxyps', 'b1_y41vkg'],
});

export const getters = {
    myProfile: state => (state.auth.loggedIn ? state.auth.user : null),
    myId: state => (state.auth.loggedIn ? state.auth.user._id : null),
    marcus: state => state.auth.loggedIn && state.auth.user.email == 'md.wiseman@hotmail.com',
    allBeers: state => {
        return state.beers.reduce((acc, cur) => {
            acc[cur._id] = cur;
            return acc;
        }, {});
    },
    allBreweries: state => {
        return state.breweries.reduce((acc, cur) => {
            acc[cur._id] = cur;
            return acc;
        }, {});
    },
    topBeers: state => state.beers.filter(x => x.averageRating > 4),
};

export const mutations = {
    setObj(state, params) {
        Vue.set(state, params.name, params.obj);
    },
    toggle(state, item) {
        state[item] = !state[item];
    },
    preferencesInCookies(state) {
        const canHave = this.$cookies.get('preferences');
        state.preferencesInCookies = !canHave || canHave.includes('preferences');
    },
    updateBeerList(state, beers) {
        beers.forEach(b => {
            const indx = state.beers.findIndex(x => x._id == b._id);
            if (indx >= 0) state.beers.slice(indx, 1, b);
            else state.beers.push(b);
        });
    },
    updateBreweryList(state, brewery) {
        const indx = state.breweries.findIndex(x => x._id == brewery._id);
        if (indx >= 0) state.breweries.slice(indx, 1, brewery);
        else state.breweries.push(brewery);
    },
    updateReviewsList(state, reviews) {
        reviews.forEach(r => {
            const indx = state.reviews.findIndex(x => x._id == r._id);
            if (indx == -1) state.reviews.push(r);
        });
    },
};

export const actions = {
    async nuxtServerInit({ commit }, { app, $cookies }) {
        const darkMode = $cookies.get('prefersDarkScheme');
        if (darkMode) {
            commit('setObj', { name: 'prefersDarkScheme', obj: darkMode == '2' });
            commit('setObj', { name: 'darkModeCookie', obj: darkMode });
        }

        await app.$axios
            .$get('/api/beers/topBeers')
            .then(res => {
                if (res && res.topBeers) {
                    commit('updateReviewsList', res.reviews);
                    commit('setObj', { name: 'beers', obj: res.topBeers });
                    commit('setObj', { name: 'topBeers', obj: res.topBeers });
                }
            })
            .catch(err => {
                console.warn('Server init error :>> ', err);
            })
            .finally(() => {
                return;
            });
    },
    async nuxtClientInit({ commit, dispatch }, { app }) {
        commit('preferencesInCookies');

        setTimeout(() => {
            dispatch('prefersDarkScheme');
        }, 0);
    },
    prefersDarkScheme({ state, commit }) {
        /**
            prefersDarkScheme cookie:
                1: Light
                2: Dark
                3: Auto

            Update app color scheme:
                commit('prefersDarkScheme', Boolean);
                    True: Dark
                    False: Light
         */

        if (process.client) {
            const darkModeCookie = this.$cookies.get('prefersDarkScheme');
            const darkModeWindow = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (darkModeCookie) {
                commit('setObj', { name: 'darkModeCookie', obj: darkModeCookie });
            }
            if (darkModeCookie && darkModeCookie !== '3') {
                commit('setObj', { name: 'prefersDarkScheme', obj: darkModeCookie === '2' });
            } else {
                commit('setObj', { name: 'prefersDarkScheme', obj: darkModeWindow });
            }

            document.documentElement.setAttribute('data-theme', state.prefersDarkScheme ? 'dark' : 'light');

            if (!state.setDMListener) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                    const dmc = this.$cookies.get('prefersDarkScheme');
                    if (dmc && dmc !== '3') return;
                    commit('setObj', { name: 'prefersDarkScheme', obj: e.matches });
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                });
                commit('setObj', { name: 'setDMListener', obj: true });
            }
        }
    },
    async setCookie({ commit, dispatch }, blah) {
        const c = blah.split('=');
        let p, prefs;

        p = this.$cookies.get('preference');
        if (p) prefs = p;
        else prefs = 'necessary,preferences,statistics,marketing';

        const checkPref = prefs.includes('preferences');
        const setExp = days => {
            return Math.round((Date.now() + 3600000 * 24 * days) / 1000);
        };

        switch (c[0]) {
            case 'preference':
                await this.$axios.$post('/api/utilities/cookie', {
                    name: 'preference',
                    value: t[1],
                    expires: setExp(365 * 2),
                });
                commit('preferencesInCookies');
                break;
            case 'prefersDarkScheme':
                // value 1 == light, value 2 == dark, value 3 == auto
                if (checkPref) {
                    await this.$axios.$post('/api/utilities/cookie', {
                        name: 'prefersDarkScheme',
                        value: t[1],
                        expires: setExp(365 * 2),
                    });
                    dispatch('prefersDarkScheme');
                }
                break;
        }
    },
    login({ state, commit, getters }, params) {
        if (getters.myId) return;
        commit('toggle', 'loading');

        return this.$auth
            .loginWith('local', {
                data: { email: params.email.toLowerCase(), password: params.password },
            })
            .then(() => {
                setTimeout(() => {
                    if (getters.myProfile) {
                        if (state.loginPopup) commit('toggle', 'loginPopup');
                        commit('setObj', {
                            name: 'bMessage',
                            obj: {
                                message: `Welcome back, ${getters.myProfile.displayName || getters.myProfile.name}!`,
                            },
                        });
                    }
                }, 0);
            })
            .catch(err => {
                console.warn('Login error :>> ', err);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Login error, please try again', name: 'error' },
                });
                return { statusCode: -1 };
            })
            .finally(() => {
                commit('toggle', 'loading');
            });
    },
    logout({ commit, getters }) {
        if (!getters.myId) return;
        commit('toggle', 'loading');

        this.$auth
            .logout({ data: { id: getters.myId } })
            .then(() => {
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Logged out, see you soon..' },
                });
            })
            .catch(err => {
                console.warn('Logout error :>> ', err);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Logout error, please try again', name: 'error' },
                });
            })
            .finally(() => {
                commit('toggle', 'loading');
            });
    },
    forgotPassword({ commit, getters }, email) {
        if (getters.myId) return;
        commit('toggle', 'loading');
        const baseURL = process.env.NODE_ENV == 'production' ? 'https://brewfoam.com' : 'http://localhost:3000';

        this.$axios
            .$post('/api/users/forgotPassword', { email, baseURL })
            .then(() => {
                commit('setObj', {
                    name: 'bMessage',
                    obj: {
                        message: 'An email has been sent to you with instructions to reset your password',
                        countdown: 6000,
                    },
                });
            })
            .catch(err => {
                console.warn('Forgot password error :>> ', err);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Forgot password error, please try again', name: 'error' },
                });
            })
            .finally(() => {
                commit('toggle', 'loginPopup');
                commit('toggle', 'loading');
                commit('setObj', {
                    name: 'loginPopupObj',
                    obj: { title: 'Login', text: 'Enter your email and password to login' },
                });
            });
    },
    async checkDB({ commit }, params) {
        return await this.$axios
            .$post('/api/users/checkDB', params)
            .then(res => {
                return res;
            })
            .catch(err => {
                console.warn('Check DB error :>> ', err);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Check DB error, please try again', name: 'error' },
                });
            })
            .finally(() => {
                return;
            });
    },
    addUser({ commit, dispatch }, params) {
        commit('toggle', 'loading');

        this.$axios
            .$post('/api/users/addNewUser', params)
            .then(res => {
                if (res.statusCode > 0) {
                    dispatch('login', params);
                } else {
                    console.warn('addUser error :>> ', err);
                    commit('setObj', {
                        name: 'bMessage',
                        obj: { message: 'Add user error, please try again', name: 'error' },
                    });
                }
            })
            .catch(err => {
                console.warn('addUser error :>> ', err);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Add user error, please try again', name: 'error' },
                });
            })
            .finally(() => {
                commit('toggle', 'loading');
                return;
            });
    },
    async deleteUser({ commit, dispatch }, id) {
        commit('toggle', 'loading');

        return await this.$axios
            .$delete(`/api/users/deleteUser/${id}`)
            .then(() => {
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Deleted user', countdown: 6000 },
                });
                dispatch('getAllUsers');
            })
            .catch(err => {
                console.warn('deleteUser error :>> ', err);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Delete user error', name: 'error' },
                });
            })
            .finally(() => {
                commit('toggle', 'loading');
                return;
            });
    },
    filterBeers({ state, commit }, q) {
        if (!q || !q.length) return commit('setObj', { name: 'searchResults', obj: null });
        const arr = state.beers.filter(x => x.beerName.includes(q) || x.brewery.name.includes(q));
        commit('setObj', { name: 'searchQuery', obj: q });
        commit('setObj', { name: 'searchResults', obj: arr });
    },
    async searchDB({ commit }, q) {
        try {
            if (!q || !q.length) {
                commit('setObj', { name: 'searchQuery', obj: '' });
                return commit('setObj', { name: 'searchResults', obj: null });
            }
            return await this.$axios
                .$get('/api/beers/search/' + q)
                .then(res => {
                    commit('setObj', { name: 'searchQuery', obj: q });
                    commit('setObj', { name: 'searchResults', obj: res.results });
                })
                .catch(err => {
                    console.log('Search err :>> ', err);
                })
                .finally(() => {
                    return;
                });
        } catch (err) {
            console.warn('Search DB err :>> ', err);
        }
    },
    async getAllBeers({ commit }) {
        await this.$axios
            .$get('/api/beers/allBeers')
            .then(res => {
                if (res && res.beers && res.breweries) {
                    commit('setObj', { name: 'beers', obj: res.beers });
                    // commit('setObj', { name: 'breweries', obj: res.breweries });
                    // commit('setObj', { name: 'reviews', obj: res.reviews });
                    commit('setObj', { name: 'topBeers', obj: res.topBeers });
                }
            })
            .catch(err => {
                console.warn('Get all error :>> ', err);
            })
            .finally(() => {
                return;
            });
    },
    async getBeer({ commit }, id) {
        return await this.$axios
            .$get(`/api/beers/singleBeer/${id}`)
            .then(res => {
                commit('updateReviewsList', res.reviews);
                commit('updateBeerList', [res.beer]);
            })
            .catch(err => {
                console.warn('Get beer error :>> ', err);
            })
            .finally(() => {
                return;
            });
    },
    async addNewBeer({ commit }, params) {
        commit('toggle', 'loading');

        return await this.$axios
            .$post('/api/beers/addNewBeer', params)
            .then(res => {
                commit('setObj', {
                    name: 'bMessage',
                    obj: {
                        message: 'Added your beer! After review it will be searchable on BrewFoam!',
                        countdown: 6000,
                    },
                });
            })
            .catch(err => {
                console.warn('Add new beer error :>> ', err);
            })
            .finally(() => {
                commit('toggle', 'loading');
                return;
            });
    },
    async getBrewery({ commit }, id) {
        return await this.$axios
            .$get(`/api/breweries/getBrewery/${id}`)
            .then(res => {
                commit('updateBeerList', res.beers);
                commit('updateReviewsList', res.reviews);
                commit('updateBreweryList', res.brewery);
            })
            .catch(err => {
                console.warn('Update brewery rating err :>> ', err);
            })
            .finally(() => {
                return;
            });
    },
    async addReview({ commit }, params) {
        commit('toggle', 'loading');

        return await this.$axios
            .$post('/api/reviews/addReview', params)
            .then(res => {
                console.log('res :>> ', res);
                commit('updateReviewsList', [res.review]);
                commit('updateBeerList', [res.beer]);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Review added', countdown: 4000 },
                });
            })
            .catch(err => {
                console.warn('Add review error :>> ', err);
                commit('setObj', {
                    name: 'bMessage',
                    obj: { message: 'Add review error, please try again', name: 'error' },
                });
            })
            .finally(() => {
                commit('toggle', 'loading');
                return;
            });
    },
    normalizeNamesInDB({}) {
        this.$axios
            .$patch('/api/beers/normalizeNames')
            .then(res => {
                console.log('res :>> ', res);
            })
            .catch(err => {
                console.warn('Axios catch err :>> ', err);
            });
    },
    generalDBUpdate({}) {
        this.$axios
            .$patch('/api/beers/updateDB')
            .then(res => {
                console.log('res :>> ', res);
            })
            .catch(err => {
                console.warn('Axios catch err :>> ', err);
            });
    },
};
