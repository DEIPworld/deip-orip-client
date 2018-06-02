<template>
    <div class="column full-height col-grow" style="max-width: 800px;">
        <div class="c-mb-4 col-grow column overflow-y-auto">

            <div class="step-title">Search research group</div>
         <!--     <div class="col-grow">
              <div class="row-nowrap group-line c-p-3">
                    <div class="group-nameplate c-pr-2">Individual Researcher</div>
                    <div class="">Nikolay Ignatiev · Alex Shkor · Artyom Ruseckiy · Egor Tsaryk</div>
                </div>
                <div class="row-nowrap group-line c-p-3">
                    <div class="group-nameplate c-pr-2">Super religious scientific group the best one</div>
                    <div class="">Alex Shkor</div>
                </div>
                <div class="row-nowrap group-line c-p-3">
                    <div class="group-nameplate c-pr-2">Deip special forces</div>
                    <div class="">
                        Nikolay Ignatiev · Artyom Ruseckiy · Egor Tsaryk · Nikolay Ignatievr · 
                        Artyom Ruseckiy · Nikolay Ignatiev · Artyom Ruseckiy · Egor Tsaryk · Nikolay Ignatiev ·
                        Nikolay Ignatiev
                    </div>
                </div>
                <div class="c-pt-6 c-pl-4">
                    <span class="deip-label">+ Add new group</span>
                </div> -->

            <div class="col-grow">
                <div v-for="group in userGroups" v-if="!group.is_personal" 
                        v-bind:class="{'selected-group': selectedGroup && group.id == selectedGroup.id }" 
                        class="row-nowrap group-line c-p-3">

                    <div class="group-nameplate c-pr-2" @click="selectGroup(group)">{{group.name}}</div>
                    <div class="">{{groupCoworkers(group).join(' · ')}}</div>
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
        data() { 
            return {
                selectedGroup: undefined
            } 
        },
        computed: {
            ...mapGetters({
                user: 'user',
                userGroups: 'userGroups',
                userCoworkers: 'userCoworkers'
            }),

            nextDisabled(){
                return !this.selectedGroup;
            }
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },
            selectGroup(group) {
                this.selectedGroup = group;
                this.$emit('selectGroup', this.selectedGroup);
            },
            groupCoworkers(group){
                return this.userCoworkers.filter(c => {
                    return c.research_group_id == group.id}).map(c => c.owner);
            }
        }
    };
</script>

<style lang="less">
    .group-line {
        border: 2px solid transparent;
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
