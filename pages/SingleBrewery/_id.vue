<template>
    <div v-if="brewery" class="brewery">
        <!-- <div class="back" @click="goBackOrIndex">
            <img src="@/assets/icons/arrow_back.svg" alt="Back" />
        </div>
        <div class="brewery__title-row">
            <div class="brewery__title-row--half">
                <b-pic :src="brewery.logo ? brewery.logo : ''" alt="Logo"></b-pic>
            </div>
            <div class="brewery__info brewery__title-row--half">
                <h1>{{ brewery.name }}</h1>
                <h2>{{ brewery.location }}</h2>
                <p>{{ brewery.type }}</p>
            </div>
        </div>

        <div class="brewery__content">
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
import helpers from '@/helpers';

export default {
    name: 'SingleBrewery',
    mixins: [helpers],
    async asyncData({ params, store, redirect }) {
        if (!params.id) return redirect('/');
        if (!store.getters.allBreweries.hasOwnProperty(params.id)) {
            await store.dispatch('getBrewery', params.id);
        }

        const brewery = store.getters.allBreweries[params.id];
        const beers = store.state.beers.filter(x => x.brewery._id == params.id);

        return { brewery, beers };
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.brewery {
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &__title-row {
        display: flex;
        margin-bottom: 40px;

        &--half {
            width: 50%;

            img {
                width: 100px;
            }

            &:first-child {
                padding-right: 10px;
                display: flex;
                justify-content: flex-end;
            }

            &:last-child {
                padding-left: 10px;
            }
        }
    }

    &__content {
        width: 100%;
        max-width: 600px;
    }

    &__info {
        h1 {
            color: var(--color-main);
            font-weight: 500;
        }
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
                border-right: 1px solid var(--color-text-secondary);
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
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    cursor: pointer;
}
</style>
