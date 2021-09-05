<template>
    <div class="page-inner"></div>
</template>

<script>
export default {
    name: 'Profile',
    layout: ctx => (ctx.$device.isMobile ? 'mobile' : 'desktop'),
};
</script>

<style lang="scss" scoped></style>
