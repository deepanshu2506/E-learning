const inputs = document.querySelectorAll(".input");
const domain = 'http://localhost:3000/'

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

$(window).load(function(){
	console.log('sff');
	alert('adfd')
	console.log(localStorage.learnerId)
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
		$.post(domain + 'login/authenticateLearner' , {username , password} , function(res){
			if(res.code == 1){
				localStorage.learnerId = req.user.learnerId;
				$('.login-content').fadeOut(200,function(){
					$('.code-content').fadeIn(200);
					
				});
				
			}
			else{
				$('span').text("*" + res.message).show();
			}
		})
	}

	
	
});
$('form').submit(function(){
	e.preventDefault()
})