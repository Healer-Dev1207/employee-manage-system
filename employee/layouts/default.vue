<template>
  <v-app>
    <v-main>
      <app-header/>
      <v-container class="pa-7">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import appHeader from '~/components/appHeader'
export default {
  components: { appHeader },
}
</script>

<style>

.v-data-table {
  color: #405793;
  border: 0;
}

.theme--light .v-data-table .v-data-footer{
  border-top: 0;
}

.theme--light.v-data-table  .v-data-table__wrapper  table  thead  tr:last-child  th {
  border-bottom: 0;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row){
  border-bottom: 0;
}


</style>
