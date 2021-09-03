import { RESEARCH_CONTENT_TYPES } from '@/variables';
import { ProjectContentService } from '@deip/project-content-service';

const projectContentService = ProjectContentService.getInstance();

export const reviewsChore = {
  methods: {
    $$getAssessmentCriterias(contentType) {
      const typeInfo = projectContentService.getProjectContentType(contentType);
      const assesmentInfo = this.$tenantSettings.assesmentCriterias.some(a => a.contentType == typeInfo.id)
        ? this.$tenantSettings.assesmentCriterias.find(a => a.contentType == typeInfo.id)
        : this.$tenantSettings.assesmentCriterias.find(a => a.contentType == RESEARCH_CONTENT_TYPES.UNKNOWN);
        
      return assesmentInfo ? assesmentInfo.values.map(a => ({...a})) : [];
    }
  }
};
