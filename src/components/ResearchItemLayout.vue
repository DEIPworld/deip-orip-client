<template>
    <div class="row p-6 bg-gray">
        <div class="col-9 col-offset-3">

            <!-- research item layout -->
            <div>
                <div class="body row">

                    <div class="row col-6">
                        <div class="row-nowrap p-5 m-auto">
                            <img class="research-avatar" src="../assets/nuclearman.jpg" >
                        </div>
                        <div class="col">
                            <div class="title pt-4">
                                Nuclear power is the use of nuclear reactions
                            </div>
                            <div class="pv-4">
                                This article is about nuclear fission and fusion power sources primarily. 
                                For commercial quantities of heat derived from naturally occurring nuclear decay.
                            </div>
                            <div class="row pb-2">
                                <div class="dark-gray">Stage: Milestone 4</div>
                                <div class="col ph-4 row-nowrap">
                                    <div class="stage-indicator mv-auto">
                                        <div style="width: 80%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row col-6">
                        <div class="col">
                            <div class="pt-4 mh-auto researchers">
                                <div class="pl-2">Researchers</div>
                                <div class="pos-relative height-3 pt-4">
                                    <img class="user-avatar pos-absolute" style="left: 0rem;" src="../assets/nuclearman.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 2rem;" src="../assets/brain.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 4rem;" src="../assets/charmander.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 6rem;" src="../assets/joker.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 8rem;" src="../assets/nuclearman.jpg" >
                                    <div class="more-users pos-absolute row-nowrap" style="left: 10rem;">
                                        <span class="m-auto">+41</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column pt-8 ph-5">
                            <!-- "btns" should be remade -->
                            <div class="btn ph-5 pv-2 text-align-center mh-auto">View Details</div>
                            <div class="pv-4 mh-auto" style="color: #1155dd;">Add to Bookmarks</div>
                        </div>
                    </div>

                </div>

                <div class="footer row align-items-center justify-between p-2">
                    <div class="row-nowrap pl-3">
                        <span class="sphere-badge mr-2" style="background-color: #3333dd;">Computer-science</span>
                        <span class="sphere-badge mr-2" style="background-color: #ff9933;">Psyhology</span>
                    </div>
                    <div>
                        <span class="dark-gray"> <b>㋡</b> 71</span>
                        <span class="dark-gray ph-5">Last Update: 01/28/2018</span>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchItemLayout",
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="less" scoped>
    @import '../styles/common.less';

    .bg-gray {
        background-color: #bbbbbb;
    }

    .body {
        border-top-left-radius: .5rem;
        border-top-right-radius: .5rem;
        background-color: #ffffff;

        .research-avatar {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
        }
        .researchers {
            width: 15rem;
        }
        .title {
            font-size: 1.2rem;
        }
        .user-avatar {
            border-radius: 50%;
            height: 3rem;
            width: 3rem;
        }
        .more-users {
            .user-avatar();
            background-color: #1155dd;
            color: #ffffff;

            span {
                transform: translateX(-0.1rem);
            }
        }
    }
    .footer {
        border-bottom-left-radius: .5rem;
        border-bottom-right-radius: .5rem;
        background-color: #eeeeee;
    }
    .sphere-badge {
        font-size: .75rem;
        border-radius: 2rem;
        color: #ffffff;
        padding: .2rem .6rem;
    }
    .dark-gray {
        color: #777777;
    }
    .stage-indicator {
        background-color: #dddddd;
        height: .25rem;
        width: 100%;
        border-radius: .25rem;

        div {
            background-color: #42b983;
            border-radius: .2rem;
            height: 100%;
        }
    }

    .btn {
        background-color: #1155dd;
        border-radius: .25rem;
        color: #ffffff;
    }
</style>
