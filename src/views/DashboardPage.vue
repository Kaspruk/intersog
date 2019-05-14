<template>
    <v-container grid-list-lg fluid>
        <transition-group tag="div" name="company" class="layout row wrap dashboardCards" v-if="campaigns.length">
            <template v-for="(campaign, index) in campaigns">
                <v-flex v-if="campaign.enaibled" :key="campaign.objectId" xs3>
                    <v-card :class="campaign.cardClass">
                        <v-card-title class="column">
                            <span class="title font-weight-regular mb-1">{{campaign.name}}</span>
                            <span class="caption grey--text">{{campaign.type}}</span>
                        </v-card-title>
                        <div class="v-card__content">
                            <v-layout class="v-card__content-wrapper wrap">
                                <v-flex xs6>
                                    <span class="d-block body-1 grey--text text-uppercase">approved posts</span>
                                    <span class="headline font-weight-medium">{{campaign.approved_posts}}</span>
                                </v-flex>
                                <v-flex xs6>
                                    <span class="d-block body-1 grey--text text-uppercase">influencers</span>
                                    <span class="headline font-weight-medium">{{campaign.approved_posts}}</span>
                                </v-flex>
                                <v-flex xs6>
                                    <span class="d-block body-1 grey--text text-uppercase">likes</span>
                                    <span class="headline font-weight-medium">{{campaign.approved_likes}}</span>
                                </v-flex>
                                <v-flex xs6>
                                    <span class="d-block body-1 grey--text text-uppercase">comments</span>
                                    <span class="headline font-weight-medium">{{campaign.approved_comments}}</span>
                                </v-flex>
                            </v-layout>
                            <v-layout class="ma-0 pl-1 justify-start">
                                <span class="caption grey--text">100% ({{campaign.days_passed}}/{{campaign.days_total}} days)</span>
                            </v-layout>
                        </div>
                        <v-card-actions>
                            <v-btn @click="hideElement(index)" flat>hide</v-btn>
                            <v-btn @click.native="commitCurrentCompany(campaign)" :to="{ name: 'details-page', params: { objectId: campaign.objectId } }" flat color="blue">show details</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </template>
            <v-flex @click="getDashboardItem" v-if="showMoreCount" key="showMore" class="more-to-show" xs3>
                <span class="grey--text font-weight-bold display-3">+{{showMoreCount}}</span>
                <span class="grey--text display-1 font-weight-light text-uppercase">more to show</span>
            </v-flex>
        </transition-group>
    </v-container>
</template>

<script>
export default {
    name: 'dashboard-page',
    data() {
        return {
            campaigns: [],
            campaignsCount: null,
        }
    },
    methods: {
        getDashboardItem() {
            const queryBuilder = this.API.DataQueryBuilder.create().setPageSize(7).setOffset(this.campaigns.length).setSortBy('updated');
            this.API.Data.of('dashboardItems').find(queryBuilder).then((result) => {
                _.forEach(result, (r) => {
                    let cardClass;
                    if(r.type === 'Challenge') {
                        cardClass = 'v-card-purple'
                    } else if (r.type === 'Giveaway') {
                        cardClass = 'v-card-indigo'
                    } else if (r.type === 'Influencer campaign') {
                        cardClass = 'v-card-blue'
                    }
                    r.cardClass = cardClass;
                    r.enaibled = true;
                    this.campaigns.push(r);
                });
                this.API.Data.of('dashboardItems').getObjectCount().then((count) => {this.campaignsCount = count})
            });
        },
        commitCurrentCompany(campaign) {
            this.$store.commit('SET_CURRENT_COMPANY', campaign)
        },
        hideElement(i) {
            this.campaigns[i].enaibled = false;
        },
    },
    computed: {
        showMoreCount() {
            return (this.campaignsCount - this.campaigns.length > 7) ? 7 : this.campaignsCount - this.campaigns.length;
        }
    },
    created() {
        this.getDashboardItem()
    }
}
</script>

<style scoped>
</style>
