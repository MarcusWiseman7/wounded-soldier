<template>
    <div class="b-message__holder">
        <div class="b-message" :class="`b-message--${name}`">
            {{ message }}
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'BMessage',
    computed: {
        ...mapState(['bMessage']),
        name() {
            return this.bMessage.hasOwnProperty('name') ? this.bMessage.name : 'success';
        },
        message() {
            return this.bMessage.hasOwnProperty('message') ? this.bMessage.message : '';
        },
        countdown() {
            return this.bMessage.hasOwnProperty('countdown') ? this.bMessage.countdown : 4000;
        },
    },
    mounted() {
        setTimeout(() => {
            this.$store.commit('setObj', { name: 'bMessage', obj: null });
        }, this.countdown);
    },
};
</script>

<style lang="scss" scoped>
.b-message {
    color: #fff;
    font-size: 18px;
    letter-spacing: 0.75px;
    height: 50px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;

    &__holder {
        width: 100%;
        left: 0;
        bottom: 0;
        position: fixed;
        z-index: 30;
        margin-bottom: 50px;
        display: flex;
        justify-content: center;
    }

    &--error {
        background-color: var(--color-error);
    }

    &--success {
        background-color: var(--color-success);
    }

    &--info {
        background-color: var(--color-info);
    }
}
</style>
