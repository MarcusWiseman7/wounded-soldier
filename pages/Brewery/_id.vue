<template>
    <div v-if="brewery" class="brewery">
        <div class="brewery__top">
            <div class="back" @click="$goBackOrIndex">
                <back-icon></back-icon>
            </div>

            <div class="name">{{ brewery.name }}</div>
        </div>

        <div class="brewery__content">
            <div class="brewery__logo">
                <cld-image
                    v-if="brewery.logoPublicId"
                    :public-id="brewery.logoPublicId"
                    alt="logo"
                    fetchFormat="auto"
                    loading="lazy"
                >
                    <cld-placeholder type="blur" />
                </cld-image>
                <BeerSVG v-else></BeerSVG>
            </div>

            <div class="brewery__info">
                <div class="type">
                    <span>{{ brewery.type }}</span>
                    <star-rating
                        :count="brewery.totalNumberOfBeerRatings"
                        :rating="brewery.averageBeerRating"
                    ></star-rating>
                </div>
                <div class="location">{{ brewery.location }}</div>
                <div class="description">
                    <clamped-text :text="brewery.description"></clamped-text>
                </div>
            </div>
        </div>

        <div class="brewery__beers">
            <div class="title">{{ brewery.name }} beers</div>
            <b-horizontal-wrapper v-slot="slotProps" :shift="248" :snapping="true" :scrollid="'scroll-top-beers'">
                <b-card
                    v-for="(item, i) in beers"
                    :key="'b-card-' + i"
                    :modifiers="['mobile']"
                    :item="item"
                    :hovered="slotProps.isHovered"
                    :dragging="slotProps.isDragging"
                ></b-card>
            </b-horizontal-wrapper>
        </div>
    </div>
</template>

<script>
import BackIcon from '@/assets/icons/general/arrow_back.svg?inline';

export default {
    name: 'Brewery',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
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

        .back {
            padding: 0 20px 20px 20px;
            cursor: pointer;

            &--mobile {
                padding: 8px 16px 16px 16px;

                svg {
                    height: 24px;
                    width: 24px;
                }
            }
        }

        .name {
            font-weight: 600;
            font-size: 26px;
        }
    }

    &__content {
        display: flex;
        gap: 20px;
    }

    &__logo {
        /deep/ img {
            height: 100px;
            width: 100px;
            border-radius: 4px;
        }
    }

    &__info {
        .type {
            display: flex;
            gap: 14px;
            font-size: 18px;
        }

        .location {
            font-weight: 500;
            font-size: 18px;
            margin-top: 4px;
        }

        .description {
            font-weight: 500;
            font-size: 14px;
            line-height: 22px;
            margin-top: 16px;
            text-align: justify;
        }
    }

    &__beers {
        margin-top: 40px;

        .title {
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 16px;
        }
    }
}
</style>
