import Bot from "meowerbot";
import * as dotenv from "dotenv";
import JSONdb from "simple-json-db";
import { exec } from "child_process";
import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


dotenv.config();

const pswd = process.env["PSWD"];
const username = "gcbridge";//use whatever username lol
//const password = process.env["PS"];
const db = new JSONdb("gcb.json");

const bot = new Bot(username, pswd);


if (!(db.has("gcs"))) {
    db.set("gcs", [{chatid: null,posthome: false}]);
}
if (!(db.has("gcarray"))) {
    db.set("gcarray", [null]);
}
if (!(db.has("hosting"))) {
    rl.question("Hosting: ",function(usr) {
      db.set("hosting", usr);
      console.log(usr);
      rl.close();
    });
} else if (db.get("hosting")==null|db.get("hosting")==undefined) {
  rl.question("Hosting: ",function(usr) {
    db.set("hosting", usr);
    console.log(usr);
    rl.close();
  });
}


var gclist = db.get("gcs");
var gcarr = db.get("gcarray");
var host = db.get("hosting");
console.log(host);



bot.onPost(async (user, content, origin) => {
    if (user == "Revower") {
      a = content.split(':');
      if (content.length>1) {
        content = a[1];
        list.content.splice(0);
      }
    }
    var args = content.split(' ');
    console.log(`ORG: ${origin}`);
    var a = true; //boolean if using prefix
  
    if (args[0] != '@gcbridge') {
      a = false;
      console.log('Incoming chat message!!!');
      //console.log(gcarr.indexOf(origin))
      var x = (origin==undefined|origin==null) ? [] : gclist[gcarr.indexOf(origin)].auth;
      var mutd = (x==undefined|x==null) ? [] : x;if (!gcarr.includes(origin)) {
        gclist.push({"chatid":origin,"auth":[],"posthome":true});gcarr.push(origin);db.set()
      }
      if (origin!=null&gclist[gcarr.indexOf(origin)].posthome==true) {
        bot.post(`${user}: ${content}`);
      } else if (origin==null){
        for (let i in gclist) {
          //console.log(`i: ${i}`);
          if (gclist[i].posthome==true) {
            bot.post(`${user}: ${content}`,gclist[i].chatid);
          }
        }
      }
      var mtd = [];
      for (let i in gclist) {
        //console.log(gclist[i]);
        mtd = (gclist[i].auth==undefined|gclist[i].auth==null) ? [origin] : gclist[i].auth;
        //console.log(`auth: ${mtd} x: ${mutd}`)
        if (origin!=gclist[i].chatid) {
          //console.log(mutd.includes(gclist[i].chatid));
          if (mutd.includes(gclist[i].chatid)) {
            //console.log(mtd.includes(origin));
            if (mtd.includes(origin)) {
              bot.post(`${user}: ${content}`,gclist[i].chatid);
            }
          }
        }
      }
    } else if (args[1] == 'info') {
      console.log(`New info message from: ${user}`);
      bot.post(`GCBridge - Made by @AXEstudios, Hosted by @${db.get("hosting")}`,origin);
      
    }  else if (args[1] == 'help') {
      console.log(`New help message from: ${user}`);
      bot.post('Commands:\n\n addgc <chatid> - add a groupchat\n auth <chatid> - authorize a chat (requires that both chats auth each other)\n unauth <chatid> - unauthorize chat\n homeoff - unauthorize home\n homeon - allow people from home to interact\n\nNote: GCBridge requires that you invite it to your groupchat to work properly.',origin);
      

      
    } else if (args[1] == 'auth') { // authorise a chat to talk
      console.log(`New auth from: ${user}`);
      gclist[gcarr.indexOf(origin)].auth.push(args[2]);
      db.set("gcs",gclist);
      bot.post(`@${user} Chat is Added!`,origin);

      
    } else if (args[1] == 'unauth') { // unauthorise
      console.log(`New unauth from: ${user}`);
      if (gcarr.includes(origin)) {
        gclist[gcarr.indexOf(origin)].auth[gclist[gcarr.indexOf(origin)].auth.indexOf(args[2])] = "";
        db.set("gcs",gclist);
        bot.post(`@${user} Chat is no longer Added!`,origin);
      } else {
        bot.post(`@${user} That chat isnt in my DB...`,origin);
      }

    }  else if (args[1] == 'homeoff') {
       console.log(`Home turned off from: ${user}`);
       if (gcarr.includes(origin)) {
         gclist[gcarr.indexOf(origin)].posthome = false;
         bot.post(`@${user} post-home turned off!`, origin);
       } else {
        bot.post(`@${user} That chat isnt in my DB...`,origin);
       }

    }  else if (args[1] == 'homeon') {
      console.log(`Home turned off from: ${user}`);
      if (gcarr.includes(origin)) {
        gclist[gcarr.indexOf(origin)].posthome = true;
        bot.post(`@${user} post-home turned off!`, origin);
      } else {
       bot.post(`@${user} That chat isnt in my DB...`,origin);
      }
      
    }  else if (args[1] == 'addgc') {
      console.log(`New addgc request from: ${user}`);
      if (a==true) {
        var bb=args[2];
        if (args[1]!="livechat"|args[1]!=null) {
          gclist.push({"chatid":bb,"auth":[],"posthome":true});
          gcarr.push(bb);
          db.set("gcs", gclist);
          db.set("gcarray", gcarr);
          bot.post(`@${user} Added!`,origin);
        } else {
          bot.post(`@${user} Thats not a gc.`,origin)
        }
      }
    }  else {
      console.log('Bad command.');
      bot.post(`@${user} no such command!`,origin);
    }
});

bot.onMessage((data) => {
    //console.log(`New message: ${data}`);
});

bot.onClose(() => {
    console.error("Disconnected");
    let command = exec("npm run start");
    command.stdout.on("data", (output) => {
        console.log(output.toString());
    });
});

bot.onLogin(() => {
    bot.post(`GCBridge 0.5 online!\nDo "@gcbridge help" for help. For extra information, do "@gcbridge info"`);
});
