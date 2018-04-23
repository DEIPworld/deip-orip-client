<template>
    <v-container fluid fill-height style="text-align: center;">
       <div v-if="content && content.content">{{content.content}}"</div>
    </v-container>   
</template>

<script>
    import '/Users/yahortsaryk/work/ethereum/deip/deip-rpc/dist/deip.min';

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
            deipRpc.api.setOptions({ url: 'ws://206.189.175.10:11011/' });
            deipRpc.config.set('chain_id', '27c7139e3d2b2867f94cd4b53a4894900683aa7581445f3b16ab285dae64bb85');
        },
        mounted(){
            this.getContnet();
        }
    };
</script>

<style lang="less" scoped>
</style>
