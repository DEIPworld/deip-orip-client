<template>
  <v-sheet max-width="400px" class="mx-auto my-12">
    <v-autocomplete
      outlined
      multiple
      clearable
      deletable-chips
      placeholder="Search item"
      :items="['qqqqqqqqqq','wwssssssssw','ddsdqqwwqdsqwd','qwdqwdqwdqwd','sadsadsadsad','dqdqwdqwdqwd']"
    >
      <template #selection="{ item, index }">
          <span
            v-if="index === 0"
            class="grey--text caption"
          >
            15 selected
          </span>
        <portal to="asasas" :order="index" slim>
          <v-chip close outlined class="ma-1">
            {{ item }}
          </v-chip>
        </portal>
      </template>
    </v-autocomplete>
    <portal-target name="asasas" multiple class="ma-n1" />
  </v-sheet>
</template>

<script>
  export default {
    name: 'selectPortal'
  };
</script>

<style scoped>

</style>
