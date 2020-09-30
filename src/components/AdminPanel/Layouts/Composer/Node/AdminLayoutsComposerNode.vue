<template>
  <component
    :is="nodeComponent"
    v-model="node"
    @click:remove="onClickRemove"
  >
    <template #settings>
      <admin-layouts-composer-node-settings
        v-model="internalValue"
        @click:remove="onClickRemove"
      />
    </template>
  </component>
</template>

<script>
  import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';

  import AdminLayoutsComposerNodeDefault
    from '@/components/AdminPanel/Layouts/Composer/Node/Types/AdminLayoutsComposerNodeDefault';

  import AdminLayoutsComposerNodeTypography
    from '@/components/AdminPanel/Layouts/Composer/Node/Types/AdminLayoutsComposerNodeTypography';

  import AdminLayoutsComposerNodeAttribute
    from '@/components/AdminPanel/Layouts/Composer/Node/Types/AdminLayoutsComposerNodeAttribute';

  import AdminLayoutsComposerNodeIcon
    from '@/components/AdminPanel/Layouts/Composer/Node/Types/AdminLayoutsComposerNodeIcon';

  import AdminLayoutsComposerNodeSettings
    from '@/components/AdminPanel/Layouts/Composer/Node/Settings/AdminLayoutsComposerNodeSettings';

  export default {
    name: 'AdminLayoutsComposerNode',
    components: {
      AdminLayoutsComposerNodeSettings,
      AdminLayoutsComposerNodeDefault,
      AdminLayoutsComposerNodeTypography,
      AdminLayoutsComposerNodeAttribute,
      AdminLayoutsComposerNodeIcon
    },
    mixins: [ProxyableFactory('node')],
    computed: {
      nodeComponent() {
        if (this.node.type === 'typography') {
          return 'AdminLayoutsComposerNodeTypography';
        }
        if (this.node.type === 'attribute' || this.node.type === 'staticComponent') {
          return 'AdminLayoutsComposerNodeAttribute';
        }
        if (this.node.component === 'VIcon') {
          return 'AdminLayoutsComposerNodeIcon';
        }

        return 'AdminLayoutsComposerNodeDefault';
      }
    },
    methods: {
      onClickRemove(e) {
        this.$emit('click:remove', e);
      }
    }
  };
</script>
