/**
 * Monitoring JS to fetch system information from API.
 * 
 * @Author MF Softworks <mf@nygmarosebeauty.com>
 */

var systemJSON;
var dataJSON;
var deviceUnique;

// First run
getUniqueDevices();
getDevices();

// Set 60 second interval
var getDevicesInterval = setInterval(
    function() { 
        getDevices() 
    }, 
    5 * 1000
);

var deviceCountInterval = setInterval(
    function() { 
        getUniqueDevices() 
    }, 
    5 * 1000
);

function getDevices() {
    $.get(
        "../../api/get.php",

        function(response) {

            try {
                systemJSON = JSON.parse(response);
                dataJSON = systemJSON.rows;

                // Check device info
                //for(var i=0; i<dataJSON.length; i++) {
                //    console.log(dataJSON[i]);
                //}

                $(document).ready(function() {
                    systemsAverageCPUPercent();
                    systemsAverageMemoryPercent();
                    systemsAverageTraffic();
                });
            }
            catch(e) {
                $("#dashboard-cpu-average").empty();
                $("#dashboard-cpu-average").append("0 <small>%</small>");
                $("#dashboard-memory-average").empty();
                $("#dashboard-memory-average").append("0 <small>%</small>");
                $("#dashboard-traffic-average").empty();
                $("#dashboard-traffic-average").append("0 B/s");
            }
        }
    );
};

function getUniqueDevices() {
    $.get(
        "../../api/get.php",
        {
            condition: "unique devices"
        },
        function(response) {
            deviceUnique = parseInt(response);
            $(document).ready(function() {
                $("#dashboard-device-count").empty();
                $("#dashboard-device-count").append(response);
            });
        }
    );
};

function systemsAverageCPUPercent() {
    var cpuAvg = calcAvgCPU();
    $('#dashboard-cpu-average').empty();
    $('#dashboard-cpu-average').append(cpuAvg + "<small>%</small>");
};
function calcAvgCPU() {
    var cpuCount = 0.0;
    var cpuAvg;
    for(var i = 0; i < deviceUnique; i++) {
        cpuCount += parseFloat(dataJSON[i].cpu_usage);
    }
    cpuAvg = cpuCount / i;
    return cpuAvg.toFixed(2);
};

function systemsAverageMemoryPercent() {
    var memAvg = calcAvgMemory();
    $('#dashboard-memory-average').empty();
    $('#dashboard-memory-average').append(memAvg + "<small>%</small>");
};
function calcAvgMemory() {
    var memCount = 0.0;
    var memAvg;
    for(var i = 0; i < deviceUnique; i++) {
        memCount += parseFloat(dataJSON[i].memory_used_percent);
    }
    memAvg = memCount / i;
    return memAvg.toFixed(2);
};

function systemsAverageTraffic() {
    var trafficAvg = calcAvgTraffic();
    $("#dashboard-traffic-average").empty();
    $("#dashboard-traffic-average").append(trafficAvg);
};
function calcAvgTraffic() {
    var trafficCount = 0;
    var trafficAvg = 0;
    for(var i = 0; i < deviceUnique; i++) {
        trafficCount += parseInt(dataJSON[i].network_up);
        trafficCount += parseInt(dataJSON[i].network_down);
    }
    trafficAvg = Math.floor(trafficCount / i);
    
    var trafficKB = Math.round(trafficAvg / 1024);
    var trafficMB = Math.round(trafficAvg / 1048576);

    if(trafficMB > 10) {
        return formatThousandSeperator(trafficMB) + " MB/s";
    }
    else if(trafficKB > 10) {
        return formatThousandSeperator(trafficKB) + " kB/s";
    }
    else {
        return formatThousandSeperator(trafficAvg) + " B/s"
    }
};

// Format large numbers with commas
function formatThousandSeperator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}