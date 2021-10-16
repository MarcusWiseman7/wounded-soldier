<template>
    <div v-if="beer" class="beer">
        <div class="beer__logo-row">
            <div class="back" :class="{ 'back--mobile': mobile }" @click="goBack">
                <back-icon></back-icon>
            </div>
        </div>

        <div class="beer__label">
            <nuxt-link :to="`/Brewery/${beer.brewery._id}`" class="logo">
                <div v-if="beer.logoPublicId || beer.brewery.logoPublicId">
                    <cld-image
                        :public-id="beer.logoPublicId || beer.brewery.logoPublicId"
                        alt="logo"
                        fetchFormat="auto"
                        loading="lazy"
                    >
                        <cld-placeholder type="blur" />
                    </cld-image>
                </div>
                <div v-else class="placeholder">
                    <BeerSVG></BeerSVG>
                </div>
            </nuxt-link>
            <div class="info">
                <div class="name">{{ beer.beerName }}</div>
                <nuxt-link :to="`/Brewery/${beer.brewery._id}`" class="brewery">
                    {{ beer.brewery.name }}
                </nuxt-link>
                <div class="style">{{ beer.style }}</div>
            </div>
        </div>

        <div v-if="!reviewing" class="beer__content">
            <!-- <b-rating :id="'single-beer-' + id" :rating="beer.averageRating"></b-rating> -->

            <div class="beer__stats">
                <div class="beer__stats--half">
                    <div class="beer__stat">{{ beer.averageRating }}&#9733;</div>
                    <div class="beer__stat">
                        {{ beer.totalNumberOfRatings }} rating{{ beer.totalNumberOfRatings > 1 ? 's' : '' }}
                    </div>
                </div>

                <div class="beer__stats--half">
                    <!-- <div class="beer__stat">{{ beer.abv || '-' }} abv</div> -->
                    <div class="beer__stat">{{ beer.degrees }}&deg;</div>
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
import BackIcon from '@/assets/icons/general/arrow_back.svg?inline';

export default {
    name: 'Beer',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
    components: { BackIcon },
    data() {
        return {
            reviewing: false,
        };
    },
    computed: {
        ...mapGetters(['myId']),
        mobile() {
            return this.$device.isMobile;
        },
        reviews() {
            return this.$store.state.reviews.filter(x => x.beer === this.beer._id);
        },
        breweryBeers() {
            return this.$store.state.beers.filter(x => x.brewery._id === this.beer.brewery._id);
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
        this.$store.dispatch('getReviews', this.id);
        this.$store.dispatch('getBreweryBeers', this.beer.brewery._id);
    },
    async asyncData({ params, store, redirect, error }) {
        if (!params.id) return redirect('/');
        const id = params.id;

        if (!store.getters.allBeers.hasOwnProperty(id)) {
            const res = await store.dispatch('getBeer', id);
            if (!res) error({ statusCode: 404 });
        }

        const beer = store.getters.allBeers[id];
        return { beer, id };
    },
};
</script>

<style lang="scss" scoped>
.button {
    margin-bottom: 20px;
}

.beer {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &__logo-row {
        display: flex;
        justify-content: space-between;
        width: 100%;

        .back {
            padding: 10px 20px 20px 20px;
            cursor: pointer;

            &--mobile {
                padding: 8px 16px 16px 16px;

                svg {
                    height: 24px;
                    width: 24px;
                }
            }
        }
    }

    &__label {
        width: 100%;
        display: flex;
        margin-top: 30px;
        gap: 10px;
        overflow: hidden;

        .logo {
            /deep/ img {
                height: 100px;
                width: 100px;
                border-radius: 4px;
            }
        }

        .info {
            display: flex;
            flex-flow: column wrap;
            gap: 4px;
        }

        .name {
            font-size: 48px;
            // media queries for font-size
            font-weight: 600;
            overflow-wrap: break-word;
            hyphens: auto;
        }

        .brewery {
            font-size: 24px;
            overflow-wrap: break-word;
            hyphens: auto;
        }

        .style {
            font-size: 22px;
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
</style>
