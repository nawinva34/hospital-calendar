<template>
  <v-app-bar color="primary" density="comfortable" elevation="2">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-toolbar-title>
      <span class="font-weight-bold">ระบบจัดการกะโรงพยาบาล</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon="mdi-bell" variant="text"></v-btn>
    <v-btn icon="mdi-account-circle" variant="text"></v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item
        prepend-icon="mdi-home"
        title="หน้าหลัก"
        to="/"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-calendar-month"
        title="ตารางกะ"
        to="/shifts"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-account-group"
        title="พนักงาน"
        to="/employees"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item prepend-icon="mdi-cog" title="ตั้งค่า"></v-list-item>

      <v-list-item
        prepend-icon="mdi-logout"
        title="ออกจากระบบ"
        to="/signin"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false);
</script>

<style scoped>
.v-toolbar-title {
  font-family: "Kanit", sans-serif;
}
</style>
