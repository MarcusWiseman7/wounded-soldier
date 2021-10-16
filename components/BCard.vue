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
                <!-- if brewery show it's logo -->
                <div
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
                </div>

                <div class="card__content__info">
                    <!-- if beer show brewery info -->
                    <div class="brewery" v-if="isBeer">
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
                        <span>{{ item.brewery.name }}</span>
                    </div>
                    <span class="name">{{ item.name || item.beerName }}</span>
                    <span>{{ item.style }}</span>
                </div>
            </div>

            <div class="card__content__news" v-if="modifiers.includes('full-card')">
                <clamped-text :text="item.brewery.description"></clamped-text>
            </div>

            <star-rating :count="item.totalNumberOfRatings" :rating="item.averageRating"></star-rating>
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

        &__inner {
            display: flex;
            gap: 10px;
        }

        &__info {
            display: flex;
            flex-direction: column;
            color: var(--color-text-second);
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;

            .name {
                font-weight: 700;
                font-size: 22px;
                color: var(--color-text);
                margin-top: 6px;
            }

            .brewery {
                display: flex;
                align-items: center;
                font-weight: 600;

                /deep/ img {
                    height: 30px;
                    width: 30px;
                    border-radius: 4px;
                    margin-right: 6px;
                }
            }
        }

        &__news {
            font-size: 14px;
            line-height: 20px;
            text-align: justify;
            margin: 14px 0;
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
