<template>
    <div class="b-pic">
        <img v-if="src" :src="src" :srcset="srcset" :alt="alt" />
        <div v-else class="placeholder">
            <BeerSVG></BeerSVG>
        </div>
    </div>
</template>

<script>
import BeerSVG from '@/components/BeerSVG';

export default {
    name: 'BPic',
    components: { BeerSVG },
    props: {
        src: { type: String, required: false },
        srcset: { type: String, required: false },
        alt: { type: String, required: false },
    },
};
</script>

<style lang="scss" scoped>
.b-pic {
    min-height: 100px;
    min-width: 100px;
    height: 100px;
    width: 100px;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.08);

    img {
        height: 100%;
        width: 100%;
        border-radius: 4px;
    }
}

.placeholder {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: --color-text-secondary;
    border-radius: 4px;
    opacity: 0.3;
}
</style>
