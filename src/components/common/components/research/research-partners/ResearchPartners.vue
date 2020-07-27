<template>
  <div v-if="!isReadOnly">
    <div v-if="partners.length">
      <v-row
        v-for="(item, i) in partners"
        :key="`${item.type}${i}`"
        no-gutters
        class="mx-0"
      >
        <v-col cols="4" class="pr-2">
          <v-select
            :value="item.type"
            item-value="type"
            item-text="title"
            outlined
            :rules="[rules.partner]"
            label="Partner"
            :items="partnersInfo"
            @change="setPartner($event, i)"
          >
            <template slot="selection" slot-scope="data">
              <v-icon class="pr-1" small color="black">
                {{ data.item.icon }}
              </v-icon>
              {{ data.item.title }}
            </template>
            <template slot="item" slot-scope="data">
              <v-icon class="pr-1" small color="black">
                {{ data.item.icon }}
              </v-icon>
              {{ data.item.title }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="7" class="pr-2">
          <v-text-field
            v-model="item.title"
            :rules="[rules.required]"
            name="partnersList"
            label="Partner's name"
            outlined
          />
        </v-col>
        <v-col cols="1" class="text-right">
          <v-btn
            fab
            outlined
            icon
            color="primary"
            class="ma-0"
            @click="deletePartner(i)"
          >
            <v-icon>remove</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <div class="text-subtitle-1">
        Add partners
      </div>
    </div>
    <v-row no-gutters justify="end">
      <v-col cols="1" class="text-right">
        <v-btn
          outlined
          icon
          fab
          color="primary"
          class="ma-0"
          @click="addPartner"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <div v-for="(item, i) in partnersСollectedData" :key="`${item.typeInfo.type}${i}`" class="mb-2">
      <div class="font-weight-medium text-subtitle-1 mr-2 display-inline-block">
        <v-icon class="mr-2" small color="black">
          {{ item.typeInfo.icon }}
        </v-icon>
        <span>{{ item.typeInfo.title }}</span>
      </div>
      <div class="display-inline-block text-subtitle-1">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
  import researchPartners from './researchPartners.json';

  export default {
    name: 'ResearchPartners',

    props: {
      partners: { type: Array, required: true },
      isReadOnly: { type: Boolean, required: false, default: false }
    },
    data() {
      return {
        partnersInfo: researchPartners,
        rules: {
          required: (value) => !!value || 'This field is required',
          partner: (v) => !!v || 'Partner is required'
        }
      };
    },
    computed: {
      partnersСollectedData() {
        return this.partners.reduce((res, item) => {
          const el = res.find(({ typeInfo: { type } }) => type == item.type);
          if (el) {
            el.title += `, ${item.title}`;
          } else {
            res.push({
              typeInfo: this.partnersInfo.find(({ type }) => type == item.type),
              title: item.title
            });
          }
          return res;
        }, []);
      }
    },
    methods: {
      addPartner() {
        this.partners.push({
          type: '',
          title: ''
        });
      },
      deletePartner(index) {
        this.partners.splice(index, 1);
      },
      setPartner(e, index) {
        this.partners[index].type = e;
      }
    }
  };
</script>

<style leng="less" scoped>
</style>
