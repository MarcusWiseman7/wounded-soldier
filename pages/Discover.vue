<template>
    <div class="">
        <b-search class="search"></b-search>
        <b-wrapper v-if="searchResults" which="searchResults" :items="searchResults"></b-wrapper>
        <b-wrapper which="topBeers" :items="topBeers"></b-wrapper>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Discover',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
    // transition(to, from) {
    //     if (!$nuxt.$device.isMobile || !from) return;
    //     return $nuxt.$store.state.transitionName;
    // },
    computed: {
        ...mapState(['searchResults', 'beers', 'topBeers']),
    },
};
</script>

<style lang="scss" scoped>
.search {
    margin: 20px 8px;

    @include breakpoint(m) {
        margin: 40px 0;
    }
}
</style>
