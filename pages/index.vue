<template>
    <div class="page-inner">
        <h1 class="headline first">New and popular</h1>
        <b-wrapper v-if="topBeers" :modifiers="['full-card']" :items="topBeers.slice(0, 2)"></b-wrapper>

        <h1 class="headline">Top rated beers</h1>
        <b-horizontal-wrapper
            v-slot="slotProps"
            :shift="248"
            :snapping="true"
            :scrollid="'scroll-top-beers'"
            @scroll="handleScroll"
        >
            <b-card
                v-for="(item, i) in topBeers"
                :key="'b-card-' + i"
                :modifiers="['mobile']"
                :item="item"
                :hovered="slotProps.isHovered"
                :dragging="slotProps.isDragging"
            ></b-card>
        </b-horizontal-wrapper>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Home',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
    computed: {
        ...mapState(['topBeers']),
        mobile() {
            return this.$device.isMobile;
        },
    },
    methods: {
        handleScroll(e) {
            // let newPageReq =
            //     e.target.scrollWidth - e.target.scrollLeft - 2 * e.target.clientWidth < e.target.clientWidth;
            // if (newPageReq && this.canLoadOlder) {
            //     this.$store.dispatch('epictour/getList', {
            //         type: 'chatList',
            //         myGender: this.myProfile.gender,
            //         mySexuality: this.myProfile.sexuality,
            //         nextpage: true,
            //     });
            // }
        },
    },
};
</script>

<style lang="scss" scoped>
.headline {
    margin: 20px 0;
}

.first {
    margin-top: 0;
}
</style>
