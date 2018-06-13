<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <user-details-body
                    @showEditEmployment="showEditEmploymentDialog"
                ></user-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <user-details-sidebar></user-details-sidebar>
        </v-card>

        <user-edit-employment-dialog
            :is-shown="isEditEmploymentShown"
        ></user-edit-employment-dialog>

    </v-container>   
</template>

<script>
    import usersService from './../../../services/users'

    export default {
        name: 'UserDetails',
        data() {
            return {
                isEditEmploymentShown: { value: false },
                accountName: this.$route.params.account_name
            }
        },
        methods: {
            showEditEmploymentDialog() {
                this.isEditEmploymentShown.value = true;
            },
        },
        created() {
            this.$store.dispatch('userDetails/loadUser', this.accountName);
        }
    }
</script>

<style lang="less" scoped>
</style>
