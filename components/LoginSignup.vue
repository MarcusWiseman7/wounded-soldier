<template>
    <div class="auth">
        <div v-if="step == 1" class="auth__inputs">
            <b-input
                label="Email"
                labelFor="username"
                :error="errors.email"
                :errorMsg="emailErrorMsg"
                :key="'username'"
            >
                <input
                    type="text"
                    autofocus
                    autocomplete="username"
                    id="username"
                    maxlength="60"
                    v-model="contact.email"
                    placeholder="Enter your email..."
                    @blur="checkError('email')"
                    @input="recheckError('email')"
                    @keypress.enter="onClick"
                />
            </b-input>
            <div class="auth__password" :class="{ hide: !showPassword }">
                <b-input
                    v-show="!iForgot"
                    label="Password"
                    labelFor="password"
                    :error="errors.password"
                    errorMsg="Min 6 characters"
                    :key="'password'"
                >
                    <input
                        v-if="!isSignup"
                        :type="passwordInputType ? 'password' : 'text'"
                        placeholder="Enter your password..."
                        ref="passwordInput"
                        autocomplete="current-password"
                        v-model="contact.password"
                        id="password"
                        @blur="checkError('password')"
                        @input="recheckError('password')"
                        @keypress.enter="onClick"
                    />
                    <input
                        v-else
                        :type="passwordInputType ? 'password' : 'text'"
                        placeholder="Enter your new password..."
                        ref="passwordInput"
                        autocomplete="new-password"
                        v-model="contact.password"
                        id="password"
                        @blur="checkError('password')"
                        @input="recheckError('password')"
                        @keypress.enter="onClick"
                    />
                    <img
                        v-if="passwordInputType"
                        class="eye"
                        :class="{ 'eye--error': errors.password }"
                        src="@/assets/icons/eye-closed.svg"
                        alt="Hide"
                        @click="passwordInputType = false"
                    />
                    <img
                        v-else
                        class="eye"
                        :class="{ 'eye--error': errors.password }"
                        src="@/assets/icons/eye.svg"
                        alt="Show"
                        @click="passwordInputType = true"
                    />
                </b-input>

                <div v-if="!iForgot" class="auth__forgot" @click="goIforgot">
                    <span>Forgot password?</span>
                </div>
            </div>
        </div>
        <div v-if="step == 2" class="auth__inputs">
            <b-input
                label="Display name"
                labelFor="displayname"
                :error="errors.displayName || displayNameExists"
                :errorMsg="displayNameErrorMsg"
                :key="'displayname'"
            >
                <input
                    type="text"
                    maxlength="60"
                    v-model="contact.displayName"
                    id="displayname"
                    placeholder="Enter a name to use..."
                    @blur="checkError('displayName')"
                    @input="recheckError('displayName')"
                    @keypress.enter="onClick"
                />
            </b-input>
        </div>

        <div class="auth__actions">
            <b-button group="main" :disabled="!formOK" @clicked="onClick">{{ btnText }}</b-button>
        </div>
    </div>
</template>

<script>
import debounce from '@/debounce';

