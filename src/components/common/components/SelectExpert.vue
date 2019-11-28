<template>
  <div>
    <v-autocomplete
      label="Find an expert to request a review"
      hide-no-data
      :append-icon="null"
      :loading="isExpertsLoading"
      :disabled="isDisabledInput"
      :items="foundExperts"
      item-text="fullname"
      return-object
      :search-input.sync="expertsSearch"
      v-on:keyup="queryExperts()"
      v-model="selectedExpert"
    />
    <div v-if="!selectedExpert">
      <v-layout row>
        <platform-avatar
          @onSelectedExpert="selectExpert"
          :disabledAvatar="isDisabledAvatarsExpert"
          :noFollow="true"
          :size="40"
          v-for="(expert, i) in experts.slice(0, 6)"
          :key="'expert-' + i"
          :user="expert"
          class="expert-avatar mr-2"
        ></platform-avatar>
      </v-layout>
    </div>
    <template v-else>
      <platform-avatar
        :user="selectedExpert"
        :size="40"
        link-to-profile
        link-to-profile-class="pl-3"
      ></platform-avatar>
      <div v-if="$options.filters.employmentOrEducation(selectedExpert)">
        <div class="py-2 body-2">{{selectedExpert | employmentOrEducation}}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "SelectExpert",
  props: {
    isDisabledAvatarsExpert: { type: Boolean, required: false, default: true },
    experts: { type: Array, required: false, default: [] },
    isDisabledInput: { type: Boolean, required: false, default: true }
  },
  data() {
    return {
      isExpertsLoading: false,
      foundExperts: [],
      expertsSearch: "",
      selectedExpert: null
    };
  },
  methods: {
    queryExperts() {
      this.isExpertsLoading = true;
      this.foundExperts = this.expertsSearch ? this.experts
            .filter(user => {
              let name = this.$options.filters.fullname(user);
              return (
                name
                  .toLowerCase()
                  .indexOf((this.expertsSearch || "").toLowerCase()) > -1 ||
                user.account.name
                  .toLowerCase()
                  .indexOf((this.expertsSearch || "").toLowerCase()) > -1
              );
            })
            .map(user => {
              const fullname = this.$options.filters.fullname(user);
              return { fullname, ...user };
            })
        : [];

      if (!this.expertsSearch) {
        this.selectedExpert = null;
      }

      this.isExpertsLoading = false;
    },
    selectExpert(expert) {
      const fullname = this.$options.filters.fullname(expert);
      expert.fullname = fullname;
      this.foundExperts = [expert];
      this.selectedExpert = expert;
      this.expertsSearch = fullname;
    }
  },
  watch: {
    selectedExpert() {
      this.$emit("onSelectExpert", this.selectedExpert);
    }
  }
};
</script>

<style scoped>
</style>