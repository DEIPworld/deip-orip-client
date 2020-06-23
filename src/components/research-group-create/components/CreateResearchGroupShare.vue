<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Research Group Tokens
      </div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="group-share-max-width mx-auto">
          <div>Each research group is assigned its own Research Group Tokens which are distributed among its members and can be used to manage the group and its research activity.</div>
          <div class="text-body-2 py-4">
            Distribute tokens of this group as follows:
          </div>
          <div
            v-for="(member, i) in group.members"
            :key="i"
            class="pt-4 display-flex justify-space-between align-center"
          >
            <div>
              <platform-avatar
                :user="member"
                :size="30"
                link-to-profile
                link-to-profile-class="px-1"
              />
            </div>

            <div>
              <v-text-field
                v-model="member.stake"
                class="width-4 pa-0 rtl"
                suffix="%"
                hide-details
                mask="###"
              />
            </div>
          </div>

          <div class="text-align-right pt-4">
            <div class="text-caption grey--text">
              <div>
                Total:
                <span>{{ sum }} %</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>Back
        </v-btn>

        <v-btn
          color="primary"
          :loading="isLoading"
          :disabled="sum !== 100 || isLoading"
          @click.native="finish()"
        >
          Create group
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CreateResearchGroupShare',
    props: {
      group: { type: Object, required: true },
      isLoading: { type: Boolean, required: true }
    },
    data() {
      return {};
    },
    computed: {
      sum() {
        return this.group.members.reduce(
          (accum, curr) => accum + parseInt(curr.stake || 0),
          0
        );
      }
    },
    methods: {
      finish() {
        this.$emit('finish');
      },
      prevStep() {
        this.$emit('decStep');
      }
    }
  };
</script>

<style lang="less" scoped>
.group-share-max-width {
  max-width: 510px;
}

.rtl.input-group input {
  text-align: center;
}
</style>
