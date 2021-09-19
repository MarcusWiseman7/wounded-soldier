<template>
    <div class="add-beer">
        <div class="add-beer__content">
            <h2>New Beer!! You're a hero!!!</h2>
            <div class="add-beer__inputs">
                <b-input label="Name" labelFor="beer">
                    <input
                        type="text"
                        autofocus
                        id="beer"
                        v-model="beer"
                        maxlength="75"
                        placeholder="The beer's name..."
                    />
                </b-input>
                <b-input class="add-beer__inputs--last" label="Brewery" labelFor="brewery">
                    <input
                        type="text"
                        id="brewery"
                        v-model="brewery"
                        maxlength="75"
                        placeholder="The brewery's name..."
                    />
                </b-input>
            </div>
            <div class="add-beer__actions">
                <b-button group="main" :disabled="!formOK" @clicked="add">Add beer</b-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddBeer',
    middleware: 'auth',
    data() {
        return {
            beer: '',
            brewery: '',
        };
    },
    computed: {
        formOK() {
            return this.beer && this.beer.length > 0 && this.brewery && this.brewery.length > 0;
        },
    },
    methods: {
        add() {
            this.$store.dispatch('addNewBeer', { beerName: this.beer, brewery: this.brewery }).then(() => {
                this.beer = '';
                this.brewery = '';
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.add-beer {
    margin: 20px;
    display: flex;
    justify-content: center;

    &__content {
        width: 100%;
        @include breakpoint(m) {
            width: 600px;
        }
    }

    &__inputs {
        margin: 40px 0;
        min-width: 300px;

        &--last {
            margin-top: 10px;
        }
    }
}
</style>
