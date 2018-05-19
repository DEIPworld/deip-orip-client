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

            <v-snackbar :timeout="4000" color="error" v-model="isServerError">
                {{serverError}}
                <v-btn dark flat @click.native="isServerError = false">Close</v-btn>
            </v-snackbar>
        </div>

    </v-container>   
</template>

<script>

    import deipRpc from '@deip/deip-rpc'
    import crypto from '@deip/libcrypto'
    import authService from './../../../../services/auth'
    import {decodedToken, clearAccessToken, setAccessToken} from './../../../../utils/auth'
    import config from './../../../../config'

    export default {
        name: 'UserAuthorization',
        data() {
            return {
                isFormValid: false,
                username: '',
                privKey: '',
                isHiddenPassword: true,
                isChecking: false,
                isServerError: false,
                serverError: null,
                rules: {
                    required: (value) => !!value || 'This field is required'
                }
            }
        },
        methods: {
            login() {

                if (this.$refs.form.validate()) {
                    this.isChecking = true;
                    const privKey = this.privKey;
                    var secretKey;
                    try {
                        secretKey = crypto.PrivateKey.from(privKey);
                    } catch(err) {
                        clearAccessToken();
                        this.isChecking = false;
                        this.isServerError = true;
                        this.serverError = `Invalid private key format`; 
                        return;
                    }

                    // sig-seed should be uint8 array with length = 32
                    const secretSig = secretKey.sign(encodeUint8Arr(config["sig-seed"]).buffer);
                    const secretSigHex = crypto.hexify(secretSig);
                    
                    authService.signIn({username: this.username, secretSigHex: secretSigHex})
                        .then((response) => {

                            if (response.success) {
                                const decoded = decodedToken(response.jwtToken);
                                const pubKey = decoded.pubKey;
                                
                                // this validation is just paranoia as we validate private key at the server using signature
                                var isValid;
                                try {
                                    isValid = deipRpc.auth.wifIsValid(this.privKey, pubKey);
                                } catch (err) {
                                    isValid = false;
                                }
                                
                                if (isValid) {
                                    // The jwt is being used by Vue router and File uploader api
                                    // to verify that user has logged successfully and entered his private key.
                                    // TODO: We should make decision on how to store private keys at UI. 
                                    // For now we can use local storage but it's not secure enough due to XSS attacks
                                    // and compromised thirdparty sources.
                                    setAccessToken(response.jwtToken, this.privKey)
                                    this.isChecking = false;
                                    this.isServerError = false;
                                    this.isServerValidated = true;
                                    this.$router.go('/');
                                } else {
                                    clearAccessToken();
                                    this.isChecking = false;
                                    this.isServerError = true;
                                    this.serverError = `Invalid private key for "${this.username}"`; 
                                }

                            } else {
                                clearAccessToken();
                                this.isChecking = false;
                                this.isServerError = true;
                                this.serverError = response.error;
                            }

                        }, (err) => {
                            clearAccessToken();
                            this.isChecking = false;
                            this.isServerError = true;
                            this.serverError = err.message; 
                        });
                }

                function encodeUint8Arr(myString) {
                    return new TextEncoder("utf-8").encode(myString);
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
