<template>
  <div>
    <layout-section>
      <div class="text-h4 font-weight-bold mb-4">
        Frequently Asked Questions
      </div>
      <div class="mb-6 text-body-2">
        Didn’t find what you were looking for?
        <router-link :to="'#'" class="a ml-1">
          Get in touch.
        </router-link>
      </div>
      <div
        v-for="(item, i) in faqs"
        :key="`${i}-faq`"
        class="mb-2"
      >
        <router-link :to="`#question${i+1}`" class="a">
          {{ item.question }}
        </router-link>
      </div>
    </layout-section>
    <v-divider />
    <layout-section>
      <content-block
        v-for="(item, i) in faqs"
        :id="`question${i+1}`"
        :key="`${i}-allfaq`"
        :max-width="800"
        no-gutters
        class="mb-12"
      >
        <h3 class="text-h5 font-weight-bold mb-4">
          {{ item.question }}
        </h3>
        <div
          class="text-body-2 white-space-pre-line"
        >
          {{ item.answer }}
        </div>
      </content-block>
    </layout-section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ContentBlock from '@/components/layout/components/ContentBlock';

  export default {
    name: 'FAQ',
    components: { ContentBlock, LayoutSection },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      }),
      faqs() {
        return this.tenant.profile.settings.faq.filter(({ isVisible }) => isVisible);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
