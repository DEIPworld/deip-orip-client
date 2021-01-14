import _ from 'lodash';

const mapAreaToProgram = (program, researchAreas) => {
  // to do: prepare a better algo for the demo, must be revised in the future
  program.disciplines = program.target_disciplines;
  
  const area = researchAreas.find((a) => a.subAreas.some((sa) => sa.disciplines.some((d) => program.disciplines.includes(d))));
  if (!area) {
    program.area = researchAreas[0];
    program.subArea = researchAreas[0].subAreas[0];
    return;
  }

  const subArea = area.subAreas.find((sa) => sa.disciplines.some((d) => program.disciplines.includes(d)));
  if (!subArea) {
    program.area = researchAreas[0];
    program.subArea = researchAreas[0].subAreas[0];
    return;
  }

  program.area = area;
  program.subArea = subArea;
};

export {
  mapAreaToProgram
};
