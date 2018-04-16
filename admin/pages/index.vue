<template>
  <div>
    <h1>Welcome, Admin</h1>
    <v-divider></v-divider>
    <dash-board-cards/>
    <v-row>
      <v-col cols=12 md=8>
        <work-chart />
      </v-col>
      <v-col>
        <categories />
      </v-col>  
    </v-row>
    
  </div>
</template>

<script>
import dashBoardCards from '../components/dashboard/dashBoardCards.vue'
import workChart from '../components/dashboard/workChart.vue'
import categories from '../components/dashboard/categories'
export default {
  middleware: 'auth',
  components: {
    dashBoardCards,
    workChart,
    categories,
  }
}
</script>

<style scoped>
/* .no_employees{
  font-size: 40px;
} */
</style>
