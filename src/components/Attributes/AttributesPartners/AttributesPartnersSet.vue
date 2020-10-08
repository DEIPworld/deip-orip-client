<template>
  <d-block :title="attribute.title">
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
            outlined
          />
        </v-col>
      </v-row>

      <template #action>
        <v-btn icon :disabled="!index" @click="removeFromModel(index)">
          <v-icon>delete</v-icon>
        </v-btn>
      </template>
    </d-timeline-item>

    <d-timeline-add @click="appendModel()" />

  </d-block>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';

  import researchPartners from './researchPartners.json';
  import { attributeSet } from '@/components/Attributes/mixins';
  import { arrayModelAddFactory } from '@/mixins/extendModel';

  const partnerModel = () => ({
    type: '',
    title: ''
  });

  export default {
    name: 'AttributesPartnersSet',
    components: { DTimelineAdd, DTimelineItem, DBlock },
    mixins: [attributeSet, arrayModelAddFactory(partnerModel())],
    data() {
      return {
        partnersInfo: researchPartners
      };
    }
  };
</script>
