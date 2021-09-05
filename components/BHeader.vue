<template>
    <div class="b-header">
        <div class="b-header--top-row">
            <div
                v-if="mobile"
                class="b-header__menu-btn"
                @click="(openMenu = !openMenu), $emit('expand-header', openMenu)"
            >
                <img src="@/assets/icons/hamburger.svg" alt="Menu" />
            </div>
            <div v-if="marcus" class="b-header__title">
                <nuxt-link to="/">
                    <span>BrewFoam</span>
                </nuxt-link>
                <div class="b-header--center" @click="navClick(4)">
                    <img v-if="!mobile" src="@/assets/icons/beer.svg" alt="beer" />
                </div>
            </div>
            <nuxt-link v-else to="/" class="b-header__title">
                <span>BrewFoam</span>
                <img v-if="!mobile" src="@/assets/icons/beer.svg" alt="beer" />
            </nuxt-link>
        </div>
        <div class="b-header__actions" v-if="openMenu || !mobile">
            <b-button v-if="!myId" group="main" modifier="outline" @clicked="navClick(0)">Login</b-button>
            <b-button
                v-if="!myId"
                group="main"
                modifier="outline"
                class="b-header__actions--last"
                @clicked="navClick(1)"
                >Create account</b-button
            >
            <b-button
                v-if="myId"
                group="main"
                modifier="outline"
                :disabled="$route.name == 'AddBeer'"
                @clicked="navClick(2)"
                >Add new beer</b-button
            >
            <b-button v-if="myId" group="main" modifier="outline" class="b-header__actions--last" @clicked="navClick(3)"
                >Logout</b-button
            >
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    name: 'BHeader',
    data() {
        return {
            openMenu: false,
        };
    },
    computed: {
        ...mapGetters(['myId', 'marcus']),
        mobile() {
            return this.$device.isMobile;
        },
    },
    methods: {
        navClick(i) {
            switch (i) {
                case 0:
                    this.$store.commit('toggle', 'loginPopup');
                    break;
                case 1:
                    this.$router.push({ name: 'SignUp' });
                    break;
                case 2:
                    this.$router.push({ name: 'AddBeer' });
                    break;
                case 3:
                    this.$store.dispatch('logout');
                    break;
                case 4:
                    this.$router.push({ name: 'Marcus' });
                    break;
            }
            this.openMenu = false;
            this.$emit('expand-header', this.openMenu);
        },
    },
};
</script>

<style lang="scss" scoped>
.b-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
    background-color: #fff;
    min-height: 75px;

    @include breakpoint(m) {
        height: 160px;
        padding: 40px;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    &--center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &--top-row {
        display: flex;
    }

    &__menu-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }

    &__title {
        display: flex;
        align-items: center;

        span {
            color: var(--color-main);
            font-size: 60px;
            font-weight: 300;
            margin: 0 6px 0 0;
        }

        img {
            height: 60px;
        }
    }

    &__actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        padding: 20px;

        &--last {
            margin-left: 10px !important;
        }

        @include breakpoint(m) {
            width: 30%;
        }
    }
}
</style>
