<template>
  <div
    v-html="$t('signUp.free.form.privacyText', {link})"
  />
</template>

<script>
  export default {
    name: 'PrivacyPolicyText',
    props: {
      link: {
        type: String,
        default: ''
      }
    }
  };
</script>
