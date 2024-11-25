//Requirements
require('dotenv');
const { Client, Events, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const fs = 'fs';


//Discord client intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
//Login Discord client
client.login(process.env.dctk);
//Login Message
client.once(Events.ClientReady, (c) => {
    console.log(`${c.user.tag} is online.`);
});


//The client will eventually reply the user with a message
client.on(Events.MessageCreate, (msg) => {
    //Analyse the command
    var commandList = analyseCommand(msg);
    //if the message is a command
    if (commandList != false) {
        executeCommand(commandList, msg.author)
            .then(result => {
            msg.reply(result);
            });
    } else {
        return;
    }
});

//prefix
const prefix = "p/";
//Analyse command and return a array
function analyseCommand(message) {
    var commandList = [];
    var msg = message.content;
    if (msg.startsWith(prefix)) {
        commandList.push(prefix);
        var msg = msg.substring(prefix.length, msg.length);
        var spaceIndex = msg.indexOf(" ");
        if (msg.length > 0) {
            while (spaceIndex != -1) {
                commandList.push(msg.substring(0, spaceIndex));
                var msg = msg.substring(spaceIndex, msg.length);
                while (msg.startsWith(" ")) {
                    var msg = msg.substring(1, msg.length);
                }
                var spaceIndex = msg.indexOf(" ");
            }
        }
        commandList.push(msg);
        return commandList;
    } else {
        return false;
    }
}

//This and all primary command function would eventually return an object
async function executeCommand(commandList, author) {
    switch (commandList[1]) {
        case "help":
            return await help(commandList);
        case "operator":
            return await operator(commandList);
        case "enemy":
            return await enemy(commandList);
        case "stage":
            return await stage(commandList);
        case "file":
            return await file(commandList);
        case "stat":
            return await stat(commandList);
        case "pull":
            return await pull(commandList, author);
        case "edit":
            return await edit(commandList, author);
        case "create":
            return await create(commandList, author);
        case "player":
            return await player(commandList, author);
        case "guess":
            return await guess(commandList, author);
        case "raw":
            return await raw(commandList);
        default:
            return `Unknown command "${commandList[1]}", type "${prefix}help" for help.`
    }
}
//primary command: raw
async function raw(commandList) {
    var textFile = await fetchMarkUp(commandList[2]);
    fs.writeFileSync('./text_files/raw.txt', textFile);
    const attachment = new AttachmentBuilder('./text_files/raw.txt');
    var result = { 
        content: `Target ${commandList[2]} has been fetched:`,
        files: [attachment]
    }
    return result;
}
//primary command: operator
async function operator(commandList) {
    var textFile = await fetchMarkUp(commandList[2]);
    return await fetchTemplate(textFile, "Operator info");
}
//primary command: enemy
async function enemy() {

}
//primary command: stage
async function stage() {
    
}
//primary command: file
async function file() {
    
}
//primary command: stat
async function stat() {
    
}
//primary command: pull
async function pull() {
    
}
//primary command: edit
async function edit() {
    
}
//primary command: create
async function create() {
    
}
//primary command: player
async function player() {
    
}
//primary command: guess
async function guess() {
    
}



//API URL
const apiUrl = "https://arknights.wiki.gg/api.php?";

//fetch() and return the response
//fetch method: GET
async function getWiki(params) {
    try {
        fetchLink = apiUrl + new URLSearchParams(params)
        var response = await fetch(fetchLink);
        var data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
//fetch method: POST
async function postWiki(params, target) {

}

//fetch markUp file (raw text) from a specific page
async function fetchMarkUp (pageTitle) {
    var params = {
        origin: "*",
        page: pageTitle,
        action: "parse",
        format: "json",
        prop: "wikitext"
    }
    try {
        var jsonFile = await getWiki(params);
        if (jsonFile.parse.wikitext) {
            var markupFile = jsonFile.parse.wikitext["*"];
            var string = JSON.stringify(markupFile);
            var string = string.slice(1, -1);
            var string = string.replace(/\\n/g, '\n');
            return string;
        }
    } catch (err) {
        var error = `${err}`;
        if (error === "TypeError: Cannot read properties of undefined (reading 'wikitext')") {
            return "Error: Page does not exist."
        }
    }
}
//analyse text and turn it into json
async function fetchTemplate(textFile, template) {
    var array = [];
    fs.writeFileSync('./text_files/raw.txt', textFile);
    fs.readFile('./text_files/raw.txt', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var line = data.split('\n');
            var lineCount = line.length;
            var firstLineContent = line[0];
            if (firstLineContent.startsWith("{{")) {
                var inTemplate = false;
                for (var i = 0; i < lineCount; i++) {
                    var lineContent = line[i];
                    if (lineContent.startsWith("{{")) {
                        if (!lineContent.startsWith(`{{${template}`)) {
                            inTemplate = false;
                        } else {
                            inTemplate = true;
                            var templateExist = true;
                        }
                    } else if (lineContent.startsWith("|") && lineContent.indexOf("=") != -1 && inTemplate) {
                        array.push(lineContent);
                    }
                }
                if (templateExist) {
                    console.log(array);
                } else {
                    return "Template does not exist or the page is falsely formatted."
                }
            } else {
                return "This page is not necessary to edit nor do further actions.";
            }
        }
    });
}