<template>
    <div class="">

        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6" v-if="claimerInfo.profile.email">
            <span>
                <v-icon size="18" class="c-mr-2">mail</v-icon> {{ claimerInfo.profile.email }}
            </span>
        </div>

        <div class="sidebar-fullwidth" v-if="claimerInfo.profile.email">
            <v-divider></v-divider>
        </div>

        <div class="">
            <div class="title bold c-pt-6">
                <span class="">Personal Info</span>
            </div>

            <div class="c-pt-4 c-pb-6">
                <div class="legacy-row legacy-justify-between" v-if="claimerInfo.profile.birthday">
                    <span class="half-bold">Birthday</span>
                    <span class="">{{ claimerInfo.profile.birthday | dateFormat("D MMM YYYY") }}</span>
                </div>

                <div class="legacy-row legacy-justify-between" v-if="claimerInfo.profile.created">
                    <span class="half-bold">Registered</span>
                    <span class="">{{ claimerInfo.profile.created | dateFormat("D MMM YYYY") }}</span>
                </div>
            </div>
        </div>

        <div class="sidebar-fullwidth">
            <v-divider></v-divider>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "ClaimUserExpertiseDetailsSidebar",
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters({
                claimerInfo: 'claimExpertiseDetails/claimerInfo'
            }),
        },
        methods: {
        }
    };
</script>

<style lang="less" scoped>
</style>
