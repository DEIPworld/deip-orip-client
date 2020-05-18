<template>
  <modal-route-view hide-toolbar center-content>
    <login-form logo="AR3C" redirect="/admin" centered />
  </modal-route-view>
</template>

<script>
  import ModalRouteView from '@/components/layout/ModalRouteView';
  import LoginForm from '@/components/auth/components/LoginForm';

  export default {
    name: 'AdminLogin',
    components: { LoginForm, ModalRouteView }
  };
</script>
