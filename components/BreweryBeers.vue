<template>
    <ul v-if="beers">
        <nuxt-link
            v-for="b in beers"
            :key="b._id"
            :to="`/SingleBeer/${b._id}`"
            class="beer"
            custom
            v-slot="{ navigate }"
        >
            <li @click="navigate">
                <b-pic :src="b.logo || breweryLogo ? b.logo || breweryLogo : ''" alt="Logo"></b-pic>

                <div class="beer__info">
                    <div class="beer__top-row">
                        <div>
                            <h2>{{ b.beerName }}</h2>
                            <h3>{{ b.style }}</h3>
                            <p>{{ b.degrees }}/{{ b.abv }}</p>
                        </div>
                        <b-rating :rating="b.averageRating" :size="16" :id="b._id"></b-rating>
                    </div>
                    <p class="beer__notes">{{ b.description }}</p>
                </div>
            </li>
        </nuxt-link>
    </ul>
</template>

<script>
export default {
    name: 'BreweryBeers',
    props: {
        beers: { type: Array, default: () => null },
        breweryLogo: { type: String, default: '' },
    },
};
</script>

<style lang="scss" scoped>
.beer {
    padding: 20px;
    display: flex;
    cursor: pointer;

    @include breakpoint(m) {
        padding: 20px 0;
    }

    img {
        height: 100px;
        width: 100px;
    }

    &__info {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 10px;
    }

    &__top-row {
        width: 100%;
        display: flex;
        justify-content: space-between;

        p {
            font-size: 12px;
        }
    }

    &__notes {
        margin-top: 10px;
        text-align: right;
        font-style: italic;
    }
}
</style>
