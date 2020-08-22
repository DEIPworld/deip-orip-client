<template>
  <div
    class="d-flex"
  >
    <div
      v-for="(item, i) in criterias"
      :key="`${i}-tenantCriteria`"
      class="d-flex mr-4"
    >
      <div v-if="item.attribute.type === 'stepper'">
        <v-tooltip v-if="item.attribute.description" bottom>
          <template v-slot:activator="{ on }">
            <div class="d-flex align-center" v-on="on">
              <span class="text-overline mr-1">{{ item.attribute.shortTitle }}</span>
              <v-avatar :size="18" class="mr-1" color="grey">
                <span class="white--text text-body-2 font-weight-medium">{{ item.value.number }}</span>
              </v-avatar>
            </div>
          </template>
          <span>{{ item.attribute.description }}</span>
        </v-tooltip>
        <div v-else class="d-flex align-center">
          <span class="text-overline mr-1">{{ item.attribute.shortTitle }}</span>
          <v-avatar :size="18" class="mr-1" color="grey">
            <span class="white--text text-body-2 font-weight-medium">{{ item.value.number }}</span>
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
