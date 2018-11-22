<template>
    <div>
        <v-data-table
            class="elevation-1 witnesses-table"
            :headers="[
                { text: 'Username', value: sortTypes.USERNAME_SORT_BY },
                { text: 'Discipline', value: sortTypes.DISCIPLINE_SORT_BY },
                { text: 'Created at', value: sortTypes.CREATED_AT_SORT_BY, align: 'center' },
                { text: 'Publications', value: sortTypes.PUBLICATIONS_SORT_BY, align: 'center' },
                { text: '', width: '100px', sortable: false }
            ]"
            :items="claims"
            :pagination.sync="pagination"
            hide-actions
            must-sort
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td class="">
                        <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: props.item.username }}">
                            {{ props.item.user | fullname }}
                        </router-link>
                    </td>

                    <td>
                        <div>
                            <span :class="[ isAbleToVote(props.item) ? 'bold green--text text--darken-3' : 'half-bold' ]">{{ props.item.discipline.label }}</span>
                            <span class="caption grey--text" v-if="props.item.status == 'approved'">(approved)</span>
                        </div>
                        
                    </td>
                    
                    <td class="text-xs-center">{{ props.item.created_at | dateFormat('HH:mm D MMM YYYY', true) }}</td> 
                    <td class="text-xs-center">{{ props.item.publications.length }}</td>

                    <td class="row justify-end">
                        <v-btn color="primary" flat :to="{
                                name: 'claim-user-expertise-details', 
                                params: { account_name: props.item.username, claim_id: props.item._id }
                            }"
                        >Details</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import _ from 'lodash';
    import { mapGetters } from 'vuex';
    import SortFieldsSvc from './../services/SortFieldsSvc';

    export default {
        name: "ClaimUserExpertiseListBody",

        data() {
            return {
                sortTypes: Object.assign({}, SortFieldsSvc.types)
            };
        },

        computed: {
            ...mapGetters({
                claims: 'claimExpertiseList/claims',
                sorting: 'claimExpertiseList/sorting',
                user: 'auth/user'
            }),

            pagination: {
                get() {
                    return Object.assign({}, this.sorting, { rowsPerPage: -1 });
                },

                set(value) {
                    this.$store.dispatch('claimExpertiseList/setSorting', {
                        sortBy: value.sortBy,
                        descending: value.descending
                    });
                }
            }
        },

        methods: {
            isAbleToVote(claim) {
                return _.some(this.user.expertTokens, token => token.discipline_id === claim.disciplineId);
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
