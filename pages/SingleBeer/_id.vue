<template>
    <div v-if="beer" class="beer page-inner">
        <div class="back" @click="goBack">
            <img src="@/assets/icons/arrow_back.svg" alt="Back" />
        </div>
        <div class="beer__title-row">
            <div class="beer__title-row--half">
                <div class="beer__logo">
                    <nuxt-link :to="`/SingleBrewery/${beer.brewery._id}`">
                        <b-pic
                            :src="beer.logo || beer.brewery.logo ? beer.logo || beer.brewery.logo : ''"
                            alt="Logo"
                        ></b-pic>
                    </nuxt-link>
                </div>
            </div>
            <div class="beer__info beer__title-row--half">
                <nuxt-link :to="`/SingleBrewery/${beer.brewery._id}`">
                    <h1>{{ beer.brewery.name }}</h1>
                </nuxt-link>
                <h2>{{ beer.beerName }}</h2>
                <p>{{ beer.style }}</p>
            </div>
        </div>

        <div v-if="!reviewing" class="beer__content">
            <b-rating :id="'single-beer-' + id" :rating="beer.averageRating"></b-rating>

            <div class="beer__stats">
                <div class="beer__stats--half">
                    <div class="beer__stat">{{ beer.degrees }}</div>
                    <div class="beer__stat">{{ beer.totalNumberOfRatings }} reviews</div>
                </div>
                <div class="beer__stats--half">
                    <div class="beer__stat">{{ beer.abv || '-' }} abv</div>
                    <div class="beer__stat">{{ beer.bi || '-' }} bi</div>
                </div>
            </div>

            <div class="beer__actions">
                <b-button class="button" group="main" modifier="outline" @clicked="checkIfLogged">Add review</b-button>
            </div>

            <beer-reviews :reviews="reviews"></beer-reviews>
        </div>
        <beer-review-form v-else :beer="beer" @close="reviewing = false"></beer-review-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import helpers from '@/helpers';

export default {
    name: 'SingleBeer',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
    transition(to, from) {
        if (!$nuxt.$device.isMobile || !from) return;
        const name = to.name === 'SingleBeer-id' ? 'page-forward' : 'page-back';
        return { name, mode: '' };
    },
    mixins: [helpers],
    async asyncData({ params, store, redirect }) {
        if (!params.id) return redirect('/');
        if (!store.getters.allBeers.hasOwnProperty(params.id)) {
            await store.dispatch('getBeer', params.id);
        }
        const beer = store.getters.allBeers[params.id];
        const reviews = store.state.reviews.filter(x => x.beer == beer._id);
        return { beer, reviews };
    },
    data() {
        return {
            reviewing: false,
        };
    },
    computed: {
        ...mapGetters(['allBeers', 'myId']),
        id() {
            return this.$route.params.id;
        },
    },
    methods: {
        goBack() {
            if (this.reviewing) this.reviewing = false;
            else this.$goBackOrIndex();
        },
        checkIfLogged() {
            if (!this.myId) {
                this.$store.commit('toggle', 'loginPopup');
            } else {
                this.reviewing = true;
            }
        },
    },
    created() {
        if (!this.$route.params || !this.$route.params.hasOwnProperty('id') || !this.$route.params.id) {
            this.$router.replace('/');
        }
    },
};
</script>

<style lang="scss" scoped>
.button {
    margin-bottom: 20px;
}

.beer {
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
        padding-right: 20px;

        h1 {
            color: var(--color-main);
            font-weight: 500;
            cursor: pointer;
            word-wrap: break-word;
        }

        h2 {
            word-wrap: break-word;
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

    &__actions {
        padding: 0 10px;
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
