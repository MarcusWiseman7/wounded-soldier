<template>
    <div id="app">
        <header>
            <menu-icon class="hamburger" @click="openMenu = true"></menu-icon>
        </header>
        <div v-if="$route.name === 'index'" class="spacer"></div>

        <transition name="slide-side">
            <main-nav v-if="openMenu" :mobile="true" @close="openMenu = false"></main-nav>
        </transition>

        <div class="content" :class="{ 'content--index': $route.name === 'index' }">
            <div class="main">
                <div v-if="$route.name === 'index'" class="foam">
                    <foam-b-g></foam-b-g>
                </div>
                <div class="page-inner">
                    <Nuxt />
                </div>
            </div>
        </div>

        <b-spinner v-if="loading"></b-spinner>

        <transition name="slideandfade">
            <b-message v-if="bMessage"></b-message>
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import FoamBG from '@/assets/icons/layout/foam.svg?inline';
import MenuIcon from '@/assets/icons/nav/menu.svg?inline';

export default {
    name: 'mobile',
    components: { MenuIcon, FoamBG },
    data() {
        return {
            openMenu: false,
        };
    },
    computed: {
        ...mapState(['loading', 'bMessage']),
    },
};
</script>

<style lang="scss" scoped>
header {
    height: 46px;
    background: #3c3737;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: var(--z-mobile-header);

    .hamburger {
        margin: 11px 28px;
        height: 24px;
        width: 24px;
    }
}

.spacer {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    height: 86px;
    z-index: var(--z-mobile-header-spacer);
    background: #3c3737;
}

.content {
    padding-top: 46px;

    &--index {
        padding-top: 130px;
    }
}

.main {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--bg-second);

    .foam {
        position: absolute;
        right: -3px;
        top: -67px;
        width: 58%;
        z-index: var(--z-foam);
    }
}

// foam svg
.color-object {
    fill: var(--bg-third);
}
</style>
