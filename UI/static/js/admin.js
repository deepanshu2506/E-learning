
const inputs = document.querySelectorAll(".input");
const httpdomain = 'http://192.168.43.111:3000/'

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

$('#adminloginbtn').click(function(){
	let username = $('.username').val();
	let password = $(".password").val();
	if(username == "" || password == ''){
		$('span').css({display:'block'})
	}
	else{
		$('span').css({display:'none'});
		$.post(httpdomain + 'login/authenticateAdmin' , {username , password} , function(res){
			console.log(res)
			if(res.code == 1){
				localStorage.adminId = res.user.adminId;
				$('.admin-login-content').fadeOut(200,function(){
					$('.adminButton-contianer').fadeIn(200);
					$('.adminlogout').fadeIn(200);
					
				});
				
			}
			else{
				$('span').text("*" + res.message).show();
			}
		})
	}

	
	
	
});



$(document).ready(function(){
    const adminId = localStorage.adminId;
	if(adminId != undefined){
        console.log(adminId)

		$.post(httpdomain + 'login/getAdmin' , {adminId} , function(res){
			console.log(res)
			if(res.code == 1){
				$('.admin-login-content').fadeOut(200,function(){
                    $('.adminButton-contianer').fadeIn(200);
                    $('.adminButton-contianer input').val("")
					$('.adminlogout').fadeIn(200);
					
				});
			}
		});
	}
});

$('.create-quiz').click(function(){
    $('.adminButton-contianer').fadeOut(200,function(){
        $('.quizinfo-content').fadeIn(200);

        
    });
});

$('.createbtn').click(function(){
    const quizName = $('.quizinfo-content .name').val();
    const field = $('.quizinfo-content .field').val();
    const adminId = localStorage.adminId
    $.post(httpdomain + 'admin/createQuiz' ,{quizName,field,adminId} ,function(res){
        localStorage.quizId = res.quizId;
        $('.quizinfo-content').fadeOut(200,function(){
            $('.question-content').fadeIn(200);
    
            
        });
    } );
});


$('.adminlogout').click(function(){
    localStorage.removeItem('adminId');
    console.log("sdf");
    
	$('.adminButton-contianer').fadeOut(200,function(){
		$('.admin-login-content').fadeIn(200);
		$('.adminlogout').fadeOut(200);
		
	});
});

let questionsArray = [];
let currIndex = 0;

$('.save-question-btn').click(function(){
    const answersarr = [];
    const question = $('.question').val();
    const option1 = $('.option1').val();
    const option2 = $('.option2').val();
    const option3 = $('.option3').val();
    const option4 = $('.option4').val();
    const answers = $('.answerbox');

    
    $.each(answers ,function(index,answer){
        console.log(answer)
        if($(answer).prop('checked') == true){
            answersarr.push(index+1);
            $(answer).prop('checked',false)
        }
    });
    const quizId = localStorage.quizId;
    const questionData = {question,option1,option2,option3,option4,answersarr,quizId}
    questionsArray.push(questionData);
    // console.log(answersarr);

    $.post(httpdomain +"admin/createQuestion" , questionData , function(res){
        console.log(res)
        if(res.code == 0){
            $('.errorspan').text(res.message).show();
        }
        else{
            $('.question').val("");
            $('.option1').val("");
            $('.option2').val("");
            $('.option3').val("");
            $('.option4').val("");
        }
    });

    
});

$('.popup img').click(function(){
    $(this).parent().fadeOut(200);
});

$('.submit-quiz-btn').click(function(){
    $.post(httpdomain + 'admin/validateQuiz' , {quizId: localStorage.quizId} ,function(res){
        console.log(res)
        $('#quizCode-popup p').text(res.quizCode);
        $('#quizCode-popup').fadeIn(200);
    });
});

$('.previous-quiz').click(function(){
    $('.adminButton-contianer').fadeOut(200,function(){
        $('.course-content').fadeIn(200);
        $.post(httpdomain + "admin/getQuizes",{adminId: localStorage.adminId},function(res){
            let count = 1;
            for(quiz of res.data){
            
                let date = new Date(quiz.time);
                let row = $('<tr></tr>')
                row.data("id",quiz.QuizId);
                row.append('<th scope="row">'+quiz.quizId+'</th><td>'+quiz.QuizName+'</td><td>'+date.getDate() + "/" + date.getMonth()+"/"+date.getFullYear() + '</td>')
                count++;
                $('.course-content table tbody').append(row);
            }
        });
	});
});

$('body').on('click',".course-content table tbody tr" , function(){
    var quizId = $(this).children("th").text();
    $.post(httpdomain+'admin/getQuizData',{quizId}, function(res){
        
    });
    $('#exampleModalCenter').modal();

})