export const project = (isBig, isPlural) => {
  const p = isPlural ? 'technologies' : 'technology';
  return isBig ? p[0].toUpperCase() + p.slice(1) : p;
};
