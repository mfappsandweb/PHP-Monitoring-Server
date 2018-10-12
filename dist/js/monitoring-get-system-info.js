/**
 * Monitoring JS to fetch system information from API.
 * 
 * @Author MF Softworks <mf@nygmarosebeauty.com>
 */

var systemJSON;
var dataJSON;

// First run
getDevices();
getUniqueDevices();

// Set 60 second interval
var getDevicesInterval = setInterval(
    function() { 
        getDevices() 
    }, 
    60 * 1000
);

var deviceCountInterval = setInterval(
    function() { 
        getUniqueDevices() 
    }, 
    60 * 1000
);

function getDevices() {
    $.get(
        "../../api/get.php",

        function(response) {

            systemJSON = JSON.parse(response);
            dataJSON = systemJSON.rows;

            // Check device info
            //for(var i=0; i<dataJSON.length; i++) {
            //    console.log(dataJSON[i]);
            //}

            $(document).ready(function() {
                systemsAverageCPUPercent();
                systemsAverageMemoryPercent();
                systemsAverageUptime();
            });
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
            $(document).ready(function() {
                $("#dashboard-device-count").empty();
                $("#dashboard-device-count").append(response);
            });
        }
    );
};

function systemsAverageCPUPercent() {
    var cpuAvg = calcAvgCPU(dataJSON);
    $('#dashboard-cpu-average').empty();
    $('#dashboard-cpu-average').append(cpuAvg + "<small>%</small>");
};
function calcAvgCPU(dataJSON) {
    var cpuCount = 0.0;
    var cpuAvg;
    for(var i = 0; i < dataJSON.length; i++) {
        cpuCount += parseFloat(dataJSON[i].cpu_usage);
    }
    cpuAvg = cpuCount / i;
    return cpuAvg.toFixed(2);
};

function systemsAverageMemoryPercent() {
    var memAvg = calcAvgMemory(dataJSON);
    $('#dashboard-memory-average').empty();
    $('#dashboard-memory-average').append(memAvg + "<small>%</small>");
};
function calcAvgMemory(dataJSON) {
    var memCount = 0.0;
    var memAvg;
    for(var i = 0; i < dataJSON.length; i++) {
        memCount += parseFloat(dataJSON[i].memory_used_percent);
    }
    memAvg = memCount / i;
    return memAvg.toFixed(2);
};

function systemsAverageUptime() {
    var uptimeAvg = calcAvgUptime(dataJSON);
    $("#dashboard-uptime-average").empty();
    $("#dashboard-uptime-average").append(uptimeAvg);
};
function calcAvgUptime(dataJSON) {
    var uptimeCount = 0;
    var uptimeAvg;
    for(var i = 0; i < dataJSON.length; i++) {
        uptimeCount += parseInt(dataJSON[i].uptime);
    }
    uptimeAvg = uptimeCount / i;
    
    var hours = Math.floor(uptimeAvg / 3600);
    var minutes = Math.floor((uptimeAvg % 3600) / 60);

    if(hours > 0) {
        return hours + " hours " + minutes + " mins";
    }
    else if(minutes > 0) {
        return minutes + " mins";
    }
    else {
        return uptimeAvg + " seconds";
    }
};