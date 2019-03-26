export const organizations = {
  0: {
      "id": 0,
      "title": "Independent researcher",
      "abbreviation": "",
  },
  1: {
    "id": 1,
    "title": "Treasury",
    "abbreviation": "",
  },
  2: {
      "id": 2,
      "title": "National Science Foundation",
      "abbreviation": "NSF",
  },
  3: {
      "id": 3,
      "title": "Massachusetts Institute of Technology",
      "abbreviation": "MIT",
  },
  4: {
    "id": 4,
    "title": "Stanford University",
    "abbreviation": "",
  },
  5: {
      "id": 5,
      "title": "California Institute of Technology",
      "abbreviation": "CalTech",
  }   
}

export const getOrganizationTitle = (orgId) => {
    orgId = orgId == 2 ? 0 : orgId; // temp filter for treasury
    let org = organizations[orgId];
    return org ? `${org.title} ${(org.abbreviation ? "(" + org.abbreviation + ")" : "")}` : "";
}