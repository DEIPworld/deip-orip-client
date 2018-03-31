<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <div class="c-m-auto">
                <div class="font-20px bold">Would you like to inport an exising research or create a new one?</div>
                <div class="text-align-center pt-4">
                    <v-btn large color="primary" dark class="ma-0" to="/createResearch">Create new</v-btn>
                </div>
                <div class="text-align-center pt-4">
                    <span class="import-of-existing">Import exising standalone publication</span>
                </div>
            </div>
        </v-layout>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchStartCreatingPage",
        data() { 
            return {} 
        }
    };
</script>

<style lang="less" scoped>
    .import-of-existing {
        color: #2F80ED;
        text-decoration: underline;
        font-size: 16px;
        cursor: pointer;

        &:hover {
            text-decoration: none;
        }
    }
</style>
