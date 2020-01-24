<template>
  <div>
    History: <br/>
    <ul>
      <li
        v-for="(hItem, index) of history"
        :key="`ae-hist-el-${index}`"
      >{{JSON.stringify(hItem, null, 2)}}</li>
    </ul>
  </div>
</template>

<script>
  import { getExpertiseHistory } from '@/services/AccountExpertiseService';

  export default {
    name: "AccountExpertiseDetails",

    data() {
      return {
        history: [],
      };
    },

    methods: {
      getExpertiseHistory(disciplineId) {
        getExpertiseHistory(this.$route.params.username, disciplineId)
          .then((history) => {
            this.history = history;
          })
          .catch(console.error)
      }
    },

    created() {
      this.getExpertiseHistory(this.$route.query.discipline_id)
    }
  };
</script>


<style lang="less" scoped>
</style>