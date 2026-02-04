<template>
  <v-app-bar color="white" density="comfortable" class="border-b">
    <v-container class="d-flex align-center py-0">
      <!-- Mobile Menu Button -->
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" class="d-md-none mr-2"></v-app-bar-nav-icon>

      <v-toolbar-title class="mr-8">
        <NuxtLink to="/" class="text-decoration-none d-flex align-center">
          <span class="text-primary font-weight-bold" style="font-size: 1.1rem;">ตารางเวร</span>
        </NuxtLink>
      </v-toolbar-title>

      <!-- Desktop Menu -->
      <div class="d-none d-md-flex gap-2">
        <v-btn to="/" variant="text" :active="route.path === '/'">ปฏิทิน</v-btn>
        <v-btn to="/employees" variant="text">พนักงาน</v-btn>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center gap-2">
        <v-btn icon="mdi-bell-outline" variant="text" density="comfortable"></v-btn>
        <v-avatar color="grey-lighten-4" size="32" class="cursor-pointer border">
          <span class="text-caption text-medium-emphasis">AD</span>
        </v-avatar>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="left">
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-calendar" title="ปฏิทิน" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-account-group" title="พนักงาน" to="/employees"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
const route = useRoute();
const drawer = ref(false);
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.border-b {
  border-bottom: 1px solid #dadce0 !important;
}
.border {
  border: 1px solid #dadce0;
}
</style>
