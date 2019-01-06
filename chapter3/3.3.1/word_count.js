
var tasks = [];
var completeTasks = 0;

function checkIfComplete() {
  completeTasks++;
  if (completeTasks === tasks.length) {
    // do after all tasks
  }
}

function getAllTasks() {
  // 单个任务类似如下形式
  let task = function() {
    // do something
    checkIfComplete();
  }
  // return tasks
}

// 执行任务
tasks = getAllTasks();
for (let task of tasks) {
  task();
}

