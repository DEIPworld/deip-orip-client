<template>
  <div>
    <v-row no-gutters class="mb-1">
      <v-col class="text-caption" cols="auto">
        Total ECI
      </v-col>
      <v-spacer />
      <v-col
        class="text-caption font-weight-medium"
        :class="member.classList"
        cols="auto"
      >
        {{ member.expertiseStats.eci | commaNumber }}
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-1">
      <v-col class="text-caption" cols="auto">
        Percentile rank
      </v-col>
      <v-spacer />
      <v-col
        class="text-caption font-weight-medium"
        :class="member.classList"
        cols="auto"
      >
        {{ member.expertiseStats.percentile_rank }}
      </v-col>
    </v-row>

    <v-row no-gutters class="mb-1">
      <v-col class="text-caption" cols="auto">
        Growth rate
      </v-col>
      <v-spacer />
      <v-col
        class="text-caption font-weight-medium"
        :class="$options.filters.numDirClass(member.expertiseStats.growth_rate)"
        cols="auto"
      >
        {{ member.expertiseStats.growth_rate | numDir }}
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { abstractMemberItem } from '@/components/MemberList/MemberListItem/abstractMemberItem';

  export default {
    name: 'MemberListItemStatInfo',
    mixins: [abstractMemberItem]
  };
</script>
