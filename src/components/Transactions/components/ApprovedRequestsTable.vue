<template>
  <div>
    <v-data-table
      :headers="approvedRequestsHeader"
      :items="approvedRequests"
      :expanded.sync="expanded"
      show-expand
      item-key="_id"
      disable-sort
      :hide-default-footer="approvedRequests.length < 50"
      :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
      :items-per-page="50"
    >
      <template #item.type="{ item }">
        <v-chip
          class="my-3"
          :color="chipColors[transactionTypes['LICENSE']].bg"
          :text-color="chipColors[transactionTypes['LICENSE']].textColor"
        >
          License
        </v-chip>
      </template>
      <template #item.requester="{ item }">
        <d-box-item
          :avatar="item.extendedDetails.requester.profile | avatarSrc(64, 64, false)"
          :size="24"
        >
          <v-clamp
            autoresize
            :max-lines="1"
          >
            {{ item.extendedDetails.requester | fullname }}
          </v-clamp>
        </d-box-item>
      </template>
      <template #item.researchGroupExternalId="{ item }">
        <d-box-item
          :avatar="item.researchGroupExternalId | researchGroupLogoSrc(64, 64)"
          :size="24"
        >
          <v-clamp
            autoresize
            :max-lines="1"
          >
            {{ item.extendedDetails.researchGroup.name }}
          </v-clamp>
        </d-box-item>
      </template>
      <template #item.created_at="{ item }">
        {{ item.created_at | dateFormat('DD MMM YYYY, hh:mm', true) }}
      </template>
      <template #item.expirationDate="{ item }">
        {{ item.expirationDate | dateFormat('DD MMM YYYY, hh:mm', true) }}
      </template>
      <template #item.status="{ item }">
        <v-chip
          class="my-3"
          :color="statusChipData.color[item.status]"
        >
          {{ statusChipData.text[item.status] }}
        </v-chip>
      </template>
      <template #expanded-item="{ item }">
        <td colspan="5" class="text-caption text--secondary">
          <div class="font-weight-medium">
            Technology:
          </div>
          <div class="text-decoration-underline">
            {{ item.licencePlan.name }}
          </div>
          <div>
            <span class="font-weight-medium">
              License issue fee:
            </span> {{ item.licencePlan.fee.amount }}
          </div>
        </td>
        <td colspan="1" class="py-3">
          <d-box-item
            v-for="(approver, i) in item.extendedDetails.approvers"
            :key="`${i}-approverAccount`"
            :avatar="approver.profile ?
              $options.filters.avatarSrc(approver.profile, 64, 64, false)
              : $options.filters.researchGroupLogoSrc(approver.external_id, 64, 64)"
            :size="24"
            class="mb-3"
          >
            <v-clamp
              autoresize
              :max-lines="1"
            >
              {{ approver.profile ? $options.filters.fullname(approver) : approver.name }}
            </v-clamp>
            <template #actionText>
              <v-chip
                :color="statusChipData.color['approved']"
              >
                {{ statusChipData.text['approved'] }}
              </v-chip>
            </template>
          </d-box-item>
          <d-box-item
            v-for="(approver, i) in item.extendedDetails.rejectors"
            :key="`${i}-rejectAccount`"
            :avatar="approver.profile ?
              $options.filters.avatarSrc(approver.profile, 64, 64, false)
              : $options.filters.researchGroupLogoSrc(approver.external_id, 64, 64)"
            :size="24"
            class="mb-3"
          >
            <v-clamp
              autoresize
              :max-lines="1"
            >
              {{ approver.profile ? $options.filters.fullname(approver) : approver.name }}
            </v-clamp>
            <template #actionText>
              <v-chip
                :color="statusChipData.color['rejected']"
              >
                {{ statusChipData.text['rejected'] }}
              </v-chip>
            </template>
          </d-box-item>
        </td>
      </template>
    </v-data-table>
    <v-divider />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { chartGradient, switchColor } from '@/plugins/charts';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  const transactionTypes = {
    LICENSE: 1
  };

  const txStatusChips = {
    approved: 'signed',
    pending: 'pending',
    rejected: 'declined'
  };

  const chipColors = {
    approved: 'success',
    pending: 'warning',
    rejected: 'error'
  };

  export default {
    name: 'PendingRequestsTable',

    components: {
      DBoxItem
    },

    data() {
      return {
        expanded: [],
        transactionTypes,
        txStatusChips,
        disableButtonsId: '',
        approvedRequestsHeader: [
          {
            text: 'Type',
            value: 'type',
            sortable: false
          },
          {
            text: 'Sender',
            value: 'requester',
            sortable: false
          },
          {
            text: 'Target',
            value: 'researchGroupExternalId',
            sortable: false
          },
          {
            text: 'Date of receipt',
            value: 'created_at',
            align: 'end',
            sortable: false
          },
          {
            text: 'Expiration date',
            value: 'expirationDate',
            align: 'center',
            sortable: false
          },
          {
            text: 'Status',
            value: 'status'
          },
          {
            text: '',
            value: 'data-table-expand',
            align: 'start elevetion-0'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        approvedRequests: 'Transactions/approvedRequests'
      }),
      chipColors() {
        return chartGradient(Object.keys(transactionTypes).length + 1).map((color) => ({
          bg: color,
          textColor: switchColor(color)
        }));
      },
      statusChipData() {
        return {
          color: chipColors,
          text: txStatusChips
        };
      },
      isCurrentUserSigned() {
        return this.pendingRequests.approvers.includes(
          (item) => item === this.$currentUser.username
        );
      }
    }
  };
</script>
