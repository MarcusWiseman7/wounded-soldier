<template>
    <div v-if="beer" class="beer">
        <div class="beer__logo-row">
            <div class="back" :class="{ 'back--mobile': mobile }" @click="goBack">
                <back-icon></back-icon>
            </div>
        </div>

        <div class="beer__can">
            <div class="beer__label">
                <nuxt-link :to="`/Brewery/${beer.brewery._id}`" class="brewery">
                    {{ beer.brewery.name }}
                </nuxt-link>
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
                <div class="name">{{ beer.beerName }}</div>
                <div class="info">
                    <div class="style">{{ beer.style }}</div>
                </div>
            </div>
        </div>

        <div class="beer__content" v-if="!reviewing">
            <div class="beer__stats">
                <div class="beer__stats--half">
                    <div class="beer__stat">{{ beer.averageRating }}&#9733;</div>
                    <div class="beer__stat">
                        {{ beer.totalNumberOfRatings }} rating{{ beer.totalNumberOfRatings > 1 ? 's' : '' }}
                    </div>
                </div>

                <div class="beer__stats--half">
                    <div class="beer__stat">{{ beer.degrees }}&deg;</div>
                    <div class="beer__stat">{{ beer.bi || '-' }} bi</div>
                </div>
            </div>

            <div class="beer__actions">
                <b-button class="button" group="main" modifier="outline" @clicked="checkIfLogged">Add review</b-button>
            </div>

            <beer-reviews :reviews="reviews"></beer-reviews>
        </div>

        <div class="beer__brewery-beers" v-if="!reviewing">
            <div class="title">More {{ beer.brewery.name }} beers</div>
            <b-horizontal-wrapper v-slot="slotProps" :shift="248" :snapping="true" :scrollid="'scroll-top-beers'">
                <b-card
                    v-for="(item, i) in breweryBeers"
                    :key="'b-card-' + i"
                    :modifiers="['mobile']"
                    :item="item"
                    :hovered="slotProps.isHovered"
                    :dragging="slotProps.isDragging"
                ></b-card>
            </b-horizontal-wrapper>
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
            return this.$store.state.beers.filter(
                x => x.brewery._id === this.beer.brewery._id && x._id !== this.beer._id
            );
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

    &__can {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    &__label {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        border-radius: 16px;
        padding: 80px 30px;
        gap: 6px;
        // box-shadow: 0 0 5px 3px rgba(255, 255, 255, 0.2);
        background: silver;

        .logo {
            /deep/ img {
                height: 300px;
                width: 250px;
                border-radius: 50%;
            }
        }

        .info {
            display: flex;
            flex-flow: column wrap;
            gap: 4px;
        }

        .name {
            font-size: 36px;
            // media queries for font-size
            font-weight: 600;
            overflow-wrap: break-word;
            hyphens: auto;
            background: cornflowerblue;
            padding: 6px 10px;
            text-align: center;
        }

        .brewery {
            font-size: 36px;
            overflow-wrap: break-word;
            hyphens: auto;
            color: var(--color-text);
            text-align: center;
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

    &__brewery-beers {
        margin-top: 40px;

        .title {
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 16px;
        }
    }
}
</style>
