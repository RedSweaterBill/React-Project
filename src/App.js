import { useEffect, useState } from 'react';

let play = false;
let movingBall = false;
let movingBall2 = false;
let id = 0;
let id2 = 0;
let score = 0;
let obstacle2InPlay = false;
const defaultXPos = 750;
const defaultYPos = 180;

window.addEventListener("click", (event) => 
{
  if (play && event.button === 0) 
  {
    if (movingBall === true && score >= 5 && movingBall2 === true) 
    {
      ReturnToSender(2);
    }
    else if (movingBall === true) 
    {
      if (score < 5) 
      {
        ReturnToSender();
      }
      else 
      {
        ShootBall(event.clientX, event.clientY, true, 7);
      }
    }
    else 
    {
      ShootBall(event.clientX, event.clientY);
    }
  }
});

function StopTimeouts(allTimeouts, idToUse = id) 
{
    if (allTimeouts) 
    {
        let _id = window.setTimeout(function() {}, 0);

        while (_id--) 
        {
            window.clearTimeout(_id);
        }
    }
    else 
    {
        window.clearTimeout(idToUse);
    }

}

function ShootBall(xPos, yPos, otherBall = false, styleId = 6) 
{
  if (otherBall) 
  {
    movingBall2 = true;
  }
  else 
  {
    movingBall = true;
  }
  let style = document.styleSheets[0].cssRules[styleId].style;
  let horizontalSpeed = parseInt((xPos - defaultXPos) / 4);
  let verticalSpeed = parseInt((yPos - defaultYPos) / 4);
  while (Math.abs(horizontalSpeed) > 4 || Math.abs(verticalSpeed) > 4) 
  {
    horizontalSpeed = Math.round(horizontalSpeed / 1.5);
    verticalSpeed = verticalSpeed / 1.5;
  }
  MoveBall(horizontalSpeed, verticalSpeed, style, otherBall);
}

function EndGame() 
{
  play = false;
  StopTimeouts(true);
  ReturnAllToSender(false);
  obstacle2InPlay = false;
  document.styleSheets[0].cssRules[2].style.left = "2000px";
  document.styleSheets[0].cssRules[2].style.top = "200px";
  document.styleSheets[0].cssRules[3].style.left = "2000px";
  document.styleSheets[0].cssRules[3].style.top = "200px";
}

function SendObstacle(className, ruleId) 
{
  let randomNumber = Math.random();
  let randomNumber2 = Math.random();
  if (randomNumber < 0.5) randomNumber = Math.min(0.3, randomNumber);
  if (randomNumber2 < 0.4) randomNumber2 = Math.min(0.1, randomNumber2);

  document.styleSheets[0].cssRules[ruleId].style.left = Math.round(randomNumber * 2000).toString() + "px";
  document.styleSheets[0].cssRules[ruleId].style.top = Math.round(randomNumber2 * 1000).toString() + "px";
  setTimeout(function() 
  {
    MoveObstacle(className, ruleId);
  }, 1000);
  if (obstacle2InPlay === false && score >= 5) 
  {
    obstacle2InPlay = true;

    randomNumber = Math.random();
    randomNumber2 = Math.random();
    if (randomNumber < 0.5) randomNumber = Math.min(0.3, randomNumber);
    if (randomNumber2 < 0.4) randomNumber2 = Math.min(0.1, randomNumber2);

    document.styleSheets[0].cssRules[3].style.left = Math.round(randomNumber * 2000).toString() + "px";
    document.styleSheets[0].cssRules[3].style.top = Math.round(randomNumber2 * 1000).toString() + "px";
    setTimeout(function() 
    {
      MoveObstacle("obstacles obstacle2", 3);
    }, 2000);
  }
}

function ReturnAllToSender(stopTimeout = true) 
{
  setTimeout(function() 
  {
    if (stopTimeout) 
    {
      StopTimeouts(false, id);
      StopTimeouts(false, id2);
    }
    movingBall2 = false;
    movingBall = false;
    document.styleSheets[0].cssRules[7].style.left = defaultXPos.toString() + "px";
    document.styleSheets[0].cssRules[7].style.top = defaultYPos.toString() + "px";
    document.styleSheets[0].cssRules[6].style.left = defaultXPos.toString() + "px";
    document.styleSheets[0].cssRules[6].style.top = defaultYPos.toString() + "px";
  }, 50);
}

function ReturnToSender(ballToReturn = 1, stopTimeout = true) 
{
  setTimeout(function() 
  {
    if (movingBall2 === true && ballToReturn === 2) 
    {
      if (stopTimeout) 
      {
        StopTimeouts(false, id2);
      }
      movingBall2 = false;
      document.styleSheets[0].cssRules[7].style.left = defaultXPos.toString() + "px";
      document.styleSheets[0].cssRules[7].style.top = defaultYPos.toString() + "px";
    }
    else if (movingBall === true) 
    {
      if (stopTimeout) 
      {
        StopTimeouts(false, id);
      }
      movingBall = false;
      document.styleSheets[0].cssRules[6].style.left = defaultXPos.toString() + "px";
      document.styleSheets[0].cssRules[6].style.top = defaultYPos.toString() + "px";
    }
  }, 50);
}

