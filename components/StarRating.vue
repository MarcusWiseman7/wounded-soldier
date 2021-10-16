<template>
    <div class="rating" v-if="count">
        <span class="rating__rate">{{ rating }}</span>
        <span
            class="rating__star"
            v-for="n in 5"
            :key="n"
            :data-percent-fill="rating >= n ? 100 : n - rating >= 1 ? 0 : n - rating"
            attribute="★"
        >
            ★
        </span>
        <span class="rating__count">({{ count }} rating{{ count > 1 ? 's' : '' }})</span>
    </div>
    <div class="rating" v-else>
        <span class="rating__count">Be the first to rate it!</span>
    </div>
</template>

<script>
export default {
    name: 'StarRating',
    props: {
        count: { type: Number, required: true },
        rating: { type: Number, required: true },
    },
};
</script>

<style lang="scss" scoped>
.rating {
    display: flex;
    font-size: 16px;
    font-weight: 00;
    line-height: 20px;

    span {
        display: flex;
        align-items: center;
        height: 100%;
    }

    &__rate {
        margin-right: 6px;
    }

    &__star {
        position: relative;
        font-size: 18px;
        width: 16px;

        &::before {
            content: attr(attribute);
            color: gold;
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            overflow: hidden;
        }
    }

    &__star[data-percent-fill='100'] {
        &::before {
            width: 100%;
        }
    }
    &__star[data-percent-fill='0'] {
        &::before {
            width: 0;
        }
    }

    &__count {
        color: var(--color-info);
        font-size: 10px;
        margin-left: 6px;
    }
}
</style>
