<template>
  <div>
    <v-expansion-panel class="elevation-0">
      <research-details-materials-item
        v-for="content of contentList"
        :key="content.id"
        :content="content"
      />
    </v-expansion-panel>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ResearchDetailsMaterials",

  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      contentList: "rd/contentList"
    })
  },
  methods: {}
};
</script>

<style scoped>
</style>