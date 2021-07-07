<template>
  <div v-if="isEmploymentSpecified || isOwner">
    <div class="d-flex" :class="{'mb-1': isEmploymentSpecified}">
      <div class="text-h6 text-left align-self-center">
        {{ $t('userDetailRouting.detailsEmployment.title') }}
      </div>
      <v-spacer v-if="isOwner" />
      <div v-if="isOwner">
        <v-btn
          outlined
          small
          color="primary"
          :to="{
            name: 'account.employment',
            query: {
              attr: attribute.attributeId
            }
          }"
        >
          {{ $t('userDetailRouting.detailsEmployment.add') }}
          <v-icon small>
            add
          </v-icon>
        </v-btn>
      </div>
    </div>

    <v-simple-table>
      <template #default>
        <tbody>
          <tr v-for="(item, index) in attribute.value" :key="`${index}-employment`">
            <td class="pl-0">
              <div class="text-body-2 py-3">
                {{ moment(item.period.from).format('YYYY') }}
                {{ item.period.to ? ` — ${moment(item.period.to).format('YYYY')}` : ` — ${$t('userDetailRouting.detailsEmployment.present')}` }}
                {{ item.company }}
              </div>
              <div class="">
                {{ item.position }}
              </div>
            </td>
            <td v-if="isOwner" class="text-right vertical-top pt-3 pr-0">
              <crud-actions row>
                <v-btn
                  icon
                  small
                  :to="{
                    name: 'account.employment',
                    query: {
                      attr: attribute.attributeId,
                      index: `${index}`
                    }
                  }"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn icon small @click="showDeleteEmploymentDialog(item, index)">
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
        v-model="deleteEmploymentMeta.isShown"
        :title="$t('userDetailRouting.detailsEmployment.deleteDialogTitle')"
        :button-true-text="$t('userDetailRouting.detailsEmployment.deleteBtn')"
        @click:confirm="deleteEmployment(deleteEmploymentMeta)"
      >
        <div class="pt-1">
          {{ $t('userDetailRouting.detailsEmployment.sureDelete') }}
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
    name: 'UserDetailsEmployment',

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
        deleteEmploymentMeta: {
          isShown: false,
          item: null,
          index: null
        }
      };
    },
    computed: {
      isEmploymentSpecified() {
        return this.attribute.value && this.attribute.value.length;
      }
    },
    methods: {
      showDeleteEmploymentDialog(item, index) {
        this.deleteEmploymentMeta.item = item;
        this.deleteEmploymentMeta.index = index;
        this.deleteEmploymentMeta.isShown = true;
      },

      deleteEmployment({ item, index }) {
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

        userService.updateUser({
          initiator: {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          ...update
        })
          .then((res) => {
            this.$notifier.showSuccess(
              this.$t('userDetailRouting.detailsEmployment.success', { company: item.company })
            );
            return this.$store.dispatch('Users/get', this.$currentUser.username);
          }, (err) => {
            this.$notifier.showError(
              this.$t('userDetailRouting.detailsEmployment.err', { company: item.company })
            );
            console.error(err);
          })
          .finally(() => {
            this.deleteEmploymentMeta.isShown = false;
          });
      }
    }
  };
</script>