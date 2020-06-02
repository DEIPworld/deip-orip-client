<template>
  <v-snackbar
    v-model="isActive"
    :color="type"
    :timeout="5000"
    @input="hideSnackbar"
  >
    {{ message }}
    <v-btn text @click="hideSnackbar">
      Close
    </v-btn>
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
      }),
    },

    created() {
      this.$store.subscribe((mutation) => {
        this.isActive = mutation.type === 'snackbar/showMessage';
      });
    },

    methods: {
      hideSnackbar() {
        this.$notifier.hide();
      }
    }
  };
</script>
