import Bot from "meowerbot";
import * as dotenv from "dotenv";
import JSONdb from "simple-json-db";
import { exec } from "child_process";


dotenv.config();

const pswd = process.env["PSWD"];
const username = "gcbridge";//use whatever username lol
//const password = process.env["PS"];
console.log(`Username: ${username}`);
console.log(`Password: ${pswd}`);
const help = [`@${username} help`, `@${username} subscribe`, `@${username} unsubscribe`, `@${username} feeds`, `@${username} read`];
const db = new JSONdb("db.json");

const bot = new Bot(username, pswd);

if (!(db.has("gcs"))) {
    db.set("gcs", []);
}


const gclist = db.get("gcs");


bot.onPost(async (user, content, origin) => {
    var args = content.split(' ');
    console.log(origin);
    
    if (args[0] == '!help') {
      bot.post('Commands:\n\naddgc! <chatid> - add a groupchat\nNote: gcbridge will listen to any posts you make and send it to all of the added groupchats\n\nIf you don\'t want other users posting in your chat you can uninvite the bot.\n\nHosted by @AXEstudios at https://replit.com/@AXEstudios/gcbridge');
    }  else if (args[0] == 'addgc!') {
      if (args[1]!="livechat") {
        gclist.push(args[1]);
        db.set("gcs", gclist);
        bot.post('Added!',origin);
      } else {
          bot.post(`@${user} L can't add livechat`)
      }
    }  else if (origin!="livechat") {
      if (origin!=null) {
        bot.post(`${user}: ${args.join(' ')}`);
      }
      for (var i = 0;i < gclist.length;i++) {
        if (origin!=gclist[i]) {
          bot.post(`${user}: ${args.join(' ')}`,gclist[i]);
        }
      }
    }
});

bot.onMessage((data) => {
    console.log(`New message: ${data}`);
});

bot.onClose(() => {
    console.error("Disconnected");
    let command = exec("npm run start");
    command.stdout.on("data", (output) => {
        console.log(output.toString());
    });
});

bot.onLogin(() => {
    bot.post(`${username} online!\nDo "!help" for help.`);
});
