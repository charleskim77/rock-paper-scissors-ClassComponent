<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'tot822');
define('DB_PASS', 'pkm!9831126');
define('DB_NAME', 'game_record');

function getDbConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}
?>