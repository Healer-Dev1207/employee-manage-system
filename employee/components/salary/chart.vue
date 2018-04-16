<template>
  <div>
    <apexchart height=280 type="bar" :options="chartOptions" :series="series"></apexchart>
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
      ],
      chartOptions: {
        title: {
          text: 'Monthly Chart',
          style: {
            fontFamily: 'Inter',
            color: '#000'
          }
        },
        chart: {
          type: 'bar',
          height: 350,
          foreColor: '#9e9e9e',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
            endingShape: 'rounded',
            borderRadius: 5,
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        grid: {
          show: false
        },
        colors: ['#316cf5', '#d62f2f'],
        xaxis: {
          type: 'category',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          style: {
            colors: ['#9e9e9e']
          },
          tickPlacement: 'on',
          axisTicks: {
            show: false,
            color: '#9e9e9e'
          },
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: '₹ (thousands)',
            style: {
              fontFamily: 'Inter',
              color: '#b9c6d5'
            },
            axisTicks: {
              color: '#9e9e9e'
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter(val) {
              return "₹" + val 
            }
          }
        },
        legend: {
          position: 'top',
          fontFamily: 'Inter',
          markers: {
            color: '#9e9e9e'
          }
        }
      }
    }
  },

  async created() {
    try {
      let data = await this.$axios.$get('employee/salary/monthly')
      let grandArr = [{name: 'Salary', data: []}, {name: 'Advance', data: []}]
      grandArr.forEach(g => {
        g.data = [...Array(12)].fill(0)
      })
      data.forEach(d => {
        let dIndex = this.categories.findIndex(g => g == this.$moment(d._id.month).format('MMM'))
        let gIndex = grandArr.findIndex(g => g.name == d._id.type)
        if(gIndex > -1){
          grandArr[gIndex].data[dIndex] = d.amount
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

//TODO: Set a year filter to see past year data for the chart