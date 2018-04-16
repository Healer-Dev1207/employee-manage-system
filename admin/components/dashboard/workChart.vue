<template>
    <div class="mt-6">
        <h2>Work Chart</h2>
        <v-divider></v-divider>
        <apexchart type="area" :options="chartOptions" :series="series" :height=400 class="mt-5"></apexchart>
        <p class="ml-4 pa-4 subtitle-2 subtextgrey--text">Note: This chart will show data only for first 4 categories.</p>
    </div>
</template>

<script>
export default {
  data() {
    return {
      series: [
      ],
      chartOptions: {
        chart: {
          type: 'area',
          toolbar: false,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        colors: ['#645DF6', '#26E7A5', '#008FFB', '#FEB019'],

        markers: {
          size: 4
        },
        yaxis: {
          title: {
            text: 'Number of Products'
          },
        },
        xaxis: {
          type: 'datetime',
          title: {
            text: 'Time Series'
          },
        },
      }
    }
  },

  async created() {
    try {
      let grandArr = []
      this.$auth.user.categories.forEach(c => {
        grandArr.push({name: c, data: []})
      })
      grandArr = grandArr.splice(0, 4)
      let data = await this.$axios.$get('admin/work/day')
      data.forEach(d => {
        let gIndex = grandArr.findIndex(g => g.name == d._id.category)
        if(gIndex > -1){
          grandArr[gIndex].data.push([d._id.date, d.count])
        }
      })
      this.series = [...grandArr]
    } catch(err) {
      if(err.response){
        this.snackbarColor = 'error'
        this.message = err.response.data.error
        this.snackbar = true
      }
    }
  }
}
</script>