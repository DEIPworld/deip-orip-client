<template>
  <div v-if="!isReadOnly">
    <v-layout column v-if="partners.length">
      <v-layout
        v-for="(item, i) in partners"
        :key="`${item.type}${i}`"
        row
        wrap
        justify-space-between
      >
        <v-flex xs4>
          <v-select
            :value="item.type"
            item-value="type"
            item-text="title"
            solo
            :rules="[rules.partner]"
            label="Partner"
            :items="partnersInfo"
            @change="setPartner($event, i)"
          >
            <template slot="selection" slot-scope="data">
              <v-icon class="pr-1" small color="black">{{ data.item.icon }}</v-icon>
              {{ data.item.title }}
            </template>
            <template slot="item" slot-scope="data">
              <v-icon class="pr-1" small color="black">{{ data.item.icon }}</v-icon>
              {{ data.item.title }}
            </template>
          </v-select>
        </v-flex>
        <v-flex offset-xs1 xs6>
          <v-text-field
            v-model="item.title"
            :rules="[rules.required]"
            name="partnersList"
            label="Partner's name"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs1 text-align-right>
          <v-btn fab outline icon color="primary" class="ma-0" @click="deletePartner(i)">
            <v-icon>remove</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-layout>
    <v-layout v-else>
      <div class="subheading">Add partners</div>
    </v-layout>
    <div class="text-align-right">
      <v-btn outline icon fab color="primary" class="ma-0" @click="addPartner">
        <v-icon>add</v-icon>
      </v-btn>
    </div>
  </div>
  <div v-else>
    <v-layout row wrap mb-2 v-for="(item, i) in partnersСollectedData" :key="`${item.typeInfo.type}${i}`">
      <v-flex shrink font-weight-medium subheading mr-2>
        <v-icon class="pb-1 mr-1" small color="black">{{ item.typeInfo.icon }}</v-icon>
        <span>{{ item.typeInfo.title }}</span>
      </v-flex>
      <v-flex grow subheading>{{ item.title }}</v-flex>
    </v-layout>
  </div>
</template>

<script>
import researchPartners from './researchPartners.json'

export default {
  name: "ResearchPartners",

  props: {
    partners: { type: Array, required: true },
    isReadOnly: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      partnersInfo: researchPartners,
      rules: {
        required: value => !!value || "This field is required",
        partner: v => !!v || "Partner is required"
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
        type: "",
        title: ""
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