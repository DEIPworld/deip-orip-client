import kindOf from 'kind-of';
import { findAndReplaceIf as replace } from 'find-and-replace-anything';
import { getObjectValueByPath } from 'vuetify/lib/util/helpers';

import DLayout from '@/components/Deipify/DLayout/DLayout';
import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
import DLayoutHeader from '@/components/Deipify/DLayout/DLayoutHeader';

import { VSheet, VBtn } from 'vuetify/lib';

export const layoutRenderer = {
  components: {
    DLayout,
    DLayoutSection,
    DLayoutHeader,

    VSheet,
    VBtn
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

  data() {
    return {
      testData: {
        foo: 'bar'
      }
    };
  },

  computed: {
    $templateReplacingMap() {
      return { };
    }
  },

  methods: {
    getChildren(children = null, h) {
      if (kindOf(children) === 'array') {
        return children.map((n) => this.generateNode(n, h));
      }

      if (kindOf(children) === 'object') {
        throw new Error('Children must be an Array');
      }

      return children;
    },

    generateNode(node, h) {
      const data = { ...(node.data || {}) };
      const condition = Object.prototype.hasOwnProperty.call(node, 'if') ? node.if : true;
      return condition !== 'false' ? h(
        node.is,
        data,
        this.getChildren(node.children, h)
      ) : null;
    },

    normalizeSchema(children = null) {
      if (kindOf(children) === 'string') {
        return replace(children, this.replaceFn);
      }

      if (kindOf(children) === 'array') {

        return children.map((node) => ({
          ...replace(node, this.replaceFn),
          ...(node.children ? {
            children: this.normalizeSchema(node.children)
          } : {})
        }));
      }

      if (kindOf(children) === 'object') {
        throw new Error('Children must be an Array');
      }

      return children;
    },

    replaceFn(val) {
      const propPattern = /{{\s*(.*?)\s*}}/gm;

      if (kindOf(val) === 'string') {
        const matches = [...val.matchAll(propPattern)];

        if (matches.length === 1 && matches[0][0] === matches[0].input) {
          return getObjectValueByPath(this, matches[0][1]);
        }

        if (matches.length > 1) {
          return val.replace(propPattern, (...args) => {
            return getObjectValueByPath(this, args[1]);
          });
        }

        return val;
      }

      return val;
    }
  },

  render(h) {
    return h(
      this.tag,
      this.normalizeSchema(this.schema, this.$templateReplacingMap)
        .map((n) => this.generateNode(n, h))
    );
  }
};
