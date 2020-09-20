var user_name='';
var user_email='';
var merged='';
var checking_existance='';
var provider_fb = new firebase.auth.FacebookAuthProvider();
var provider_gg = new firebase.auth.GoogleAuthProvider();

function face_logout(){
firebase.auth().signOut().then(function()
{
	document.getElementById("fb_login_btn").style.display="inline";
  	document.getElementById("fb_logout_btn").style.display="none";
  	document.getElementById("private").disabled=true;	
	document.getElementById("public").disabled=true;
}).catch(function(error) {
 console.log(error.message	)
});
}

function google_logout(){
firebase.auth().signOut().then(function() {
	document.getElementById("google_login_btn").style.display="inline";
  	document.getElementById("google_logout_btn").style.display="none";
  	 document.getElementById("private").disabled=true;	
	document.getElementById("public").disabled=true;
}).catch(function(error) {
	console.log(error.message)});
	}


function face_login()
	{
firebase.auth().signInWithPopup(provider_fb).then(function(result) {
  	user_name = result.user.displayName;
  	user_email= result.user.email;
  	email_name();
  	li_creator();
  	document.getElementById("fb_logout_btn").style.display="inline";
  	document.getElementById("fb_login_btn").style.display="none";
  	document.getElementById("private").disabled=false;
  	document.getElementById("private").disabled=false;	
	document.getElementById("public").disabled=false;
  	
	console.log(error.message)	});
// fb_login ended
	}

function google_login()
	{
firebase.auth().signInWithPopup(provider_gg).then(function(result) {
  	user_name = result.user.displayName;
  	user_email= result.user.email;
  	email_name();
  	li_creator();
  	 document.getElementById("google_logout_btn").style.display="inline";
  	document.getElementById("google_login_btn").style.display="none";
  	document.getElementById("private").disabled=false;
  	document.getElementById("private").disabled=false;	
	document.getElementById("public").disabled=false;
  	
}).catch(function(error) {
console.log(error.message)		});
// google_login ended
	}


function send()
	{
	var get=document.getElementById('input').value;
	document.getElementById('input').value="";

firebase.database().ref('/public').push({
	"email":user_email,
	"sender":user_name,
	"msg":get 	});
	}


function deletethis(get)
	{
	var get_attr=get.getAttribute('data-id');
firebase.database().ref('public').child(get_attr).remove();
	}
	firebase.database().ref('public').on('child_removed',function(data){
	document.getElementById("msg-"+data.key).innerHTML="This message is removed"	})



function delete_private(get)
	{
	var get_attr=get.getAttribute('data-id');
firebase.database().ref(merged).child(get_attr).remove();

firebase.database().ref(merged).on('child_removed',function(data){

	document.getElementById(`m-${data.key}`).innerHTML="this message is removed";
})

	}



// li creator function
function li_creator()
	{
	document.getElementById('public').disabled=false;
	document.getElementById('private').disabled=false;	
	document.getElementById('submit').disabled=false;	
	} 


function show_public(){
	document.getElementById("display_div").style.display="block";
	document.getElementById("private_div").style.display="none";
	document.getElementById('pri_list').style.display="none";

firebase.database().ref('public').on('child_added',function(data){
	var button="";
	if(data.val().email==user_email){
	button=`<button class="del"	data-id=${data.key} onclick="deletethis(this)">x</button>`	}
	var already=document.getElementById('list').innerHTML;
	var html=`<li id="msg-${data.key}"> ${button} <u>${data.val().sender}</u> : ${data.val().msg}</li>`;
	document.getElementById('list').innerHTML=`${already} ${html}`;})
}

function show_private(){
	document.getElementById("display_div").style.display="none";
	document.getElementById("private_div").style.display="block";
	document.getElementById("list").innerHTML="";

}


function email_name(){
firebase.database().ref('email&name').once('child_added',function(data){
	if(data.val().email==user_email){}
	else{
		firebase.database().ref('/email&name').push({
		"email":user_email,
		"name":user_name	})		
		}		
	})
		}

function email_checker(){

	firebase.database().ref('email&name').once('child_added',function(data){
	var email_check=document.getElementById("private_input").value;
		if(email_check==data.val().email){
			var li=`<li onclick="private_database(this)">${data.val().email}</li>`;
			document.getElementById("list_search").innerHTML=li;
		}
	})
}

function private_database(get){
	document.getElementById("private_list").innerHTML="";
	var searched_one=get.innerHTML;
	var login_one=user_email;
	var first='';
	var second='';
	for(let i=0;i<searched_one.length;i++)
	{
	if(searched_one.substr(i,1)>login_one.substr(i,1))
		{
		first=searched_one.substr(0,9);
		second=login_one.substr(0,9);
		break;
		}
	else if(searched_one.substr(i,1)<=login_one.substr(i,1))
		{
		first=login_one.substr(0,9);
		second=searched_one.substr(0,9);
		break;
		}
	}
merged=`${first}${second}`;
document.getElementById("private_msg").style.display='inline';
document.getElementById("private_submit").style.display='inline';
firebase.database().ref(merged).on('child_added',function(data){
	var button="";
	if(data.val().email==user_email){
	button=`<button class="del" data-id=${data.key} onclick="delete_private(this)">x</button>`	}
	var already=document.getElementById('private_list').innerHTML;
	var html=`<li id="m-${data.key}"> ${button} <u>${data.val().sender}</u> : ${data.val().msg}</li>`;
	document.getElementById('private_list').innerHTML=`${already} ${html}`;})
}


function private_send(){
var get=document.getElementById('private_msg').value;
document.getElementById('private_msg').value="";
firebase.database().ref(merged).push({
	"email":user_email,
	"sender":user_name,
	"msg":get 	});
	}

function msg_display(){
	document.getElementById('pri_list').style.display="block";
}






