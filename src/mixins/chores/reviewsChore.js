import { RESEARCH_CONTENT_TYPES } from '@/variables';
import { ResearchContentService } from '@deip/research-content-service';

const researchContentService = ResearchContentService.getInstance();

export const reviewsChore = {
  methods: {
    $$getAssessmentCriterias(contentType) {
      const typeInfo = researchContentService.getResearchContentType(contentType);
      const assesmentInfo = this.$tenantSettings.assesmentCriterias.some(a => a.contentType == typeInfo.id)
        ? this.$tenantSettings.assesmentCriterias.find(a => a.contentType == typeInfo.id)
        : this.$tenantSettings.assesmentCriterias.find(a => a.contentType == RESEARCH_CONTENT_TYPES.UNKNOWN);
        
      return assesmentInfo ? assesmentInfo.values.map(a => ({...a})) : [];
    }
  }
};
