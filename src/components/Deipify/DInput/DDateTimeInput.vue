<template>
  <v-sheet class="d-flex">
    <v-spacer
      style="margin-right: -1px;"
    >
      <d-input-date
        v-model="date"
        :label="label"
        :only-future="onlyFuture"
        :field-props="{class: 'rounded-br-0 rounded-tr-0'}"
      />
    </v-spacer>
    <v-sheet min-width="112px" width="30%">
      <d-time-input
        v-model="time"
        :date="onlyFuture ? date : ''"
        placeholder="00:00"
        class="rounded-bl-0 rounded-tl-0"
      />
    </v-sheet>
  </v-sheet>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DTimeInput from '@/components/Deipify/DInput/DTimeInput';

  export default {
    name: 'DDateTimeInput',
    components: { DTimeInput, DInputDate },
    mixins: [Proxyable],
    props: {
      label: {
        type: String,
        default: null
      },
      onlyFuture: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        date: undefined,
        time: undefined
      };
    },
    computed: {
      dateTime() {
        return `${this.date}T${this.time || '00:00'}:00`;
      }
    },
    watch: {
      dateTime(val) {
        this.internalValue = val;
      }
    },
    created() {
      if (this.internalValue) {
        this.setModel();
      }
    },
    methods: {
      setModel() {
        const [date, time] = this.internalValue.split('T');
        this.date = date;
        this.time = time;
      }
    }
  };
</script>
