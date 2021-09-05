<template>
    <div class="signup">
        <div class="signup__container">
            <h1>Sign up</h1>
            <!-- <login-signup></login-signup> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'SignUp',
};
</script>

<style lang="scss" scoped>
.signup {
    display: flex;
    justify-content: center;

    &__container {
        h1 {
            margin: 30px 0;
        }

        @include breakpoint(m) {
            width: 600px;
        }
    }
}
</style>
