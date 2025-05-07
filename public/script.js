//{"name":"Pinkie",
// "rank":"REGULAR",
// "experience":2,
// "level":1,
// "room":
//      {
//      "name":"Street",
//      "description":"You are in a small street. Litter is strewn about, and you see rats crawling in and out of the sewer grating.",
//      "items":[],
//      "money":0,
//      "enemies":[],
//      "exits":["n","e","s","w"],
//      "players":["Pinkie"]
//       },    
//"money":1,
//"inventory":[],
// "quests":["novice reader"],
// "weapon":"NONE!",
// "armor":"NONE!",
// "statPoints":0,
// "hitPoints":12}
const socket = io();
socket.emit("mud_input", "api"); // Envoie une commande initiale au serveur MUD
const log = document.getElementById("log");
const input = document.getElementById("cmd");
//profile information
let profile = document.createElement("header");
profile.id = "profile";
log.appendChild(profile);
let nickname = document.createElement("p");
nickname.id = "name";
profile.appendChild(nickname);
let rank = document.createElement("p");
rank.id = "rank";
profile.appendChild(rank);
let experience = document.createElement("p");
experience.id = "experience";
profile.appendChild(experience);
let level = document.createElement("p");
level.id = "level";
profile.appendChild(level);
let money = document.createElement("p");
money.id = "money";
profile.appendChild(money);
//map information

//inventory information
//chat information
let chat = document.createElement("div");
log.appendChild(chat);

socket.on("mud_output", (text) => {
    if (text["api"]) {
        let json = JSON.parse(text["content"]);
        nickname.textContent = json.name;
        rank.textContent = `Rank : ${json.rank}`;
        experience.textContent = `Experience : ${json.experience}`;
        level.textContent = `Level : ${json.level}`;
        money.textContent = `Money : ${json.money}`;
    }
    else {
        let message = document.createElement("p");
        message.textContent = text["content"];
        chat.appendChild(message);
    }


});


input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        socket.emit("mud_input", input.value);
        input.value = "";
    }
});