<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div class="spacer d-flex align-center" v-on="on">
        <v-avatar size="32" class="mr-3">
          <img :src="$options.filters.researchGroupLogoSrc(author.external_id, 32, 32, true)">
        </v-avatar>
        <div class="spacer">
          <div class="text-caption">
            {{ author.name }}
          </div>
        </div>
      </div>
    </template>
    <span>{{ author.name }}</span>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'ResearchListAuthor',
    props: {
      author: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
