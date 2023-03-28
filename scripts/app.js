console.log("Task Manager");

function togglePanel(){
  $("#form").slideToggle("slow");
  // console.log("button clicked");
}
function saveTask(){
  console.log("Save clicked");
}

function toggleImportant(){
  const nonImpClasses = "fa-regular fa-bookmark not-important";
  const impClasses = "fa-solid fa-bookmark important";

  $("#iImportant").removeClass(nonImpClasses)
  $("#iImportant").addClass(impClasses);
}

function init(){
  console.log("Task Manager");

  //retrieve data

  //hook events
  $("#btnShowPanel").click(togglePanel);
  $("#btnSave").click(saveTask)
  $("#iImportant").click(toggleImportant);
}

window.onload = init;