<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <create-token-sale v-if="isTokenSaleProposal"></create-token-sale>

        <div v-if="!isTokenSaleProposal" class="contributions-container"> 
            <div v-if="!isResearchGroupMember">
                <v-text-field 
                    suffix="DEIP" 
                    mask="########################" 
                    v-model="amount">
                </v-text-field>
                <v-btn color="primary" @click="contributeToTokenSale()">Contribute</v-btn>
            </div>
            <div v-if="isResearchGroupMember">
                <div class="subheading c-mb-10"> 
                    <div class="bold">Token Sale:</div>
                    <div>{{tokenSale}}</div>
                </div>
                <div class="bold">Contributions:</div>
                <div v-for="contribution in contributionsList">
                    <div>{{contribution}}</div>
                </div>
                <div v-if="contributionsList.length == 0">
                    No contributions for this token sale found
                </div>
            </div>
        </div> 

    </v-container>   
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc';
    
    export default {
        name: "TokenSale",
        computed: {
            ...mapGetters({
                user: 'user',
                userGroups: 'userGroups',
                research: 'ts/research',
                tokenSale: 'ts/tokenSale',
                contributionsList: 'ts/contributionsList'
            }),
            isResearchGroupMember(){
                if(this.research){
                    return this.userGroups.find(g => g.id === this.research.research_group_id) !== undefined;
                }
                return false;
            },
            isTokenSaleProposal() {
                if(this.research) {
                    return this.isResearchGroupMember && this.tokenSale == null;
                }
                return false;
            }
        },
        data() { 
            return {
                amount: 0
            } 
        },
        methods: {
            contributeToTokenSale() {
                debugger;
                deipRpc.broadcast.contributeToTokenSaleAsync(
					this.user.privKey,
                    this.tokenSale.id,
                    this.user.username,
                    parseInt(this.amount)
                ).then((data) => {
                    alert("Contributed !")
                }, (err) => {
                    alert(err.message)
                })
            }
        },
        created() {
            const permlinks = {
                group_permlink: this.$route.params.research_group_permlink,
                research_permlink: this.$route.params.research_permlink
            }
            this.$store.dispatch('ts/loadTokeSaleDetails', permlinks)
        }
    };
</script>

<style lang="less">

    .contributions-container {
        width: 100%; 
        text-align: center; 
        margin-left: 30%; 
        margin-right: 30%;
    }

</style>
