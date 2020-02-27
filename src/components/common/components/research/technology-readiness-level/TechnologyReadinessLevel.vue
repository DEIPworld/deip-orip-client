<template>
  <v-layout v-if="!isReadOnly" row wrap>
    <template v-for="(item, i) in trl">
      <v-flex :key="`${item.id}${i}`" text-align-center flex-1 trl-step mb-3>
        <v-layout column>
          <v-flex px-1 trl-step-header lightBlue>
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
    <v-flex mb-2 xs12 display-flex>
      <v-avatar size="30px" color="align-self-center ">
        <v-icon color="#0386b0">mdi-numeric-{{ currentTrlData.step }}-circle</v-icon>
      </v-avatar>
      <span class="subheading align-self-center font-weight-medium black--text">TRL</span>
    </v-flex>
    <v-flex xs12 class="caption font-weight-bold">{{ currentTrlData.description }}</v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex mb-2 xs12 display-flex>
      <v-avatar size="30px" color="align-self-center mr-2">
        <v-icon color="#0386b0" large>mdi-numeric-{{ currentTrlData.step }}-circle</v-icon>
      </v-avatar>
      <span class="title align-self-center font-weight-medium">TRL</span>
    </v-flex>
    <v-flex xs12 class="caption font-weight-bold">{{ currentTrlData.description }}</v-flex>
  </v-layout>
</template>

<script>
import trlData from "@/components/common/trl.json";

export default {
  name: "TechnologyReadinessLevel",

  props: {
    currentTrlStep: { type: String, required: true },
    isReadOnly: { type: Boolean, required: false, default: false },
    isChip: { type: Boolean, required: false, default: false }
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
.lightBlue {
  background: #ebf5fe;
}
.trl-step {
  position: relative;
  &-header {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
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
    background: linear-gradient(to left bottom, transparent 50%, #ebf5fe 50%)
        top / 100% 50% no-repeat,
      linear-gradient(to left top, transparent 50%, #ebf5fe 50%) bottom / 100%
        50% no-repeat;
  }
}
</style>