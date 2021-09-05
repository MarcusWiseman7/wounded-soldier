<template>
    <div id="app" :class="{ 'dark-mode': darkMode }">
        <header>
            <div class="logo-holder">
                <img class="beer-icon" src="@/assets/icons/white-beer.svg" alt="Beer" />
            </div>
            <h1>Wounded Soldier</h1>
        </header>

        <div class="content">
            <div class="left-aside">
                <main-nav></main-nav>
            </div>

            <div class="main">
                <div class="foam">
                    <foam-b-g></foam-b-g>
                </div>
                <Nuxt />
            </div>

            <div class="right-aside"></div>
        </div>

        <b-popup
            v-if="loginPopup"
            :title="loginPopupObj.title"
            :text="loginPopupObj.text"
            :modifiers="['autoWidth']"
            @close="closeLoginPopup"
        >
            <template v-slot:body>
                <login-signup></login-signup>
            </template>
        </b-popup>

        <b-spinner v-if="loading"></b-spinner>

        <transition name="slideandfade">
            <b-message v-if="bMessage"></b-message>
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import FoamBG from '@/assets/icons/foam.svg?inline';

export default {
    name: 'Desktop',
    components: { FoamBG },
    data() {
        return {};
    },
    computed: {
        ...mapState(['loading', 'bMessage', 'loginPopup', 'loginPopupObj', 'darkMode']),
    },
    methods: {
        closeLoginPopup() {
            this.$store.commit('toggle', 'loginPopup');
            this.$store.commit('setObj', {
                name: 'loginPopupObj',
                obj: { title: 'Login', text: 'Enter your email and password to login' },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    display: flex;
}

header {
    display: flex;
    align-items: center;
    padding: 70px 0 20px 60px;

    h1 {
        font-size: 26px;
        margin-left: 20px;
    }
}

.logo-holder {
    height: 70px;
    width: 70px;
    background-color: var(--color-main);
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        height: 45px;
        width: 45px;
    }
}

.main {
    width: 55%;
    position: relative;

    .foam {
        position: absolute;
        right: 33px;
        top: -120px;
        z-index: -1;
    }
}

.left-aside {
    width: 25%;
    position: relative;
    padding: 0 0 0 35px;
}

.right-aside {
    width: 20%;
}
</style>
