<template>
    <section>
        <v-container class="px-5" v-if="company" fluid>
            <v-card class="pa-3 mb-3" color="grey lighten-4"><span class="title">{{company.name}}</span></v-card>
            <v-card class="pa-0">
                <v-layout class="pa-3 mb-3">
                    <v-btn-toggle v-model="social_network" color="primary" mandatory>
                        <v-btn  v-for="social in socials"
                                :key="social"
                                :value="social"
                                @click="updateQuery('social_network', social)"
                                flat>
                            {{social}}
                        </v-btn>
                    </v-btn-toggle>
                </v-layout>
                <v-layout class="slide-line-menu align-start">
                    <v-btn-toggle v-model="current_status" color="primary" ref="slideLineMenu" mandatory>
                        <v-btn  v-for="status in status_type"
                                :key="status"
                                :value="status"
                                @click.native="changeStatusTab($event.target)"
                                :ripple="false"
                                flat>
                            {{status}}
                        </v-btn>
                    </v-btn-toggle>
                    <div class="slide-line-menu_line" v-if="status_active_tab_item" :style="slideLine"></div>
                </v-layout>
                <transition name="fade">
                    <v-layout v-if="current_status === 'pending'" class="align-center">
                        <v-combobox multiple
                                    v-model="posts_hashtags"
                                    class="combobox pt-1 mt-0"
                                    prefix="+keywords"
                                    append-icon
                                    chips
                                    deletable-chips
                                    hide-details
                                    :search-input.sync="search"
                                    @keyup.enter="createWhereClause()">
                        </v-combobox>
                        <v-btn class="my-0 mx-1 filter_btn" color="primary" @click="createWhereClause()">filter</v-btn>
                    </v-layout>
                </transition>
                <v-layout class="py-2 px-3 grey lighten-4 wrap">
                    <v-flex xs12>
                        <v-layout>
                            <transition name="fade">
                                <span v-if="posts_count > 0" class="font-weight-bold mt-2">{{posts_count}} items total</span>
                            </transition>
                            <v-spacer></v-spacer>
                            <transition name="fade">
                                <v-pagination
                                        v-if="pagination_length > 1"
                                        v-model="page"
                                        :length="pagination_length"
                                        @input="createWhereClause()"
                                ></v-pagination>
                            </transition>
                        </v-layout>
                    </v-flex>
                    <v-container grid-list-lg fluid>
                        <transition-group tag="div"
                                          name="company"
                                          v-if="companies_posts && companies_posts.length"
                                          class="layout row wrap">
                            <v-flex v-for="posts in companies_posts" :key="posts.objectId" xs3>
                                <v-card>
                                    <v-card-title>
                                        <v-avatar>
                                            <v-img :src="posts.author_pic"></v-img>
                                        </v-avatar>
                                        <div class="ml-3">
                                            <span class="subheading d-block font-weight-medium">@{{posts.author_username}}</span>
                                            <a :href="posts.link" class="subheading blue--text">{{posts.social_network}}</a>
                                        </div>
                                    </v-card-title>
                                    <v-img :src="posts.pic" aspect-ratio="0.95">
                                        <div class="v-image_caption">{{posts.caption}}</div>
                                    </v-img>
                                    <v-layout class="px-4 py-3">
                                        <v-flex class="pa-0" xs6>
                                            <span class="d-block subheading grey--text text-uppercase font-weight-medium">Likes</span>
                                            <span class="headline font-weight-bold">{{posts.likes_number}}</span>
                                        </v-flex>
                                        <v-flex class="pa-0" xs6>
                                            <span class="d-block subheading grey--text text-uppercase font-weight-medium">Comments</span>
                                            <span class="headline font-weight-bold">{{posts.comments_number}}</span>
                                        </v-flex>
                                    </v-layout>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn v-if="current_status !== 'reject'" flat @click="updatePostStatus(posts, false)">reject</v-btn>
                                        <v-btn v-if="current_status !== 'approved'" flat color="accent" @click="updatePostStatus(posts, true)">approve</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </transition-group>
                        <v-layout class="pa-4 justify-center" v-else>
                            <span class="display-3 grey--text">No posts here</span>
                        </v-layout>
                    </v-container>
                </v-layout>
            </v-card>
        </v-container>
    </section>
</template>

