<template>
    <div v-if="brewery" class="brewery">
        <div class="brewery__top">
            <div class="back" @click="$goBackOrIndex">
                <back-icon></back-icon>
            </div>

            <h1>{{ brewery.name }}</h1>
        </div>

        <div class="brewery__content">
            <div class="brewery__logo">
                <div class="brewery__logo__pic">
                    <b-pic :publicId="brewery.logoPublicId ? brewery.logoPublicId : ''" alt="Logo"></b-pic>
                </div>
            </div>
            <div class="brewery__info">
                <h2>{{ brewery.location }}</h2>
                <p>{{ brewery.type }}</p>
            </div>
        </div>

        <!-- <div class="brewery__content">
            <b-rating :id="'single-brewery-' + $route.params.id" :rating="brewery.averageBeerRating"></b-rating>

            <div class="brewery__stats">
                <div class="brewery__stats--half">
                    <div class="brewery__stat">{{ brewery.totalNumberOfBeerRatings }} reviews</div>
                    <div class="brewery__stat"></div>
                </div>
                <div class="brewery__stats--half">
                    <div class="brewery__stat"></div>
                    <div class="brewery__stat"></div>
                </div>
            </div>

            <div class="brewery__beers-headline">
                <h2>{{ brewery.name }} beers</h2>
            </div>

            <brewery-beers :beers="beers" :breweryLogo="brewery.logo"></brewery-beers>
        </div> -->
    </div>
</template>

<script>
import BackIcon from '@/assets/icons/general/arrow_back.svg?inline';

export default {
    name: 'Brewery',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
    // transition(to, from) {
    //     if (!$nuxt.$device.isMobile || !from) return;
    //     return $nuxt.$store.state.transitionName;
    // },
    components: { BackIcon },
    async asyncData({ params, store, redirect }) {
        if (!params.id) return redirect('/');
        if (!store.getters.allBreweries.hasOwnProperty(params.id)) {
            await store.dispatch('getBrewery', params.id);
        }

        const brewery = store.getters.allBreweries[params.id];
        const beers = store.state.beers.filter(x => x.brewery._id == params.id);

        return { brewery, beers };
    },
};
</script>

<style lang="scss" scoped>
.brewery {
    &__top {
        display: flex;
    }

    &__content {
        display: flex;
    }

    &__logo {
        width: 40%;
        display: flex;
        justify-content: flex-end;
        padding-right: 40px;

        &__pic {
            width: 160px;
            height: 160px;
        }
    }

    &__info {
    }

    &__stats {
        display: flex;
        width: 100%;
        max-width: 800px;
        margin: 40px 0;
        height: 140px;

        &--half {
            width: 50%;

            &:first-child {
                border-right: 1px solid var(--color-text-second);
            }
        }
    }

    &__stat {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        height: 50%;
    }

    &__beers-headline {
        text-align: center;
        margin: 40px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-main);
    }
}

.back {
    // position: absolute;
    // left: 0;
    // top: 0;
    padding: 0 20px 20px 20px;
    cursor: pointer;
}
</style>
