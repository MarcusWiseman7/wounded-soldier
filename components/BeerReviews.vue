<template>
    <ul v-if="reviews">
        <li v-for="r in reviews" :key="r._id" class="review">
            <b-pic :src="r.pic ? r.pic : ''" alt="Review pic"></b-pic>

            <div class="review__info">
                <div class="review__top-row">
                    <div>
                        <h3 v-if="r.reviewer">{{ r.reviewer.displayName || r.reviewer.name }}</h3>
                        <h3 v-else>Phil</h3>
                        <p>{{ prettyDate(r.date || r.dateCreated) }}</p>
                    </div>
                    <b-rating :rating="r.rating" :size="16" :id="r._id"></b-rating>
                </div>
                <p v-if="r.notes && r.notes.length > 0" class="review__notes">"{{ r.notes }}"</p>
            </div>
        </li>
    </ul>
</template>

<script>
import helpers from '@/helpers';

export default {
    name: 'BeerReviews',
    mixins: [helpers],
    props: {
        reviews: { type: Array, default: () => null },
    },
};
</script>

<style lang="scss" scoped>
.review {
    padding: 20px;
    display: flex;
    align-items: flex-start;

    @include breakpoint(m) {
        padding: 20px 0;
    }

    &__info {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 8px 10px;
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
