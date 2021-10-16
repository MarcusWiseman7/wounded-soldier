<template>
    <v-clamp :max-lines="maxlines" tag="p" ellipsis="">
        <template>{{ text }}</template>
        <template v-slot:after="{ clamped, expand }">
            <span class="show-more" v-if="clamped" @click="expand"> more...</span>
        </template>
    </v-clamp>
</template>

<script>
import VClamp from 'vue-clamp';

export default {
    name: 'ClampedText',
    props: {
        text: { type: String, default: '' },
        maxlines: { type: Number, default: 2 },
    },
    components: { VClamp },
};
</script>

<style lang="scss" scoped>
.show-more {
    font-size: 12px;
    color: var(--color-main);
    cursor: pointer;
}
</style>
