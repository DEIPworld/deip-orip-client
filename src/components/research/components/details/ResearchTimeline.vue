<template>
    <div>
        <div class="row">
            <div>
                <div class="start-point deip-blue-bg white--text">Start</div>
            </div>
            <div class="col-grow pos-relative row-nowrap align-center">

                <div class="chapter-line black" :style="{ width: offsets[offsets.length - 1].value + '%' }"></div>
                <div class="chapter-line grey lighten-1 col-grow"></div>

                <div class="pos-absolute" 
                    :style="{ left: offset.value + '%' }"
                    v-for="(offset, i) in offsets" :key="i"
                >
                    <v-tooltip bottom color="white">
                        <div class="chapter-point deip-blue-bg" slot="activator"></div>
                        <div>
                            <div class="black--text half-bold">Chapter {{ i + 1 }}, Globaly pum purum purum</div>
                            <div class="grey--text">28 Jun, Noname Pum</div>
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
        data() {
            return {
                startTimestamp: 1520408000000,
                chapters: [
                    {
                        timestamp: 1520812800000
                    }, {
                        timestamp: 1521331200000
                    }, {
                        timestamp: 1521936000000
                    }, {
                        timestamp: 1523232000000
                    }
                ],
                offsets: []
            };
        },
        created() {
            let period = Date.now() - this.startTimestamp;

            for (let i = 0; i < this.chapters.length; i++) {
                this.offsets.push({ 
                    value: (100 * (this.chapters[i].timestamp - this.startTimestamp) / period).toFixed(2)
                }); 
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
    }

    .chapter-line {
        height: 2px;
    }
    .chapter-point {
        width: 22px;
        height: 22px;
        border-radius: 50%;
    }
</style>
