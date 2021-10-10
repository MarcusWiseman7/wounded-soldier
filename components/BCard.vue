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

        <div class="card__content">
            <div class="card__content__inner">
                <div class="card__content__desc">
                    <div
                        v-if="publicId"
                        class="card__logo"
                        :class="{ 'card__logo--large': modifiers.includes('full-card') }"
                    >
                        <cld-image :public-id="publicId" alt="logo" fetchFormat="auto" loading="lazy">
                            <cld-placeholder type="blur" />
                        </cld-image>
                    </div>
                    <div v-else class="placeholder">
                        <BeerSVG></BeerSVG>
                    </div>

                    <div class="card__content__names">
                        <h3>{{ item.name || item.beerName }}</h3>
                        <span class="bolder" v-if="item.brewery">{{ item.brewery.name }}</span>
                        <span>{{ item.style }}</span>
                    </div>
                </div>

                <div v-if="modifiers.includes('full-card')" class="full-card">
                    <v-clamp :max-lines="2" tag="p" ellipsis="">
                        <template>{{ item.brewery.description }}</template>
                        <template v-slot:after="{ clamped }">
                            <span v-if="clamped">... <span class="underline">more</span></span>
                        </template>
                    </v-clamp>
                </div>
            </div>

            <div class="rating">
                <span :class="{ 'rating--gold': item.averageRating > 4.5 }">{{ item.averageRating }}&#9733;</span>
                <span class="rating__count"
                    >{{ item.totalNumberOfRatings }} rating{{ item.totalNumberOfRatings > 1 ? 's' : '' }}</span
                >
            </div>
        </div>
    </nuxt-link>
</template>

<script>
import VClamp from 'vue-clamp';
import { mapState } from 'vuex';

export default {
    name: 'BCard',
    props: {
        item: { type: Object, default: () => null },
        modifiers: { type: Array, default: () => [] },
        dragging: { type: Boolean, default: false },
    },
    components: { VClamp },
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
        publicId() {
            return this.item.logoPublicId || (this.item.hasOwnProperty('brewery') && this.item.brewery.logoPublicId);
        },
    },
};
</script>

<style lang="scss" scoped>
.disabled {
    pointer-events: none;
}

.rating {
    display: flex;
    font-size: 16px;
    line-height: 20px;

    span {
        display: flex;
        align-items: center;
        height: 100%;
    }

    &__count {
        color: var(--color-info);
        font-size: 10px;
        margin-left: 6px;
    }

    &--gold {
        color: gold;
    }
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

    &__logo {
        min-height: 60px;
        min-width: 60px;
        height: 60px;
        width: 60px;
        border-radius: 4px;
        z-index: 4;
        box-shadow: 0 0 4px rgba($color: #fff, $alpha: 0.08);

        /deep/ img {
            height: 60px;
            width: 60px;
            border-radius: 4px;
        }

        &--large {
            min-height: 80px;
            min-width: 80px;
            height: 80px;
            width: 80px;

            /deep/ img {
                height: 80px;
                width: 80px;
            }
        }
    }

    &--desktop {
        width: calc(25% - 9px);

        // &:nth-child(4n) {
        //     margin-right: 0;
        // }

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

    &__content {
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: var(--color-text);
        width: 100%;
        height: 100%;

        &__desc {
            display: flex;
            margin-bottom: 20px;
        }

        &__names {
            display: flex;
            flex-direction: column;
            color: var(--color-text-second);
            font-size: 14px;
            line-height: 20px;
            margin-left: 10px;
            font-weight: 400;

            .bolder {
                font-weight: 600;
            }

            h3 {
                color: var(--color-text);
            }
        }

        .full-card {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 14px;
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

.underline {
    text-decoration: underline;
    font-size: 12px;
}
</style>
