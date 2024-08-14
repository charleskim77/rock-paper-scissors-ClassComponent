<?php
header('Content-Type: application/json');

// 데이터베이스 연결 정보
define('DB_HOST', '185.229.113.239');
define('DB_USER', 'u645262502_noona');
define('DB_PASS', 'Noona2004&@#$');
define('DB_NAME', 'u645262502_noonadb');


// 데이터베이스 연결
function connectDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
    }
    return $conn;
}

// 게임 기록 저장
function saveRecord($data) {
    $conn = connectDB();
    $userName = $conn->real_escape_string($data['userName']);
    $finalPoints = intval($data['finalPoints']);
    $wins = intval($data['gameRecord']['wins']);
    $losses = intval($data['gameRecord']['losses']);
    $ties = intval($data['gameRecord']['ties']);
    $time = $conn->real_escape_string($data['time']);

    $sql = "INSERT INTO game_records (user_name, final_points, wins, losses, ties, play_time) 
            VALUES ('$userName', $finalPoints, $wins, $losses, $ties, '$time')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Record saved successfully']);
    } else {
        echo json_encode(['error' => 'Error saving record: ' . $conn->error]);
    }

    $conn->close();
}

// 랭킹 조회
function getRankings() {
    $conn = connectDB();
    $sql = "SELECT user_name, final_points FROM game_records 
            ORDER BY final_points DESC LIMIT 20";
    $result = $conn->query($sql);

    $rankings = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $rankings[] = [
                'userName' => $row['user_name'],
                'finalPoints' => intval($row['final_points'])
            ];
        }
    }

    echo json_encode($rankings);
    $conn->close();
}

// API 라우팅
$requestMethod = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

if ($requestMethod === 'POST' && $action === 'saveRecord') {
    $data = json_decode(file_get_contents('php://input'), true);
    saveRecord($data);
} elseif ($requestMethod === 'GET' && $action === 'getRankings') {
    getRankings();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}