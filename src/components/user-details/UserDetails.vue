<template>
    <base-page-layout>
        <user-details-body slot="content"></user-details-body>
        <user-details-sidebar slot="right-sidebar"></user-details-sidebar>
    </base-page-layout>
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
