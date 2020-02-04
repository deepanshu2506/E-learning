// select all elements
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const qImg = document.getElementById("qImg");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");
userScore = 0;


// create some variables

let runningQuestion = 0;
let count = 0;
const questionTime =15; // 10s
const gaugeWidth = 150; // 150px
const gaugeUnit = gaugeWidth / questionTime;
let TIMER;
let score = 0;

// render a question



// start quiz

    // renderQuestion();
    // // quiz.style.display = "block";
    // renderProgress();
    // renderCounter();
    // TIMER = setInterval(renderCounter,1000); // 1000ms = 1s


// render progress
function renderProgress(){
    // for(let qIndex = 0; qIndex <= lastQuestion; qIndex++){
    //     progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    // }
}

// counter render

function renderCounter(){
    if(count <= questionTime){
        counter.innerHTML = questionTime-count;
        timeGauge.style.width = count * gaugeUnit + "px";
        count++
    }else{
        //our callback
        clearInterval(TIMER);
        count = 0;
        displayAnalysis();
    }
}

// checkAnwer

function checkAnswer(answer){

        if(answer == currQuestion.answers){
            userScore += 1;
            localStorage.userScore = parseInt(localStorage.userScore) + 1;
        }

       $.post(httpdomain + 'quiz/setAnswer' , {userId: localStorage.learnerId , sessionId:sessionStorage.sessionId , answer ,questionId: currQuestion.questionId})
        alert('answer submitted');
        // scoreRender();
}

// score render
// function scoreRender(){
//     scoreDiv.style.display = "block";
    
//     // calculate the amount of question percent answered by the user
//     const scorePerCent = Math.round(100 * score/questions.length);
    
//     // choose the image based on the scorePerCent
//     let img = (scorePerCent >= 80) ? "img/5.png" :
//               (scorePerCent >= 60) ? "img/4.png" :
//               (scorePerCent >= 40) ? "img/3.png" :
//               (scorePerCent >= 20) ? "img/2.png" :
//               "img/1.png";
    
//     scoreDiv.innerHTML = "<img src="+ img +">";
//     scoreDiv.innerHTML += "<p>"+ scorePerCent +"%</p>";
// }





















