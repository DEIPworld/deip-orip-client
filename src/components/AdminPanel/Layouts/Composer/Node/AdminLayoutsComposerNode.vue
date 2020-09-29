<template>
  <component
    :is="nodeComponent"
    v-model="node"
    @click:remove="onClickRemove"
  >
    <template #settings>
      <admin-layouts-composer-node-settings
        v-model="node"
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
  import AdminLayoutsComposerNodeSettings
    from '@/components/AdminPanel/Layouts/Composer/Node/AdminLayoutsComposerNodeSettings';

  export default {
    name: 'AdminLayoutsComposerNode',
    components: {
      AdminLayoutsComposerNodeSettings,
      AdminLayoutsComposerNodeDefault,
      AdminLayoutsComposerNodeTypography,
      AdminLayoutsComposerNodeAttribute
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
