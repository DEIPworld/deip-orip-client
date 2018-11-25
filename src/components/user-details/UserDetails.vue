<template>
    <page-container>
        <contentbar>
            <user-details-body></user-details-body>
        </contentbar>

        <sidebar>
            <user-details-sidebar></user-details-sidebar>
        </sidebar>
    </page-container>
</template>

<script>
    import usersService from './../../services/http/users'

    export default {
        name: 'UserDetails',
        data() {
            return {
            }
        },
        methods: {

        },
        created() {
        }
    }
</script>

<style lang="less" scoped>
</style>
