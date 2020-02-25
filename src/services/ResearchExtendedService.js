import researchHttp from './http/researchExtended';

const getResearch = researchId => researchHttp.getResearch(researchId)

const updateResearch = (researchId, milestones, videoSrc, partners, trl) => {
  const update = {
    milestones,
    videoSrc,
    partners,
    trl
  }
  return researchHttp.updateResearch(researchId, update)
}

export {
  getResearch,
  updateResearch
}
