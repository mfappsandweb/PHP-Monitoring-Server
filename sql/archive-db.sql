DELETE FROM device_log
    WHERE TIMESTAMPDIFF(DAY,timestamp,UTC_TIMESTAMP()) >= 7;