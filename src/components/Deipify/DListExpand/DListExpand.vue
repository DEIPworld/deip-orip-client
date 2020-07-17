<template>
  <div>
    <slot
      :expanded="expanded"
      :toggle="toggle"
      :active="active"
    />

    <slot v-if="active" name="toggle">
      <div class="mt-4">
        <a
          class="text-decoration-underline-dotted text-caption text--secondary"
          @click="toggle"
        >
          Show {{ !expanded ? 'more' : 'less' }}
        </a>
      </div>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'DListExpand',

    props: {
      active: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        expanded: false
      };
    },

    methods: {
      toggle() {
        this.expanded = !this.expanded;
      }
    }
  };
</script>
