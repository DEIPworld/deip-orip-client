<template>
  <d-autocomplete
    v-model="internalValue"
    :items="list"
    outlined
    hide-details="auto"
  />
</template>

<script>
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { createRange } from 'vuetify/lib/util/helpers';
  import { padStart } from '@/utils/helpers';

  export default {
    name: 'DTimeInput',
    components: { DAutocomplete },
    mixins: [Proxyable],
    props: {
      graduate: {
        type: Number,
        default: 5,
      }
    },
    computed: {
      list() {
        const hours = createRange(24);
        const minutes = createRange(60);

        const list = [];

        for (const h of hours) {
          for (const m of minutes) {
            if (m % this.graduate === 0) {
              list.push(`${padStart(h, 2)}:${padStart(m, 2)}`);
            }
          }
        }

        return list;
      }
    }
  };
</script>
