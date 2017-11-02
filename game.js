function gameStart() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var x = canvas.width / 2;
  var y = canvas.height - 80;
  var paddleHeight = 18;
  var paddleWidth = 135;
  var paddleX = (canvas.width - paddleWidth) / 2;
  var rightPressed = false;
  var leftPressed = false;
  var ballRadius = 12;
  var brickRowCount = 8;
  var brickColumnCount = 8;
  var count = brickRowCount * brickColumnCount;
  var rem = count;
  var score = 0;
  var lives = 5;
  var flag = 0;
  var brickWidth = 80;
  var brickHeight = 20;
  var brickPadding = 3;
  var brickOffsetTop = 100;
  var brickOffsetLeft = 150;
  var magicBrickRow = Math.round(Math.random() * brickRowCount);
  var magicBrickCol = Math.round(Math.random() * brickColumnCount);
  var gamelevel = 1;
  var paused = false;
  var bricks = [];
  var muted = false;
  for (c = 0; c < brickColumnCount; ++c) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; ++r) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1
      };
    }
  }
  var dx = 2.5;
  var dy = -2.5;
  var explode = new Audio("Explosion.mp3");
  var hit = new Audio("hit.mp3");
  var won = new Audio("won.mp3");

  document.getElementById('sound').onclick = function () {
    console.log("Muted Functions" + document.getElementById('sound').src);
    if ((document.getElementById('sound').src.toString()).indexOf("off.png") != -1) {
      console.log('Volume On');
      this.src = "on.png";
      explode.volume = 1.0;
      hit.volume = 1.0;
      won.volume = 1.0;

    } else if ((document.getElementById('sound').src.toString()).indexOf("on.png") != -1) {
      console.log('Volume Off');
      this.src = "off.png";
      explode.volume = 0;
      hit.volume = 0;
      won.volume = 0;
    }
  };

  function gamenextLevel(level, nscore) {
    if (gamelevel < 5) {
      console.log(level);
      if (level == 2) {
        console.log(document.querySelector('.speech').innerText);
        document.querySelector('.speech').innerText = "Greate Job!! More 3 level to finish the Game!\n\tPress Space bar to Pause the Game.";
        var brickOffsetTop = 120;
        var brickOffsetLeft = 200;
        brickColumnCount = brickColumnCount - 1;
        brickRowCount = brickRowCount - 1;
        dx = dx + 2;
        dy = dy - 2;
      }
      if (level == 3) {
        console.log(document.querySelector('.speech').innerText);
        document.querySelector('.speech').innerText = "Greate Job!! More 2 level to finish the Game!\n\tPress Space bar to Pause the Game.";
        var brickOffsetTop = 130;
        var brickOffsetLeft = 150;
        brickColumnCount = brickColumnCount - 1;
        brickRowCount = brickRowCount - 1;
        dx = dx + 2;
        dy = dy - 2;
      }
      if (level == 4) {
        console.log(document.querySelector('.speech').innerText);
        document.querySelector('.speech').innerText = "Greate Job!! More 2 level to finish the Game!\n\tPress Space bar to Pause the Game.";
        var brickOffsetTop = 120;
        var brickOffsetLeft = 200;
        brickColumnCount = brickColumnCount + 1;
        brickRowCount = brickRowCount + 1;
        dx = dx + 2;
        dy = dy - 2;
      }
      if (level == 5) {
        console.log(document.querySelector('.speech').innerText);
        document.querySelector('.speech').innerText = "Greate Job!! This is the Final Level to Win\n\tPress Space bar to Pause the Game.";
        var brickOffsetTop = 100;
        var brickOffsetLeft = 150;
        brickColumnCount = brickColumnCount + 1;
        brickRowCount = brickRowCount + 1;
        dx = dx + 3;
        dy = dy - 3;
      }

      count = brickColumnCount * brickRowCount;
      x = canvas.width / 2;
      y = canvas.height - 200;
      gamelevel = level;
      localStorage.setItem("gamelevel", gamelevel);
      paddleWidth = paddleWidth > 70 ? paddleWidth - 20 : paddleWidth;
      console.log('Paddle Width:'+paddleWidth);
      for (c = 0; c < brickColumnCount; ++c) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; ++r) {
          bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
          };
        }
      }
    } else
      location.href = "success.html";
  }


  function localstorage(hscore) {
    if (typeof (Storage) !== "undefined") {
      if (localStorage.getItem("highScore") < hscore) {
        var username = window.prompt("You are the HighScorer! Enter Your Name");
        username != null ? localStorage.setItem("username", username) : localStorage.setItem("username", ' ');
        localStorage.setItem("highScore", hscore);
      }
    } else {
      alert("Sorry, your browser does not support Web Storage.");
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#353638";
    ctx.fillStroke = "#fff";
    ctx.stroke = "10";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#353638";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (c = 0; c < brickColumnCount; ++c) {
      for (r = 0; r < brickRowCount; ++r) {
        if (bricks[c][r].status == 1) {
          var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          //ctx.shadowBlur = 10;
          //ctx.shadowColor = "black";
          if (c == magicBrickCol && r == magicBrickRow)
            ctx.fillStyle = (count) % 2 == 0 ? '#000000' : '#CFB53B';
          else
            ctx.fillStyle = (((c + 1 * r)) % 2 == 0) ? '#ABA5A4' : '#662112';
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (c = 0; c < brickColumnCount; ++c) {
      for (r = 0; r < brickRowCount; ++r) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            if (r == magicBrickRow && c == magicBrickCol) {
              explode.play();
              if (((r - 1) >= 0) && bricks[c][r - 1].status == 1 && typeof bricks[c][r - 1] != typeof undefined) //1
              {
                bricks[c][r - 1].status = 0;
                score=score+5;
                count--;
                document.getElementById('plusfive').style.display='block';
                setTimeout(function(){ document.getElementById('plusfive').style.display='none';},900);
              }
              if (((r + 1) < brickRowCount) && bricks[c][r + 1].status == 1 && typeof bricks[c][r + 1] != typeof undefined) { //2
                bricks[c][r + 1].status = 0;
                score=score+5;
                count--;
			    document.getElementById('plusfive').style.display='block';
                setTimeout(function(){ document.getElementById('plusfive').style.display='none';},900);
              }
              if (((c + 1) < brickColumnCount) && bricks[c + 1][r].status == 1 && typeof bricks[c + 1][r] != typeof undefined) { //3
                bricks[c + 1][r].status = 0;
                score=score+5;
                count--;
				document.getElementById('plusfive').style.display='block';
                setTimeout(function(){ document.getElementById('plusfive').style.display='none';},900);
              }
              if (((c - 1) >= 0) && bricks[c - 1][r].status == 1 && typeof bricks[c - 1][r] != typeof undefined) { //4
                bricks[c - 1][r].status = 0;
                score=score+5;
                count--;
				document.getElementById('plusfive').style.display='block';
                setTimeout(function(){ document.getElementById('plusfive').style.display='none';},900);
              }
              bricks[c][r].status = 0;
              score++;
              count--;
              dy = -dy;
            } else {
              hit.play();
              dy = -dy;
              b.status = 0;
              score++;
              count--;
            }
            if (count <= 0) {
              won.play();
              ctx.font = '50px Berlin Sans FB';
              ctx.fillStyle = "#000000";
              ctx.fillText("You Won!", 400, 400);
              paused = true;
              localstorage(score);
              document.querySelector('.speech').style.display = "none";
              document.querySelector('.nextLevel').style.display = "block";
              flag = 1;
                document.querySelector('.nextLevel').onclick = function () {
                document.querySelector('.speech').style.display = "block";
                document.querySelector('.nextLevel').style.display = "none";
                paused = false;
                flag = 0;
                gamenextLevel(gamelevel + 1, score);
              };

            }
          }
        }
      }
    }
  }

  function drawScore() {
    ctx.font = "20px Berlin Sans FB";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: " + score, 100, 20);
  }

  function drawLives() {
    ctx.font = "20px Berlin Sans FB";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Lives: " + lives, canvas.width - 750, 20);
  }

  function drawLevel() {
    ctx.font = "20px Berlin Sans FB";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Level: " + gamelevel, canvas.width - 600, 20);
  }

  function HighScore() {
    ctx.font = "20px Berlin Sans FB";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Player: " + (localStorage.getItem("username") == null ? ' ' : localStorage.getItem("username")) + "\t \t \t \t \t \t \t" + "High Score: " + (localStorage.getItem("highScore") == null ? 0 : localStorage.getItem("highScore")), canvas.width - 450, 20);
  }

  function draw() {
    if (gamelevel > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "	#808080";
      ctx.fillRect(30, 0, 940, 25);
      //ctx.shadowOffsetX = 3;
      //ctx.shadowOffsetY = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      drawLevel()
      HighScore();
      collisionDetection();
      if (y + dy < ballRadius)
        dy = -dy;
      else if (y + dy > canvas.height - ballRadius) {
        if (x >= paddleX - 5 && x <= paddleX + paddleWidth + 5) {
          hit.play();   
        if(gamelevel==2 && (dy>-3.5 && dy<3.5))
          dy = -dy-1;
      else if (gamelevel==3 && (dy>-4.5 && dy<4.5))
        dy = -dy-1;
      else if (gamelevel==4 && (dy>-5.5 && dy<5.5))
        dy = -dy-1;
      else if (gamelevel==5 && (dy>-6.5 && dy<6.5))
        dy = -dy-2;
      else dy=-dy ;   
          
        } else {
          lives--;
          if (lives <= 0) {
            gamelevel = 0;
            console.log("In lives !");
            ctx.font = '50px Berlin Sans FB';
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Game Over!!!", 400, 400);
            localstorage(score);
            paused = true;
            document.querySelector('.speech').innerText = "Click on Retry to Start the Game!!";
          } else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            //paddleWidth = 135;
            rem = count;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      } else
        y += dy;
      if (x + dx < ballRadius || x + dx > canvas.width - ballRadius)
        dx = -dx;
      else
        x += dx;
      if (rightPressed && paddleX < canvas.width - paddleWidth)
        paddleX += 7;
      else if (leftPressed && paddleX > 0)
        paddleX -= 7;
    }
  }

  function keyDownHandler(e) {
    if (e.keyCode == 39)
      rightPressed = true;
    else if (e.keyCode == 37)
      leftPressed = true;
  }

  function keyUpHandler(e) {
    if (e.keyCode == 39)
      rightPressed = false;
    if (e.keyCode == 37)
      leftPressed = false;
  }

  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      if ((relativeX - paddleWidth / 2 >= 0) && (relativeX - paddleWidth / 2 <= (canvas.width - paddleWidth)))
        paddleX = relativeX - paddleWidth / 2;
    }
  }
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("keypress", keyPress, false);

  function keyPress(e) {
    if (e.keyCode == 32 || e.keyCode == 0 && (flag == 0)) {
      if (!paused) {
        paused = true;

      } else if (paused) {
        paused = false;
      }
    }
  }

  setInterval(function () {
    paused ? 1 : draw();
  }, 20);

  document.getElementById('imgBtn').onclick = function () {
    if (gamelevel > 0 &&  flag == 0) {
      console.log("in pause");
      if (!paused) {
        paused = true;

      } else if (paused) {
        paused = false;
      }
    }
  };
}