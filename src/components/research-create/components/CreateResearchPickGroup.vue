<template>
    <div class="column full-height col-grow" style="max-width: 800px;">
        <div class="c-mb-4 col-grow column overflow-y-auto">

            <div class="step-title">Select Research Group</div>
            <div class="col-grow">
                <div v-for="group in userGroups" v-if="!group.is_personal" 
                        v-bind:class="{'selected-group': research.group && group.id == research.group.id }"
                        @click="setGroup(group)" 
                        class="row-nowrap group-line c-p-3">

                    <div class="group-nameplate c-pr-2">{{group.name}}</div>
                    <div class="">{{getGroupCoworkers(group).join(' · ')}}</div>
                </div>

                <div class="c-pt-6 c-pl-4">
                    <router-link class="app-title" :to="`${user.username}/create-research-group`">
                        <span  class="deip-label">+ Add new group</span>
                    </router-link>
                </div> 
            </div>

        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';

    export default {
        name: "CreateResearchPickGroup",
        props: {
            research: { type: Object, required: true } 
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userGroups: 'auth/userGroups',
                userCoworkers: 'auth/userCoworkers'
            }),

            nextDisabled(){
                return !this.research.group;
            }
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
            setGroup(group) {
                this.$emit('setGroup', group);
            },
            getGroupCoworkers(group){
                return this.userCoworkers.filter(c => {
                    return c.research_group_id == group.id}).map(c => c.owner);
            }
        }
    };
</script>

<style lang="less">
    .group-line {
        border: 1px solid #E0E0E0;
        border-radius: 2px;
        cursor: pointer;
        &:hover  {
            border-color: #2F80ED;
        }
    }
    .group-nameplate {
        font-weight: bold;
        font-size: 16px;
        flex: 0 0 250px;
    }

    .selected-group {
        background-color: #eaeaea;
    }
</style>
