<template>
  <d-layout-section>
    <d-layout-section-main>
      <div class="text-h4 mb-8">
        {{ $t('transactions.title') }}
      </div>
      <transactions-list :key="'group-proposals'" :account="$currentUser.username" />
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import TransactionsList from '@/components/TransactionsList/TransactionsList';

  export default {
    name: 'Transactions',

    components: {
      DLayoutSection,
      DLayoutSectionMain,
      TransactionsList
    }
  };
</script>
