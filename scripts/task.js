class Task{
  constructor(title, important, desc, dueDate, duration, status, color, budget){
    this.title = title;
    this.important = important;
    this.description = desc;
    this.dueDate = dueDate;
    this.duration = duration;
    this.status = status;
    this.color = color;
    this.budget = budget;

    this.name = "Yreish";
  }
}

/**
- add the control on the form (add an id)
- update save task to read that value
- update task class to receive that new value
- send the new value when creating a new task (on saveTask fn)
- update the display function to display the budget (css changes may be needed)
 */