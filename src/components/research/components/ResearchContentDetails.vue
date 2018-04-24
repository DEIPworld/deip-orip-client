<template>
    <v-container fluid fill-height style="text-align: center;">
       <div v-if="content && content.content">{{content.content}}"</div>
    </v-container>   
</template>

<script>
    export default {
        name: "researchContentDetails",
        data() { 
            return {
                content: {}
            } 
        },

        methods: {
            getContnet() {
                deipRpc.api.getResearchContentByIdAsync(this.$route.params.content_id)
                    .then((data) => {
                        this.content = data;
                })
            }
        },
        created() {
        },
        mounted(){
            this.getContnet();
        }
    };
</script>

<style lang="less" scoped>
</style>
