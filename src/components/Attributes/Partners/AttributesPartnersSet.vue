<template>
  <d-block>
    <template #title>
      {{ attribute.title }}
      <span v-if="!$$isRequired" class="text-body-2 text--secondary">(optional)</span>
    </template>
    <d-timeline-item
      v-for="(partner, index) of internalValue"
      :key="`row-${index}`"
      :dot-top="16"
    >
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="partner.type"
            item-value="type"
            item-text="title"
            outlined
            label="Partner type"
            :items="partnersInfo"
          >
            <template slot="selection" slot-scope="{ item }">
              <v-sheet max-width="90%">
                <v-row no-gutters>
                  <v-col cols="auto" class="mr-2">
                    <v-icon small>
                      {{ item.icon }}
                    </v-icon>
                  </v-col>
                  <v-col class="text-truncate">
                    {{ item.title }}
                  </v-col>
                </v-row>
              </v-sheet>
            </template>

            <template slot="item" slot-scope="{ item }">
              <v-icon class="mr-3" small>
                {{ item.icon }}
              </v-icon>
              {{ item.title }}
            </template>
          </v-select>
        </v-col>

        <v-col cols="8">
          <v-text-field
            v-model="partner.title"
            label="Partner's name"
            name="Partner name"
            autocomplete="off"
            outlined
          />
        </v-col>
      </v-row>

      <template #action>
        <v-btn icon :disabled="!index" @click="removeItem(partner)">
          <v-icon>delete</v-icon>
        </v-btn>
      </template>
    </d-timeline-item>

    <d-timeline-add @click="addItem()" />
  </d-block>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';
  import { arrayModelAddFactory } from '@/mixins/extendModel';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';

  import projectPartners from './researchPartners.json';

  const partnerModelFactory = () => ({
    type: undefined,
    title: undefined
  });

  export default {
    name: 'AttributesPartnersSet',
    components: { DTimelineAdd, DTimelineItem, DBlock },
    mixins: [attributeSet, arrayModelAddFactory(partnerModelFactory)],
    data() {
      return {
        partnersInfo: projectPartners
      };
    },
    created() {
      this.addStartItem();
    }
  };
</script>
