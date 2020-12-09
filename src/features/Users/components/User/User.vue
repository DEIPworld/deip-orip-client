<template>
  <div data-wrapper>

  </div>
</template>

<script>
  export default {
    name: 'User',
    props: {
      userId: {
        type: String,
        default: null
      },
      userData: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
