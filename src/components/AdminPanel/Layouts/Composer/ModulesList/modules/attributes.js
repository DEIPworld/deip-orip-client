import { ATTR_ICONS, ATTR_TYPES, LAYOUT_TYPES } from '@/variables';
import {
  extendModuleObject,
  setAs,
  setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const propsForRead = {
  [ATTR_TYPES.TEXT]: setComponentProps({
    clamped: setAs(Number)
  }),
  [ATTR_TYPES.TEXTAREA]: setComponentProps({
    clamped: setAs(Number)
  }),
  [ATTR_TYPES.STEPPER]: setComponentProps({
    viewType: setAs(Array, ['default', 'small'])
  })
};

const propsForSet = {};

const extenders = {
  [LAYOUT_TYPES.SET]: (attr) => ({
    component: 'AttributesSet',
    model: `researchRef.attributes.${attr._id}`,
    ...(propsForSet[attr.type] ? _.cloneDeep(propsForSet[attr.type]) : {}),
    props: {
      attribute: `@attributes.${attr._id}`,
    }
  }),

  [LAYOUT_TYPES.READ]: (attr) => ({
    component: 'AttributesRead',
    ...(propsForRead[attr.type] ? _.cloneDeep(propsForRead[attr.type]) : {}),
    ...{
      props: {
        attribute: `@research.researchRef.attributes.${attr._id}`,
        projectId: '@research.externalId',
      }
    }
  })
};

export const modulesAttributes = (ctx) => {
  return extendModuleObject([
    {
      component: 'span',
      name: 'Creation date',
      text: '@research.createdAt',
      icon: 'mdi-calendar-text'
    },
    ...ctx.$tenantSettings.researchAttributes
      .map((attr) => ({
        icon: ATTR_ICONS[attr.type],
        name: attr.shortTitle || attr.title,
        isRequired: attr.isRequired,
        isHidden: attr.isHidden,
        ...extenders[ctx.layoutType](attr)
      }))
  ], { type: 'attribute' });
};
