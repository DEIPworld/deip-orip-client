import RecursiveIterator from 'recursive-iterator';
import kindOf from 'kind-of';
import { genObjectId } from '@/utils/helpers';

export const setComponentProps = (availableProps, props = {}) => ({
  availableProps,
  props
});

export const setComponentAttrs = (availableAttrs, attrs = {}) => ({
  availableAttrs,
  attrs
});

export const extendModuleObject = (obj, ext = { type: 'common' }) => {
  for (const { node } of new RecursiveIterator(obj)) {
    if (kindOf(node) === 'object' && node.component) {
      node.moduleId = genObjectId(node);

      for (const key of Object.keys(ext)) {
        if (!node[key]) {
          node[key] = ext[key];
        }
      }
    }
  }

  return obj;
};

export const setAs = (type, val) => ({
  type: kindOf(type()),
  value: val || null
});
