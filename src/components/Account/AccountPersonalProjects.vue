<template>
  <d-layout>
    <d-layout-section>
      <d-layout-section-main>
        <projects-list
          :user-name="$currentUserName"
          type="personal"
        />
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';

  export default {
    name: 'AccountPersonalProjects',
    components: {
      ProjectsList,
      DLayoutSectionMain,
      DLayoutSection,
      DLayout
    }
  };
</script>
