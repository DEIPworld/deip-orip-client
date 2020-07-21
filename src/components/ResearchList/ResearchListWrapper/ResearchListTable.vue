<template>
  <div>
    <v-divider />
    <v-simple-table>
      <tbody>
        <slot />
      </tbody>
    </v-simple-table>
    <v-divider />
  </div>
</template>

<script>
  export default {
    name: 'ResearchListTable'
  };
</script>
