export const project = (isBig = false, isPlural = false) => {
  const p = isPlural ? 'technologies' : 'technology';
  return isBig ? p[0].toUpperCase() + p.slice(1) : p;
};
