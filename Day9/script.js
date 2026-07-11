alert("JavaScript Loaded");
let password=document.getElementById("password");
let confirm=document.getElementById("confirmPassword");

password.addEventListener("keyup",function(){

let pass=password.value;

let strength=document.getElementById("strength");

if(pass.length<8){

strength.innerHTML="Weak Password";

strength.style.color="red";

}

else if(pass.match(/[A-Z]/)&&pass.match(/[0-9]/)&&pass.match(/[!@#$%^&*]/)){

strength.innerHTML="Strong Password";

strength.style.color="green";

}

else{

strength.innerHTML="Medium Password";

strength.style.color="orange";

}

});

confirm.addEventListener("keyup",function(){

let match=document.getElementById("match");

if(password.value===confirm.value){

match.innerHTML="Passwords Match";

match.style.color="green";

}

else{

match.innerHTML="Passwords do not Match";

match.style.color="red";

}

});

function validateForm(){

let name=document.getElementById("name").value.trim();

let email=document.getElementById("email").value.trim();

let contact=document.getElementById("contact").value.trim();

let branch=document.getElementById("branch").value;

let cgpa=document.getElementById("cgpa").value;

let dob=document.getElementById("dob").value;

if(name==""){

alert("Please enter your name");

return false;

}

if(contact.length!=10){

alert("Contact number must be 10 digits");

return false;

}

if(branch==""){

alert("Please select branch");

return false;

}

if(cgpa<0 || cgpa>10){

alert("CGPA should be between 0 and 10");

return false;

}

if(password.value.length<8){

alert("Password must be at least 8 characters");

return false;

}

if(password.value!=confirm.value){

alert("Passwords do not match");

return false;

}

if(dob==""){

alert("Select your Date of Birth");

return false;

}

return true;

}