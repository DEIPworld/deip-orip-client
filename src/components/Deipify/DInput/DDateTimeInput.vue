<template>
  <v-sheet class="d-flex pa-6">
    <v-spacer
      style="margin-right: -1px;"
    >
      <d-input-date v-model="date" :field-props="{class: 'rounded-br-0 rounded-tr-0'}" />
    </v-spacer>
    <v-sheet min-width="112px" width="30%">
      <d-time-input v-model="time" class="rounded-bl-0 rounded-tl-0" />
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
    data() {
      return {
        date: undefined,
        time: undefined
      }
    }
  };
</script>
