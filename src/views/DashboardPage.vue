<template>
    <v-container grid-list-lg fluid>
        <v-layout class="row wrap dashboardCards">
            <v-flex v-for="campaign in campaigns" :key="campaign.objectId" xs3>
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
                        <v-btn flat>hide</v-btn>
                        <v-btn flat color="blue">show details</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex class="more-to-show" xs3>
                <span class="grey--text font-weight-bold display-3">+7</span>
                <span class="grey--text display-1 font-weight-light text-uppercase">more to show</span>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'dashboard-page',
    data() {
        return {
            campaigns: null,
        }
    },
    created() {
        const queryBuilder = this.API.DataQueryBuilder.create().setPageSize(7);
        this.API.Data.of('dashboardItems').find(queryBuilder).then((result) => {
            this.campaigns = _.map(result, (r) => {
                let cardClass;
                if(r.type === 'Challenge') {
                    cardClass = 'v-card-purple'
                } else if (r.type === 'Giveaway') {
                    cardClass = 'v-card-indigo'
                } else if (r.type === 'Influencer campaign') {
                    cardClass = 'v-card-blue'
                }
                r.cardClass = cardClass;
                return r;
            })
        });
    }
}
</script>

<style scoped>

</style>
