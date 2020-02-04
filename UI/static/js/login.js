
const inputs = document.querySelectorAll(".input");
const httpdomain = 'http://localhost:3000/'

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}

$(document).ready(function(){
	localStorage.setItem('userScore',0);
	const learnerId = localStorage.learnerId;
	if(learnerId != undefined){

		$.post(httpdomain + 'login/getUser' , {learnerId} , function(res){
			console.log(res)
			if(res.code == 1){
				$('.login-content').hide(function(){
					$('.code-content').fadeIn(200);
					$('.intermediate-screen').hide();
					$('.logout').fadeIn(200);
				});
			}
		});
	}
});


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

$('#loginbtn').click(function(){
	let username = $('.username').val();
	let password = $(".password").val();
	if(username == "" || password == ''){
		$('span').css({display:'block'})
	}
	else{
		$('span').css({display:'none'});
		$.post(httpdomain + 'login/authenticateLearner' , {username , password} , function(res){
			console.log(res)
			if(res.code == 1){
				localStorage.learnerId = res.user.learnerId;
				$('.login-content').fadeOut(200,function(){
					$('.code-content').fadeIn(200);
					$('.intermediate-screen').hide();
					$('.logout').fadeIn(200);
					
				});
				
			}
			else{
				$('span').text("*" + res.message).show();
			}
		})
	}

	
	
	
});

$('.logout').click(function(){
	localStorage.removeItem('learnerId');
	$('.code-content').fadeOut(200,function(){
		$('.login-content').fadeIn(200);
		$('.logout').fadeOut(200);
		
	});
});

$('#regbtn').click(function(){
	// console.log('sdf')
	$('.login-content').fadeOut(200,function(){
		$('.register-content').fadeIn(200);
		// $('.logout').fadeOut(200);
		
	});
});

$('.registerbtn').click(function(){
	const username = $('#newUsername').val();
	const password = $('#newPassword').val();
	const name = $('#name').val();
	const designation = $('#qualification').val();
	const field = $('#domain').val();
	$.post(httpdomain + 'login/register' , {name,username,password,designation,field , type:1} , function(res){
		if(res.code == 0){
			alert('Username is already taken');
		}
		else{
			$('.register-content').fadeOut(200,function(){
				$('.login-content').fadeIn(200);
				// $('.logout').fadeOut(200);
				
			});
		}
	});
})
$('form').submit(function(){
	e.preventDefault()
});

let timeRemaining = 0;
let numberOfUsers = 0;
let x = null;
$('.start-quiz-btn').click(function(){
	const quizCode = $('.quiz-code').val();
	const userId = localStorage.learnerId;
	console.log('df');
	
	$.post(httpdomain + 'quiz/joinSession' , {quizCode,userId},function(res){
		if(res.code == 1){
			sessionStorage.sessionId = res.sessionId;
			// console.log(res);
			localStorage.quizId = res.quizId
			timeRemaining = Math.floor(res.timeRemaining);
			numberOfUsers = res.numberOfUsers;
			$('.code-content').fadeOut(200,function(){
				$('.intermediate-screen').fadeIn(200);
				
			});

			x = setInterval(function() {
				// Display the result in the element with id="demo"
				$('.clock em').html(timeRemaining + "s") ;
				$.post(httpdomain + 'quiz/getActiveUsers' ,{sessionId: sessionStorage.sessionId},function(response){
					console.log(response)
					$('.activeCount em').html(response.users)
				});
				timeRemaining = timeRemaining -1;
			  
				// If the count down is finished, write some text
				if (timeRemaining <= 0) {
				  clearInterval(x);
				  //executing the call back fun. (next question) 
				  startQuiz();
				  
				}
			  }, 1000);
		}else{
			alert("invalid code");
		}
		
	})
});
let questionCount = 0;
let quizData = null;
chartData = null;
let firstQuestion = false;
function startQuiz(){
	questionCount = 0;
	firstQuestion  = false;
	$('.logout').prop('disabled',true);
	

	$.post(httpdomain + 'quiz/getQuiz' , {quizId:localStorage.quizId} , function(res){
		console.log(res)
		quizData = res;
		// console.log(quizData)
		// console.log(quizData[questionCount]);
		displayQuestion();
		firstQuestion = true;
	});
}

function displayQuestion(){
	currQuestion = quizData.quiz[questionCount];
		$('#question').html("<p>"+ currQuestion.question +"</p>");
		$('#A').html(currQuestion.option1);
		$('#B').html(currQuestion.option2);
		$('#C').html(currQuestion.option3);
		$('#D').html(currQuestion.option4);

		$('.intermediate-screen').fadeOut(200,function(){
			$('#quiz').fadeIn(200);
			$('.chart-container').fadeOut(200);
	
		// quiz.style.display = "block";
			// renderProgress();
			// renderCounter();
			TIMER = setInterval(renderCounter,1000);
		});
}

function displayAnalysis(){
	$('#quiz').fadeOut(200,function(){
		chartData = [0,0,0,0]
		$.post(httpdomain + 'quiz/getAnalysis' , {questionId: currQuestion.questionId, sessionId : sessionStorage.sessionId},function(res){
			for(answer of res.data){
				chartData[answer.answerOption-1] += 1;
				myChart.data.datasets[0].data = chartData;
			}
			myChart.update();
			$('.chart-container h3 em').text(currQuestion.question);
			// count = 0;
			var seconds = 0
			var x = setInterval(function(){
				document.getElementById("clock").innerHTML = (questionTime - seconds) + "s ";
      			seconds = seconds + 1;
    
      // If the count down is finished, write some text
     			 if (seconds >= questionTime) {
					clearInterval(x);
					questionCount ++;
					if(questionCount == quizData.quiz.length){
						$('#score-popup').fadeIn(200);
						$('#score-popup p').text("your score is: " + localStorage.userScore)
						localStorage.userScore
					}
					else{
						displayQuestion();
					}
        			
      			}
			},1000)
		})
		console.log(myChart);

		$('.chart-container').fadeIn(200);
	}); 
}

$('#score-popup img').click(function(){
	$(this).parent().fadeOut(200);
})