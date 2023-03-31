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
      displayTask(task);
      clearForm();
    },
    error: function(error) {
      console.log("Save failed", error);
      alert("Unexpected Error, task was not saved :( ");
    }
  });

  console.log(task);
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
  let trueDate =  new Date(date); //parse date string intodddddobj
  return trueDate.toLocaleDateString() + ' ' + trueDate.toLocaleTimeString();
}

function displayTask(task){
  let syntax = `<div class="task" style="border:1px solid ${task.color};">
    <div class="info">
      <h5>${task.title}</h5>
      <p>${task.description}</p>
    </div>
    <label>${task.status}</label>
    <label>$${task.budget || "0.00"}</label>
    <div class="dates">
      <label>${formatDate(task.dueDate)}</label>
      <label>Days to complete: ${task.duration}</label>
    </div>
  </div>`;

  $("#pendingTasks").append(syntax);
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

function init(){
  console.log("Task Manager");

  //retrieve data
  fetchTasks();


  //hook events
  $("#btnShowPanel").click(togglePanel);
  $("#btnSave").click(saveTask)
  $("#iImportant").click(toggleImportant);
}

window.onload = init;

/**
 * Inv home:
 * http methods/verbs
 * http status codes
 * 
 * 
 * 
 * Challenges:
 * - format date
 * - clear form after displaying
 * 
 */