<template>
    <div>
        <div class="row">
            <div>
                <v-tooltip bottom color="white">
                    <div class="start-point deip-blue-bg white--text" slot="activator">Start</div>
                    <div>
                        <div class="black--text half-bold">{{research.title}}</div>
                        <div class="grey--text">{{new Date(research.created_at).toString()}}</div>
                    </div>
                </v-tooltip>
            </div>
            <div class="col-grow pos-relative row-nowrap align-center">

                <div v-if="offsets && offsets.length != 0" class="chapter-line black" :style="{ width: offsets[offsets.length - 1].value + '%' }"></div>
                <div class="chapter-line grey lighten-1 col-grow"></div>

                <div v-if="offsets && offsets.length != 0" class="pos-absolute" :style="{ left: offset.value + '%' }"
                    v-for="(offset, i) in offsets" :key="i">
                    <v-tooltip bottom color="white">
                        <div class="chapter-point deip-blue-bg" slot="activator"></div>
                        <div>
                            <div class="black--text half-bold">Chapter {{ i + 1 }}, {{contentList[i].title}}</div>
                            <div class="grey--text">{{new Date(contentList[i].created_at).toString()}}</div>
                        </div>
                    </v-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchTimeline",
        props: {
            research: { required: true, type: Object, default: undefined },
            contentList: { required: true, type: Array, default: undefined }
        },
        computed: {
            offsets: function () {     
                if (this.research !== undefined && this.contentList !== undefined 
                        && this.contentList.length !== 0) {

                    const startTimestamp = Date.parse(this.research.created_at);
                    const endTimestamp = Date.parse(this.contentList[this.contentList.length - 1].created_at);
                    const allTime = endTimestamp - startTimestamp;

                    const offsets = [];
                    // the end of timeline can be reached for finished research only
                    const maxRatio = this.research.is_finished ? 100 : 70;
                    for (let i = 0; i < this.contentList.length; i++) {
                        const contentTimestamp = Date.parse(this.contentList[i].created_at);

                        // calculate item ratio by its index
                        var indexFactor = (i + 1) / this.contentList.length * maxRatio;
                        
                        // calculate item ratio by its timestamp
                        var timestampFactor;
                        if(allTime === 0) {
                            // all research content have been posted at the same time (genesis)
                            timestampFactor = i == this.contentList.length - 1 ? maxRatio : 50;
                        } else {
                            var timeAfter = endTimestamp - contentTimestamp;
                            timestampFactor = 100 - (timeAfter / allTime * 100) || 1;
                        }

                        // adjust position relative to entire timeline period
                        var ratio = (indexFactor * timestampFactor) / 100;
                        offsets.push({ value: ratio.toFixed(2) });
                    }

                    return offsets;
                }
                return [];
            }
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
