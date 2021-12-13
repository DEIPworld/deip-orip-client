<template>
  <v-row no-gutters :style="rowStyles">
    <v-col v-for="(items, index) of criteriasChunks" :key="index" :style="colStyles">
      <d-dot-list :items="items" row-align="center">
        <template #label="{ item }">
          <div class="text-body-2">
            {{ item.title }}
          </div>
        </template>
        <template #value="{ item }">
          <d-rating
            v-model="form[item.id]"
            :readonly="readonly"
            :segments="item.max"
          />
        </template>
      </d-dot-list>
    </v-col>
  </v-row>
</template>

<script>
  import chunk from 'chunk';
  import DDotList from '@/components/Deipify/DDotList/DDotList';
  import { gutterable } from '@/mixins/gutterable';
  import DRating from '@/components/Deipify/DRating/DRating';
  import { reviewsChore } from '@/mixins/chores';

  export default {
    name: 'ReviewAssessment',
    components: { DRating, DDotList },
    mixins: [gutterable, reviewsChore],

    props: {
      value: {
        type: Object,
        required: true
      },
      contentType: {
        type: Number,
        required: true
      },
      readonly: {
        type: Boolean,
        required: false,
        default: true
      },

      columns: {
        type: Number,
        default: 1
      },

      gap: {
        type: [Number, String],
        default: 24
      },
    },

    data() {
      return {
        form: Object.keys(this.value)
          .reduce((form, field) => {
            form[field] = this.value[field];
            return form;
          }, {}),
        criterias: []
      };
    },

    computed: {
      criteriasChunks() {
        return chunk(this.criterias, Math.ceil(this.criterias.length / this.columns));
      },

      gutterValue() {
        return `${this.$$gutterInfo.number / 2}${this.$$gutterInfo.unit}`;
      },

      rowStyles() {
        return {
          marginLeft: `-${this.gutterValue}`,
          marginRight: `-${this.gutterValue}`
        }
      },

      colStyles() {
        return {
          paddingLeft: this.gutterValue,
          paddingRight: this.gutterValue
        }
      }
    },

    watch: {

      value: {
        handler(newVal, oldVal) {
          const keys = Object.keys(newVal);
          for (let i = 0; i < keys.length; i++) {
            const id = keys[i];
            if (this.criterias.some((criteria) => criteria.id == id) && this.form[id] != newVal[id]) {
              this.form[id] = newVal[id];
            }
          }
        },
        deep: true
      },

      form: {
        handler(newVal, oldVal) {
          this.$emit('input', newVal);
        },
        deep: true
      }
    },

    created() {
      const assesmentCriterias = this.$$getAssessmentCriterias(this.contentType);
      this.criterias = assesmentCriterias;
    },
  };
</script>
