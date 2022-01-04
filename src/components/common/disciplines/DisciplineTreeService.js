import _ from 'lodash';

const mapAreaToProgram = (program, projectAreas) => {
  // to do: prepare a better algo for the demo, must be revised in the future
  program.domains = program.domains;
  
  const area = projectAreas.find((a) => a.subAreas.some((sa) => sa.domains.some((d) => program.domains.includes(d))));
  if (!area) {
    program.area = projectAreas[0];
    program.subArea = projectAreas[0].subAreas[0];
    return;
  }

  const subArea = area.subAreas.find((sa) => sa.domains.some((d) => program.domains.includes(d)));
  if (!subArea) {
    program.area = projectAreas[0];
    program.subArea = projectAreas[0].subAreas[0];
    return;
  }

  program.area = area;
  program.subArea = subArea;
};

export {
  mapAreaToProgram
};
