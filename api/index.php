<?php
	header('Access-Control-Allow-Origin: *');
    require_once "../inc/db-interface.php";

    // Get machine data
    $machine = json_decode($_GET["data"]);

    // Seperate objects within object
    $machine_drives = $machine->drives;
    $machine_os = $machine->system;

    // Add escape character to string properties
    $machine->hostname = addslashes($machine->hostname);
    $machine_os->name = addslashes($machine_os->name);
    $machine_os->version = addslashes($machine_os->version);

    // Connect to server database
    $db = new MySQL_Server_Connection();

    // Save OS
    $machine_os_sql = 
        "SELECT *
            FROM operating_systems
            WHERE name = \"$machine_os->name\"
            AND version = \"$machine_os->version\";";
    
    $res = $db->runSQLQuery($machine_os_sql);

    if( isset($res['rows']) && $res['rows'][0]['id'] != "") {
        $os_id = $res['rows'][0]['id'];
    }
    else {
        $machine_os_sql = 
            "INSERT INTO operating_systems(
                name,
                version
            )
            VALUES(
                \"$machine_os->name\",
                \"$machine_os->version\"
            );";
    
        $db->runSQLQuery($machine_os_sql);
        
        $machine_os_sql = 
        "SELECT *
            FROM operating_systems
            WHERE name = \"$machine_os->name\"
            AND version = \"$machine_os->version\";";
        
        $res = $db->runSQLQuery($machine_os_sql);
        $os_id = $res['rows'][0]['id'];
    }

    // Build device log SQL query
    $device_log_sql = 
        "INSERT INTO device_log(
            hostname,
            os_id,
            uptime,
            cpu_count,
            cpu_usage,
            memory_total,
            memory_used,
            memory_used_percent,
            network_up,
            network_down,
            timestamp
        )
        VALUES(
            \"$machine->hostname\",
            $os_id,
            $machine->uptime,
            $machine->cpu_count,
            $machine->cpu_usage,
            $machine->memory_total,
            $machine->memory_used,
            $machine->memory_used_percent,
            $machine->network_up,
            $machine->network_down,
            \"$machine->timestamp\"
        );";

    // Check database response for errors
    $res = $db->runSQLQuery($device_log_sql);
    if( $res["response"] != "true" ) {
        $error = "\n[" . date("Y-m-d H:i:s", time()) . "]: SQL Error Occured in api/index.php.\n" . $res["error"];
        print($error);
        error_log($error);
    }

    // Get ID of just entered host
    $host_id_sql =
        "SELECT id
            FROM device_log
            WHERE hostname LIKE \"$machine->hostname\"
            AND timestamp = \"$machine->timestamp\"
            ORDER BY id DESC;
        ";

    $res = $db->runSQLQuery($host_id_sql);
    if( $res["response"] != "true" ) {
        $error = "\n[" . date("Y-m-d H:i:s", time()) . "]: SQL Error Occured in api/index.php.\n" . $res["error"];
        print($error);
        error_log($error);
    }

    $host_id = $res["rows"][0]["id"];


    foreach($machine_drives as $drive) {
        $drive->name = addslashes($drive->name);
        $drive->mount_point = addslashes($drive->mount_point);
        $drive->type = addslashes($drive->type);

        $host_drives_sql =
            "INSERT INTO device_drives(
                name,
                mount_point,
                type,
                total_size,
                used_size,
                percent_used,
                timestamp,
                host_id
            )
            VALUES(
                \"$drive->name\",
                \"$drive->mount_point\",
                \"$drive->type\",
                $drive->total_size,
                $drive->used_size,
                $drive->percent_used,
                \"$machine->timestamp\",
                $host_id
            );";

        $res = $db->runSQLQuery($host_drives_sql);
        if( $res["response"] != "true" ) {
            $error = "\n[" . date("Y-m-d H:i:s", time()) . "]: SQL Error Occured in api/index.php.\n" . $res["error"];
            print($error);
            error_log($error);
        }
    }

    echo "success";
?>