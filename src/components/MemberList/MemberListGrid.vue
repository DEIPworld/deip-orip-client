<template>
  <div :class="$style.host">
    <member-list-card
      v-for="item in items"
      :key="'list-item-' + item.account.name"
      :member="item"
    />
  </div>
</template>

<script>
  import MemberListCard from '@/components/MemberList/MemberListItem/MemberListCard';

  export default {
    name: 'MemberListGrid',
    components: { MemberListCard },
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
