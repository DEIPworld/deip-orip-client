<template>
  <d-stack gap="4">
    <div
      v-for="(item, index) of attribute.value"
      :key="index"
      class="text-body-2"
    >
      <template v-if="item.url">
        <v-hover v-slot="{ hover }">
          <a
            :href="item.url"
            target="_blank"
            class="text-decoration-none d-flex"
            :class="{ 'text--primary': !hover }"
          >
            <v-icon left size="20" :color="hover ? 'primary' : 'black'">
              launch
            </v-icon>
            {{ item.label || item.url }}
          </a>
        </v-hover>
      </template>

      <template v-if="!item.url">
        <span class="">{{ item.label }}</span>
      </template>

    </div>
  </d-stack>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AttributesUrlRead',
    components: { DStack },
    mixins: [attributeRead]
  };
</script>
