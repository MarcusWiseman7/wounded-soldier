<template>
    <nuxt-link
        v-if="item && item._id"
        :to="(isBeer ? '/Beer/' : '/Brewery/') + item._id"
        class="card no-drag"
        :class="[
            modifiers.map(x => 'card--' + x),
            { disabled: dragging, 'card--desktop': !mobile, 'card--mobile': mobile },
        ]"
    >
        <div v-if="stockPic" class="card__bg-img" :class="{ 'card__bg-img--large': modifiers.includes('full-card') }">
            <cld-image :public-id="stockPic" alt="beers" fetchFormat="auto" loading="lazy">
                <cld-placeholder type="blur" />
            </cld-image>
        </div>
        <div v-else class="placeholder">
            <BeerSVG></BeerSVG>
        </div>

        <div class="card__content" v-if="isBeer">
            <span class="name">{{ item.name || item.beerName }}</span>
            <span class="style">{{ item.style }}</span>

            <div class="row">
                <!-- brewery info -->
                <b-pill>
                    <template v-slot:icon>
                        <div class="logo">
                            <cld-image
                                v-if="item.brewery.logoPublicId"
                                :public-id="item.brewery.logoPublicId"
                                alt="logo"
                                fetchFormat="auto"
                                loading="lazy"
                            >
                                <cld-placeholder type="blur" />
                            </cld-image>
                            <div v-else class="placeholder">
                                <BeerSVG></BeerSVG>
                            </div>
                        </div>
                    </template>
                    <template v-slot:title>
                        <span>{{ item.brewery.name }}</span>
                    </template>
                </b-pill>

                <!-- rating info -->
                <b-pill :modifiers="['rating']">
                    <template v-slot:icon>
                        <span class="star">★</span>
                    </template>
                    <template v-slot:title>
                        <span>{{ item.averageRating }}</span>
                    </template>
                    <template v-slot:info>
                        <span
                            >({{ item.totalNumberOfRatings }} review{{
                                item.totalNumberOfRatings > 1 ? 's' : ''
                            }})</span
                        >
                    </template>
                </b-pill>
            </div>

            <!-- location -->
            <b-pill v-if="item.brewery.location" :modifiers="['location']">
                <template v-slot:icon>
                    <img src="@/assets/icons/flags/czech.svg" alt="" height="12" />
                </template>
                <template v-slot:title>
                    <span>{{ item.brewery.location }}</span>
                </template>
            </b-pill>

            <!-- <div class="card__content__inner"> -->
            <!-- if brewery show it's logo -->
            <!-- <div
                    v-if="!isBeer"
                    class="card__logo"
                    :class="{ 'card__logo--large': modifiers.includes('full-card') }"
                >
                    <cld-image
                        v-if="item.logoPublicId"
                        :public-id="item.logoPublicId"
                        alt="logo"
                        fetchFormat="auto"
                        loading="lazy"
                    >
                        <cld-placeholder type="blur" />
                    </cld-image>
                    <BeerSVG v-else></BeerSVG>
                </div> -->

            <!-- <div class="card__content__info"> -->

            <!-- <div class="brewery" ></div> -->

            <!-- </div> -->
            <!-- </div> -->

            <!-- <div class="card__content__news" v-if="modifiers.includes('full-card')">
                <clamped-text :text="item.brewery.description"></clamped-text>
            </div> -->

            <!-- <star-rating :count="item.totalNumberOfRatings" :rating="item.averageRating"></star-rating> -->
        </div>
    </nuxt-link>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'BCard',
    props: {
        item: { type: Object, required: true },
        modifiers: { type: Array, default: () => [] },
        dragging: { type: Boolean, default: false },
    },
    computed: {
        ...mapState(['stockPhotos']),
        mobile() {
            return this.$device.isMobile;
        },
        stockPic() {
            return this.stockPhotos[Math.floor(Math.random() * this.stockPhotos.length)];
        },
        isBeer() {
            return this.item.hasOwnProperty('brewery');
        },
    },
};
</script>

<style lang="scss" scoped>
.disabled {
    pointer-events: none;
}

.card {
    border: 1px solid var(--color-border);
    box-sizing: border-box;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 12px 12px 0;
    background-color: var(--color-bg);
    overflow: hidden;
    position: relative;

    &__bg-img {
        width: 100%;
        height: var(--height-card-bgimage);

        /deep/ img {
            height: var(--height-card-bgimage);
            width: 100%;
            min-height: var(--height-card-bgimage);
            object-fit: cover;
            border-radius: 12px 12px 0 0;
        }

        &--large {
            height: var(--height-card-bgimage-large);
            /deep/ img {
                height: var(--height-card-bgimage-large);
                min-height: var(--height-card-bgimage-large);
                object-fit: cover;
                border-radius: 12px 12px 0 0;
            }
        }
    }

    &__content {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--color-text);
        width: 100%;
        height: 100%;
    }

    .name {
        font-size: 16px;
        font-weight: 500;
    }

    .style {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-second);
    }

    .logo {
        height: 26px;
        width: 26px;

        /deep/ img {
            height: 26px;
            width: 26px;
            border-radius: 50%;
        }
    }

    .star {
        color: gold;
        height: 100%;
        display: flex;
        align-items: center;
        padding-bottom: 2px;
    }

    .row {
        display: flex;
        gap: 6px;
        margin-top: 4px;
    }

    .news {
        font-size: 14px;
        line-height: 20px;
        text-align: justify;
        margin: 14px 0;
    }

    &--desktop {
        width: calc(25% - 9px);

        &.card--full-card {
            width: calc(50% - 6px);

            &:nth-child(2n) {
                margin-right: 0;
            }
        }

        .card__bg-img {
            width: 100%;
            height: 160px;
        }
    }

    &--mobile {
        min-width: 260px;
        max-width: 260px;

        &.card--full-card {
            min-width: 100%;
            max-width: 100%;
        }
    }

    &:hover,
    &:active {
        .card__bg-img::after {
            content: '';
            background: var(--color-hover);
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }
    }
}
</style>
