<template>
    <div>
        <v-btn color="primary" block class="ma-0">
            Profile settings
        </v-btn>

        <div class="sm-title bold c-pt-8">Expertise</div>

        <div class="c-pt-4 c-pb-6">
            <div class="row justify-between">
                <div class="half-bold">Anatomy</div>
                <div>1 345</div>
            </div>
            <div class="row justify-between">
                <div class="half-bold">Biochemistry</div>
                <div>666</div>
            </div>
            <div class="row justify-between">
                <div class="half-bold">Biology</div>
                <div>145</div>
            </div>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
            <div class="row-nowrap">
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">23<br>Folowers</div>
                </div>
                <div class="vertical-devider"></div>
                <div class="col-6 c-pv-6 display-flex" v-ripple>
                    <div class="clickable-label text-align-center c-m-auto">4<br>Following</div>
                </div>
            </div>
            <v-divider></v-divider>
        </div>

        <div class="c-pt-6 c-pb-6 pos-relative">
            <div v-show="false" class="c-pt-1">
                <!-- <v-icon>fas fa-lock</v-icon> --> NikolayIgnatiev
            </div>
            <div class="c-pt-1">
                <v-icon size="18" class="c-mr-2">mail</v-icon>
                alex_skhor@mail.ru
            </div>
            <div class="c-pt-1">
                <v-icon size="18" class="c-mr-2">phone</v-icon>
                +375 25 90 05 003
            </div>
            
            <v-icon small color="grey lighten-1" class="corner-edit">mode_edit</v-icon>
        </div>

        <div style="margin: 0 -24px">
            <v-divider></v-divider>
        </div>

        <div class="sm-title bold c-pt-6">Personal Info</div>

        <div class="c-pt-4 c-pb-6">
            <div>
                <span class="half-bold">Birthday</span>
                <span class="right">9 Jan, 1990</span>
            </div>
            <div>
                <span class="half-bold">Registered</span>
                <span class="right">19 Feb, 2018</span>
            </div>
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
