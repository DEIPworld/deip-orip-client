export const project = (isBig = false, isPlural = false) => {
  const p = isPlural ? 'projects' : 'project';
  return isBig ? p[0].toUpperCase() + p.slice(1) : p;
};
