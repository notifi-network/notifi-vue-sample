<script setup lang="ts" >
import { RouterLink, RouterView } from "vue-router";
import HomeVue from "../src/views/HomeView.vue";
</script>

<template>
  <header>
    <div>
      <HomeView />
    </div>
  </header>

  <RouterView />
</template>

