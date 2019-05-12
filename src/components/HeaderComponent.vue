<template>
    <v-toolbar>
        <v-container class="mx-auto" fluid>
            <v-toolbar-title>
                <router-link
                        class="black--text"
                        :to="{ name: 'dashboard-page' }">
                    Dashboard
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-container>
    </v-toolbar>
</template>

<script>
export default {
    name: 'HeaderComponent'
}
</script>

<style scoped>

</style>
