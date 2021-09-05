<template>
    <div class="m" @mouseenter="showbtns(true)" @mouseleave="showbtns(false)">
        <div v-show="indibtnsL" class="bt lt">
            <div class="btreal lt islink" @click.stop="scro(-1)">
                <img src="@/assets/icons/scroller/left.svg" alt="left" />
            </div>
        </div>
        <div
            class="scroller"
            ref="scr"
            :class="{ snap: snapping && !drag, 'space-around': spaceAround }"
            @scroll="scrolled"
            @touchstart="touch"
            @touchend="savepos"
            @mousedown.stop="dragstart"
            @mousemove.stop="dragging"
            @mouseleave="dragend"
            @mouseup.stop="dragend"
            :id="scrollid"
        >
            <slot :isHovered="{ L: indibtnsL, R: indibtnsR }" :isDragging="drag"></slot>
        </div>
        <div v-show="indibtnsR" class="bt rt">
            <div class="btreal rt islink" @click.stop="scro(+1)">
                <img src="@/assets/icons/scroller/right.svg" alt="right" />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import debounce from '@/debounce';

export default {
    name: 'BHorizontalWrapper',
    props: {
        shift: { type: Number, default: 0 },
        snapping: { type: Boolean, default: false },
        spaceAround: { type: Boolean, default: false },
        tag: { type: String, default: '' },
        savePosition: { type: Boolean, default: false },
        scrollid: { type: String, default: '' },
    },
    data() {
        return {
            btns: false,
            scrollPosition: 0,
            btns_disabled: false,
            isEdge: false,
            drag: false,
            wantdrag: false,
            startx: null,
            finalPosition: 0,
            startScroll: 0,
            savedScrollPos: 0,
        };
    },
    computed: {
        indibtnsL: function() {
            return this.btns && this.scrollPosition > 0;
        },
        indibtnsR: function() {
            return this.btns && this.$refs.scr.scrollWidth - 20 > this.$refs.scr.clientWidth + this.scrollPosition;
        },
        // ...mapState(['savedPositions']),
    },
    methods: {
        touch() {
            this.btns_disabled = true;
        },
        dragstart(e) {
            if (this.$refs.scr) {
                this.startx = e.clientX;
                this.startScroll = this.$refs.scr.scrollLeft;
                this.wantdrag = true;
            }
        },
        dragging(e) {
            if (this.wantdrag) {
                let diffx = this.startx - e.clientX;
                if (Math.abs(diffx) > 10) this.drag = true;
                if (this.drag === true) {
                    this.$refs.scr.scrollTo(this.startScroll + diffx, 0);
                    this.finalPosition = this.startScroll + diffx;
                }
            }
        },
        dragend(e) {
            if (this.drag) {
                setTimeout(() => {
                    if (this.$refs.scr) {
                        this.$refs.scr.scrollTo({
                            top: 0,
                            left: this.finalPosition,
                            behavior: 'smooth',
                        });
                        this.savedScrollPos = this.finalPosition;
                    }
                }, 0);
            }
            this.drag = false;
            this.wantdrag = false;
        },
        scrolled: debounce(function(k) {
            if (!this.btns_disabled && this.$refs.scr) {
                this.scrollPosition = this.$refs.scr.scrollLeft;
                this.savedScrollPos = this.$refs.scr.scrollLeft;
            }
        }, 500),
        showbtns(s) {
            this.drag = false;
            if (!this.btns_disabled) this.btns = s;
        },
        scro(kam) {
            if (this.isEdge) {
                if (kam > 0) this.$refs.scr.scrollLeft += this.shift || 243;
                else this.$refs.scr.scrollLeft -= this.shift || 243;
            } else {
                this.$refs.scr.scrollBy({
                    top: 0,
                    left: kam * (this.shift || 243),
                    behavior: 'smooth',
                });
            }
        },
        savepos() {
            this.savedScrollPos = this.$refs.scr.scrollLeft;
        },
        handleScroll(e) {
            this.$emit('scroll', e);
        },
    },

    mounted() {
        if (this.tag && this.savedPositions.hasOwnProperty(this.tag)) {
            this.savedScrollPos = this.savedPositions[this.tag];
            Vue.nextTick(() => {
                if (this.$refs.scr) {
                    this.$refs.scr.scrollLeft = this.savedPositions[this.tag];
                }
            });
        }
        if (this.scrollid && document.getElementById(this.scrollid))
            document.getElementById(this.scrollid).addEventListener('scroll', this.handleScroll, { passive: true });
    },
    // beforeDestroy() {
    //     if (this.savePosition !== false)
    //         this.$store.commit('savePosition', { tag: this.tag, pos: this.savedScrollPos });
    // },
};
</script>

<style scoped lang="scss">
.snap {
    -webkit-scroll-snap-type: x mandatory;
    scroll-snap-type: x mandatory;
    -webkit-scroll-snap-destination: 50% 50%;
    scroll-snap-destination: 50% 50%;

    &::after {
        content: ' ';
        min-width: 1px;
    }
}

.scroller {
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; //hide scrollbar in firefox
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        display: none !important;
        background-color: transparent;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    &.space-around {
        padding-left: 12px;

        @include breakpoint(t) {
            padding-left: 16px;
        }
    }
}

/deep/ .isMuted {
    opacity: 0.4;
    pointer-events: none;
}

.m {
    position: relative;
    width: 100%;

    .bt {
        position: absolute;
        transform: translateY(-50%);
        z-index: 2;
        width: 54px;
        background: transparent;
        top: 50%;
        padding: 40px 10px 40px 0px;
        overflow: hidden;
    }

    .bt.rt {
        padding-left: 15px;
    }

    .bt.lt {
        padding-right: 15px;
    }

    .btreal {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
        z-index: 3;
        width: 39px;
        height: 42px;
    }

    .lt {
        left: 0;
        border-radius: 0 3px 3px 0;
    }

    .rt {
        text-align: right;
        right: 0;
        border-radius: 3px 0 0 3px;
    }
}
</style>
