<template>
  <reviews-list
    :project-id="project.externalId"
    :has-content-selector="false"
    :disabled="$$limitedAccess"
    v-bind="$$limitedAccessProps"
  />
</template>

<script>
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';
  import { limitAccess } from '@/mixins/limitAccess';
  import ReviewsList from '@/features/Reviews/components/List/ReviewsList';

  export default {
    name: 'ProjectDetailsReviews',
    components: { ReviewsList },
    mixins: [
      projectDetails,
      limitAccess
    ],
  };
</script>
