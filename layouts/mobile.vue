<template>
    <div id="app" :class="{ 'dark-mode': darkMode }">
        <header>
            <menu-icon class="hamburger" @click="openMenu = true"></menu-icon>
        </header>

        <transition name="slide-side">
            <main-nav v-if="openMenu" :mobile="true" @close="openMenu = false"></main-nav>
        </transition>

        <div class="content">
            <Nuxt />
        </div>
        <b-footer></b-footer>

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
import MenuIcon from '@/assets/icons/nav/menu.svg?inline';

export default {
    components: { MenuIcon },
    data() {
        return {
            openMenu: false,
        };
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
header {
    background-color: #3c3737;

    .hamburger {
        margin: 11px 28px;
        height: 24px;
        width: 24px;
    }
}
</style>
