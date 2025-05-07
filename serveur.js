const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const net = require("net");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

function stripAnsi(text) {
    if (text[0] === "{") {
        return { content: text.replace(/\x1b\[[0-9;]*m/g, ""), api: true };
    }
    else {
        return { content: text.replace(/\x1b\[[0-9;]*m/g, ""), api: false };
    }
}

// 🔌 Connexion Telnet au MUD
const client = net.createConnection({ host: "windows93.net", port: 8082 }, () => {
    console.log("🟢 Connecté à 93REALMS");
    client.write("Pinkie\r\n"); 
    client.write("LesLicornesMagique33.\r\n");
});

// 🔁 Quand des données arrivent du MUD
client.on("data", (data) => {
    const raw = data.toString();
    const clean = stripAnsi(raw);
    console.log(clean); // log dans le terminal

    io.emit("mud_output", clean); // 👉 envoie à tous les navigateurs connectés
});

client.on("end", () => console.log("🔴 Déconnecté du MUD"));
client.on("error", (err) => console.error("❌ Erreur Telnet :", err.message));

// 🔁 Quand un client web se connecte
io.on("connection", (socket) => {
    console.log("🌐 UI connectée");

    socket.on("mud_input", (cmd) => {
        client.write(cmd + "\r\n");
    });
});

server.listen(3000, () => {
    console.log("🌍 Web UI sur http://localhost:3000");
});