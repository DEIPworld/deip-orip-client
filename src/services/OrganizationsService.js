import organizations from "./organizations.json";

const getAllOrganizations = () => {
  return organizations;
}

const getResearchOrganization = (researchId) => {
  let orgs = getAllOrganizations();
  return orgs.find(org => org.researches.some(id => id == researchId));
}

export default {
  getAllOrganizations,
  getResearchOrganization
};
