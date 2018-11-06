<template>
    <v-container fluid fill-height class="pa-0 justify-center">

        <div class="page-container">
            <div class="text-align-center">
                <div class="deip-emblem">
                    <div class="emblem-logo">Deip.world</div>
                    <div class="emblem-caption">Decentralized research platform</div>
                </div>
            </div>

            <v-form v-model="isFormValid" ref="form" class="c-mt-10" v-show="!isServerValidated">
                <div class="c-pb-6 text-align-center">
                    Please fill the form for account create
                </div>
                
                <v-text-field 
                    name="username"
                    label="Username"
                    v-model="formData.username" 
                    :rules="[
                        rules.required, 
                        rules.unique, 
                        rules.usernameFormat
                    ]"
                    @input="usernameChanged"
                    :loading="isUsernameChecking"
                ></v-text-field>

                <div class="c-pv-4 text-align-justify caption grey--text">
                    DEIPWORLD INC will use the information you provide on this form to add you to the
                    list of private beta participants. As soon as you finish the registration (add all the required information,
                    generate and save the private key, and press the “Finish Registration” button that appears after you generate
                    and save the key), you will be added to the list and a DEIP representative will either accept or decline your
                    request. The procedure can take about a week. After the request is accepted you can use the generated key to
                    access the private beta. No data is stored until you press the “Finish Registration” button.<br><br>
                    To receive a private key, press the “Generate Private Key” button.
                </div>

                <v-btn block color="primary" 
                    @click="generatePrivateKey()"
                    :disabled="!isFormValid || isUsernameVerifyed !== true || isSaving"
                >{{ !formData.privKey ? 'Generate' : 'Re-generate' }} private key</v-btn>

                <div v-show="formData.privKey !== null">
                    <v-text-field class="c-mt-4"
                        label="Your private key"
                        disabled
                        v-model="formData.privKey"
                    ></v-text-field>

                    <v-text-field class=""
                        label="Your public key"
                        disabled
                        v-model="formData.pubKey"
                    ></v-text-field>

                    <div class="sm-title half-bold c-pb-4 grey--text">Permission to use the data</div>

                    <div class="text-align-justify caption grey--text">
                        Please confirm you have saved the generated key and want to be added to the list of private beta
                        participants with the information specified above:
                    </div>

                    <v-checkbox
                        class="c-mv-4"
                        label="I have saved the key and want to be added to the list"
                        v-model="formData.isPrivKeySaved"
                        :disabled="isSaving"
                        hide-details
                    ></v-checkbox>

                    <div class="c-pb-4 text-align-justify caption grey--text">
                        All the data (except your private key) will be stored in the DEIP cloud server.<br><br>
                        You can change your mind at any time by clicking the <span class="half-bold">unsubscribe link</span>
                        in the footer of any email you receive from us, or by contacting us at 
                        <a class="a" href="mailto:info@deip.world">info@deip.world</a>.
                        We will treat your information with respect. For more information about our privacy terms please read our
                        <a class="a" target="_blank" href="https://deip.world/DEIP%20PRIVACY%20POLICY.pdf">Privacy Policy</a>.
                        By clicking below, you agree that we may process your information in accordance with these terms.
                    </div>

                    <v-btn block color="primary" 
                        :loading="isSaving"
                        @click="finishRegistration()"
                        :disabled="!formData.isPrivKeySaved || isSaving"
                    >Finish registration</v-btn>
                </div>
            </v-form>

            <div class="c-mt-10" v-show="isServerValidated">
                <div class="text-align-center half-bold">
                    Thank you for your interest in DEIP!
                </div>
            </div>
        </div>
    </v-container>   
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
    import _ from 'lodash';

    export default {
        name: 'CreateAccountTestNet',
        data() {
            return {
                isFormValid: false,
                isUsernameVerifyed: undefined,
                isUsernameChecking: false,
                isSaving: false,
                isServerValidated: false, // true only when server accepts all information

                formData: {
                    username: '',
                    privKey: null,
                    pubKey: null,
                    isPrivKeySaved: false
                },

                rules: {
                    required: value => !!value || 'This field is required',
                    unique: value => !!value && this.isUsernameVerifyed !== false || 'Username should be unique in system',
                    usernameFormat: value => {
                        var result = deipRpc.utils.validateAccountName(value);
                        return result === null || result;
                    }
                }
            }
        },
        methods: {
            resetKey() {
                if (this.formData.privKey) {
                    this.formData.privKey = null;
                }
            },
            finishRegistration() {
                this.isSaving = true;
                const jsonMetadata = '';
                const config = JSON.parse(process.env.TEST_NET_USER_FACTORY_CONFIG);

                const authority = {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [[this.formData.pubKey, 1]]
                };

                deipRpc.broadcast.accountCreateAsync(
                    config.key,
                    this.toAssetUnits(config.fee),
                    config.name,
                    this.formData.username,
                    authority,
                    authority,
                    authority,
                    this.formData.pubKey,
                    jsonMetadata
                ).then(() => {
                    this.isSaving = false;
                    this.isServerValidated = true;
                }).catch(err => {
                    this.isSaving = false;
                    this.$store.dispatch('layout/setError', { message: 'An error occured' });
                    console.log(err);
                });
            },
            generatePrivateKey() {
                let keys = deipRpc.auth.getPrivateKeys(
                    this.formData.username,
                    (new Date()).getTime().toString(),
                    ['owner']
                );

                this.formData.privKey = keys.owner;
                this.formData.pubKey = keys.ownerPubkey;

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
        width: 550px;
        min-height: 100%;
        padding: 40px 0;
    }
</style>
