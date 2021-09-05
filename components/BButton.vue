<template>
    <button
        @click.stop="onClick"
        @mouseup.stop="onMouseup"
        class="m-button"
        :class="[
            groupClass,
            modifierClass,
            {
                selected,
                negative,
            },
        ]"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'MButton',
    props: {
        group: { type: String, default: '' },
        modifier: { type: String, default: '' },
        disabled: { type: Boolean, default: false },
        selected: { type: Boolean, default: false },
        negative: { type: Boolean, default: false },
        fileInput: { type: Boolean, default: false },
    },
    computed: {
        groupClass() {
            return this.group ? `m-button--${this.group}` : '';
        },
        modifierClass() {
            if (!this.modifier) return '';
            let array = this.modifier.split(' ');
            let newClass = '';
            array.forEach(c => {
                newClass += ` m-button--${c}`;
            });
            return newClass.trim();
        },
    },
    methods: {
        onClick(e) {
            if (!this.fileInput) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.$emit('clicked');
        },
        onMouseup(e) {
            if (!this.fileInput) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.$emit('onMouseUp');
        },
    },
};
</script>

<style lang="scss" scoped>
//mobile
$button--main-height: 56px;
$button--cta-height: 38px;
$button--quick-height: 32px;
$button--response-height: 26px;
$button--option-height: 30px; // XD - Like to button
$button--overlay-height: 40px;
$button--stream-height: 40px;
$button--pill-height: 42px;

//desktop
$button--desktop--response-height: 34px;

.m-button {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    white-space: nowrap;
    position: relative;
    user-select: none;

    // GLOBAL SETUP

    // color
    &--main,
    &--cta,
    &--quick,
    &--response {
        background: var(--color-main);
        color: #fff;

        &[disabled] {
            cursor: no-drop;
            background: var(--color-main-disabled);

            & > label {
                cursor: no-drop;
            }

            &:hover,
            &:focus,
            &:active {
                background: var(--color-main-disabled);
            }
        }

        @media (hover) {
            &:hover,
            &:focus,
            &:active {
                background: var(--color-main-darker);
            }
        }
    }

    &--outline {
        background: transparent;
        border: 1px solid var(--color-main);
        color: var(--color-main);

        &:hover,
        &:focus,
        &:active {
            background: transparent;
            border: 1px solid var(--color-main-darker);
            color: var(--color-main-darker);
        }
    }

    &--main,
    &--cta {
        &.m-button--secondary {
            background: #fafafa;
            border: 1px solid #f2f2f2;

            &:hover,
            &:focus,
            &:active {
                background: scale-color(#fafafa, $lightness: -3%);
                border: 1px solid scale-color(#f2f2f2, $lightness: -5%);
            }
        }

        &.selected {
            border: 1px solid var(--color-main);

            &:hover,
            &:focus,
            &:active {
                border: 1px solid var(--color-main-darker);
            }
        }
    }

    // font
    &--main,
    &--cta {
        font-weight: 700;
        font-size: 16px;

        &.m-button--outline {
            font-weight: 500;
        }
    }

    &--quick,
    &--response {
        font-weight: 700;
        font-size: 14px;
    }

    // GROUPS

    // Main button
    &--main {
        height: $button--main-height;
        border-radius: 12px; // $button--main-height/2;
        box-shadow: 2px 10px 20px rgba(var(--color-main), 0.3);

        @include breakpoint(t) {
            max-width: 310px;
            margin-left: auto;
            margin-right: auto;
        }

        &:hover,
        &:focus,
        &:active {
            box-shadow: 2px 10px 20px var(--color-main-darker);
        }

        &.m-button--secondary {
            font-weight: 400;
            color: #000;
            box-shadow: none;
        }

        &.negative {
            background: #f71616;
            box-shadow: 2px 10px 20px rgba(255, 0, 0, 0.31);

            &:hover,
            &:focus,
            &:active {
                background: #f71616;
                box-shadow: 2px 10px 20px rgba(255, 0, 0, 0.31);
            }
        }

        &.m-button--outline {
            box-shadow: none;
        }
    }

    // Call to action button
    &--cta {
        height: $button--cta-height;
        border-radius: 6px;

        &.m-button--secondary {
            font-weight: 600;
            color: #3c3c3c;
        }
    }

    // Quick CTA button
    &--quick {
        height: $button--quick-height;
        border-radius: 6px;
        padding: 0 26px;

        &.m-button--icon {
            height: 34px;
        }

        &.m-button--outline {
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(153, 153, 153, 0.5);
            font-weight: 500;
            color: #707070;
        }

        &.m-button--secondary {
            background: rgba(250, 250, 250, 0.5);
            border: 1px solid rgba(242, 242, 242, 0.5);
            font-weight: 500;
            color: #3c3c3c;
        }
    }

    // Response button
    &--response {
        height: $button--response-height;
        border-radius: 4px;
        width: auto;
        padding: 0 16px;

        &.m-button {
            &--red {
                background-color: #f71616;
            }

            &--green {
                background-color: #2db400;
            }

            &--gold {
                background: #ffce00;
                border: none;
            }

            &--purple {
                background: var(--color-main-muted);
            }
        }

        &.m-button--outline {
            background: #fff;
            border: 1px solid var(--color-main);
            font-weight: 700;
            color: var(--color-main);
        }
    }

    // Like to button
    &--option {
        height: $button--option-height;
        border-radius: $button--option-height/2;
        width: auto;
        padding: 0 8px 0 20px;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: -0.02em;
        background: #fafafa;
        border: 1px solid var(--color-main-muted);
        color: var(--color-main-muted);

        span {
            transform: translateX(0px);
            transition: transform 0.15s linear;
        }

        img {
            opacity: 0;
            width: auto;
            transform: translateX(20px);
            transition: all 0.15s linear;
        }

        @media (hover: hover) {
            &:not(.selected):hover {
                background: var(--color-main-muted);
                color: #fff;
            }
        }

        &.selected {
            background: var(--color-main-muted);
            color: #fff;

            span {
                transform: translateX(-8px);
            }

            img {
                opacity: 1;
                transform: translateX(-2px);
            }
        }
    }

    // Overlay button
    &--overlay {
        height: $button--overlay-height;
        border-radius: $button--overlay-height/2;
        background: #fafafa;
        border: 1px solid #f2f2f2;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        font-size: 14px;
        color: #3c3c3c;
        width: auto;
        padding: 0 30px;

        &:hover,
        &:focus,
        &:active {
            color: #000;
        }
    }

    // MODIFICATIONS
    // Icon
    &--icon {
        &.m-button--main {
            & > *:first-child,
            & .m-button__label > *:first-child {
                margin-right: 10px;
            }
        }

        &.m-button--cta,
        &.m-button--overlay {
            & > *:first-child,
            & .m-button__label > *:first-child {
                margin-right: 8px;
            }
        }

        &.m-button--response,
        &.m-button--quick {
            & > *:first-child,
            & .m-button__label > *:first-child {
                margin-right: 6px;
            }
        }
    }

    &__label {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 !important;
        position: relative;

        & + input,
        & > input {
            width: 1px !important; // fix for Safari
        }
    }

    // CONTENT
    & > span {
        &:not(:first-of-type) {
            margin-left: 5px;
        }
    }
}
</style>
