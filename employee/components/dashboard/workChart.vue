<template>
    <div class="mt-14 pa-1">
      <h3>Work Chart</h3>
     <apexchart type="line" :options="chartOptions" :series="series" :height=320  class="mt-5"></apexchart>
     <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      :color="snackbarColor"
      top
      elevation=0
      app
      >
        {{message}}
      <template v-slot:action="{ attrs }">
        <v-icon
        color="white"
        size=23
        v-bind="attrs"
        @click="snackbar = false">
            mdi-close-circle
        </v-icon>
      </template>
      </v-snackbar>
   </div>
</template>

<script>
export default {
    data() {
        return {
          snackbar: false,
          snackbarColor: '#73cfa6',
          message: null,
          series: [
            {data: [["2021-01-14T00:00:00.000Z", 10], ["2021-02-12T00:00:00.000Z", 8], ["2021-03-19T00:00:00.000Z", 5]], name: "Tshirt"},
            {data: [["2021-01-14T00:00:00.000Z", 5], ["2021-02-12T00:00:00.000Z", 12], ["2021-03-19T00:00:00.000Z", 3]], name: "Shorts"},
            // {data: [["2021-01-14T00:00:00.000Z", 1], ["2021-02-12T00:00:00.000Z", 8], ["2021-03-19T00:00:00.000Z", 3]], name: "Tshirt"},
            // {data: [["2021-01-14T00:00:00.000Z", 1], ["2021-02-12T00:00:00.000Z", 8], ["2021-03-19T00:00:00.000Z", 3]], name: "Tshirt"}
          ],
          chartOptions: {
            stroke: {
              curve: 'smooth'
            },
            chart: {
              type: 'line',
              toolbar: false,
              zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
              },
              fontFamily: 'Inter',
              
              toolbar: {
                autoSelected: 'zoom'
              }
            },
            colors: ['#316cf5', '#73cfa6', '#F3B076', '#d62f2f'],

            markers: {
              size: 4
            },
            yaxis: {
              
            },
            xaxis: {
              type: 'datetime',
            },
            legend: {
              position: 'bottom',
            }
        }
      }
    },

    async created() {
      try {
        let categories = await this.$axios.$get('employee/category')
        let data = await this.$axios.$get('employee/home/chart')
        let grandArr = []
        for(let ctg of categories){
          grandArr.push({name: ctg.category, data: []})
        }
        grandArr = grandArr.splice(0, 4)
        data.forEach(d => {
          let gIndex = grandArr.findIndex(g => g.name == d._id.category)
          if(gIndex > -1){
            grandArr[gIndex].data.push([d._id.date, d.count])
            }
        })
        this.series = [...grandArr]
      } catch(err) {
        if(err.response){
          this.message = err.response.data.error
          this.snackbarColor = 'error'
          this.snackbar = true
        } else {
          console.log(err)
        }
      }
    }
}
</script>