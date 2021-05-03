<template>
  <!--  <div>-->
  <div v-if="$ready">
    <template v-if="!asset">
      <v-btn
        color="primary"
        small
        block
        outlined
        :to="{
          name: 'project.asset.create',
          params: $route.params
        }"
      >
        {{ $t('assets.issueTokens') }}
      </v-btn>
    </template>

    <template v-else>
      <d-stack gap="16">
        <teams-data-provider
          v-slot="{ team }"
          :teams="shareholders[0]"
        >
          <div class="d-flex">
            <v-sheet class="mr-n2">
              <router-link
                :to="{ name: 'team.details', params: { teamId: team.externalId } }"
              >
                <v-avatar size="40">
                  <v-img :src="team.externalId | researchGroupLogoSrc(40)" />
                </v-avatar>
              </router-link>
            </v-sheet>
            <users-list view-type="stack" :users="shareholders" />
          </div>
        </teams-data-provider>


        <d-dot-list :items="listData" />
        <v-btn
          v-if="$isUser"
          block
          text
          small
          color="primary"
          @click="details = true"
        >
          {{ $t('defaultNaming.moreDetails') }}
        </v-btn>
      </d-stack>
      <vex-dialog
        v-model="details"
        :max-width="580"
        :title="$t('assets.widget.shareholders')"
        :button-false-text="false"
        button-true-text="Ok"
      >
        <d-stack>
          <div class="text-body-1">
            <span class="font-weight-medium">
              {{ $t('assets.widget.shareholders') }}:
            </span> {{ internalAsset.balances.length }}<br>
            <span class="font-weight-medium">
              {{ $t('assets.widget.tokensIssued') }}:
            </span> {{ listDataTotal.value }}<br>
            <span class="font-weight-medium">
              {{ $t('assets.widget.yTokens') }}:
            </span> {{ listDataUserBalance.value }}<br>
            <span class="font-weight-medium">
              {{ $t('assets.widget.yShare') }}:
            </span> {{ listDataUserBalancePercent.value }}<br>
          </div>
          <users-list :users="shareholders" view-type="dataProvider">
            <template #default="{ users }">
              <teams-data-provider
                v-slot="{ team }"
                :teams="shareholders[0]"
              >
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="text-left">
                        {{ $t('assets.widget.name') }}
                      </th>
                      <th class="text-right">
                        {{ $t('assets.widget.shares') }}
                      </th>
                      <th class="text-right">
                        {{ $t('assets.widget.tokens') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>


                    <tr>
                      <td>
                        <v-sheet color="transparent" class="d-flex align-center">
                          <v-avatar size="40" class="mr-4 my-2">
                            <v-img :src="team.externalId | researchGroupLogoSrc(40)" />
                          </v-avatar>
                          <v-clamp
                            autoresize
                            :max-lines="2"
                            class="text-body-2 font-weight-medium"
                          >
                            {{ team.name }}
                          </v-clamp>
                        </v-sheet>
                      </td>
                      <td class="text-right white-space-nowrap">
                        {{ toPercent(getBalance(team.externalId).amount) }}
                      </td>
                      <td class="text-right white-space-nowrap">
                        {{ getBalance(team.externalId).amount }}
                      </td>
                    </tr>


                    <tr
                      v-for="user in users"
                      :key="user.account.name"
                    >
                      <td>
                        <v-sheet color="transparent" class="d-flex align-center">
                          <v-avatar size="40" class="mr-4 my-2">
                            <v-img :src="user | accountAvatarSrc(64, 64, false)" />
                          </v-avatar>
                          <v-clamp
                            autoresize
                            :max-lines="2"
                            class="text-body-2 font-weight-medium"
                          >
                            <template v-if="user.teamRef">{{ user.teamRef.name }}</template>
                            <template v-else>{{ user | accountFullname }}</template>
                          </v-clamp>
                        </v-sheet>
                      </td>
                      <td class="text-right white-space-nowrap">
                        {{ toPercent(getBalance(user.account.name).amount) }}
                      </td>
                      <td class="text-right white-space-nowrap">
                        {{ getBalance(user.account.name).amount }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </teams-data-provider>
            </template>
          </users-list>
        </d-stack>

      </vex-dialog>
    </template>
  </div>
</template>

<script>

  import DDotList from '@/components/Deipify/DDotList/DDotList';
  import { assetsChore } from '@/mixins/chores';
  import DStack from '@/components/Deipify/DStack/DStack';
  import UsersList from '@/features/Users/components/List/UsersList';
  import TeamsDataProvider from '@/features/Teams/components/TeamsDataProvider';

  export default {
    name: 'AssetsWidget',
    components: {
      TeamsDataProvider,
      UsersList,
      DStack,
      DDotList
    },
    mixins: [assetsChore],
    props: {
      asset: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        details: false
      };
    },

    computed: {
      internalAsset() {
        if (this.asset) {
          return this.$store.getters['Assets/one'](
            this.$$fromAssetUnits(this.asset).assetId
          );
        }

        return null;
      },

      shareholders() {
        return this.internalAsset.balances.map((balance) => balance.owner);
      },

      currentUserBalance() {
        const balance = this.getBalance(this.$currentUser.username);

        return balance ? balance.amount : this.toAssetUnits(0);
      },

      listData() {
        return [
          this.listDataTotal,
          this.listDataUserBalance,
          this.listDataUserBalancePercent
        ];
      },

      listDataTotal() {
        return {
          label: 'Tokens issued',
          value: this.toAssetUnits(this.internalAsset.maxSupply)
        };
      },

      listDataUserBalance() {
        return {
          label: 'Your tokens',
          value: this.currentUserBalance
        };
      },

      listDataUserBalancePercent() {
        return {
          label: 'Your share',
          value: this.toPercent(this.currentUserBalance)
        };
      }
    },

    created() {
      if (!this.asset) {
        this.$setReady();
      }

      if (this.asset && !(this.internalAsset && this.internalAsset.balances)) {
        this.$store
          .dispatch(
            'Assets/get',
            {
              symbol: this.$$fromAssetUnits(this.asset).assetId
            }
          )
          .then(() => {
            this.$setReady();
          });
      } else {
        this.$setReady();
      }
    },

    methods: {
      toAssetUnits(amount) {
        return this.$$toAssetUnits(
          {
            amount,
            assetId: this.internalAsset.stringSymbol
          }
        );
      },

      toPercent(accetString) {
        const asset = this.$$fromAssetUnits(accetString);

        return this.$options.filters
          .currency(
            (asset.amount / this.internalAsset.maxSupply) * 100,
            {
              symbol: '%',
              symbolPosition: false
            }
          );
      },

      getBalance(user) {
        return this.$where(
          this.internalAsset.balances,
          { owner: user }
        )[0];
      }
    }
  };
</script>
