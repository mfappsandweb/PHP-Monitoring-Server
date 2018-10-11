<?php
	header('Access-Control-Allow-Origin: *');
    require_once "../inc/db-interface.php";

    $db = new MySQL_Server_Connection();

    if(!isset($_GET['condition'])) $_GET['condition'] = null;

    switch($_GET['condition']) {
        case "unique devices":
            $device_sql =
            "SELECT COUNT(DISTINCT hostname)
                FROM device_log;";
            
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
                ORDER BY id DESC;";

            // Store database response
            $response = $db->runSQLQuery($device_sql);

            // Return JSON response
            echo json_encode($response);
            return;
    }

?>