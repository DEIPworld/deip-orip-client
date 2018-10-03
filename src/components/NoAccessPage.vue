<template>
    <v-app>
        <v-content>
            <div class="display-flex full-height pos-relative overflow-hidden">
                <div class="c-m-auto text-align-center">
                    <div class="display-3 bold">Sorry</div>
                    <div class="headline">You don't have the access to this page</div>
                </div>

                <img class="left-polygon" :src="'./static/polygon.svg'">
                <img class="right-polygon" :src="'./static/polygon.svg'">
            </div>
        </v-content>
    </v-app>   
</template>

<script>
    export default {
        name: "NoAccessPage"
    };
</script>


<style lang="less" scoped>
    .right-polygon {
        transform: rotate(-65deg);
        position: absolute;
        opacity: 0.5;
        top: 90px;

        right: -150px;
    }
    
    .left-polygon {
        transform: rotate(-65deg);
        position: absolute;
        opacity: 0.5;
        top: 90px;

        left: -200px;
    }
</style>