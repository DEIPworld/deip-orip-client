<template>
  <d-layout>
    <d-layout-section>
      <d-layout-section-main>
        <projects-list
          :user-name="$currentUserName"
          type="teams"
        />
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import ProjectsList from '@/components/Projects/List/ProjectsList';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  export default {
    name: 'AccountTeamsProjects',
    components: {
      DLayoutSectionMain,
      DLayoutSection,
      DLayout,
      ProjectsList
    }
  };
</script>
