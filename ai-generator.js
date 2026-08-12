async function sendAIMessage(){

let input =
document.getElementById("ai-message");


let chat =
document.getElementById("ai-chat");


let message =
input.value;


if(!message){
return;
}


chat.innerHTML +=
`
<div class="user-message">
${message}
</div>
`;


input.value="";


let loading =
document.createElement("div");

loading.className="ai-message";

loading.innerHTML="⚡ Создаю уникальные ники...";

chat.appendChild(loading);



try{


let response =
await fetch(
"https://ТВОЙ-WORKER.workers.dev",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify({

message:message

})

});


let data =
await response.json();



loading.innerHTML =
data.answer;



}

catch(e){


loading.innerHTML =
"❌ Ошибка подключения AI";


}


}
