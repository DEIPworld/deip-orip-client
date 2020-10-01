import kindOf from 'kind-of';
import { getObjectValueByPath, mergeDeep } from 'vuetify/lib/util/helpers';
import dotProp from 'dot-prop';

import DLayout from '@/components/Deipify/DLayout/DLayout';
import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';
import DLayoutSectionSplit from '@/components/Deipify/DLayout/DLayoutSectionSplit';

import DStack from '@/components/Deipify/DStack/DStack';
import DBlock from '@/components/Deipify/DBlock/DBlock';
import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

import CrudActions from '@/components/layout/CrudActions';

import { VDivider, VSheet, VIcon, VBtn, VRow, VCol } from 'vuetify/lib/components';
import RecursiveIterator from 'recursive-iterator';

const rendererCommon = {
  components: {
    DLayout,
    DLayoutSection,
    DLayoutSectionMain,
    DLayoutSectionSidebar,
    DLayoutSectionSplit,

    CrudActions,

    DStack,
    DBlock,
    DMetaItem,
    DSimpleTooltip,

    VDivider,
    VSheet,
    VIcon,
    VBtn,
    VRow,
    VCol
  },
  props: {
    schema: {
      type: Array,
      default: () => []
    },
    tag: {
      type: String,
      default: 'd-layout'
    }
  },

  methods: {
    normalizeSchema(children = null) {
      const clone = _.cloneDeep(children);

      const stringPattern = /{{\s*(.*?)\s*}}/gm;
      const modelPattern = /^@([a-zA-Z0-9_.-]*)$/;

      for (const { parent, node, key } of new RecursiveIterator(clone)) {
        if (kindOf(node) === 'string') {
          const stringMatches = [...node.matchAll(stringPattern)];
          const modelMatches = node.match(modelPattern);

          if (modelMatches && modelMatches.length) {
            parent[key] = getObjectValueByPath(this, modelMatches[1]);
          }

          if (stringMatches && stringMatches.length) {
            parent[key] = node
              .replace(stringPattern, (...args) => getObjectValueByPath(this, args[1]));
          }
        }
      }

      return clone;
    }
  }
};

export const nativeRenderer = {
  mixins: [
    rendererCommon
  ],

  methods: {
    getChildren(children = null, h) {
      if (kindOf(children) === 'array') {
        return children.map((n) => this.generateNode(n, h));
      }

      if (kindOf(children) === 'string') {
        return children;
      }

      throw new Error('Children must be an Array or String');
    },

    generateNode(node, h) {
      const data = { ...(node.data || {}) };
      const condition = Object.prototype.hasOwnProperty.call(node, 'if') ? node.if : true;
      return condition !== 'false' ? h(
        node.is,
        data,
        this.getChildren(node.children, h)
      ) : null;
    }
  },

  render(h) {
    return h(
      this.tag,
      this.normalizeSchema(this.schema)
        .map((n) => this.generateNode(n, h))
    );
  }
};

export const componentsRenderer = {
  mixins: [
    rendererCommon
  ],
  // props: ['value'],
  methods: {
    getChildren(children = null, h) {
      if (children) {
        if (kindOf(children) === 'array') {
          return children.map((n) => this.generateNode(n, h));
        }

        throw new Error('Children must be an Array');
      }

      return null;
    },

    generateNode(node, h) {
      const self = this;

      // eslint-disable-next-line no-eval
      const condition = node.if ? eval(`${node.if}`) : true;

      const data = {
        ...(node.props ? { props: node.props } : {}),
        ...(node.attrs ? { attrs: node.attrs } : {}),
        ...(node.class ? { class: node.class } : {}),
        ...(node.slot ? { slot: node.slot } : {}),
        ...(node.on ? { on: node.on } : {})
      };

      let vModel = {};

      if (node.model) {
        vModel = {
          props: {
            value: getObjectValueByPath(self.internalValue, node.model)
          },
          on: {
            change(event) {
              const a = dotProp.set(self.internalValue, node.model, event);
              self.internalValue = { ...self.internalValue, ...a };
            }
          }
        };
      }

      const isStringNode = kindOf(node) === 'string';

      const component = isStringNode ? node : node.component;

      let content = this.getChildren(node.children, h);

      if (node.text) {
        content = node.text;
      }
      if (isStringNode) {
        content = null;
      }

      if (condition) {
        return h(
          component,
          mergeDeep(data, vModel),
          content
        );
      }

      return false;
    }
  },

  render(h) {
    return h(
      this.tag,
      this.normalizeSchema(this.schema)
        .map((n) => this.generateNode(n, h))
    );
  }
};
