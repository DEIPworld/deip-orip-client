<template>
  <d-layout>
    <d-layout-section>
      <d-layout-section-main>
        <d-stack :gap="36">
          <projects-list
            :user-name="$currentUserName"
            type="teams"
          >
            <template #title>
              {{ $t('account.projects.teamsTech') }}
            </template>
          </projects-list>
          <!-- <projects-list
            :user-name="$currentUserName"
            type="personal"
          >
            <template #title>
              {{ $t('account.projects.myTech') }}
            </template>
          </projects-list> -->
          <projects-list
            :user-name="$currentUserName"
            type="following"
          >
            <template #title>
              {{ $t('account.projects.follTech') }}
            </template>
          </projects-list>
        </d-stack>
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AccountTeamsProjects',
    components: {
      DLayoutSectionMain,
      DLayoutSection,
      DLayout,
      ProjectsList,
      DStack
    }
  };
</script>
