import Bot from "meowerbot";
import * as dotenv from "dotenv";
import JSONdb from "simple-json-db";
import { exec } from "child_process";


dotenv.config();

const pswd = process.env["PSWD"];
const username = "gcbridge";
const db = new JSONdb("db.json");

const bot = new Bot(username, pswd);

if (!(db.has("gcs"))) {
    db.set("gcs", []);
}


const gclist = db.get("gcs");


bot.onPost(async (user, content, origin) => {
    var args = content.split(' ');
    console.log(origin);
    var a = true;
    if (args[0] != 'gcb!') {
      a = false;
    }
    
    
    if (args[1] == 'help') {
      if (a==true) {
        bot.post('Commands:\n\ngcb! addgc <chatid> - add a groupchat\nNote: gcbridge will listen to any posts you make and send it to all of the added groupchats\n\nIf you don\'t want other users posting in your chat you can uninvite the bot.\n\nHosted by @AXEstudios at https://replit.com/@AXEstudios/gcbridge');
      }
    }  else if (args[1] == 'addgc') {
      if (a==true) {
        if (args[1]!="livechat") {
          gclist.push(args[2]);
          db.set("gcs", gclist);
          bot.post('Added!',origin);
        } else {
          bot.post(`@${user} L can't add livechat`)
        }
      }
    }  else if (origin!="livechat") {
      if (origin!=null) {
        bot.post(`${user}: ${content}`);
      }
      for (var i = 0;i < gclist.length;i++) {
        if (origin!=gclist[i]) {
          bot.post(`${user}: ${content}`,gclist[i]);
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
    bot.post(`${username} online!\nDo "gcb! help" for help.`);
});
