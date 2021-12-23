<template>
  <!-- TODO: make review request condition props or move to slot -->
  <reviews-list
    :project-id="project._id"
    :content-id="null"
    :domain-id="project.domains.map((_id) => _id)"
    :exclude-users="project.members"

    :disable-content-route="!contentAssessAllowed"
    :disable-review-request-route="!contentAssessAllowed || project.numberOfProjectContents === 0 || $isGuest"
    :disable-create-route="true"
  />
</template>

<script>
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';
  import ReviewsList from '@/features/Reviews/components/List/ReviewsList';

  export default {
    name: 'ProjectDetailsReviews',
    components: { ReviewsList },
    mixins: [
      projectDetails
    ]
  };
</script>
