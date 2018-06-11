<template>
    <div>
        <div v-if="research" class="row">
            <div>
                <v-tooltip bottom color="white">
                    <div class="start-point deip-blue-bg white--text" slot="activator">Start</div>
                    <div>
                        <div class="black--text half-bold">{{research.title}}</div>
                        <div class="grey--text">{{new Date(research.created_at).toDateString()}}</div>
                    </div>
                </v-tooltip>
            </div>
            <div class="col-grow pos-relative row-nowrap align-center">

                <div v-if="timelineOffsets && timelineOffsets.length != 0" class="chapter-line black" :style="{ width: timelineOffsets[timelineOffsets.length - 1].value + '%' }"></div>
                <div class="chapter-line grey lighten-1 col-grow"></div>

                <div v-if="timelineOffsets && timelineOffsets.length != 0" class="pos-absolute" :style="{ left: offset.value + '%' }"
                    v-for="(offset, i) in timelineOffsets" :key="i">
                    <v-tooltip bottom color="white">
                        <div class="chapter-point deip-blue-bg" slot="activator"></div>
                        <div>
                            <div class="black--text half-bold">Chapter {{ i + 1 }}, {{contentList[i].title}}</div>
                            <div class="grey--text text-align-center">{{new Date(contentList[i].created_at).toDateString()}}</div>
                        </div>
                    </v-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchTimeline",
        computed: {
            ...mapGetters({
                user: 'auth/user',
                research: 'rd/research',
                contentList: 'rd/contentList',
                timelineOffsets: 'rd/timelineOffsets'
            })
        }
    };
</script>

<style lang="less" scoped>
    .start-point {
        text-transform: uppercase;
        height: 30px;
        padding: 0 12px;
        line-height: 32px;
        border-radius: 20px;

        &:hover {
            box-shadow: 0px 6px 6px -3px rgba(0,0,0,0.2), 
                        0px 10px 14px 1px rgba(0,0,0,0.14), 
                        0px 4px 18px 3px rgba(0,0,0,0.12);
        }
    }

    .chapter-line {
        height: 2px;
    }
    .chapter-point {
        width: 22px;
        height: 22px;
        border-radius: 50%;

        &:hover {
            box-shadow: 0px 6px 6px -3px rgba(0,0,0,0.2), 
                        0px 10px 14px 1px rgba(0,0,0,0.14), 
                        0px 4px 18px 3px rgba(0,0,0,0.12);
        }
    }
</style>
