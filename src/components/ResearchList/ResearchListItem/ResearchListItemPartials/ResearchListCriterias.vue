<template>
  <div
    class="d-flex"
  >
    <div
      v-for="(item, i) in criterias"
      :key="`${i}-tenantCriteria`"
      class="d-flex mr-4"
    >
      <div v-if="item.type === 'stepper'">
        <v-tooltip v-if="item.step.description" bottom>
          <template v-slot:activator="{ on }">
            <div class="d-flex align-center" v-on="on">
              <span class="text-overline mr-1">{{ item.readinessLevelShortTitle }}</span>
              <v-avatar size="20" class="mr-1" color="grey">
                <span class="white--text text-h6">{{ item.value.index + 1 }}</span>
              </v-avatar>
            </div>
          </template>
          <span>{{ item.step.description }}</span>
        </v-tooltip>
        <div v-else class="d-flex align-center">
          <span class="text-overline mr-1">{{ item.readinessLevelShortTitle }}</span>
          <v-avatar size="20" class="mr-1" color="grey">
            <span class="white--text text-h6">{{ item.value.index + 1 }}</span>
          </v-avatar>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'ResearchListCriterias',
    props: {
      criterias: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
