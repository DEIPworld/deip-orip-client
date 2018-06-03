<template>
    <v-container fluid fill-height class="pa-0 column-page">

        <div class="content-column">
            <div class="filling">
                <user-details-body
                    @showEditEducation="showEditEducationDialog"
                    @showEditEmployment="showEditEmploymentDialog"
                ></user-details-body>
            </div>
        </div>

        <v-card height="100%" class="sidebar">
            <user-details-sidebar></user-details-sidebar>
        </v-card>

        <user-edit-education-dialog
            :is-shown="isEditEducationShown"
        ></user-edit-education-dialog>

        <user-edit-employment-dialog
            :is-shown="isEditEmploymentShown"
        ></user-edit-employment-dialog>

    </v-container>   
</template>

<script>
    
    export default {
        name: 'UserDetails',
        data() {
            return {
                isEditEducationShown: { value: false },
                isEditEmploymentShown: { value: false },
                accountName: 'alice'
            }
        },
        methods: {
            showEditEducationDialog() {
                this.isEditEducationShown.value = true;
            },
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
