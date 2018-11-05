<template>
    <div class="row discipline-picker full-height overflow-y-auto">
        <div class="col-4 c-p-4 overflow-y-auto">
            <div class="bold uppercase c-pb-4">Your disciplines</div>

            <div v-if="userDisciplines.length">
                <div v-for="(discipline, i) in userDisciplines" :key="i">
                    <span class="deip-label"
                        :class="{'selected': isUserLabelSelected(discipline) }"
                        @click="handleUserDiscipline(discipline)"
                    >{{ discipline.label }}</span>
                </div>
            </div>

            <div v-else class="grey--text">You have no expertise</div>
        </div>

        <div class="col-8 c-p-4 full-height overflow-y-auto">
            <div class="bold uppercase c-pb-4">All disciplines</div>

            <discipline-tree-picker
                :is-multiple-select="isMultipleSelect"
                :preselected="preselected"
                @select="select"
            ></discipline-tree-picker>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import * as disciplineTreeService from "./../DisciplineTreeService"; 

    export default {
        name: "AdvancedDisciplinePicker",

        props: {
            isMultipleSelect: { type: Boolean, required: false, default: true },
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
