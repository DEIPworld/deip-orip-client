<template>
    <div class="">
        <div class="section-divider">
            <v-divider></v-divider>
        </div>

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

        <div class="section-divider" v-if="claimerInfo.profile.email">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6" v-if="claimerInfo.profile.email">
            <span>
                <v-icon size="18" class="c-mr-2">mail</v-icon> {{ claimerInfo.profile.email }}
            </span>
        </div>

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

        <div class="">
            <div class="sm-title bold c-pt-6">
                <span class="">Personal Info</span>
            </div>

            <div class="c-pt-4 c-pb-6">
                <div class="row justify-between" v-if="claimerInfo.profile.birthday">
                    <span class="half-bold">Birthday</span>
                    <span class="">{{ claimerInfo.profile.birthday | dateFormat("D MMM YYYY") }}</span>
                </div>

                <div class="row justify-between" v-if="claimerInfo.profile.created">
                    <span class="half-bold">Registered</span>
                    <span class="">{{ claimerInfo.profile.created | dateFormat("D MMM YYYY") }}</span>
                </div>
            </div>
        </div>

        <div class="section-divider">
            <v-divider></v-divider>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ClaimUserExpertiseSidebar",
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters({
                claimerInfo: 'claimExpertise/claimerInfo'
            }),
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
