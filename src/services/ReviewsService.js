import { getDecodedToken, getOwnerWif } from './../utils/auth'
import { signOperation } from './../utils/blockchain';
import reviewsHttp from './http/reviews';
import { ARTICLE_CODE, DATA_CODE } from '@/services/ResearchService';

const ASSESSMENT_CRITERIAS = {}

ASSESSMENT_CRITERIAS[ARTICLE_CODE] = [
  { name: "impact", title: "Impact", max: 5 },
  { name: "novelty", title: "Novelty", max: 5 },
  { name: "methodology", title: "Methodology", max: 5 }
]

ASSESSMENT_CRITERIAS[DATA_CODE] = [
  { name: "rationality", title: "Rationality", max: 5 },
  { name: "technical_quality", title: "Technical Quality", max: 5 },
  { name: "replication", title: "Replication", max: 5 }
]

ASSESSMENT_CRITERIAS["default"] = [
  { name: "novelty", title: "Novelty", max: 5 },
  { name: "technical_quality", title: "Technical Quality", max: 5 },
  { name: "methodology", title: "Methodology", max: 5 }
]

const getAssessmentCriteria = (typeCode) => {
  return ASSESSMENT_CRITERIAS[typeCode] || ASSESSMENT_CRITERIAS["default"];
}

const makeReview = function (researchContentId, isPositive, text) {
  const review = {
    author: getDecodedToken().username,
    research_content_id: researchContentId,
    is_positive: isPositive,
    content: text,
    weight: 10000
  };

  const operation = ["make_review", review];
  return signOperation(operation, getOwnerWif())
    .then((signedTx) => {
      return reviewsHttp.sendMakeReviewOp(signedTx)
    })
}

export {
  makeReview,
  getAssessmentCriteria
};
