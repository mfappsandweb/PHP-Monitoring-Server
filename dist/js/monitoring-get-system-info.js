/**
 * Monitoring JS to fetch system information from API.
 * 
 * @Author MF Softworks <mf@nygmarosebeauty.com>
 */

function getSystemInfo() {

    $.get(
        "../../api/get.php",

        function(response) {
            var systemJSON = JSON.parse(response);
            for(var i=0; i<10; i++) {
                device = systemJSON.rows[i];
                console.log( device );
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
            $("#dashboard-device-count").append(response);
        }
    );

};

function systemsAverageCPUPercent() {
    $.get(
        "../../api/get.php",

        function(response) {
            var dataJSON = JSON.parse(response);
            var systemsJSON = dataJSON.rows;
            var cpuAvg = calcAvgCPU(systemsJSON);
            $('#dashboard-cpu-average').append(cpuAvg + "<small>%</small>");
        }
    );
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
    $.get(
        "../../api/get.php",

        function(response) {
            var dataJSON = JSON.parse(response);
            var systemsJSON = dataJSON.rows;
            var memAvg = calcAvgMemory(systemsJSON);
            $('#dashboard-memory-average').append(memAvg + "<small>%</small>");
        }
    );
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