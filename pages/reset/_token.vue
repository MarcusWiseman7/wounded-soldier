<template>
    <div class="reset-password">
        <!-- <div class="reset-password__container">
            <h1>Reset Password</h1>

            <div class="reset-password__inputs">
                <b-input
                    label="Password"
                    labelFor="password"
                    :error="errorpassword"
                    errorMsg="Min 6 characters"
                    :key="'password'"
                >
                    <input
                        :type="passwordInputType ? 'password' : 'text'"
                        placeholder="Enter your new password..."
                        ref="passwordInput"
                        autocomplete="new-password"
                        v-model="password"
                        id="password"
                        @blur="checkError"
                        @input="recheckError"
                        @keypress.enter="resetPassword"
                    />
                    <img
                        v-if="passwordInputType"
                        class="eye"
                        :class="{ 'eye--error': errorpassword }"
                        src="@/assets/icons/eye-closed.svg"
                        alt="Hide"
                        @click="passwordInputType = false"
                    />
                    <img
                        v-else
                        class="eye"
                        :class="{ 'eye--error': errorpassword }"
                        src="@/assets/icons/eye.svg"
                        alt="Show"
                        @click="passwordInputType = true"
                    />
                </b-input>
            </div>

            <div class="reset-password__actions">
                <b-button group="main" :disabled="!successpassword" @clicked="resetPassword">{{ btnText }}</b-button>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'ResetPassword',
    asyncData({ params }) {
        return { token: params.token };
    },
    data() {
        return {
            email: '',
            password: '',
            regexpassword: /^.{6,}$/,
            errorpassword: false,
            successpassword: false,
            passwordInputType: true,
        };
    },
    computed: {
        btnText() {
            return this.successpassword ? 'Reset password' : 'Enter new password';
        },
    },
    methods: {
        checkError() {
            this.errorpassword = this.password.match(this.regexpassword) === null;
            if (!this.errorpassword) this.checkSuccess();
        },
        recheckError() {
            if (this.errorpassword) this.checkError();
            else this.checkSuccess();
        },
        checkSuccess() {
            this.successpassword = this.password.match(this.regexpassword) !== null;
        },
        resetPassword() {
            if (this.errorpassword || !this.successpassword) return;

            this.$axios
                .patch('/api/users/resetPassword', { token: this.token, password: this.password })
                .then(res => {
                    if (res.data && res.data.statusCode == 1) {
                        this.email = res.data.email;
                        this.tryLogin();
                    }
                })
                .catch(err => {
                    console.warn('Reset password axios error :>> ', err);
                })
                .finally();
        },
        async tryLogin() {
            if (this.errorpassword || !this.successpassword || !this.email) return;

            try {
                let result = await this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,
                });

                if (result && result.statusCode > 0) this.$router.replace('/');
            } catch (err) {
                console.warn('Login error :>> ', err);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.reset-password {
    display: flex;
    justify-content: center;

    &__container {
        h1 {
            margin: 40px 0;
        }

        @include breakpoint(m) {
            width: 600px;
        }
    }

    &__inputs {
        margin: 20px 0 40px 0;
        min-width: 300px;
    }

    &__actions {
        margin: 60px 0;
    }
}
</style>
