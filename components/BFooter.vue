<template functional>
    <footer>
        <span>&copy; {{ new Date().getFullYear() }} by Marcus Wiseman</span>
    </footer>
</template>

<script>
export default {
    name: 'BFooter',
};
</script>

<style lang="scss" scoped>
footer {
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    flex-shrink: 0;

    span {
        margin: 24px 0;
        font-size: 14px;
    }
}
</style>
