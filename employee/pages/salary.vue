<template>
  <div>
    <chart />
    <salary-table />
  </div>
</template>

<script>
import Chart from '../components/salary/chart'
import salaryTable from '../components/salary/salaryTable'
export default {
  head() {
    return{
        title: 'Salary'
    }  
  },
  middleware:'auth',
  components: {
    Chart,
    salaryTable
  }
}
</script>