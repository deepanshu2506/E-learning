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
	const learnerId = localStorage.learnerId;
	if(learnerId != undefined){

		$.post(httpdomain + 'login/getUser' , {learnerId} , function(res){
			console.log(res)
			if(res.code == 1){
				$('.login-content').hide(function(){
					$('.code-content').fadeIn(200);
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
})