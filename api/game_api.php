<?php
header("Content-Type: application/json");
require_once 'db_connect.php';

$conn = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 게임 기록 저장
    $data = json_decode(file_get_contents("php://input"), true);
    
    $userName = $conn->real_escape_string($data['userName']);
    $finalPoints = (int)$data['finalPoints'];
    $wins = (int)$data['gameRecord']['wins'];
    $losses = (int)$data['gameRecord']['losses'];
    $ties = (int)$data['gameRecord']['ties'];
    $totalGames = $wins + $losses + $ties;
    $gameTime = $conn->real_escape_string($data['time']);
    $ipAddress = $_SERVER['REMOTE_ADDR'];

    $sql = "INSERT INTO game_records (user_name, final_points, wins, losses, ties, total_games, game_time, ip_address) 
            VALUES ('$userName', $finalPoints, $wins, $losses, $ties, $totalGames, '$gameTime', '$ipAddress')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Record saved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 랭킹 조회
    $sql = "SELECT * FROM rankings";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $rankings = [];
        while($row = $result->fetch_assoc()) {
            $rankings[] = $row;
        }
        echo json_encode($rankings);
    } else {
        echo json_encode([]);
    }

} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}

$conn->close();
?>