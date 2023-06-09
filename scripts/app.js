var isImportant = false;
const serverUrl = 'http://fsdiapi.azurewebsites.net'

function togglePanel(){
  $("#form").slideToggle("slow");
  // console.log("button clicked");
}
function saveTask(){
  console.log("Save clicked");

  const title = $("#txtTitle").val(); //document.getElementById("txtTitle").innerHTML
  const desc = $("#txtDescription").val();
  const dueDate = $("#selDueDate").val();
  const duration = $("#txtDuration").val();
  const status = $("#selStatus").val();
  const color = $("#selColor").val();
  const budget = $("#txtBudget").val();

  //validations
  // if no title OR no desc OR no duration OR no busget
  if (!title || !desc || !duration || !budget) {
    //show an error
    showAlert("Validations have not been met! Please try again :( ", true);
    //stop the execution / Don't do anything else in this fn
    return;
  }


  let task = new Task(title, isImportant, desc, dueDate, duration, status, color, budget);
  console.log(task);
  
  // send the obj to server
  $.ajax({
    type: "POST",
    url: serverUrl + '/api/tasks/',
    data: JSON.stringify(task),
    contentType: 'application/json',
    success: function(res){
      console.log("Saved worked", res);
      showAlert("Awesome! Get to work!", false);
      displayTask(task);
      clearForm();
    },
    error: function(error) {
      console.log("Save failed", error);
      showAlert("Unexpected Error, task was not saved :(   ", true);
    }
  });
  console.log(task);
}

function showAlert(message, isError) {
  const alertDiv = document.getElementById('custom-alert');
  const alertText = document.getElementById('alert-text');

  alertText.innerHTML = message;
  alertDiv.style.display = 'block';

  if(isError) {
    $("#custom-alert").addClass("error-alert");
  }
  else {
    $("#custom-alert").removeClass("error-alert");
  }

  const closeButton = document.getElementById('alert-close');
  closeButton.onclick = function() {
    alertDiv.style.display = 'none';
  };

  setTimeout(function() {
    alertDiv.style.display = 'none';
  }, 3000);
}


function clearForm(){
  $("#txtTitle").val('');
  $("#txtDescription").val('');
  $("#selDueDate").val('');
  $("#txtDuration").val('');
  $("#selStatus").val('');
  $("#selColor").val('#000000');
  $("#txtBudget").val('');
}

function formatDate(date) {
  let trueDate =  new Date(date); //parse date string into obj
  return trueDate.toLocaleDateString() + ' ' + trueDate.toLocaleTimeString();
}

function getIcon(savedAsImportant) {
  if(savedAsImportant){
    //HERE
    return `<i class="fa-solid fa-star iImportant"></i>`;
  }else{
    return `<i class="fa-regular fa-star iNotImportant"></i>`;
  }
}

function formatBudget(budget){
  if(!budget) {
    return "0.00";
  }

  //parse budget to a number, and then fix it to 2 decimals
  return parseFloat(budget).toFixed(2);
}

function displayTask(task){
  let syntax = `<div id="${task._id}" class="task" style="border:1px solid ${task.color};">

  ${getIcon(task.important)}


    <div class="info">
      <h5>${task.title}</h5>
      <p>${task.description}</p>
    </div>
    <label>${task.status}</label>
    <label>$${formatBudget(task.budget)}</label>
    <label>Days to complete:  ${task.duration}</label>
    <div class="dates">
      <label>${formatDate(task.dueDate)}</label>
    </div>
      <i onclick="deleteTask('${task._id}')" class="fa-solid fa-trash iDelete"></i>
  </div>`;

  $("#pendingTasks").append(syntax);
}

function deleteTask(id){
  $.ajax({
    type: "DELETE",
    url: serverUrl + `/api/tasks/${id}/`,
    success: function(){
      console.log("Task removed");
      $("#" + id).remove(); //remove div from the screen
    },
    error: function(){
      console.log("Error deleting:", error);
    }
  });
}

function toggleImportant(){
  const nonImpClasses = "fa-regular fa-bookmark not-important";
  const impClasses = "fa-solid fa-bookmark important";

  if(isImportant){
    $("#iImportant").removeClass(impClasses).addClass(nonImpClasses);
    isImportant = false;
  }
  else {
    $("#iImportant").removeClass(nonImpClasses).addClass(impClasses);
    isImportant = true;
  }
}

function fetchTasks() {
  // retrieve all the tasks from the server
  $.ajax({
    url: serverUrl + '/api/tasks/',
    type: 'GET',
    success: function(response){
      const list = JSON.parse(response); //parse a json string into array/objects
      for(let i=0; i<list.length; i++){
        let record = list[i];
        //if the task name is equal to my name, then:
        if (record.name === "Yreish"){
          displayTask(record);      
        }
      }
    },
    error: function(error){
      console.log("Error", error);
    }
  });

}

function deleteAllTasks() {
  $.ajax({
    type: "DELETE",
    url: serverUrl + "/api/tasks/clear/Yreish/",
    success: function(){
      console.log("task cleared");
      $("#pendingTasks").html(''); //clear the contents of list (removing all tasks)
    },
    error: function(error) {
      console.log("Error clearing tasks", error);
    }
  });
}

function init(){
  console.log("Task Manager");

  //retrieve data
  fetchTasks();
  //hook events
  $("#btnShowPanel").click(togglePanel);
  $("#btnSave").click(saveTask)
  $("#iImportant").click(toggleImportant);
  $("#btnDeleteAll").click(deleteAllTasks);
}

window.onload = init;