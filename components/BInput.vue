<template>
    <div class="input-wrapper" :class="`input-wrapper--${type}`">
        <label :for="labelFor" v-if="label" :class="{ error }">
            {{ label }}
        </label>
        <slot name="label"></slot>

        <div
            :class="[
                type,
                {
                    'input--error': error,
                    input: type == 'textarea',
                    'input--with-label': !!label,
                    'state-visible': error,
                },
            ]"
        >
            <!-- INPUT SLOT -->
            <slot></slot>

            <!-- Select -->
            <!-- <ul
                v-if="type == 'select'"
                class="select-wrapper"
                :class="{ selecting: selecting }"
                @click="selecting = !selecting"
            > -->
            <!-- Select first row -->
            <!-- <li v-if="selected" class="select__header select__header--selected" @click="$emit('select-desc')">
                    {{ selected.t ? selected.t : '' }}
                    <slot name="selectSelected"></slot>
                </li>
                <li v-else class="select__header" v-html="selectDescription" @click="$emit('select-desc')"></li> -->

            <!-- Open select - options -->
            <!-- <ul v-if="selecting" class="select__options">
                    <slot name="selectLi"></slot>
                    <li
                        class="select__option"
                        v-for="(item, i) in items"
                        :key="i"
                        @click="$emit('select-item', item)"
                        v-html="item.t"
                    ></li>
                </ul>
            </ul> -->

            <!-- Search states-->
            <div v-if="type == 'search-area'" class="search-area__state">
                <img
                    v-if="loading"
                    class="search-area__state--loading"
                    src="@/assets/icons/rotate.svg"
                    alt="loading"
                    width="16"
                    height="16"
                />
                <img
                    v-if="searchValid && !loading"
                    @click="$emit('clear-fld')"
                    class="search-area__state--clear"
                    src="@/assets/icons/closer.svg"
                    alt="clear"
                    width="16"
                    height="16"
                />
            </div>

            <!-- Input states -->
            <div v-if="type == 'input'" class="input__state">
                <img
                    v-show="error"
                    src="@/assets/icons/error.svg"
                    alt="error"
                    class="input__state--error"
                    width="16"
                    height="16"
                    @click="$emit('reset-input')"
                />
            </div>
        </div>

        <!-- Error message -->
        <p v-if="error && errorMsg" class="input--error__message">
            {{ errorMsg }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'BInput',
    props: {
        type: { type: String, default: 'input' },
        label: { type: String, required: false },
        labelFor: { type: String, default: '' },
        errorMsg: { type: String, default: '' },
        error: { type: Boolean, default: false },
        searchValid: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        // items: { type: Array, default: () => [] },
        // selectDescription: { type: String, default: 'Select' },
        // selected: { type: Object, default: () => null },
    },
    // data() {
    //     return {
    //         selecting: false,
    //     };
    // },
};
</script>

<style lang="scss" scoped>
label {
    font-weight: 700;
    font-size: 13px;
    letter-spacing: -0.02em;
    line-height: 14px;
    text-align: left;
    color: var(--color-main);
    padding-left: 22px;

    &.error {
        color: var(--color-error);
    }
}

.input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0;
}

$input-height: 42px;
$search-height: 36px;

.input,
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

        img {
            height: 100%;
            padding: 0px 12px;
            box-sizing: content-box;
            cursor: pointer;
            user-select: none;
        }
    }
}

/** INPUT **/
.input {
    height: $input-height;
    border-radius: $input-height/2;
    background: #f2f2f2;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1) inset, 0 0 1px 0 rgba(0, 0, 0, 0.1);
    margin: 1px;
    padding-left: 22px;

    & > * {
        z-index: 1;
    }

    &::before {
        content: '';
        display: block;
        width: calc(100% - 1px);
        height: calc(100% - 1px);
        position: absolute;
        border-radius: 21px;
        background: #fafafa;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1) inset, 0 0 1px 0 rgba(0, 0, 0, 0.1);
        z-index: 0;
    }

    &--error {
        background: var(--color-error);
        box-shadow: 0 0 1px 0 #d98989 inset, 0 0 1px 0 #d98989;

        &::before {
            box-shadow: 0 0 1px 0 #d98989 inset, 0 0 1px 0 #d98989;
        }

        &__message {
            padding-left: 22px;
            margin-top: 4px;
            font-size: 12px;
            color: var(--color-error);
            text-align: left;
        }
    }

    &--warning {
        &__message {
            font-weight: 400;
            font-size: 12px;
            letter-spacing: -0.02em;
            line-height: 16px;
            color: #999;
            margin-top: 3px;
        }
    }

    &--with-label {
        margin-top: 4px;
    }

    input,
    textarea {
        background-color: transparent;
        border: none;
        height: calc(100% - 4px);
        padding: 0;
        box-shadow: none;
        font-size: 14px;
        text-align: left;
        color: #000;
        flex: 1 1 100%;
        min-width: 0;

        &::placeholder {
            color: #999;
        }

        &:invalid {
            box-shadow: none;
        }

        &[type='password'] {
            letter-spacing: 1px;

            &::placeholder {
                letter-spacing: -0.02em;
            }
        }
    }

    &.textarea {
        height: auto;
        padding: 12px 0 12px 22px;
    }

    textarea {
        height: auto;
        font-family: inherit;
        border: none;
        resize: vertical;

        &::placeholder {
            color: #999;
        }
    }
}

/** SEARCH **/
.search-area {
    -webkit-transform: translate3d(0, 0, 0); /* fix ios bug */
    width: 100%;
    height: $search-height;
    border-radius: $search-height/2;
    background: #fafafa;
    // border: 1px solid $border;

    @include breakpoint(t) {
        height: 44px;
        border-radius: 22px;
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
        font-size: 14px;
        letter-spacing: -0.01em;
        color: #000;

        &::placeholder {
            font-size: 14px;
            font-weight: 400;
            letter-spacing: -0.02em;
            color: #999;
            background-size: 14px 14px;
            opacity: 1;
        }

        &:placeholder-shown {
            padding-left: 22px;
            background: url(../assets/icons/search.svg) no-repeat left center;
        }
    }
}

.select {
    -webkit-transform: translate3d(0, 0, 0); /* fix ios bug */
    border-radius: $input-height/2;
    background: #fafafa;
    // border: 1px solid $border;
    text-align: left;

    &-wrapper {
        width: 100%;
    }

    &__header,
    &__option {
        height: $input-height;
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 14px;
        color: #000;
        cursor: pointer;
        padding: 0 22px;
    }

    &__header {
        position: relative;
        user-select: none;
        color: #999;

        &--selected {
            color: #000;
        }

        &::after {
            content: '';
            // background: url('../assets/more.svg') no-repeat;
            position: absolute;
            top: 15px;
            right: 22px;
            z-index: 2;
            height: 12px;
            width: 12px;
            cursor: pointer;
        }
    }

    &__options {
        padding: 6px 0;
        max-height: 222px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .selecting {
        .select__header {
            &::before {
                content: '';
                height: 1px;
                background: #e9ebee;
                position: absolute;
                top: 100%;
                left: 8px;
                width: calc(100% - 16px);
            }
        }
    }
}

.radio {
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -0.02em;
    line-height: 25px;
    text-align: left;
    color: #000;
    position: relative;
    width: 250px;
    margin: 0 auto;

    input {
        visibility: hidden;
        height: 0;
        width: 0;
        position: absolute;
    }

    label {
        padding-left: 36px;
        height: 46px;
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #fff;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    input:checked + label::before {
        box-shadow: inset 0 0 0 6px var(--color-main-muted);
    }
}
</style>
