<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");


include("dbconn.php");

$id = "r0906003";

$data = [];

try {
    //更新 code , 成績 , 完成時間 
    $topicPDO = $conn->prepare("SELECT ct_draw_exam.topic_1, ct_draw_exam.topic_2, ct_draw_exam.topic_3 FROM ct_draw_exam INNER JOIN ct_draw_st_exam ON ct_draw_exam.exam_id=ct_draw_st_exam.exam_id WHERE ct_draw_st_exam.s_id=?;");
    $topicPDO->execute([$id]);
    $fetchtopicPDO = $topicPDO->fetchAll();
    $topicData = array('topic' => []);
    foreach ($fetchtopicPDO as $row) {
        array_push($topicData['topic'], $row['topic_1'], $row['topic_2'], $row['topic_3']);
    }


    $statePDO = $conn->prepare("SELECT * FROM ct_draw_topic_state WHERE s_id=?");
    $statePDO->execute([$id]);
    $fetchstatePDO = $statePDO->fetchAll();

    $statetmp = array($fetchstatePDO[0]['topic_no'] => [(int)$fetchstatePDO[0]['topic_state'],(int)$fetchstatePDO[0]['score'],$fetchstatePDO[0]['topic_xml']],$fetchstatePDO[1]['topic_no'] => [(int)$fetchstatePDO[1]['topic_state'],(int)$fetchstatePDO[1]['score'],$fetchstatePDO[1]['topic_xml']],$fetchstatePDO[2]['topic_no'] => [(int)$fetchstatePDO[2]['topic_state'],(int)$fetchstatePDO[2]['score'],$fetchstatePDO[2]['topic_xml']]);
    $topicState = array('state' => $statetmp);

    $data = array_merge($topicData,$topicState);


} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

print_r(json_encode($data));

$conn = null;