<template>
    <transition name="popup">
        <div class="popup__holder" @mousedown="clickOutside" v-if="transitionEffect">
            <div class="popup" :class="[modifierClass, { 'popup--wholeHeight': setHeight }]" @mousedown.stop="">
                <div class="popup__container" v-body-scroll-lock="true" ref="popup">
                    <button v-if="closeIcon" @click="$emit('close')" class="popup__close">
                        <img src="@/assets/icons/closer.svg" alt="close" />
                    </button>

                    <div class="popup__content">
                        <slot name="header"></slot>

                        <h1 v-if="title" class="popup__content__title">{{ title }}</h1>
                        <p v-if="text">{{ text }}</p>

                        <slot name="body"></slot>
                    </div>

                    <slot name="actions"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import helpers from '@/helpers';
import Vue from 'vue';

export default {
    name: 'BPopup',
    props: {
        clickOutsideToClose: { type: Boolean, default: true },
        closeIcon: { type: Boolean, default: true },
        title: { type: String, required: false },
        text: { type: String, required: false },
        modifiers: { type: Array, default: () => [] },
    },
    mixins: [helpers],
    data() {
        return {
            transitionEffect: false,
            setHeight: false,
        };
    },
    computed: {
        modifierClass() {
            let newClass = '';
            this.modifiers.forEach(c => {
                newClass += ` popup--${c}`;
            });
            return newClass.trim();
        },
    },
    methods: {
        clickOutside() {
            if (this.clickOutsideToClose) this.$emit('close');
        },
        keyEvent($event) {
            if ($event.key == 'Enter') {
                if (this.$route.name == 'ChatOpened') return;
                else if (this.$refs.btn1WithBtn2) this.$emit('btn1');
                else if (this.$refs.btn1WithoutBtn2)
                    !this.priceSelector ? this.$emit('btn1') : this.$emit('mediaPrice', this.lpricetoGprice);
            } else if ($event.key == 'Escape') {
                this.$emit('close');
            }
        },
        checkHeight() {
            if (this.$refs.popup) this.setHeight = this.$refs.popup.scrollHeight > window.innerHeight;
        },
    },
    mounted() {
        document.addEventListener('keyup', this.keyEvent, false);
        window.addEventListener('resize', this.checkHeight, false);

        Vue.nextTick(() => {
            this.checkHeight();
        });

        this.transitionEffect = true;
    },
    beforeDestroy() {
        document.removeEventListener('keyup', this.keyEvent);
        window.removeEventListener('resize', this.checkHeight);
    },
};
</script>

<style lang="scss" scoped>
.popup {
    user-select: none;
    width: 314px;
    max-width: calc(100% - 24px);
    max-height: calc(100% - 24px);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
    height: auto;
    border-radius: 16px;

    &--autoWidth {
        width: auto;
    }

    &--wholeHeight {
        height: 100%;
    }

    &__holder {
        height: calc(var(--vh, 1vh) * 100);
        width: 100%;
        left: 0;
        bottom: 0;
        position: fixed;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);

        @include breakpoint(m) {
            left: 50%;
            transform: translateX(-50%);
        }
    }

    &__container {
        position: relative;
        display: flex;
        flex-flow: column nowrap; // 1)
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.95);
        padding: 18px 20px 0px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        & > * {
            flex-shrink: 0;
            flex-grow: 0;
        }

        &::after {
            content: '';
            flex: 0 0 30px;
            width: 100%;
            height: 30px;
        }
    }

    &__close {
        position: absolute;
        top: 0;
        left: 0;
        padding: 18px;

        & > img {
            width: 14px;
            height: 14px;
        }
    }

    &__content {
        display: flex;
        flex-flow: column nowrap; // 1)
        align-items: center;
        text-align: center;
        color: #000;
        max-width: 100%;

        // elipsis for long names - one row
        .displayname,
        .username,
        .username span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
        }

        // elipsis for long names - multiple rows
        &__title {
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        h1,
        p {
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        h1 {
            font-weight: 600;
            font-size: 16px;
            margin-top: 16px;

            @include breakpoint(xs) {
                font-size: 18px;
                margin-top: 18px;
            }
        }

        p {
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            margin-top: 8px;
            max-width: 100%;

            @include breakpoint(xs) {
                font-size: 14px;
                line-height: 18px;
                margin-top: 10px;
            }
        }

        /deep/ strong {
            overflow-wrap: break-word;
        }
    }
}
</style>
