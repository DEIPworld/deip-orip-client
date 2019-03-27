export const organizations = {
  0: {
      "id": 0,
      "title": "Independent researcher",
      "name": "No organisation",
      "abbreviation": "",
  },
  1: {
    "id": 1,
    "title": "Treasury",
    "abbreviation": "",
    "name": "Treasury"
  },
  2: {
      "id": 2,
      "title": "National Science Foundation",
      "abbreviation": "NSF",
      "name": "NSF",
  },
  3: {
      "id": 3,
      "title": "Massachusetts Institute of Technology",
      "abbreviation": "MIT",
      "name": "MIT",
  },
  4: {
    "id": 4,
    "title": "Stanford University",
    "abbreviation": "",
    "name": "Stanford",
  },
  5: {
      "id": 5,
      "title": "California Institute of Technology",
      "abbreviation": "CalTech",
      "name": "CalTech",
  }
}

export const getOrganizationTitle = (orgId) => {
    orgId = orgId == 2 ? 0 : orgId; // temp filter for treasury
    let org = organizations[orgId];
    return org ? `${org.title} ${(org.abbreviation ? "(" + org.abbreviation + ")" : "")}` : "";
}

export const isUniversityName = (name) => {
  return Object.values(organizations).some(o => o.name == name);
}

export const getUniversityByName = (name) => {
  return Object.values(organizations).find(o => o.name == name);
}

export const getUniversityById= (id) => {
  return Object.values(organizations).find(o => o.id == id);
}
