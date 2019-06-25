var cpuLabelArray = [];
var cpuUsageArray = [];
var dataJSON;
var cpuChart;

$.get(
    "../../api/get.php",

    function(response) {
        // Store device info
        dataJSON = JSON.parse(response).rows;
        
        makeCPUArrays();
        makeCPUChartJS();
    }
);

var CPUChartInterval = setInterval(
    function() { 
        $.get(
            "../../api/get.php",
        
            function(response) {
                // Store device info
                dataJSON = JSON.parse(response).rows;
                
                makeCPUArrays();
            }
        );
    },
    5 * 1000
)


function makeCPUArrays() {

    // Create cpu average variable at 0.0
    var cpuAvg = 0.0;

    // Create device count variable
    var count = 0;

    // Set index j
    var j;

    // Set timestamp var
    var timestamp;

    // Check each system log
    for(var i = 0; i < 50; i++) {
        // Set index j = current index (i)
        j = i;

        // Reset vars
        cpuAvg = 0.0;
        count = 0;
        timestamp = dataJSON[i].timestamp;

        // If the device hasn't been included already, add its usage to one point of data for a cpu usage average
        while(j < dataJSON.length && dataJSON[j].timestamp == timestamp) {
            // Add this devices usage to usage total
            cpuAvg += parseFloat(dataJSON[j].cpu_usage);

            // Increase index j and device count
            j++;
            count++;
        }

        // Once all unique devices have been added for current data point, average the cpu total by the count
        cpuAvg = cpuAvg / count;

        // Push data point to arrays
        cpuUsageArray.push( cpuAvg );
        cpuLabelArray.push( timestamp );


        // Set i to equal the device index that is for the next data point (j)
        i = j;
    }
};

function makeCPUChartJS() {
    /* ChartJS
     * -------
     */

    // Get context with jQuery - using jQuery's .get() method.
    var cpuChartCanvas = $('#average-cpu-usage-chartjs').get(0).getContext('2d')
    // This will get the first returned node in the jQuery collection.
    cpuChart = new Chart(cpuChartCanvas)

    var cpuChartData = {
      labels  : cpuLabelArray, //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label               : 'CPU Usage',
          fillColor           : 'rgba(0, 166, 90, 1)',
          strokeColor         : 'rgba(0, 166, 90, 1)',
          pointColor          : 'rgba(0, 166, 90, 1)',
          pointStrokeColor    : '#c1c7d1',
          pointHighlightFill  : '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data                : cpuUsageArray //[65, 59, 80, 81, 56, 55, 40]
        },
        /*{
          label               : 'Digital Goods',
          fillColor           : 'rgba(60,141,188,0.9)',
          strokeColor         : 'rgba(60,141,188,0.8)',
          pointColor          : '#3b8bba',
          pointStrokeColor    : 'rgba(60,141,188,1)',
          pointHighlightFill  : '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data                : [28, 48, 40, 19, 86, 27, 90]
        }*/
      ]
    }

    var cpuChartOptions = {
      //Boolean - If we should show the scale at all
      showScale               : true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines      : false,
      //String - Colour of the grid lines
      scaleGridLineColor      : 'rgba(0,0,0,.05)',
      //Number - Width of the grid lines
      scaleGridLineWidth      : 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines  : true,
      //Boolean - Whether the line is curved between points
      bezierCurve             : true,
      //Number - Tension of the bezier curve between points
      bezierCurveTension      : 0.3,
      //Boolean - Whether to show a dot for each point
      pointDot                : false,
      //Number - Radius of each point dot in pixels
      pointDotRadius          : 4,
      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth     : 1,
      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,
      //Boolean - Whether to show a stroke for datasets
      datasetStroke           : true,
      //Number - Pixel width of dataset stroke
      datasetStrokeWidth      : 2,
      //Boolean - Whether to fill the dataset with a color
      datasetFill             : true,
      //String - A legend template
      legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].lineColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
      //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio     : true,
      //Boolean - whether to make the chart responsive to window resizing
      responsive              : true
    }

    //Create the line chart
    cpuChart.Line(cpuChartData, cpuChartOptions)
}