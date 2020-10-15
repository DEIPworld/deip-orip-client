<template>
  <d-layout>
    <d-layout-section
      :background="`https://i.pinimg.com/originals/b9/4f/f2/b94ff23237dc6fb391b7721182e49c2e.jpg`"
      :min-height="320"
      align-content="end"
    >
      <d-layout-section-main>
        <d-stack :max-width="800">
          <div class="text-h3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </div>
          <div class="text-body-2">
            Accusantium blanditiis dicta doloribus eius excepturi fugiat id in labore laudantium modi mollitia nihil odio officia reprehenderit, unde vel vero voluptas voluptatem!
          </div>
        </d-stack>
      </d-layout-section-main>
    </d-layout-section>

    <d-layout-section>
      <d-layout-section-main>
        <projects-list with-filter>

          <!--        <template #itemRowActions="{ project }">-->
          <!--          <v-btn small icon><v-icon>clear</v-icon></v-btn>-->
          <!--        </template>-->

          <!--        <template #itemCardActions="{ project }">-->
          <!--          <v-btn small>clear</v-btn>-->
          <!--        </template>-->

        </projects-list>
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>

</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import ProjectsList from '@/components/Projects/List/ProjectsList';
  import { VIEW_TYPES } from '@/variables';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'Sandbox',
    components: { DStack, DLayout, ProjectsList, DLayoutSectionMain, DLayoutSection },
    data() {
      return {
        VIEW_TYPES
      };
    }
  };
</script>
