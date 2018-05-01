<template>
    <v-container fluid fill-height class="pa-0 justify-center">

        <div class="page-container">
            <div class="text-align-center">
                <div class="deip-emblem">
                    <div class="emblem-logo">Deip.world</div>
                    <div class="emblem-caption">Decentralized research platform</div>
                </div>
            </div>

            <v-form v-model="isFormValid" ref="form" class="c-mt-10">
                <div class="c-pb-6">
                    Thank you for your interest in DEIP!
                    <br>
                    To finish the registration and getting limit-less access to the newest research please type your name and save the private key
                </div>

                <!-- <v-text-field single-line v-model="email" disabled></v-text-field> -->

                <v-text-field 
                    label="First name"
                    v-model="formData.firstname" 
                    :rules="[rules.required]"
                    @input="resetKey"
                ></v-text-field>
                <v-text-field 
                    label="Last name"
                    v-model="formData.lastname" 
                    :rules="[rules.required]"
                    @input="resetKey"
                ></v-text-field>
                <v-text-field 
                    name="username"
                    label="Username"
                    v-model="formData.username" 
                    :rules="[rules.required, rules.unique]"
                    @input="usernameChanged"
                    :loading="isUsernameChecking"
                ></v-text-field>

                <v-btn block color="primary" 
                    @click="generatePrivateKey()"
                    :disabled="!isFormValid || isUsernameVerifyed !== true"
                >{{ !formData.privKey ? 'Generate' : 'Re-generate' }} private key</v-btn>

                <div v-show="formData.privKey">
                    <v-text-field class="c-mt-4"
                        label="Your key"
                        disabled
                        multi-line no-resize rows="2"
                        v-model="formData.privKey"
                    ></v-text-field>

                    <v-checkbox
                        label="I have saved the key"
                        v-model="formData.isPrivKeySaved"
                    ></v-checkbox>

                    <v-btn block color="primary" 
                        @click="finishRegistration()"
                        :disabled="!formData.isPrivKeySaved"
                    >Finish registration</v-btn>
                </div>
            </v-form>
        </div>

    </v-container>   
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'DataFillingRegesitration',
        data() {
            return {
                isFormValid: false,
                email: 'myemail@email.com',
                isUsernameVerifyed: undefined,
                isUsernameChecking: false,

                formData: {
                    firstname: '',
                    lastname: '',
                    username: '',
                    privKey: undefined,
                    pubKey: undefined,
                    isPrivKeySaved: false
                },

                rules: {
                    required: value => !!value || 'This field is required',
                    unique: value => !!value && this.isUsernameVerifyed !== false || 'Username should be unique in system'
                }
            }
        },
        methods: {
            resetKey() {
                if (this.formData.privKey) {
                    this.formData.privKey = undefined;
                }
            },
            finishRegistration() {
                this.formData; // object which has all necessary info
                // here should be BE calling to save all data

                 this.$router.push({ name: 'ClaimExpertiseRegesitration' });
            },
            generatePrivateKey() {
                // to do: to sort out how to handle this keys by roles and how many of them we want
                let keys = deipRpc.auth.getPrivateKeys(
                    this.formData.username,
                    (new Date()).getTime().toString(),
                    ['active']
                );

                this.formData.privKey = keys.active;
                this.formData.pubKey = keys.activePubkey;

                this.formData.isPrivKeySaved = false;
            },
            usernameChanged: _.debounce(
                function() {
                    this.isUsernameVerifyed = undefined;
                    this.resetKey();

                    if (this.formData.username !== '') {
                        this.isUsernameChecking = true;

                        deipRpc.api.getAccountsAsync([this.formData.username])
                            .then(res => { this.isUsernameVerifyed = _.isEmpty(res); })
                            .catch(error => { this.isUsernameVerifyed = false; })
                            .finally(() => {
                                this.isUsernameChecking = false;
                                let usernameInput = _.find(this.$refs.form.inputs, input => input.$attrs.name === 'username');
                                usernameInput.validate();
                            });
                    }
                }, 
                600
            )
        }
    }
</script>

<style lang="less" scoped>
    .page-container {
        width: 500px;
        min-height: 100%;
        padding: 40px 0;
    }
</style>