<script>
export default {
    name: 'details-page',
    data() {
        return {
            company: null,
            companies_posts: [],
            socials: ['instagram', 'youtube', 'facebook', 'twitter'],
            social_network: 'instagram',
            status_type: ['pending', 'approved', 'reject'],
            current_status: 'pending',
            status_active_tab_item: null,
            posts_hashtags: [],
            search: null,
            posts_count: null,
            pagination_length: 1,
            page: 1,
            where_clause: []
        };
    },
    methods: {
        getCurrentCompany() {
            const queryBuilder = this.API.DataQueryBuilder.create().setWhereClause(`objectId='${this.$route.params.objectId}'`);
            this.API.Data.of('dashboardItems').find(queryBuilder).then((result) => {
                [this.company] = result;
                setTimeout(() =>  this.findActiveStatusTab(), 0);
            });
        },
        createWhereClause() {
            this.where_clause = [];
            if (!_.isEmpty(this.$route.query)) {
                this.where_clause.push(`company='${this.$route.params.objectId}'`);
                _.forEach(this.$route.query, (value, key) => {
                    if (value === 'pending') {
                        this.where_clause.push(`${key} is ${this.postsStatus(value)}`);
                    } else if (value === 'approved' || value === 'reject') {
                        this.where_clause.push(`${key}=${this.postsStatus(value)}`);
                    } else if (value.length) {
                        this.where_clause.push(`${key}='${value}'`);
                    }
                });
                if(this.posts_hashtags && this.posts_hashtags.length) {
                    _.forEach(this.posts_hashtags, (h) => {
                        this.where_clause.push(`caption LIKE '%${h}%'`)
                    });
                }
                this.where_clause = this.where_clause.join(' and ');
            }
            this.getCompaniesPosts()
        },
        getCompaniesPosts() {
            const queryBuilder = this.API.DataQueryBuilder.create().setWhereClause(this.where_clause).setPageSize(8).setOffset(this.companies_posts.length * (this.page - 1));
            this.API.Data.of('campaignItems').find(queryBuilder).then((posts) => {
                this.companies_posts = posts;
                this.getCompaniesPostsCount();
            });
        },
        getCompaniesPostsCount() {
            const queryBuilder = this.API.DataQueryBuilder.create().setWhereClause(this.where_clause);
            this.API.Data.of('campaignItems').getObjectCount(queryBuilder).then((count) => {
                this.posts_count = count;
                this.pagination_length = Math.ceil(count / 8)
            });
        },
        updatePostStatus(post, status) {
            const updated_post = post;
            updated_post.status = status;
            this.API.Data.of('campaignItems').save(updated_post).then((res) => {
                if(res){
                    this.getCompaniesPosts();
                }
            });
        },
        changeStatusTab(el) {
            this.updateQuery('status', this.current_status);
            this.status_active_tab_item = el;
            this.posts_hashtags = []
        },
        findActiveStatusTab() {
            [this.status_active_tab_item] = _.filter(this.$refs.slideLineMenu.$el.children, x => x.classList.contains('v-btn--active'));
        },
        updateQuery (name, value) {
            let query = this.$route.query;
            if (_.isEmpty(this.$route.query)){
                query = {
                    ...this.$route.query,
                    'social_network': this.social_network,
                    'status': this.current_status,
                }
            } else if (value){
                query = {
                    ...this.$route.query,
                    [name]: value
                }
            }
            this.$router.replace({query});
            this.createWhereClause()
        },
        updateValues() {
            this.social_network = this.$route.query.social_network;
            this.current_status = this.$route.query.status;
        },
        postsStatus(status) {
            let currentStatus;
            if(status === 'pending') {
                currentStatus = null
            } else if (status === 'approved') {
                currentStatus = true
            } else if (status === 'reject') {
                currentStatus = false
            }
            return currentStatus;
        }
    },
    computed: {
        currentCompany() {
            return this.$store.getters.CURRENT_COMPANY
        },
        slideLine() {
            return {
                width: `${this.status_active_tab_item.offsetWidth}px`,
                left: `${this.status_active_tab_item.offsetLeft}px`,
            };
        },
    },
    watch: {
        currentCompany(val) {
            if(val) {
                this.company = val;
                setTimeout(() =>  this.findActiveStatusTab(), 0);
            }
        },
    },
    created() {
        if(_.isEmpty(this.$store.getters.CURRENT_COMPANY)){
            this.getCurrentCompany();
        }
        if (!_.isEmpty(this.$route.query)){
            this.updateValues()
        }
        this.updateQuery()
    },
}
</script>

<style scoped>

</style>
