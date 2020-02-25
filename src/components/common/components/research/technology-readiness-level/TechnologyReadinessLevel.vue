<template>
  <v-layout v-if="!isReadOnly" row wrap>
    <template v-for="(item, i) in trl">
      <v-flex :key="`${item.id}${i}`" text-align-center flex-1 trl-step mb-3>
        <v-layout column>
          <v-flex
            px-1
            trl-step-header
            :class="{lightGrey:i+1 < 4,lightBlue:i+1 > 3 && i+1 < 7,lightGreen: i+1 > 6}"
          >
            <v-btn
              outline
              large
              icon
              :input-value="item.id == currentTrlStep"
              @click="changeCurrentTrlStep(item.id)"
              color="primary"
              class="ma-0"
            >{{ i+1 }}</v-btn>
          </v-flex>
          <v-flex px-1>
            <v-divider style="height:57px" color="#2962ff" vertical></v-divider>
            <div
              class="caption"
              :class="{['font-weight-medium']: item.id == currentTrlStep}"
            >{{ item.description }}</div>
          </v-flex>
        </v-layout>
      </v-flex>
    </template>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex shrink headline font-weight-bold blue--text display-flex trl-label pl-1 pr-4 mb-2>
      <v-icon large color="blue">mdi-check-circle</v-icon>
      <span class="mx-3">TRL</span>
      {{ currentTrlData.step }}
    </v-flex>
    <v-flex grow class="body-2 blue--text">{{ currentTrlData.description }}</v-flex>
  </v-layout>
</template>

<script>
import trlData from './trl.json'

export default {
  name: "TechnologyReadinessLevel",

  props: {
    currentTrlStep: { type: String, required: true },
    isReadOnly: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      trl: trlData
    };
  },
  computed: {
    currentTrlData() {
      let step = 1;
      return {
        ...this.trl.find((item, i) => {
          if (item.id === this.currentTrlStep) {
            step = i + 1;
            return true;
          }
        }),
        step
      };
    }
  },
  methods: {
    changeCurrentTrlStep(step) {
      this.$emit("changeCurrentTrlStep", step);
    }
  }
};
</script>

<style lang="less" scoped>
.flex-1 {
  flex: 1;
}
.lightGrey {
  background: #fafafa;
}
.lightBlue {
  background: #ebf5fe;
}
.lightGreen {
  background: #f4faf4;
}
.trl-step {
  position: relative;
  &-header {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
  &:nth-child(3n + 4),
  &:first-child {
    .trl-step-header {
      border-left: 1px solid #e0e0e0;
    }
  }
  &:last-child:after {
    content: "";
    position: absolute;
    right: -48px;
    top: -7px;
    width: 50px;
    height: 60px;
    filter: drop-shadow(1px 0 0px #e0e0e0);
    background: linear-gradient(to left bottom, transparent 50%, #f4faf4 50%)
        top / 100% 50% no-repeat,
      linear-gradient(to left top, transparent 50%, #f4faf4 50%) bottom / 100%
        50% no-repeat;
  }
}
.trl-label {
  background: #ebf5fe;
  border: 1px solid #bbdefb;
  border-radius: 100px;
}
</style>