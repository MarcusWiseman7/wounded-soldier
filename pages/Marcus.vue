<template>
    <div class="marcus">
        <div class="marcus__actions">
            <b-button group="main" modifier="outline" @clicked="$store.dispatch('generalDBUpdate')">Update DB</b-button>
            <b-button group="main" modifier="outline" @clicked="$store.dispatch('normalizeNamesInDB')"
                >Normalize names</b-button
            >
        </div>
    </div>
</template>

<script>
export default {
    name: 'Marcus',
};
</script>

<style lang="scss" scoped>
.marcus {
    margin: 40px 20px;

    &__actions {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
