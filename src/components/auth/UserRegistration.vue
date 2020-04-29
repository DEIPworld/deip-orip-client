<template>
  <modal-route-view :title="title">
    <div class="title">
      Personal Information
    </div>
  </modal-route-view>
</template>

<script>
  import ModalRouteView from '@/components/layout/ModalRouteView';

  export default {
    name: 'UserRegistration',
    components: { ModalRouteView },
    props: {
      title: {
        type: String,
        default: 'Sign Up'
      },
      hideAgree: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style scoped>

</style>
