<template>
    <div class="row discipline-picker full-height overflow-y-auto">
        <div class="col-3 c-p-4 overflow-y-auto" v-if="withRecentlyUsed">
            <div class="bold uppercase c-pb-4">Recently used</div>
            <div><span class="deip-label">Religion</span></div>
            <div><span class="deip-label">Chemistry</span></div>
            <div><span class="deip-label">Biology</span></div>
            <div><span class="deip-label">Physics</span></div>
            <div><span class="deip-label">Belarusian</span></div>
        </div>

        <div class="c-p-4 overflow-y-auto" :class="withRecentlyUsed ? 'col-3' : 'col-4'">
            <div class="bold uppercase c-pb-4">Popular</div>
            <div><span class="deip-label">Religion</span></div>
            <div><span class="deip-label">Chemistry</span></div>
            <div><span class="deip-label">Biology</span></div>
            <div><span class="deip-label">Physics</span></div>
            <div><span class="deip-label">Belarusian</span></div>
        </div>

        <div class="c-p-4 full-height overflow-y-auto" :class="withRecentlyUsed ? 'col-6' : 'col-8'">
            <div class="bold uppercase c-pb-4">All</div>

            <discipline-tree-picker
                :is-multiple-select="isMultipleSelect"
                :preselected="preselected"
                @select="select"
            ></discipline-tree-picker>
        </div>
    </div>
</template>

<script>
    
    export default {
        name: "AdvancedDisciplinePicker",
        props: {
            isMultipleSelect: { type: Boolean, required: false, default: true },
            withRecentlyUsed: { type: Boolean, required: false, default: true },
            preselected: { 
                validator(value) {
                    return value === undefined || typeof value === 'array' || typeof value === 'object';
                },
                required: false
            },
        },
        methods: {
            select(selected){
                this.$emit('select', selected);
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
