<template>
    <div class="b-pic" :class="modifiers.map(m => 'b-pic--' + m)">
        <cld-image v-if="publicId" :public-id="publicId" alt="logo" fetchFormat="auto" loading="lazy">
            <cld-placeholder type="blur" />
        </cld-image>

        <img v-else-if="src" :src="src" :alt="alt" />

        <div v-else class="placeholder">
            <BeerSVG></BeerSVG>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BPic',
    props: {
        publicId: { type: String, required: false },
        src: { type: String, required: false },
        alt: { type: String, required: false },
        modifiers: { type: Array, default: () => [] },
    },
};
</script>

<style lang="scss" scoped>
.b-pic {
    /deep/ img {
        height: 100%;
        width: 100%;
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
