<template>
   <v-layout fill-height row discipline-picker overflow-y-auto>
        <v-flex xs4 pa-3 v-if="!withoutUserDisciplines" overflow-y-auto>
            <v-flex pb-3 bold uppercase>Your domains</v-flex>

            <v-flex v-if="userDisciplines.length">
                <div v-for="(discipline, i) in userDisciplines" :key="i">
                    <span class="discipline-picker-label"
                        :class="{'selected': isUserLabelSelected(discipline) }"
                        @click="handleUserDiscipline(discipline)"
                    >{{ discipline.label }}</span>
                </div>
            </v-flex>
        </v-flex>

        <v-flex pa-3 fill-height overflow-y-auto :class="!withoutUserDisciplines ? 'xs8' : 'xs12'">
            <v-flex pb-3 bold uppercase>All domains</v-flex>

            <discipline-tree-picker
                :is-multiple-select="isMultipleSelect"
                :is-highlighted-parent="isHighlightedParent"
                :preselected="preselected"
                @select="select"
            ></discipline-tree-picker>
        </v-flex>
    </v-layout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import * as disciplineTreeService from "./../DisciplineTreeService"; 

    export default {
        name: "AdvancedDisciplinePicker",

        props: {
            isMultipleSelect: { type: Boolean, required: false, default: true },
            isHighlightedParent: { type: Boolean, required: false, default: false },

            withoutUserDisciplines: { type: Boolean, required: false, default: false },
            
            preselected: {
                validator(value) {
                    return value === undefined || typeof value === 'array' || typeof value === 'object';
                },
                required: true
            },
        },

        computed: {
            ...mapGetters({
                user: 'auth/user'
            }),

            userDisciplines() {
                return disciplineTreeService.getNodesByIdList(
                    this.user.expertTokens.map(token => token.discipline_id)
                );
            }
        },

        methods: {
            select(selected){
                this.$emit('select', selected);
            },

            handleUserDiscipline(discipline) {
                if (!this.isMultipleSelect) {
                    this.$emit('select', discipline);
                } else {
                    let preselectedCopy = _.cloneDeep(this.preselected);

                    if (!_.find(preselectedCopy, item => item.id === discipline.id)) {
                        preselectedCopy.push(discipline);
                    } else {
                        _.remove(preselectedCopy, item => item.id === discipline.id);
                    }

                    this.$emit('select', preselectedCopy);
                }
            },

            isUserLabelSelected(discipline) {
                if (!this.isMultipleSelect) {
                    return !!this.preselected && this.preselected.id === discipline.id;
                } else {
                    return !!_.find(this.preselected, item => item.id === discipline.id);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .discipline-picker {
        border: 1px solid #E0E0E0;

        & > :not(:last-child) {
            border-right: 1px solid #E0E0E0;
        }
    }
</style>
