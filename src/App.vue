<template>
    <v-app>
        <div class="overlay" :hidden="overlay"></div>
        <v-tabs
            fixed-tabs
            dark
        >
            <v-tab to="/">Linear Model</v-tab>
            <v-tab to="/Curve">Curve Model</v-tab>
            <!-- <v-tab>Item Three</v-tab> -->
        </v-tabs>
        <v-main>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Vuex from "./store/index";

export default Vue.extend({
    name: "App",
    data: () => ({
    }),
    computed: {
        overlay() {
            return Vuex.state.block === 0;
        }
    },
    methods: {},
})

</script>

<style lang="scss">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
            color: #42b983;
            }
        }
    }

    .tvc {
        margin: 1.0rem;
    }

    .overlay {
        z-index: 100;
        position: absolute;
        background: blueviolet;
        opacity: 0.3;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }
</style>
