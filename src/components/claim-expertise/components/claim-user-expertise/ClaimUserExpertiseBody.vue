<template>
    <div class="">
        <div class="row">
            <v-avatar size="160px" class="">
                <!-- <img v-bind:src="userInfo.profile.avatar | avatarSrc(160, 160, false)" /> -->
                <v-gravatar :email="'helloworld' + '@deip.world'" />
            </v-avatar>

            <div class="col-grow c-pl-12">
                <div class="display-1 half-bold c-pt-4">
                    <span class="a">William Watkins</span>
                </div>

                <div class="c-pt-4">
                    <div class="row half-bold">
                        <span class="c-mt-1">
                            <v-icon small>location_on</v-icon>
                            San Diego, CA
                        </span>
                    </div>
                </div>

                <div class="c-pt-2">
                    Belarusian state university
                </div>
            </div>
        </div>

        <div class="bold title c-pt-8">Discipline: Biochemistry</div>
        <div class="bold title c-pt-8">Motivation letter</div>

        <div class="c-pt-4">
            Dramatically supply 24/7 content whereas cross functional metrics. Distinctively mesh emerging web services
            after viral human capital. Conveniently foster multimedia based web services for orthogonal initiatives.
            Holisticly enhance alternative systems vis-a-vis equity invested niche markets. Credibly architect frictionless
            products and resource-leveling supply chains.
        </div>
        
        <div class="bold title c-pt-8">Publications</div>

        <v-card class="c-mt-6">
            <div class="c-p-6">
                <v-icon color="primary" class="c-mr-3">mdi-note-text</v-icon>
                <span class="primary--text half-bold">Collaboratively envisioneer prospective testing procedures through cross functional processes</span>
            </div>

            <v-divider></v-divider>

            <div class="c-p-6">
                <v-icon color="primary" class="c-mr-3">mdi-note-text</v-icon>
                <span class="primary--text half-bold">Collaboratively envisioneer prospective testing procedures through cross functional processes</span>
            </div>
        </v-card>

        <div class="c-mt-8">
            <v-btn color="primary" class="ma-0" @click="isAllocationDialogShown = true">Create a proposal</v-btn>
        </div>

        <claim-user-expertise-allocation-dialog
            :is-shown="isAllocationDialogShown"
            @close="isAllocationDialogShown = false"
        ></claim-user-expertise-allocation-dialog>
    </div>
</template>

<script>
    export default {
        name: 'ClaimUserExpertiseBody',
        data() {
            return {
                isAllocationDialogShown: false
            }
        },
        computed: {
        },
        methods: {
        }
    }
</script>

<style lang="less" scoped>

</style>
