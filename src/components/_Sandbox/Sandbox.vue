<template>
  <d-layout>
<!--    <d-layout-section-->
<!--      :background="`https://i.pinimg.com/originals/b9/4f/f2/b94ff23237dc6fb391b7721182e49c2e.jpg`"-->
<!--      :min-height="320"-->
<!--      align-content="end"-->
<!--    >-->
<!--      <d-layout-section-main>-->

<!--&lt;!&ndash;        <assets-provider v-slot="{ assets }">&ndash;&gt;-->
<!--&lt;!&ndash;          {{ assets }}&ndash;&gt;-->
<!--&lt;!&ndash;        </assets-provider>&ndash;&gt;-->

<!--        <d-stack :max-width="800">-->
<!--          <div class="text-h3">-->
<!--            Lorem ipsum dolor sit amet, consectetur adipisicing elit.-->
<!--          </div>-->
<!--          <div class="text-body-2">-->
<!--            Accusantium blanditiis dicta doloribus eius excepturi fugiat id in labore laudantium modi mollitia nihil odio officia reprehenderit, unde vel vero voluptas voluptatem!-->
<!--          </div>-->
<!--        </d-stack>-->
<!--      </d-layout-section-main>-->
<!--    </d-layout-section>-->

    <d-layout-section>
      <d-layout-section-main>
        <pre>{{ JSON.stringify($currentUser, null, 2) }}</pre>
<!--        <vex-editor />-->
<!--        <projects-list with-filter>-->

<!--          &lt;!&ndash;        <template #itemRowActions="{ project }">&ndash;&gt;-->
<!--          &lt;!&ndash;          <v-btn small icon><v-icon>clear</v-icon></v-btn>&ndash;&gt;-->
<!--          &lt;!&ndash;        </template>&ndash;&gt;-->

<!--          &lt;!&ndash;        <template #itemCardActions="{ project }">&ndash;&gt;-->
<!--          &lt;!&ndash;          <v-btn small>clear</v-btn>&ndash;&gt;-->
<!--          &lt;!&ndash;        </template>&ndash;&gt;-->

<!--        </projects-list>-->
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>

</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';
  import { VIEW_TYPES } from '@/variables';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DStack from '@/components/Deipify/DStack/DStack';
  import VexEditor from '@/plugins/VuetifyExtended/components/VexEditor/VexEditor';
  import { registerStoreModule, unregisterStoreModule, hasValue } from '@/utils/helpers';
  import AssetsProvider from '@/features/Assets/components/provider';

  export default {
    name: 'Sandbox',
    components: { AssetsProvider, VexEditor, DStack, DLayout, ProjectsList, DLayoutSectionMain, DLayoutSection },
    data() {
      return {
        VIEW_TYPES,
        xxx: hasValue({a: { b: ['a']}})
      };
    },
    created() {
      registerStoreModule.call(this, {
        state: {},
        getters: {},
        actions: {},
        mutations: {},
        namespaced: true
      })
        .then((name) => {
        });
    },
    beforeDestroy() {
      unregisterStoreModule.call(this, this.$$storeNS)
    }
  };
</script>
