<template>
  <div class="c-p-10">
    <v-layout row wrap>
			<v-flex xs8>
				<div class="title c-pb-10">{{contentRef.title}}</div>
			</v-flex>
			<v-flex xs4>
				<div class="right">
				</div>
			</v-flex>
			<v-flex offset-xs2>
				<div>
					<div class="right">
					</div>
				</div>
			</v-flex>
			<v-flex xs8>
				<div class="left">
					<!-- <router-link class="subheading deip-blue-color"  style="text-decoration: none"
							:to="{ name: 'AgencyProgramDetails', 
									params: { 
										agency: program.agency_name, 
										foa: program.funding_opportunity_number }}">
							{{ program.funding_opportunity_number + ' ' + program.funding_opportunity_title }}
					</router-link> -->
				</div>
			</v-flex>
			<v-flex xs4>
			</v-flex>
			<v-flex xs12>
				<div>
					<div class="subheading c-pt-5 c-pb-5">Package: <span class="caption grey--text">({{contentRef.hash}})</span></div>
					<v-card v-for="file in contentRef.packageFiles" :key="file.hash">
						<v-card-text>
							<a target="_blank" class="a" :href="`${fileStorageBaseUrl}/content/refs/research/package/${contentRef.researchId}/${contentRef.hash}/${file.hash}`">
									{{file.filename}}
							</a>
							<span class="right body-2 grey--text">{{file.hash.slice(0, 8)}}</span>
						</v-card-text>
					</v-card>
				</div>
			</v-flex>
        <v-flex xs12>
					<!-- START Research Content Reviews section -->
					<div class="c-pt-5 sidebar-fullwidth"><v-divider></v-divider></div>
					<!-- END Research Content Reviews section -->
			</v-flex>
    </v-layout>
  </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import applicationsHttp from './../../../services/http/application';

    export default {
        name: "ResearchContentDetailsPackage",
        data() {
          return {
            fileStorageBaseUrl: window.env.DEIP_SERVER_URL
          };
        },
        computed: {
          ...mapGetters({
            user: 'auth/user',
            userExperise: 'auth/userExperise',
						contentRef: 'rcd/contentRef'
          })
        },
        methods: {

        }
    };
</script>

<style lang="less" scoped>

</style>
