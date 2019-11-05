<template>
    <v-dialog v-model="isShown" fullscreen persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Claim for Expertise Tokens</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <page-container>
                <contentbar>

                    <div class="headline text-align-center half-bold">Select your discipline</div>

                    <div class="discipline-picker c-mt-8">
                        <advanced-discipline-picker
                            :is-multiple-select="false"
                            :is-highlighted-parent="true"
                            :preselected="discipline"
                            @select="setDiscipline"
                        ></advanced-discipline-picker>
                    </div>

                    <div class="red--text c-pt-2 text-align-center">
                        <v-icon color="red">warning</v-icon>
                        Please be accurate, you will need the community assistance to change the disciplines
                    </div>

                    <v-form ref="form">
                        <div class="c-pt-6">
                            <v-textarea
                                label="Provide a cover letter" 
                                auto-grow
                                rows="2"
                                v-model="coverLetter"
                                :rules="[required]"
                            ></v-textarea>
                        </div>

                        <div class="title bold c-pt-6">Add links to your relevant publications in this discipline</div>

                        <v-card class="c-mt-6">
                            <template v-for="(publication, index) in publications">
                                <div class="legacy-row c-p-6">
                                    <div class="c-pt-6 c-pr-4">
                                        <v-icon color="primary">mdi-note-text</v-icon>
                                    </div>

                                    <div class="legacy-col-grow">
                                        <v-text-field
                                            label="Link to publication"
                                            v-model="publication.value"
                                            :rules="[required, urlRule]"
                                        ></v-text-field>
                                    </div>

                                    <div class="c-pt-5 c-pl-4">
                                        <v-btn class="ma-0" icon @click="removeLink(index)">
                                            <v-icon color="grey">close</v-icon>
                                        </v-btn>
                                    </div>
                                </div>

                                <v-divider></v-divider>
                            </template>

                            <div class="c-p-6">
                                <v-btn outline icon color="primary" class="ma-0" @click="addLinkInput">
                                    <v-icon small>add</v-icon>
                                </v-btn>

                                <span class="deip-blue-color c-pl-3">Add a link to a publication</span>
                            </div>
                        </v-card>
                        
                        <div class="legacy-row legacy-justify-center c-ph-6 c-pt-6">
                            <v-btn color="primary"
                                :disabled="isClaimBtnDisabled || isLoading"
                                :loading="isLoading"
                                @click="claimExpertise"
                            >Claim Expertise Tokens</v-btn>
                        </div>
                    </v-form>

                </contentbar>
            </page-container>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import expertiseClaimsService from '../../../services/http/expertiseClaims.js';
    import { createExpertiseClaim } from './../../../services/ExpertiseClaimsService';
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-oa-rpc-client';

    export default {
        name: "UserClaimExpertiseDialog",

        props: {
            isShown: { type: Boolean, required: true }
        },

        data() {
            return {
                URL_REGEX: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,

                required: value => !!value || 'This field is required',
                urlRule: value => {
                    return value && value.match(this.URL_REGEX) === null ? 'Incorrect url format' : true
                },

                discipline: undefined,
                coverLetter: '',
                publications: [{ value: '' }],

                isLoading: false
            }
        },

        computed: {
            ...mapGetters({
                user: 'auth/user'
            }),

            isClaimBtnDisabled() {
                const isLinkArrayValid = !_.isEmpty(this.publications) 
                    && this.publications.reduce((acc, curr) => acc && curr.value.match(this.URL_REGEX) !== null, true);
                
                return !this.discipline || !this.coverLetter || !isLinkArrayValid;
            }
        },

        methods: {
            setDiscipline(discipline) {
                this.discipline = discipline;
            },
            addLinkInput() {
                this.publications.push({ value: '' });
            },
            removeLink(index) {
                this.publications.splice(index, 1);
            },
            claimExpertise() {
                this.isLoading = true;

                createExpertiseClaim(this.user.username, this.discipline.id, this.coverLetter, this.publications.map(item => item.value))
                    .then((claim) => {
                        this.$store.dispatch('layout/setSuccess', {
                            message: "You have posted the claim successfully! Please wait for community approval before you obtain the expertise tokens"
                        });

                        setTimeout(() => {
                            this.$emit('close');
                            this.$router.push({
                                name: 'claim-user-expertise-details', 
                                params: { account_name: this.user.username, claim_id: claim._id }
                            });
                        }, 1000);
                    }).catch(err => 
                        console.log(err)
                    ).finally(() => {
                        this.isLoading = false;
                    });
            }
        },

        watch: {
            'isShown': function(newValue) {
                if (newValue) {
                    this.$refs.form.reset();

                    this.discipline = undefined;
                    this.coverLetter = '';
                    this.publications = [{ value: '' }];
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .discipline-picker {
        height: 350px;
    }
</style>