function StartGame() 
{
  score = 0;
  document.getElementsByClassName("elementScore")[0].innerHTML = "Score: " + score;
  setTimeout(function () 
  {
    play = true;
    MoveObstacle("obstacles obstacle1", 2);
  }, 3000);
}

function MoveBall(horizontalSpeed, verticalSpeed, style, otherBall = false) 
{
  let tempId = setTimeout(function() 
  {
    style.left = (parseInt(style.left.substring(0, style.left.length - 2)) + horizontalSpeed) + "px";
    style.top = (parseInt(style.top.substring(0, style.top.length - 2)) + verticalSpeed) + "px";
    MoveBall(horizontalSpeed, verticalSpeed, style, otherBall);
  }, 15);
  
  if (otherBall) 
  {
    id2 = tempId;
  }
  else 
  {
    id = tempId;
  }
}

function MoveObstacle(className, ruleId) 
{
    let elementStyle = document.styleSheets[0].cssRules[ruleId].style;
      setTimeout(function () 
      {
          console.log(className);
          const rect1 = document.getElementsByClassName(className)[0].getBoundingClientRect();
          const rect2 = document.getElementsByClassName("dot")[0].getBoundingClientRect();
          
          if (Math.round(rect1.left / 10) > Math.round((rect2.left / 10))) 
          {
            elementStyle.left = (parseInt(elementStyle.left.substring(0, elementStyle.left.length - 2)) - 6) + "px";
          }
          else if (Math.round(rect1.left / 10) < Math.round((rect2.left / 10)))
          {
            elementStyle.left = (parseInt(elementStyle.left.substring(0, elementStyle.left.length - 2)) + 6) + "px";
          }
          if (Math.round(rect1.bottom / 10) < Math.round((rect2.bottom / 10))) 
          {
            elementStyle.top = (parseInt(elementStyle.top.substring(0, elementStyle.top.length - 2)) + 6) + "px";
          }
          else if (Math.round(rect1.bottom / 10) > Math.round((rect2.bottom / 10)))
          {
            elementStyle.top = (parseInt(elementStyle.top.substring(0, elementStyle.top.length - 2)) - 6) + "px";
          }

          for(let i = 0; i < 2; i++) 
          {
            const rect3 = document.getElementsByClassName("balls ball" + (i + 1))[0].getBoundingClientRect();

            if ((rect1.left < rect3.right && rect1.right > rect3.left) && ((rect1.top <= rect3.top && (rect1.bottom > rect3.top + 10)) || (rect1.top >= rect3.top && rect1.top < (rect3.bottom - 10)))) 
            { 
              score++;
              document.getElementsByClassName("elementScore")[0].innerHTML = "Score: " + score;
              ReturnToSender(i + 1);
              SendObstacle(className, ruleId);
              return;
            }
          } 

          if ((rect1.left < rect2.right && rect1.right > rect2.left) && ((rect1.top <= rect2.top && (rect1.bottom > rect2.top + 10)) || (rect1.top >= rect2.top && rect1.top < (rect2.bottom - 10)))) 
          { 
            EndGame();
          }
          else 
          {
            MoveObstacle(className, ruleId);
          }
      }, 15);
}

function changeHighScore(highScore, setHighScore) 
{
  if (score > highScore) 
  {
    setHighScore(score);
  }
}

function App() 
{
  let number = parseInt(localStorage.getItem('savedHighScore'));
  if (isNaN(number)) 
  {
    number = 0;
  }

  const [highScore, setHighScore] = useState(number);

  useEffect(() => 
  {
    localStorage.setItem('savedHighScore', highScore);
  }, [highScore])

return (
    <div>
      <h1 className = 'elementHighScore'> High Score: {highScore}</h1>
      <button className = 'buttonItems' onClick = {() => StartGame()}>Play</button>
      <h1 className = 'elementScore'>Score: 0</h1>
      <button className = 'buttonItems' onClick = {() => changeHighScore(highScore, setHighScore)}>Keep Score</button>
      <h3 className = 'devScore'>Dev's High Score: 11</h3>
      <div className = 'dot'></div>
      <div className = 'obstacles'>
        <div className = 'obstacles obstacle1'></div>
        <div className = 'obstacles obstacle2'></div>
      </div>
      <div className = 'balls'>
        <div className = 'balls ball1'></div>
        <div className = 'balls ball2'></div>
      </div>
    </div>
  );
}

export default App;