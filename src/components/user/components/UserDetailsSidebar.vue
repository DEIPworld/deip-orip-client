<template>
    <div>
        <v-btn color="primary" block class="ma-0">
            Profile settings
        </v-btn>

        <div class="sm-title bold c-pt-6">Expertise</div>

        <div class="c-pt-4 c-pb-6">
            <div class="row justify-between">
                <div class="half-bold">Physics</div>
                <div>12 345</div>
            </div>
            <div class="row justify-between">
                <div class="half-bold">Chemistry</div>
                <div>145</div>
            </div>
            <div class="row justify-between">
                <div class="half-bold">Science</div>
                <div>666</div>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">123<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">43<br>Following</div>
                </div>
            </div>
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6 pos-relative">
            <div class="">linkedin.com/in/NikolayIgnatiev</div>
            <div class="c-pt-1">
                <!-- <v-icon>fas fa-lock</v-icon> --> NikolayIgnatiev
            </div>
            <div class="c-pt-1">NikolayIgnatiev</div>
            <div class="c-pt-1">NikolayIgnatiev@mail.ru</div>
            
            <v-icon small color="grey lighten-1" class="corner-edit">mode_edit</v-icon>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Personal Info</div>

        <div class="c-pt-4 c-pb-6">
            <div>Birthday: 9 Jan, 1990</div>
            <div class="c-pt-1">Registered: 19 Feb, 2020</div>
        </div>
        
        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserDetailsSidebar",
        data() {
            return {};
        }
    };
</script>

<style lang="less" scoped>
    .corner-edit {
        position: absolute;
        top: 18px;
        right: 10px;
    }
    .vertical-devider {
        background-color: rgba(0,0,0,0.12);
        width: 1px;
        margin: 12px 0;
    }
</style>
