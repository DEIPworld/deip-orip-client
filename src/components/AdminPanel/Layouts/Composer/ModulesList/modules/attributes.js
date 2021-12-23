import { ATTR_ICONS, ATTR_TYPES, LAYOUT_TYPES } from '@/variables';

import {
  extendModuleObject,
  setAs, setComponentAttrs, setComponentProps
} from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/_utils';

const propsForRead = {
  [ATTR_TYPES.TEXT]: setComponentAttrs({
    clamped: setAs(Number)
  }),
  [ATTR_TYPES.TEXTAREA]: setComponentAttrs({
    clamped: setAs(Number)
  }),
  [ATTR_TYPES.IMAGE]: setComponentAttrs({
    width: setAs(Number),
    srcWidth: setAs(Number),
    aspectRatio: setAs(Number)
  }),
  [ATTR_TYPES.STEPPER]: setComponentAttrs({
    viewType: setAs(Array, ['default', 'small'])
  }),
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS]: setComponentAttrs({
    viewType: setAs(Array, ['default', 'widget']),
    title: setAs(String, 'Content access')
  })
};

const propsForSet = {};

const extenders = {
  [LAYOUT_TYPES.SET]: (attr) => ({
    component: 'AttributesSet',
    model: `attributes.${attr._id}`,
    ...(propsForSet[attr.type] ? _.cloneDeep(propsForSet[attr.type]) : {}),
    props: {
      attribute: `@attributes.${attr._id}`
    }
  }),

  [LAYOUT_TYPES.READ]: (attr) => ({
    component: 'AttributesRead',
    ...(propsForRead[attr.type] ? _.cloneDeep(propsForRead[attr.type]) : {}),
    ...{
      props: {
        attribute: `@project.attributes.${attr._id}`,
        project: '@project'
      }
    }
  })
};

export const modulesAttributes = (ctx) => {
  return extendModuleObject([
    {
      list: [
        {
          component: 'PortalBadge',
          name: 'Portal',
          icon: 'mdi-account-network-outline',
          props: {
            portalId: '@project.portalId'
          }
        },
        {
          component: 'span',
          name: 'Creation date',
          text: '@project.createdAt',
          icon: 'mdi-calendar-text'
        },
        ...ctx.$$projectAttributes
          .map((attr) => ({
            icon: ATTR_ICONS[attr.type],
            name: attr.shortTitle || attr.title,
            isRequired: attr.isRequired,
            isHidden: attr.isHidden,
            ...extenders[ctx.layoutType](attr)
          }))
      ]
    }
  ], { type: 'attribute' });
};
