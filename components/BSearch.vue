<template>
    <div class="input-wrapper">
        <div class="search-area">
            <search-icon></search-icon>
            <input
                @click.stop="onfocus"
                @touchstart.stop="onfocus"
                @keydown="startTyping"
                @keyup="stopTyping"
                name="search"
                :placeholder="placeholderText"
                autocomplete="off"
                ref="searchfld"
                type="text"
                v-model="query"
                v-on:input="query = $event.target.value"
                id="search"
                class="search"
                maxlength="50"
            />
            <div class="search-area__state">
                <div v-if="loading" class="search-area__state--loading">
                    <rotate-icon></rotate-icon>
                </div>
                <div class="search-area__state--clear" v-if="searchValid && !loading" @click="clearFld">
                    <cross-icon></cross-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import debounce from '@/debounce';
import SearchIcon from '@/assets/icons/general/search.svg?inline';
import CrossIcon from '@/assets/icons/general/closer.svg?inline';
import RotateIcon from '@/assets/icons/rotate.svg?inline';

export default {
    name: 'BSearch',
    components: { SearchIcon, CrossIcon, RotateIcon },
    data() {
        return {
            query: '',
            typing: false,
            loading: false,
        };
    },
    computed: {
        ...mapState(['searchQuery']),
        searchValid() {
            return this.query.length > 0;
        },
        placeholderText() {
            if (!this.$device.isMobile) return 'Search for beers or breweries...';
            else return 'Beers or breweries...';
        },
    },
    watch: {
        query: debounce(async function(q) {
            this.loading = true;
            await this.$store.dispatch('searchDB', q);
            this.loading = false;
        }, 400),
    },
    methods: {
        startTyping(e) {
            if (e.key == 'Shift') return;
            this.typing = true;
        },
        stopTyping: debounce(function() {
            this.typing = false;
        }, 500),
        onfocus() {
            setTimeout(() => {
                if (this.$refs.searchfld) this.$refs.searchfld.focus();
            }, 50);
        },
        clearFld() {
            this.query = '';
            if (this.$refs.searchfld) this.$refs.searchfld.focus();
        },
        getSize() {
            // this.$store.dispatch('initApp');
        },
    },
    created() {
        if (this.searchQuery && this.searchQuery.length > 0) this.query = this.searchQuery;
    },
    mounted() {
        this.getSize();
        window.addEventListener('resize', this.getSize, false);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.getSize);
    },
};
</script>

<style lang="scss" scoped>
$search-height: 60px;

.input-wrapper {
    position: relative;
    padding: 0;
    display: flex;
    justify-content: center;

    @include breakpoint(m) {
        padding: 0 40px;
    }

    @include breakpoint(d) {
        padding: 0;
    }
}

.search-area {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;

    &::after {
        content: '';
        display: block;
        height: 100%;
        flex: 0 0 22px;
        transition: flex-basis 0.2s;
    }

    &.state-visible {
        &::after {
            flex: 0 0 40px;
        }
    }

    &__state {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;

        svg,
        img {
            height: 100%;
            padding: 0px 22px;
            box-sizing: content-box;
            cursor: pointer;
            user-select: none;
        }

        svg {
            height: 16px;
            width: 16px;
        }
    }
}

.search-area {
    -webkit-transform: translate3d(0, 0, 0); /* fix ios bug */
    width: 100%;
    height: $search-height;
    border-radius: $search-height/2;
    border: 1px solid var(--color-border);

    @include breakpoint(d) {
        width: 80%;
    }

    @include breakpoint(full) {
        width: 1000px;
    }

    &:focus {
        outline: none;
    }

    &::after {
        flex: 0 0 40px;
    }

    // Search state
    &__state {
        &--loading {
            animation-name: spin;
            animation-duration: 1000ms;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
    }

    // the input
    .search {
        flex: 1 1 auto;
        height: 100%;
        -webkit-appearance: none;
        -moz-appearance: none;
        background: transparent;
        font-size: 26px;
        letter-spacing: -0.01em;
        padding-left: 6px;

        &::placeholder {
            font-size: 26px;
            font-weight: 400;
            letter-spacing: -0.02em;
            color: var(--color-text-second);
            background-size: 26px 26px;
            opacity: 1;
        }
    }
}

.color-object {
    fill: var(--color-text);
}
</style>
