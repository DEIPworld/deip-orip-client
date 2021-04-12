<template>
  <div v-if="isEducationSpecified || isOwner">
    <div class="d-flex" :class="{'mb-1': isEducationSpecified}">
      <div class="text-h6 text-left align-self-center">
        {{ $t('userDetailRouting.detailsEducation.title') }}
      </div>
      <v-spacer v-if="isOwner" />
      <div v-if="isOwner">
        <v-btn
          outlined
          small
          color="primary"
          :to="{
            name: 'account.education',
            query: {
              attr: attribute.attributeId
            }
          }"
        >
          {{ $t('userDetailRouting.detailsEducation.add') }}
          <v-icon small>
            add
          </v-icon>
        </v-btn>
      </div>
    </div>
    <v-simple-table>
      <template #default>
        <tbody>
          <tr v-for="(item, index) in attribute.value" :key="`${index}-education`">
            <td class="pl-0">
              <div class="text-body-2 py-3">
                {{ moment(item.period.from).format('YYYY') }}
                {{ item.period.to ? ` — ${moment(item.period.to).format('YYYY')}` : ` — ${$t('userDetailRouting.detailsEducation.present')}` }}
                {{ item.educationalInstitution }}
              </div>
              <div class="">
                {{ item.degree }}
              </div>
            </td>
            <td v-if="isOwner" class="text-right vertical-top pt-3 pr-0">
              <crud-actions row>
                <v-btn
                  icon
                  small
                  :to="{
                    name: 'account.education',
                    query: {
                      attr: attribute.attributeId,
                      index: `${index}`
                    }
                  }"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn icon small @click="showDeleteEducationDialog(item, index)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </crud-actions>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div v-if="isOwner">
      <vex-dialog
        v-model="deleteEducationMeta.isShown"
        :title="$t('userDetailRouting.detailsEducation.deleteDialogTitle')"
        :button-true-text="$t('userDetailRouting.detailsEducation.deleteBtn')"
        @click:confirm="deleteEducation(deleteEducationMeta)"
      >
        <div class="pt-1">
          {{ $t('userDetailRouting.detailsEducation.sureDelete') }}
        </div>
      </vex-dialog>
    </div>
  </div>
</template>

<script>
  import CrudActions from '@/components/layout/CrudActions';
  import { userDetails } from '@/features/Users/mixins/userDetails';
  import { expandAttributes, compactAttributes } from '@/utils/helpers';

  import { UserService } from '@deip/user-service';

  const userService = UserService.getInstance();

  export default {
    name: 'UserDetailsEducation',

    components: {
      CrudActions
    },
    mixins: [userDetails],
    props: {
      attribute: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        deleteEducationMeta: {
          isShown: false,
          item: null,
          index: null
        }
      };
    },
    computed: {
      isEducationSpecified() {
        return this.attribute.value && this.attribute.value.length;
      }
    },
    methods: {
      showDeleteEducationDialog(item, index) {
        this.deleteEducationMeta.item = item;
        this.deleteEducationMeta.index = index;
        this.deleteEducationMeta.isShown = true;
      },
      deleteEducation({ item, index }) {
        const userAttributes = expandAttributes(this.$currentUser.profile.attributes);
        userAttributes[this.attribute.attributeId] = userAttributes[
          this.attribute.attributeId
        ].reduce(
          (accum, current, i) => {
            if (i == index) {
              return accum;
            }
            return accum.concat(current);
          }, []
        );

        const update = {
          ...this.$currentUser.profile,
          attributes: [
            ...compactAttributes(userAttributes)
          ]
        };

        const formData = new FormData();
        formData.append('profile', JSON.stringify(update));

        userService.updateUserProfile(this.$currentUser.username, formData)
          .then((res) => {
            this.$notifier.showSuccess(
              this.$t('userDetailRouting.detailsEducation.success', { educationalInstitution: item.educationalInstitution })
            );
            return this.$store.dispatch('Users/get', this.$currentUser.username);
          }, (err) => {
            this.$notifier.showError(
              this.$t('userDetailRouting.detailsEducation.err', { educationalInstitution: item.educationalInstitution })
            );
            console.error(err);
          })
          .finally(() => {
            this.deleteEducationMeta.isShown = false;
          });
      }
    }
  };
</script>
