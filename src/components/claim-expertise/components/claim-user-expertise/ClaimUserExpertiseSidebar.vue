<template>
    <div class="">
        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START User Profile Followers Section ### -->
        <div style="margin: 0 -24px">
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">23<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">4<br>Following</div>
                </div>
            </div>
        </div>
        <!-- ### END User Profile Followers Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START User Profile Contacts Section ### -->
        <div class="c-pt-6 c-pb-6">
            <span>
                <v-icon size="18" class="c-mr-2">mail</v-icon>
                alexshkor@deip.world
            </span>
        </div>
        <!-- ### END User Profile Contacts Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <!-- ### START User Profile Info Section ### -->
        <div class="">
            <div class="sm-title bold c-pt-6">
                <span class="">Personal Info</span>
            </div>

            <div class="c-pt-4 c-pb-6">
                <div class="row justify-between">
                    <span class="half-bold">Birthday</span>
                    <span class="">9 Jan 2018</span>
                </div>

                <div class="row justify-between">
                    <span class="half-bold">Registered</span>
                    <span class="">9 Jan 2018</span>
                </div>
            </div>
        </div>
        <!-- ### END User Profile Info Section ### -->

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

    </div>
</template>

<script>
    export default {
        name: "ClaimUserExpertiseSidebar",
        data() {
            return {
            };
        },
        computed: {
        },
        methods: {
        }
    };
</script>

<style lang="less" scoped>
    .vertical-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        margin: 12px 0;
    }

    .section-divider {
        margin: 0 -24px;
    }
</style>
