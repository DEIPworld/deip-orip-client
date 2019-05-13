
<template>
  <div>
    <v-dialog v-model="meta.isOpen" persistent transition="scale-transition" max-width="700px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Payment Request</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <page-container>
                <contentbar>
                    <div class ="row">
                      <div class="col-12">
                        <div class="row c-pb-4">
                          <div class="col-3">
                            <div>Funding Opportunity:</div>        
                          </div>
                          <div class="col-9">
                            <div class="deip-blue-color bold">
                              {{meta.contract.foa.funding_opportunity_title}}
                            </div>
                            <div class="grey--text bold">
                              #{{meta.contract.foa.funding_opportunity_number}}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-3">
                            <div>Research:</div>        
                          </div>
                          <div class="col-9">
                            <div class="deip-blue-color bold">
                              {{ research.title}}
                            </div>        
                          </div>
                        </div>

                        <v-divider class="c-mb-4 c-mt-4"></v-divider>

                        <div class="row c-pt-6">
                          <div class="col-3">
                            <div class="bold">Research Group:</div>        
                          </div>
                          <div class="col-9">
                            <div class="deip-blue-color bold">{{ researchGroup.name }}</div>        
                          </div>
                        </div>

                        <div class="row c-pt-3">
                          <div class="col-3">
                            <div class="bold">Organization:</div>        
                          </div>
                          <div class="col-9">
                            <div class="deip-blue-color bold">{{ getOrganizationTitle(user.account.organisation_id) }}</div>        
                          </div>
                        </div>

                        <div class="row c-pt-3">
                          <div class="row-nowrap justify-between align-center c-mr-5"
                              v-for="(member, i) in membersList" :key="i + '-picked'">
                              <div>
                                <v-avatar size="40px">
                                    <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" />
                                    <v-gravatar v-else :email="member.account.name + '@deip.world'" />
                                </v-avatar>
                                <router-link to="#" class="a c-pl-1">{{ member | fullname }}</router-link>
                              </div>
                          </div>
                        </div>

                        <v-divider class="c-mb-4 c-mt-6"></v-divider>

                        <div class="row">
                          <div class="col-8">
                            <v-select v-model="purpose" 
                                :items="purposes"
                                label="Purpose" 
                                item-text="title"
                                item-value="id">
                            </v-select>
                          </div>
                          <div class="col-1"></div>
                          <div class="col-3">
                            <v-text-field
                              v-model="amount"
                              hide-details
                              mask="##############" suffix="$">
                            </v-text-field>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-12">
                            <v-text-field
                              label="Description"
                              v-model="description"
                              multi-line
                              rows=4
                              auto-grow
                              hide-details>
                            </v-text-field>  
                          </div>
                        </div>

                        <div class="row c-pt-6">
                          <div class="col-5"></div>
                          <div class="col-3 text-align-right">
                            <v-btn color="primary" 
                              class="c-m-auto"
                              flat
                              @click="close()"
                            >Close</v-btn>
                          </div>
                          <div class="col-1"></div>
                          <div class="col-3 text-align-right">
                            <v-btn color="primary" 
                              class="c-m-auto"
                              :disabled="isDisabled || isLoading"
                              :loading="isLoading"
                              @click="withdraw()"
                            >Withdraw Request</v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                </contentbar>
            </page-container>
        </v-card>
    </v-dialog>
    </div>
</template>


<script>
    import deipRpc from '@deip/deip-rpc-client';
    import { getAccessToken } from './../../../utils/auth'
    import { mapGetters } from 'vuex';
    import { signOperation } from './../../../utils/blockchain'
    import { getOrganizationTitle } from './../../../utils/organizations'

    const purposes = [
      {id: 1, title: "Salary"},
      {id: 2, title: "Equipment" },
      {id: 3, title: "Business Travel"}
    ];

    export default {
        props: {
          meta: { required: true, default: undefined, type: Object }
        },

        name: "WithdrawFundingRequestDialog",
        data() { 
          return {
            description: "",
            purpose: 1,
            purposes: purposes,
            amount: null,
            isLoading: false
          }
        },
        computed: {
          ...mapGetters({
              user: 'auth/user',
              research: 'rd/research',
              researchGroup: 'rd/group',
              membersList: 'rd/membersList'
          }),
          isDisabled() {
            return !this.amount || !this.purposes || !this.description;
          }
        },
        methods: {
          getOrganizationTitle,
          close() {
            this.meta.isOpen = false;
          },
          withdraw() {
            this.isLoading = true;
            deipRpc.broadcast.createFundingWithdrawalRequestAsync(
              this.user.privKey,
              this.meta.contract.relation.id,
              this.researchGroup.id,
              this.research.id,
              this.user.account.organisation_id,
              this.user.username,
              this.purpose,
              this.toAssetUnits(this.amount),
              this.description
            )
            // .then(() => deipRpc.api.getFundingWithdrawalRequestsAsync())
            // .then((requests) => {
            //   let requestId = requests.length ? requests[requests.length -1].id : 0;
            //   return deipRpc.broadcast.approveFundingWithdrawalRequestAsync(this.user.privKey, requestId, this.user.username);
            // })
            .then(() => {
                let reload = new Promise((resolve, reject) => {
                  this.$store.dispatch('rd/loadFundingContracts', { researchId: this.research.id, notify: resolve });
                });
              return Promise.all([reload]);
            })
            .then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: `Withdraw request has been created successfully!`
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                  message: `An error occurred while sending the request, please try again later.`
              });
            })
            .finally(() => {
              this.isLoading = false;
              this.close();
            });
          }

        },
        watch: {
            "meta.isOpen"(newVal, oldVal) {
                if (newVal) {
                    this.description = '';
                    this.amount = null;
                    this.purpose = 1;
                } 
            }
        }
    };
</script>

<style lang="less" scoped>

    #content-dropzone {
        margin-left: -1px;
        margin-right: -1px;
    }

    .dialog.dialog--active {
        overflow: visible;
    }

    .author-item {
        width: 100%
    }

    .selected-author-item {
        padding-top: 8px;
        padding-bottom: 8px;
        background-color: rgb(224, 224, 224);
    }

    .avatar {
        margin-left: 10px
    }

</style>

