<template>
        <v-toolbar app fixed clipped-left dark color="black">
            <!-- <v-toolbar-side-icon @click.stop="updateDrawer(!drawer)"></v-toolbar-side-icon> -->
            <v-toolbar-title>DEIP</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn icon large class="ma-0">
                <v-icon size="32px" color="grey lighten-1">search</v-icon>
            </v-btn>
            <v-btn icon large class="ma-0">
                <v-badge color="amber darken-3" right overlap>
                    <v-icon size="32px" color="grey lighten-1">chat_bubble</v-icon>
                    <span slot="badge">5</span>
                </v-badge>
            </v-btn>

            <v-menu bottom left offset-y>
                <v-btn fab flat icon class="ma-0" slot="activator">
                    <v-avatar size="32px">
                        <img src="http://deip.world/static/ashkor.7ff44c16.png" alt="User">
                    </v-avatar>
                </v-btn>
                <v-list dark dense>
                    <v-list-tile @click="">
                        <v-list-tile-title>Whatever</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-title>Settings</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-title>Sign out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <div class="mx-3" style="width: 180px">
                <v-btn dark round color="deip-blue" class="full-width ma-0" to="/startCreateResearch">
                    <div class="col-grow">Add Research</div>
                    <v-icon dark size="20px" class="ml-2">add</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
</template>

<script>
    export default {
        name: 'Toolbar',
        props: {
            drawer: Boolean
        },
        methods: {
            updateDrawer(value) {
                this.$emit('update', value);
            }
        }
    }
</script>
