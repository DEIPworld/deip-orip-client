<template>
  <v-row v-if="!isReadOnly" no-gutters>
    <template v-for="(item, i) in trl">
      <v-col :key="`${item.id}${i}`" class="text-align-center flex-1 trl-step mb-4">
        <div
          class="px-1 trl-step-header py-0"
          :class="{lightGrey:i+1 < 4,lightBlue:i+1 > 3 && i+1 < 7,lightGreen: i+1 > 6}"
        >
          <v-btn
            outlined
            large
            icon
            :input-value="item.id == currentTrlStep"
            :color="item.id == currentTrlStep ? 'primary' : 'blue'"
            class="ma-0"
            @click="changeCurrentTrlStep(item.id)"
          >
            {{ i+1 }}
          </v-btn>
        </div>
        <div class="px-1">
          <v-divider
            style="height:57px"
            :color="item.id == currentTrlStep ? '#2962ff' : '#2196f3'"
            vertical
          />

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div
                class="caption"
                :class="{['font-weight-bold']: item.id == currentTrlStep,['grey--text']: item.id != currentTrlStep}"
                v-on="on"
              >
                {{ item.shortTitle }}
              </div>
            </template>
            <span>{{ item.description }}</span>
          </v-tooltip>
        </div>
      </v-col>
    </template>
  </v-row>

  <v-row v-else-if="isChip && isReadOnly" no-gutters>
    <v-col cols="12" class="display-flex mb-2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div class="display-flex" v-on="on">
            <v-avatar size="24px" class="align-self-center">
              <v-icon size="24px" color="#0386b0">
                mdi-numeric-{{ currentTrlData.step }}-circle
              </v-icon>
            </v-avatar>
            <span class="subtitle-1 align-self-center font-weight-medium black--text">TRL</span>
          </div>
        </template>
        <span>{{ currentTrlData.description }}</span>
      </v-tooltip>
    </v-col>
  </v-row>

  <v-row v-else no-gutters>
    <v-col cols="12" class="mb-2 display-flex">
      <v-avatar size="30px" color="align-self-center mr-2">
        <v-icon color="#0386b0" large>
          mdi-numeric-{{ currentTrlData.step }}-circle
        </v-icon>
      </v-avatar>
      <span class="title align-self-center font-weight-medium">TRL</span>
    </v-col>
    <v-col cols="12" class="caption font-weight-bold">
      {{ currentTrlData.description }}
    </v-col>
  </v-row>
</template>

<script>
  import trlData from '@/components/common/trl.json';

  export default {
    name: 'TechnologyReadinessLevel',

    props: {
      currentTrlStep: {
        type: String,
        required: true
      },
      isReadOnly: {
        type: Boolean,
        required: false,
        default: false
      },
      isChip: {
        type: Boolean,
        required: false,
        default: false
      }
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
        this.$emit('changeCurrentTrlStep', step);
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

.lightGreen {
  background: #f4faf4;
}

.lightGrey {
  background: #fafafa;
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
</style>
