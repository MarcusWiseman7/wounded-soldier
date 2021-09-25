<template>
    <div class="b-pic" :class="modifiers.map(m => 'b-pic--' + m)">
        <cld-image v-if="psrc" :public-id="psrc" alt="logo" fetchFormat="auto" loading="lazy">
            <cld-placeholder type="pixelate" />
        </cld-image>
        <div v-else class="placeholder">
            <BeerSVG></BeerSVG>
        </div>
    </div>
</template>

<script>
import BeerSVG from '@/components/BeerSVG?inline';

export default {
    name: 'BPic',
    components: { BeerSVG },
    props: {
        src: { type: String, required: false },
        alt: { type: String, required: false },
        modifiers: { type: Array, default: () => [] },
    },
    computed: {
        psrc() {
            return this.$cloudinary.image.url(this.src, {});
        },
    },
};
</script>

<style lang="scss" scoped>
.b-pic {
    /deep/ img {
        height: 100%;
        width: 100%;
    }

    &--card-bg {
        /deep/ img {
            height: 100px;
            min-height: 100px;
            object-fit: cover;
            border-radius: 12px 12px 0 0;
        }
    }

    &--card-bg-large {
        /deep/ img {
            height: 160px;
            min-height: 160px;
            object-fit: cover;
            border-radius: 12px 12px 0 0;
        }
    }

    &--card-logo {
        min-height: 50px;
        min-width: 50px;
        height: 50px;
        width: 50px;
        border-radius: 4px;
        z-index: 4;
        transform: translate3d(0, -60%, 0);
        box-shadow: 0 0 4px rgba($color: #fff, $alpha: 0.08);

        /deep/ img {
            height: 50px;
            width: 50px;
            border-radius: 4px;
        }
    }

    &--card-logo-large {
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
