<?php
	header('Access-Control-Allow-Origin: *');
    require_once "../inc/db-interface.php";

    $db = new MySQL_Server_Connection();

    if(!isset($_GET['condition'])) $_GET['condition'] = null;
    if(!isset($_GET['view'])) $_GET['view'] = null;

    switch($_GET['condition']) {
        case "unique devices":
            $device_sql =
            "SELECT COUNT(DISTINCT hostname)
                FROM device_log
                WHERE TIMESTAMPDIFF(MINUTE,timestamp,UTC_TIMESTAMP()) < 60;";
            
            // Store database response for searching
            $response = $db->runSQLQuery($device_sql);

            // Return count
            echo $response["rows"][0]["COUNT(DISTINCT hostname)"];
            return;

        default:
            // Get all system info within the last 60 minutes
            $device_sql = 
            "SELECT * 
                FROM device_log
                WHERE TIMESTAMPDIFF(MINUTE,timestamp,UTC_TIMESTAMP()) < 60
                ORDER BY id DESC
                LIMIT 200;";

            // Store database response
            $response = $db->runSQLQuery($device_sql);

            $devices = $response['rows'];

            for($i = 0; $i < count($devices); $i++) {
                $drive_sql = 
                "SELECT *
                    FROM device_drives
                    WHERE host_id = ".$devices[$i]['id']."
                    AND timestamp = \"".$devices[$i]['timestamp']."\";
                ";

                $response_d = $db->runSQLQuery($drive_sql);
                $drives = $response_d['rows'];

                $response['rows'][$i]['drives'] = $drives;

                $os_sql =
                "SELECT *
                    FROM operating_systems
                    WHERE id = ".$devices[$i]['os_id'].";
                ";

                $response_os = $db->runSQLQuery($os_sql);
                $os = $response_os['rows'];

                $response['rows'][$i]['system'] = $os;
            }

            // Return JSON response
            if($_GET['view'] === "browser") {
                echo "<pre>" . json_encode($response, JSON_PRETTY_PRINT) . "</pre>";
            }
            else {
                echo json_encode($response);
            }
            return;
    }

?>