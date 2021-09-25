<template>
    <nuxt-link
        v-if="item && item.hasOwnProperty('brewery')"
        :to="`/Beer/${item._id}`"
        class="card no-drag"
        :class="[
            modifiers.map(x => 'card--' + x),
            { disabled: dragging, 'card--desktop': !mobile, 'card--mobile': mobile },
        ]"
    >
        <b-pic
            class="card__bg-img"
            :src="stockPic"
            :modifiers="[modifiers.includes('full-card') ? 'card-bg-large' : 'card-bg']"
        ></b-pic>
        <b-pic
            :src="item.logo || item.brewery.logo"
            alt="logo"
            :modifiers="modifiers.includes('full-card') ? ['card-logo', 'card-logo-large'] : ['card-logo']"
        ></b-pic>

        <div class="card__desc">
            <div>
                <h3>{{ item.beerName }}</h3>
                <div class="card__desc__info">
                    <span class="bolder">{{ item.brewery.name }}</span>
                    <span>{{ item.style }}</span>
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

            <b-rating
                :rating="item.averageRating"
                :count="item.totalNumberOfRatings"
                :id="item._id"
                :size="16"
            ></b-rating>
        </div>
    </nuxt-link>
    <nuxt-link
        v-else-if="item"
        :to="`/Brewery/${item._id}`"
        class="card"
        :class="[modifiers.map(x => 'card--' + x), { disabled: dragging }]"
    >
        <b-pic :modifiers="['card-bg']"></b-pic>
        <b-pic :src="item.logo || item.brewery.logo" alt="logo" :modifiers="['card-logo']"></b-pic>

        <div class="card__desc">
            <h3>{{ item.name }}</h3>
            <h5>{{ item.type }}</h5>
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
            return 'stock/' + this.stockPhotos[Math.floor(Math.random() * this.stockPhotos.length)];
        },
    },
};
</script>

<style lang="scss" scoped>
.disabled {
    pointer-events: none;
}

.card {
    border: 1px solid var(--border-color);
    box-sizing: border-box;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 12px 12px 0;
    background-color: var(--bg);
    overflow: hidden;
    position: relative;

    &__bg-img {
        width: 100%;
        height: 100px;
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
        min-width: 160px;
        max-width: 160px;
    }

    &__desc {
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: var(--color-text);
        width: 100%;
        height: 100%;

        &__info {
            display: flex;
            flex-direction: column;
            color: var(--color-text-second);
            font-size: 14px;
            line-height: 20px;
            margin: 6px 0 14px 0;
            font-weight: 400;

            .bolder {
                font-weight: 600;
            }
        }

        .full-card {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 14px;
        }
    }

    &:hover {
        background-color: var(--bg-third);
    }
}

.underline {
    text-decoration: underline;
    font-size: 12px;
}
</style>
