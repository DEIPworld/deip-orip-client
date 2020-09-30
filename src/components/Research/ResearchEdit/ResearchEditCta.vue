<template>
  <div class="mt-4">
    <v-btn
      small
      outlined
      color="white"
      :to="{
      name: 'research.edit',
      params: {
        researchExternalId: $route.params.researchExternalId
      }
    }"
    >
      <v-icon left size="18">
        mdi-pencil-outline
      </v-icon>
      Edit
    </v-btn>
  </div>
</template>

<script>
  export default {
    name: 'ResearchEditCta'
  };
</script>
