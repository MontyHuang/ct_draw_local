<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");

include("dbconn.php");

$id = "r0906003";

//全部試卷
$exam = [];

//學生試卷
$studentExamPaper = "";

//學生題目狀態
$studentTopicState = [];

//回傳資料
$data = [];

// Create connection
try {
    //尋找學生是否在topic_state有資料
    $stmt = $conn->prepare("SELECT * FROM ct_draw_topic_state WHERE s_id=?");
    $stmt->execute([$id]);
    $fetchdata = $stmt->fetchAll();

    //如果沒有資料
    if ($fetchdata == false) {
        //學生資料初始化
        //派試卷
        $examPDO = $conn->prepare("SELECT DISTINCT exam_id FROM ct_draw_exam;");
        $examPDO->execute();
        $fetchexamPDO = $examPDO->fetchAll();
        foreach ($fetchexamPDO as $row) {
            array_push($exam, $row['exam_id']);
        }
        $studentExamPaper = $exam[rand(0, count($exam) - 1)];

        $initExamPDO = $conn->prepare("INSERT INTO `ct_draw_st_exam`(`s_id`, `exam_id`) VALUES (?,?)");
        $initExamPDO->execute([$id, $studentExamPaper]);

        //寫入學生任務State
        $initStatePDO = $conn->prepare("INSERT INTO `ct_draw_topic_state`(`s_id`, `topic_no`, `topic_state`) VALUES (?,?,?)");
        $initStatePDO->execute([$id, 1, 0]);
        $initStatePDO->execute([$id, 2, 0]);
        $initStatePDO->execute([$id, 3, 0]);


        $topicData = array('topic' => []);
        //回傳題目
        $topicPDO = $conn->prepare("SELECT ct_draw_exam.topic_1, ct_draw_exam.topic_2, ct_draw_exam.topic_3 FROM ct_draw_exam INNER JOIN ct_draw_st_exam ON ct_draw_exam.exam_id=ct_draw_st_exam.exam_id WHERE ct_draw_st_exam.s_id=?;");
        $topicPDO->execute([$id]);
        $fetchtopicPDO = $topicPDO->fetchAll();

        foreach ($fetchtopicPDO as $row) {
            array_push($topicData['topic'], $row['topic_1'], $row['topic_2'], $row['topic_3']);
        }


        //回傳題目狀態

        $topicstatePDO = $conn->prepare("SELECT * FROM ct_topic_state WHERE s_id=?");
        $topicstatePDO->execute([$id]);
        $fetchtopicstatePDO = $topicstatePDO->fetchAll();
        $tmp = array($fetchtopicstatePDO[0]['topic_no'] => (int)$fetchtopicstatePDO[0]['topic_state'], $fetchtopicstatePDO[1]['topic_no'] => (int)$fetchtopicstatePDO[1]['topic_state'], $fetchtopicstatePDO[2]['topic_no'] => (int)$fetchtopicstatePDO[2]['topic_state']);
        $topicState = array('state' => $tmp);


        $data = array_merge($topicData,$topicState);
    } else {
        $topicData = array('topic' => []);
        //回傳題目
        $topicPDO = $conn->prepare("SELECT ct_draw_exam.topic_1, ct_draw_exam.topic_2, ct_draw_exam.topic_3 FROM ct_draw_exam INNER JOIN ct_draw_st_exam ON ct_draw_exam.exam_id=ct_draw_st_exam.exam_id WHERE ct_draw_st_exam.s_id=?;");
        $topicPDO->execute([$id]);
        $fetchtopicPDO = $topicPDO->fetchAll();

        foreach ($fetchtopicPDO as $row) {
            array_push($topicData['topic'], $row['topic_1'], $row['topic_2'], $row['topic_3']);
        }


        //回傳題目狀態

        $topicstatePDO = $conn->prepare("SELECT * FROM ct_draw_topic_state WHERE s_id=?");
        $topicstatePDO->execute([$id]);
        $fetchtopicstatePDO = $topicstatePDO->fetchAll();
        $tmp = array($fetchtopicstatePDO[0]['topic_no'] => (int)$fetchtopicstatePDO[0]['topic_state'], $fetchtopicstatePDO[1]['topic_no'] => (int)$fetchtopicstatePDO[1]['topic_state'], $fetchtopicstatePDO[2]['topic_no'] => (int)$fetchtopicstatePDO[2]['topic_state']);
        $topicState = array('state' => $tmp);


        $data = array_merge($topicData,$topicState);

    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

print_r(json_encode($data));

$conn = null;