export default {
    name: 'LoginSignup',
    data() {
        return {
            passwordInputType: true,
            showPassword: false,
            contact: {
                email: '',
                password: '',
                displayName: '',
            },
            errors: {
                email: false,
                password: false,
                displayName: false,
            },
            emailExists: false,
            displayNameExists: false,
            success: {
                email: false,
                password: false,
                displayName: false,
            },
            regex: {
                email: /\S+@\S+\.\S+/,
                password: /^.{6,}$/,
                displayName: /^.{3,}$/,
            },
            step: 1,
            iForgot: false,
        };
    },
    computed: {
        emailErrorMsg() {
            return this.emailExists ? 'This email is already used' : 'Please enter a valid email';
        },
        displayNameErrorMsg() {
            return this.displayNameExists ? 'This name taken' : 'Min 4 characters';
        },
        formOK() {
            switch (this.step) {
                case 1:
                    if (!this.showPassword || this.iForgot) {
                        return this.success.email;
                    } else {
                        return this.success.email && this.success.password;
                    }
                case 2:
                    return this.success.displayName && !this.displayNameExists;
            }
        },
        isSignup() {
            return this.$route.name == 'SignUp';
        },
        btnText() {
            if (!this.isSignup) {
                if (this.iForgot) return 'Reset password';
                return this.formOK && !this.emailExists ? 'Sign up' : 'Enter';
            } else {
                return this.step == 1 ? 'Continue' : 'Enter';
            }
        },
    },
    methods: {
        goIforgot() {
            this.$store.commit('setObj', {
                name: 'loginPopupObj',
                obj: { title: 'Reset Password', text: 'Send an email to reset my password' },
            });
            this.iForgot = true;
        },
        onClick() {
            if (this.iForgot) {
                this.$store.dispatch('forgotPassword', this.contact.email);
            } else if (!this.isSignup) {
                if (this.step == 1 && !this.emailExists) this.goSignup();
                else this.tryLogin();
            } else {
                switch (this.step) {
                    case 1:
                        if (this.emailExists) this.tryLogin();
                        else this.step++;
                        break;
                    case 2:
                        this.addUser();
                        break;
                }
            }
        },
        goSignup() {
            this.$store.commit('setObj', { name: 'authContact', obj: this.contact });
            this.$store.commit('toggle', 'loginPopup');
            this.$router.push({ name: 'SignUp' });
        },
        checkError(err) {
            this.errors[err] = this.contact[err].match(this.regex[err]) === null;
            if (!this.errors[err]) this.checkSuccess(err);
            return;
        },
        recheckError(err) {
            if (this.errors[err]) this.checkError(err);
            else this.checkSuccess(err);

            if (['email', 'displayName'].includes(err)) {
                setTimeout(() => {
                    if (err == 'email') this.checkEmail();
                    else this.checkDisplayName();
                }, 10);
            }
        },
        checkSuccess(success) {
            this.success[success] = this.contact[success].match(this.regex[success]) !== null;
        },
        showPasswordNow() {
            this.showPassword = true;
            this.contact.password = '';
            this.$refs.passwordInput.focus();
        },
        async tryLogin() {
            if (!this.success.password) return this.showPasswordNow();

            try {
                let result = await this.$store.dispatch('login', {
                    email: this.contact.email,
                    password: this.contact.password,
                });

                if (result && result.statusCode > 0) this.$router.replace('/');
                else this.showPasswordNow();
            } catch (err) {
                console.warn('Login error :>> ', err);
            }
        },
        checkEmail: debounce(function() {
            if (!this.success.email) return;
            this.$store.dispatch('checkDB', { email: this.contact.email }).then(res => {
                this.emailExists = res.statusCode < 0;
            });
        }, 200),
        checkDisplayName: debounce(function() {
            if (!this.success.displayName) return;
            this.$store.dispatch('checkDB', { displayName: this.contact.displayName }).then(res => {
                this.displayNameExists = res.statusCode < 0;
            });
        }, 200),
        addUser() {
            if (!this.formOK) return;
            this.$store.dispatch('addUser', this.contact);
        },
    },
    created() {
        if (this.$route.name == 'SignUp') this.showPassword = true;
        if (this.$store.state.authContact) {
            this.contact = Object.assign({}, this.contact, this.$store.state.authContact);
            this.recheckError('email');
        }
    },
};
</script>

<style lang="scss" scoped>
.auth {
    margin: 20px 0;

    &__inputs {
        margin: 20px 0 40px 0;
        min-width: 300px;
    }

    &__password {
        margin-top: 10px;
    }

    &__forgot {
        color: #999;
        font-size: 12px;
        padding: 6px 12px;
        margin: 6px 0 -12px 0;
        cursor: pointer;
    }
}

.eye {
    position: absolute;
    right: 12px;
    top: 9px;
    cursor: pointer;

    &--error {
        right: 30px;
    }
}

.hide {
    overflow: hidden;
    height: 0;
}
</style>
