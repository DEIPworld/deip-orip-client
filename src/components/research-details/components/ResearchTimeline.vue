<template>
  <div v-if="timeline.length" class="mb-6">
    <v-row no-gutters>
      <v-col cols="auto" class="pr-4">
        <v-icon large color="grey lighten-2">
          mdi-flag
        </v-icon>
      </v-col>
      <v-col class="rd-block-header align-self-center">
        {{ $t('researchDetails.timeline') }}
      </v-col>
    </v-row>

    <v-row class="full-width pt-4">
      <v-col cols="8" class="milestone-description full-width text-body-2">
        {{ selectedTimelineItem.description }}
      </v-col>
      <v-col cols="4">
        <ul
          class="rd-timeline"
          :class="{ 'rd-timeline--full': timelineItemsToShow === timeline.length }"
        >
          <li
            v-for="(item, index) of timeline.slice(0, timelineItemsToShow)"
            :key="`timeline_item_${item.id}`"
            class="rd-timeline-item"
          >
            <div
              class="rd-timeline-item__marker rd-timeline-item__marker--clickable"
              :class="{ 'rd-timeline-item__marker--active': item === selectedTimelineItem }"
              :style="{ backgroundColor: getTimelineItemColor(index) }"
              @click="onTimelineMarkerClick(item)"
            />
            <div
              v-if="timelineItemsToShow !== timeline.length || index !== (timeline.length - 1)"
              class="rd-timeline-item__line"
              :style="{ background: `linear-gradient(${getTimelineItemColor(index)}, ${getTimelineItemColor(index + 1)})`}"
            />
            <div class="rd-timeline-item__date">
              {{ item.date }}
            </div>
            <div v-if="item.label" class="rd-timeline-item__label pt-1">
              {{ item.label }}
            </div>
            <div v-if="item.budget" class="rd-timeline-item__budget pt-1">
              <span class="font-weight-bold">$ {{ item.budget }}</span>
              <span class="pl-1">{{ item.purpose }}</span>
            </div>
          </li>
          <li v-if="timelineItemsToShow < timeline.length" class="rd-timeline-item">
            <div class="rd-timeline-item__marker" :style="{ backgroundColor: '#E0E0E0' }" />
            <div class="rd-timeline-item__line" :style="{ background: `#E0E0E0` }" />
            <v-btn
              outlined
              color="primary"
              class="ma-0"
              @click="onShowMoreTimelineClick()"
            >
              {{ $t('researchDetails.showEvents') }}
            </v-btn>
          </li>
        </ul>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'ResearchTimeline',

    props: {
      timeline: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        selectedTimelineItemId: 1,
        timelineItemsToShow: 3
      };
    },

    computed: {
      selectedTimelineItem() {
        return this.timeline.find((m) => m.id == this.selectedTimelineItemId);
      }
    },

    methods: {
      getTimelineItemColor(index) {
        const isIndexValid = index % 1 === 0 && index >= 0;
        if (!isIndexValid) {
          throw new Error('invalid index');
        }

        const colors = ['#8901EF', '#7558F2', '#2962FF', '#60B3F4', '#54E4F5'];

        const periodicity = (colors.length - 1) * 2;

        const reducedIndex = index % periodicity;
        const maxIndex = colors.length - 1;

        let colorIndex;
        if (reducedIndex <= maxIndex) {
          colorIndex = reducedIndex;
        } else {
          colorIndex = maxIndex - (reducedIndex % maxIndex);
        }
        return colors[colorIndex];
      },
      onShowMoreTimelineClick() {
        this.timelineItemsToShow = Math.min(
          this.timelineItemsToShow + 3,
          this.timeline.length
        );
      },
      onTimelineMarkerClick(item) {
        this.selectedTimelineItemId = item.id;
      }
    }
  };
</script>

<style lang="less" scoped>
  .rd-block-header {
    font-family: Muli;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    letter-spacing: 0.25px;
    color: black;
  }

  .rd-timeline {
    list-style: none;

    &--full {
      .rd-timeline-item {
        &:last-child {
          height: auto;
        }
      }
    }

    .rd-timeline-item {
      padding-left: 40px;
      position: relative;
      height: 110px;

      &__marker {
        border-radius: 50%;
        width: 12px;
        height: 12px;
        position: absolute;
        top: 10px;
        left: 0;

        &--clickable {
          &:hover {
            cursor: pointer;
            opacity: 0.8;
            box-shadow: 0px 0px 3px 0px rgba(153, 153, 153, 0.5);
            transform: scale(1.4, 1.4);
          }
        }

        &--active {
          transform: scale(1.4, 1.4);
        }
      }

      &__line {
        height: 92px;
        width: 2px;
        position: absolute;
        top: 25px;
        left: 5px;
      }

      &__date {
        font-family: Muli;
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #000000;
      }

      &__label {
        font-family: Roboto;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        color: #000000;
      }

      &__budget,
      &__purpose {
        font-family: Roboto;
        font-size: 12px;
        line-height: 18px;
        color: #9e9e9e;
      }
    }
  }
</style>
