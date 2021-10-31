<template>
    <div class="pill" :class="modifiers.map(m => 'pill--' + m)">
        <div class="pill__icon">
            <slot name="icon"></slot>
        </div>

        <div class="pill__title">
            <slot name="title"></slot>
        </div>

        <div class="pill__info">
            <slot name="info"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BPill',
    props: {
        modifiers: { type: Array, default: () => [] },
    },
};
</script>

<style lang="scss" scoped>
.pill {
    border: 1px solid var(--color-border);
    border-radius: 20px;
    display: flex;
    align-items: center;
    height: 30px;
    padding: 2px 8px 2px 2px;
    min-width: 100px;
    width: fit-content;
    max-width: 100%;

    &__icon {
        border-radius: 50%;
        height: 26px;
        width: 26px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__title {
        font-size: 14px;
        font-weight: 500;
        margin: 0 8px;
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__info {
        font-size: 10px;
        font-weight: 300;
        color: var(--color-text-second);
        white-space: nowrap;
    }

    &--rating {
        .pill__title {
            margin: 0 8px 0 2px;
        }
    }

    &--location {
        .pill__title {
            max-width: 200px;
        }
    }
}
</style>
