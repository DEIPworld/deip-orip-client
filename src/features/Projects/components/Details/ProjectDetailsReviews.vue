<template>
  <!-- TODO: make review request condition props or move to slot -->
  <reviews-list
    :project-id="project.externalId"
    :content-id="null"
    :discipline-id="project.disciplines.map(({external_id}) => external_id)"
    :exclude-users="project.members"

    :disable-content-route="isLicensingAccessLimited"
    :disable-review-request-route="isLicensingAccessLimited || project.numberOfResearchContents === 0 || !$isLoggedIn"
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
