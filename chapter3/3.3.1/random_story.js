import { runInNewContext } from "vm";

function checkForRSSFile () {
  // ...
  next(null, result);
}

function readRSSFile () {
  // ...
  next(null, result);
}

function downloadRSSFeed () {
  // ...
  next(null, result);
}

function parseRSSFeed () {
  // ...
  next(null, result);
}

function next (err, result) {
  if (err) throw err;
  var currentTask = tasks.shift();
  if (currentTask) {
    currentTask(result);
  }
}

var tasks = [
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
];

// 开始执行任务
next();