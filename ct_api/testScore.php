<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");

header('Content-Type: application/json; charset=utf-8');

include("dbconn.php");


//學生id
$id = $_POST['studnet'];
//第幾題
$step = $_POST['step'];
//成績
$score = $_POST['score'];
//Blockly XML 學生作答
$code = $_POST['code'];

$datenow = date("Y-m-d H:i:s");



try {
    //更新 code , 成績 , 完成時間 
    $stmt = $conn->prepare("UPDATE ct_draw_topic_state SET topic_state=?,topic_xml=?,score=?,finish_time=? WHERE s_id=? AND topic_no=?;");
    $stmt->execute([1, $code, $score, $datenow, $id, $step]);

    if ($stmt->rowCount() == false) {
        echo "error";
    }
} catch (PDOException $e) {
    echo "Connection failed: "  . $e->getMessage();
}

$conn = null;
