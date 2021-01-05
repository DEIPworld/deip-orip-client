import { createEnum } from '@deip/toolbox';

export const VIEW_TYPES = createEnum({
  GRID: 1,
  TABLE: 2
});

export const SKELETONS = {
  card: 'heading, description@2, meta',
  meta: 'text@3',
  description: 'text@3',
  grid: 'card@12'
};

export const LAYOUT_TYPES = createEnum({
  SET: 1,
  READ: 2,
  EDIT: 3
});

export const maxTitleLength = 255;
export const maxDescriptionLength = 2048;

export const defaultAssetId = 'EUR';
