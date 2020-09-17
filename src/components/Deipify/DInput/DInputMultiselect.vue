<template>
  <v-sheet>

    <v-menu
      v-model="open"
      :close-on-content-click="false"
      offset-y
      offset-overflow
      max-height="560"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="search"
          :label="label"
          outlined
          hide-details="auto"
          v-bind="attrs"
          v-on="on"
        />
      </template>

      <v-list>
        <v-list-item v-for="item of internalItems" :key="item.value">
          <v-list-item-action>
            <v-checkbox
              v-model="internalValue"
              :value="item.value"
              color="primary"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <div class="text-body-2">
              {{ item.title }}
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-sheet
      class="mt-2 ml-n1 mr-n1 mb-n1"
    >
      <v-chip
        v-for="value in sortedLabels"
        :key="value"
        class="ma-1"
        outlined
        close
        close-icon="close"
        @click:close="removeItem(value)"
      >
        {{ getItemObject(value).title }}
      </v-chip>
    </v-sheet>

  </v-sheet>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'DInputMultiselect',
    mixins: [Proxyable],
    props: {
      label: {
        type: String,
        default: null
      },
      items: {
        type: Array,
        default: () => ({})
      }
    },
    data() {
      return {
        search: '',
        open: false
      };
    },
    computed: {
      internalItems() {
        return this.$where(
          this.items,
          {
            '+title': (val) => new RegExp(
              this.search.toLowerCase(), 'g'
            ).test(val.toLowerCase())
          }
        );
      },

      sortedLabels() {
        const base = [...this.items.map((i) => i.value)];
        const unsorted = [...this.internalValue];

        const sorted = unsorted.sort((lhs, rhs) => {
          const lhsi = base.indexOf(lhs);
          const rhsi = base.indexOf(rhs);

          return lhsi > rhsi ? 1 : lhsi < rhsi ? -1 : 0;
        });
        return sorted;
      }
    },
    created() {
      if (!this.internalValue) {
        this.internalValue = [];
      }
    },
    methods: {
      removeItem(item) {
        const idx = this.internalValue.indexOf(item);
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.internalValue = [...new Set(this.internalValue)];
        }
      },
      getItemObject(value) {
        console.log
        return this.items.find((i) => i.value === value);
      }
    }
  };
</script>
