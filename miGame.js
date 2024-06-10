"use strict";

var runSound = new Audio("resources/run.mp3");
runSound.loop = true;
var jumpSound = new Audio("resources/jump.mp3");
var deadSound = new Audio("resources/dead.mp3");

var screen = "home";
function key(event) {
  //   alert(event.which);

  if (screen == "game") {
    if (event.which == 13) {
      // Enter
      setTimeout(startGame, 1000 * 1);
    }

    if (event.which == 32) {
      // Space
      if (girlStatus == "alive") {
        if (scorePoint < winScore) {
          if (runAnimationId != 0) {
            if (jumpAnimationId == 0) {
              clearInterval(runAnimationId);
              runSound.pause();
              jumpAnimationId = setInterval(jump, 130);
              jumpSound.play();
              runAnimationId = 0;
            }
          } else {
            //   alert("Press Enter to Start the Game");
            startGame();
          }
        } else {
          score();
        }
      }
    }

    if (event.which == 8 || event.which == 27) {
      // ESC or Backspace
      if (girlStatus == "alive") {
        if (scorePoint < winScore) {
          if (runAnimationId != 0) {
            clearInterval(runAnimationId);
            runSound.pause();
            runAnimationId = 0;
          } else if (jumpAnimationId != 0) {
            clearInterval(jumpAnimationId);
            jumpSound.pause();
            jumpAnimationId = 0;
          }
          clearInterval(moveBackgroundAnimationId);
          clearInterval(moveObjectAnimationId);
          moveBackgroundAnimationId = 0;
          moveObjectAnimationId = 0;
        } else {
          score();
        }
      }
    }
  }
}

var girlStatus = "alive";
function startGame() {
  if (runAnimationId == 0) {
    moveObjectAnimationId = setInterval(moveObjects, 9.4);
    runAnimationId = setInterval(run, 130);
    runSound.play();
    moveBackgroundAnimationId = setInterval(movebackground, 0.5);
    girl.style.marginTop = girlMarginTopDefault + "px";
    jumpAnimationId = 0;
  }
}

var moveObjectAnimationId = 0;
var objectMarginLeft = 1500;
var objectCount = 110;
var obstacleImage = "resources/flame.gif";
function createObjects() {
  for (var y = 0; y < objectCount; y++) {
    var obstacle = document.createElement("img");
    obstacle.src = obstacleImage;
    obstacle.className = "obstacle";
    obstacle.style.marginLeft = objectMarginLeft + "px";

    if (y <= winScore / 3) {
      objectMarginLeft += 1500;
    }

    if (y >= winScore / 3) {
      objectMarginLeft += 1200;
    }
    if (y >= winScore * (2 / 3)) {
      objectMarginLeft += 1000;
    }

    obstacle.id = "obstacle" + y;
    background.appendChild(obstacle);
  }
}

var girl = document.getElementById("girl");

var runAnimationId = 0;
var runImageNumber = 1;
function run() {
  runImageNumber += 1;
  if (runImageNumber == 9) {
    runImageNumber = 1;
  }

  girl.src = "resources/Run (" + runImageNumber + ").png";
  score();
}

var girlMarginTop = 260;
var girlMarginTopDefault = 260;

function moveObjects() {
  for (var y = 0; y < objectCount; y++) {
    var obstacle = document.getElementById("obstacle" + y);
    var obstacleCurrentMarginLeft = getComputedStyle(obstacle).marginLeft;
    var obstacleNewMarginLeft = parseInt(obstacleCurrentMarginLeft) - 5;
    obstacle.style.marginLeft = obstacleNewMarginLeft + "px";

    if ((obstacleNewMarginLeft >= 50) & (obstacleNewMarginLeft <= 200)) {
      if (girlMarginTop > 280) {
        // alert(objectMarginLeft);
        console.log(objectMarginLeft);
        clearInterval(runAnimationId);
        runSound.pause();
        clearInterval(jumpAnimationId);
        jumpAnimationId = 0;
        clearInterval(moveObjectAnimationId);
        clearInterval(moveBackgroundAnimationId);
        deadAnimationId = setInterval(dead, 100);
        deadSound.play();
        girlStatus = "dead";
        screen = "end";
      }
    }
  }
}

var jumpAnimationId = 0;
var jumpImageNumber = 1;
function jump() {
  if (jumpImageNumber <= 5) {
    for (var x = 0; x < 1000; x++) {
      girlMarginTop -= 0.05; // = (girlMarginTop = girlMarginTop - 30;)
    }
  }

  if (jumpImageNumber >= 6) {
    for (var x = 0; x < 1000; x++) {
      girlMarginTop += 0.05; // = (girlMarginTop = girlMarginTop + 30;)
    }
  }

  girl.style.marginTop = girlMarginTop + "px";

  jumpImageNumber += 1;

  if (jumpImageNumber == 11) {
    jumpImageNumber = 1;
    clearInterval(jumpAnimationId);
    runAnimationId = setInterval(run, 100);
    runSound.play();

    jumpAnimationId = 0;
    girlMarginTop = girlMarginTopDefault;
  }

  girl.src = "resources/Jump (" + jumpImageNumber + ").png";
  score();
}

var endScreen = document.getElementById("end");
var endScreenMsg = document.getElementById("msg");
var endScreenScore = document.getElementById("endScore");

var deadAnimationId = 0;
var deadImageNumber = 1;
function dead() {
  deadImageNumber += 1;

  if (deadImageNumber == 11) {
    deadImageNumber = 10;
    clearInterval(deadAnimationId);

    deadAnimationId = 0;

    endScreenMsg.innerHTML = "Game Over";
    endScreenScore.innerHTML = scorePoint;
    setTimeout(end, 1000 * 1);
  }
  girl.style.marginTop = girlMarginTopDefault + 50 + "px";

  girl.src = "resources/Dead (" + deadImageNumber + ").png";
}

function end() {
  endScreen.style.display = "flex";
  background.style.display = "none";
}

var scorePoint = 0;
var winScore = 1000;
function score() {
  if (scorePoint < winScore) {
    scorePoint += 1;
    var socreIndicator = document.getElementById("score");
    socreIndicator.innerHTML = scorePoint + " of " + winScore;
  } else {
    clearInterval(runAnimationId);
    clearInterval(jumpAnimationId);
    clearInterval(moveObjectAnimationId);
    clearInterval(moveBackgroundAnimationId);
    girlMarginTop = girlMarginTopDefault;
    girl.style.display = "none";
    runSound.pause();
    endScreenMsg.innerHTML = "You Won";
    endScreenScore.innerHTML = winScore;
    setTimeout(end, 1000 * 0.5);
    screen = "end";
  }
}

var moveBackgroundAnimationId = 0;
var backgroundPositionX = 0;
var background = document.getElementById("background");
var backgroundImage1 = 'url("resources/background1.jpg")';
var backgroundImage2 = 'url("resources/background1.jpg")';
function movebackground() {
  backgroundPositionX -= 3;
  background.style.backgroundPositionX = backgroundPositionX + "px";
  if (scorePoint == winScore / 3) {
    background.style.backgroundImage = backgroundImage2;
  }
  if (scorePoint == winScore * (2 / 3)) {
    background.style.backgroundImage = backgroundImage1;
  }
}

function restart() {
  window.location.reload();
}

var startScreen = document.getElementById("start");
function start(level) {
  screen = "game";
  endScreen.style.display = "none";
  background.style.display = "flex";
  startScreen.style.display = "none";
  setTimeout(startGame, 1000 * 1);
  winScore = level;
}
