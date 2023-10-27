<?php

$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "todo_db";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data["action"])) {
    $action = $data["action"];

    if ($action == "add") {
        $task = $conn->real_escape_string($data["task"]);
        $stmt = $conn->prepare("INSERT INTO tasks (name) VALUES (?)");
        $stmt->bind_param("s", $task);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Task added successfully"]);
        } else {
            echo json_encode(["error" => "Error adding task"]);
        }
        $stmt->close();
    } 
    // elseif ($action == "edit") {
    //     $id = $data["id"];
    //     $updatedTask = $conn->real_escape_string($data["task"]);
    //     $stmt = $conn->prepare("UPDATE tasks SET name=? WHERE id=?");
    //     $stmt->bind_param("si", $updatedTask, $id);
    //     if ($stmt->execute()) {
    //         echo json_encode(["message" => "Task updated successfully"]);
    //     } else {
    //         echo json_encode(["error" => "Error updating task"]);
    //     }
    //     $stmt->close();
    // } 
    elseif ($action == "delete") {
        $id = $data["id"];
        $stmt = $conn->prepare("DELETE FROM tasks WHERE id=?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Task deleted successfully"]);
        } else {
            echo json_encode(["error" => "Error deleting task"]);
        }
        $stmt->close();
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    $action = $_GET["action"];

    if ($action == "get") {
        $stmt = $conn->prepare("SELECT * FROM tasks");
        $stmt->execute();
        $result = $stmt->get_result();
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = ["id" => $row["id"], "name" => $row["name"]];
        }
        echo json_encode($tasks);
        $stmt->close();
    }
}

$conn->close();
?>