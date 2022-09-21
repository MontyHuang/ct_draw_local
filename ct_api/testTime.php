<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");

include("dbconn.php");

$id = "r0906003";

//預設考試時間
$defaultTestStartTime = "2022-06-06 10:00:00";
$defaultTestEndTime = "2023-06-24 17:00:00";

//回傳資料 陣列位置0狀態 (0:任務還沒開始 1:任務進行 2:任務結束)
$data = [];

//現在時間
$datenow = date("Y-m-d H:i:s");

function TestTimeCompare($datenow, string $studentTestStartTime, string $studentTestEndTime)
{
    $TimeStateData = [];
    if ($datenow <= $studentTestStartTime && $datenow <= $studentTestEndTime) {
        array_push($TimeStateData, 0, $studentTestStartTime, $studentTestEndTime);
    } else if ($datenow >= $studentTestStartTime && $datenow >= $studentTestEndTime) {
        array_push($TimeStateData, 2, $studentTestStartTime, $studentTestEndTime);
    } else {
        array_push($TimeStateData, 1, $studentTestStartTime, $studentTestEndTime);
    }

    return $TimeStateData;
}

// Create connection
try {
    $stmt = $conn->prepare("SELECT * FROM ct_draw_sp_test_time WHERE s_id=?");
    $stmt->execute([$id]);
    $fetchdata = $stmt->fetchAll();

    if ($fetchdata) {
        $data = TestTimeCompare($datenow, $fetchdata[0]['start'], $fetchdata[0]['end']);
    } else {
        $data = TestTimeCompare($datenow, $defaultTestStartTime, $defaultTestEndTime);
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}


print_r(json_encode($data));

$conn = null;
