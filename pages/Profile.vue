<template>
    <div class=""></div>
</template>

<script>
export default {
    name: 'Profile',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
    // transition(to, from) {
    //     if (!$nuxt.$device.isMobile || !from) return;
    //     return $nuxt.$store.state.transitionName;
    // },
};
</script>

<style lang="scss" scoped></style>
