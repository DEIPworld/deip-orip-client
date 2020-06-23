<template>
  <v-snackbar
    :value="isActive"
    :color="type"
    :timeout="5000"
    @input="hideSnackbar"
  >
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="hideSnackbar"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'DSnackbar',
    data() {
      return {
        isActive: false
      };
    },

    computed: {
      ...mapGetters({
        message: 'snackbar/message',
        type: 'snackbar/type'
      })
    },

    created() {
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'snackbar/showMessage') {
          this.isActive = true;
        }
        if (mutation.type === 'snackbar/hideMessage') {
          this.isActive = false;
        }

      });
    },

    methods: {
      hideSnackbar() {
        this.$notifier.hide();
      }
    }
  };
</script>
