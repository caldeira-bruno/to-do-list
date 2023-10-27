function addTask() {
    var task = document.getElementById("task").value;
    if (task === "") {
        alert("Task cannot be empty!");
        return;
    }

    var taskData = {
        action: "add",
        task: task
    };

    fetch("backend.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        displayTasks();
        document.getElementById("task").value = "";
    })
    .catch(error => console.error("Error:", error));
}

// function editTask(id) {
//     var taskElement = document.getElementById("taskText_" + id);
//     if (taskElement) {
//         var updatedTask = prompt("Edit task:", taskElement.innerText);
//         if (updatedTask !== null && updatedTask.trim() !== "") {
//             var taskData = {
//                 action: "edit",
//                 id: id,
//                 task: updatedTask
//             };

//             fetch("backend.php", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(taskData)
//             })
//             .then(response => response.json())
//             .then(data => {
//                 displayTasks();
//             })
//             .catch(error => console.error("Error:", error));
//         }
//     } else {
//         console.log("Element not found: taskText_" + id);
//     }
// }

function deleteTask(id) {
    var taskData = {
        action: "delete",
        id: id
    };

    fetch("backend.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        displayTasks();
    })
    .catch(error => console.error("Error:", error));
}

function displayTasks() {
    fetch("backend.php?action=get")
    .then(response => response.json())
    .then(tasks => {
        const tbody = document.querySelector('tbody');

        tbody.innerHTML = "";

        for (let i = 0; i < tasks.length; i++) {
            const tr = document.createElement('tr');

            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');

            td1.textContent = tasks[i].id;
            td2.textContent = tasks[i].name;
            td3.innerHTML = 
                              "<button class='delete-button' onclick='deleteTask(" + tasks[i].id + ")'>Apagar</button>";

            tr.append(td1, td2, td3);
            tbody.append(tr);
        }

    })
    .catch(error => console.error("Error:", error));
}

displayTasks();