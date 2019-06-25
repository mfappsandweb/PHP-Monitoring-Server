var CPUArray;
var memoryArray;
var dataJSON;

$.get(
    "../../api/get.php",

    function(response) {
        // Store device info
        dataJSON = JSON.parse(response).rows;
        
        CPUArray = makeCPUArray();
        memoryArray = makeMemoryArray();
        makeCPUFlot();
        makeMemoryFlot();
    }
);

var CPUArrayInterval = setInterval(
    function() {
        $.get(
            "../../api/get.php",
        
            function(response) {
                // Store device info
                dataJSON = JSON.parse(response).rows;
        
                
                CPUArray = makeCPUArray();
            }
        );
    },
    5 * 1000
);
var memoryArrayInterval = setInterval(
    function() {
        $.get(
            "../../api/get.php",
        
            function(response) {
                // Store device info
                dataJSON = JSON.parse(response).rows;
                
                memoryArray = makeMemoryArray();
            }
        );
    },
    5 * 1000
);

function makeCPUArray() {
    // Array index
    var index = 0;

    // Create CPU Usage Array
    var array = [];

    // Create empty hostname lost
    var hostnames = [];

    // Create cpu average variable at 0.0
    var cpuAvg = 0.0;

    // Create device count variable
    var count = 0;

    // Set index j
    var j;

    // Check each system log
    for(var i = 0; i < dataJSON.length; i++) {
        // Set index j = current index (i)
        j = i;

        // Reset vars
        hostnames = [];
        cpuAvg = 0.0;
        count = 0;

        // If the device hasn't been included already, add its usage to one point of data for a cpu usage average
        while(j < dataJSON.length && hostnames.includes(dataJSON[j].hostname) == false) {
            // Add this devices usage to usage total
            cpuAvg += parseFloat(dataJSON[j].cpu_usage);

            // Add device to hostname list as already checked
            hostnames.push(dataJSON[j].hostname);

            // Increase index j and device count
            j++;
            count++;
        }

        // Once all unique devices have been added for current data point, average the cpu total by the count
        cpuAvg = cpuAvg / count;

        // Push data point to array
        index++;
        array.push( [index, cpuAvg] );

        // Set i to equal the device index that is for the next data point (j)
        i = j;
    }
    return array;
};

function makeMemoryArray() {
    // Array index
    var index = 0;

    // Create CPU Usage Array
    var array = [];

    // Create empty hostname lost
    var hostnames = [];

    // Create cpu average variable at 0.0
    var memAvg = 0.0;

    // Create device count variable
    var count = 0;

    // Set index j
    var j;

    // Check each system log
    for(var i = 0; i < dataJSON.length; i++) {
        // Set index j = current index (i)
        j = i;

        // Reset vars
        hostnames = [];
        memAvg = 0.0;
        count = 0;

        // If the device hasn't been included already, add its usage to one point of data for a cpu usage average
        while(j < dataJSON.length && hostnames.includes(dataJSON[j].hostname) == false) {
            // Add this devices usage to usage total
            memAvg += parseFloat(dataJSON[j].memory_used_percent);

            // Add device to hostname list as already checked
            hostnames.push(dataJSON[j].hostname);

            // Increase index j and device count
            j++;
            count++;
        }

        // Once all unique devices have been added for current data point, average the cpu total by the count
        memAvg = memAvg / count;

        // Push data point to array
        index++;
        array.push( [index, memAvg] );

        // Set i to equal the device index that is for the next data point (j)
        i = j;
    }
    console.log(array);
    return array;
};

function makeCPUFlot() {

    /*
     * Flot Interactive Chart
     * -----------------------
     */
  
    var interactive_plot = $.plot('#average-cpu-usage-chart', 
        [CPUArray], 
        {
            grid  : {
              borderColor: '#f3f3f3',
              borderWidth: 1,
              tickColor  : '#f3f3f3'
            },
            series: {
              shadowSize: 0, // Drawing is faster without shadows
              color     : '#3c8dbc'
            },
            lines : {
              fill : true, //Converts the line chart to area chart
              color: '#3c8dbc'
            },
            yaxis : {
              min : 0,
              max : 100,
              show: true
            },
            xaxis : {
              show: false
            }
        }
    )
  
    var updateInterval = 5000 //Fetch data ever x milliseconds
    var realtime       = 'on' //If == to on then fetch data every x seconds. else stop fetching

    function update() {
      
      interactive_plot.setData([CPUArray])
  
      // Since the axes don't change, we don't need to call plot.setupGrid()
      interactive_plot.draw()
      if (realtime === 'on')
        setInterval(update, updateInterval)
    }
  
    //INITIALIZE REALTIME DATA FETCHING
    if (realtime === 'on') {
      update()
    }
    /*
     * END INTERACTIVE CHART
     */
};

function makeMemoryFlot() {

    /*
     * Flot Interactive Chart
     * -----------------------
     */
  
    var interactive_plot = $.plot('#average-mem-usage-chart', 
        [memoryArray], 
        {
            grid  : {
              borderColor: '#f3f3f3',
              borderWidth: 1,
              tickColor  : '#f3f3f3'
            },
            series: {
              shadowSize: 0, // Drawing is faster without shadows
              color     : '#3c8dbc'
            },
            lines : {
              fill : true, //Converts the line chart to area chart
              color: '#3c8dbc'
            },
            yaxis : {
              min : 0,
              max : 100,
              show: true
            },
            xaxis : {
              show: false
            }
        }
    )
  
    var updateInterval = 5000 //Fetch data ever x milliseconds
    var realtime       = 'on' //If == to on then fetch data every x seconds. else stop fetching

    function update() {
      
      interactive_plot.setData([memoryArray])
  
      // Since the axes don't change, we don't need to call plot.setupGrid()
      interactive_plot.draw()
      if (realtime === 'on')
        setInterval(update, updateInterval)
    }
  
    //INITIALIZE REALTIME DATA FETCHING
    if (realtime === 'on') {
      update()
    }
    /*
     * END INTERACTIVE CHART
     */
};