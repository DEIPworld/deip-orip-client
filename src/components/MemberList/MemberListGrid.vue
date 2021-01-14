<template>
  <div :class="$style.host">
    <member-list-card
      v-for="item in items"
      :key="'list-item-' + item.account.name"
      :member="item"
      :group="group"
      @showConfirmAction="showConfirmAction"
    />
    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.actionLabel"
      :loading="actionDialog.loading"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </vex-dialog>
  </div>
</template>

<script>
  import MemberListCard from '@/components/MemberList/MemberListItem/MemberListCard';
  import { dropoutMember } from '@/components/MemberList/MemberListItem/dropoutMember';

  export default {
    name: 'MemberListGrid',
    components: { MemberListCard },
    mixins: [dropoutMember],
    props: {
      items: {
        type: Array,
        default: () => ([])
      },
      group: {
        type: Object,
        default: undefined
      }
    }
  };
</script>

<style module lang="scss">
  .host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 1.5rem;
  }
</style>
