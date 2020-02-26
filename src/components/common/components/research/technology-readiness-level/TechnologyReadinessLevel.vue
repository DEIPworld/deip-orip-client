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
              :color="item.id == currentTrlStep ? 'primary' : 'blue'"
              class="ma-0"
            >{{ i+1 }}</v-btn>
          </v-flex>
          <v-flex px-1>
            <v-divider
              style="height:57px"
              :color="item.id == currentTrlStep ? '#2962ff' : '#2196f3'"
              vertical
            ></v-divider>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div
                  class="caption"
                  :class="{['font-weight-bold']: item.id == currentTrlStep,['grey--text']: item.id != currentTrlStep}"
                  v-on="on"
                >{{ item.shortTitle }}</div>
              </template>
              <span>{{ item.description }}</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-flex>
    </template>
  </v-layout>
  <v-layout row wrap v-else-if="isChip && isReadOnly">
     <v-chip :color="trlBGColor" :text-color="trlColor">
      <v-avatar>
        <v-icon>mdi-check-circle</v-icon>
      </v-avatar>
      TRL {{ currentTrlData.step }}
    </v-chip>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex
      shrink
      font-weight-bold
      display-flex
      trl-label
      pl-1
      pr-4
      mb-2
      :class="`trl-label-${trlColor} ${trlColor}--text`"
    >
      <v-icon large :color="trlColor">mdi-check-circle</v-icon>
      <span class="mx-3">TRL</span>
      {{ currentTrlData.step }}
    </v-flex>
    <v-flex grow class="body-2 grey--text">{{ currentTrlData.description }}</v-flex>
  </v-layout>
</template>

<script>
import trlData from '@/components/common/trl.json';

export default {
  name: "TechnologyReadinessLevel",

  props: {
    currentTrlStep: { type: String, required: true },
    isReadOnly: { type: Boolean, required: false, default: false },
    isChip: {type: Boolean, required: false, default: false}
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
    },
    trlColor() {
      return this.currentTrlData.step < 4
        ? "grey"
        : this.currentTrlData.step > 3 && this.currentTrlData.step < 9
        ? "blue"
        : this.currentTrlData.step > 8
        ? "green"
        : null;
    },
     trlBGColor() {
      return this.currentTrlData.step < 4
        ? "#e0e0e0"
        : this.currentTrlData.step > 3 && this.currentTrlData.step < 9
        ? "#bbdefb"
        : this.currentTrlData.step > 8
        ? "#c8e6c9"
        : null;
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
  border-radius: 100px;
  font-size: 24px !important;
  font-weight: 400;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  &-grey {
    background: #e0e0e0;
  }
  &-blue {
    background: #bbdefb;
  }
  &-green {
    background: #c8e6c9;
  }
}
</style>