<template>
    <v-container fluid fill-height class="pa-0 justify-center">

        <div class="page-container">
            <div class="text-align-center">
                <div class="sm-title c-pb-4 bold">Welcome to</div>
                <div class="deip-emblem">
                    <div class="emblem-logo">Deip.world</div>
                    <div class="emblem-caption">Decentralized research platform</div>
                </div>
            </div>

            <v-form v-model="isFormValid" ref="form" class="c-mt-10">
                <v-text-field 
                    label="Username"
                    v-model="username" 
                    :rules="[rules.required]"
                    @keyup.enter="login"
                ></v-text-field>
                <v-text-field 
                    label="Private key"
                    v-model="privKey" 
                    :rules="[rules.required]"
                    :append-icon="isHiddenPassword ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (isHiddenPassword = !isHiddenPassword)"
                    :type="isHiddenPassword ? 'password' : 'text'"
                    @keyup.enter="login"
                ></v-text-field>

                <v-btn block color="primary" @click="login()" v-show="!isChecking">Login</v-btn>
                <div class="row justify-center c-pt-3" v-show="isChecking">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
            </v-form>

            <v-snackbar :timeout="4000" color="error" v-model="isWrongCreds">
                Wrong credentials
                <v-btn dark flat @click.native="isWrongCreds = false">Close</v-btn>
            </v-snackbar>
        </div>

    </v-container>   
</template>

<script>
    export default {
        name: 'UserAuthorization',
        data() {
            return {
                isFormValid: false,
                username: '',
                privKey: '',
                isHiddenPassword: true,
                isChecking: false,
                isWrongCreds: false,

                rules: {
                    required: (value) => !!value || 'This field is required'
                }
            }
        },
        methods: {
            login() {
                if (this.$refs.form.validate()) {
                    this.isChecking = true;

                    // imitation of data sending
                    setTimeout(() => {
                        this.isChecking = false;
                        this.isWrongCreds = true;
                    }, 1500);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-container {
        width: 500px;
        height: 400px;
    }
</style>
