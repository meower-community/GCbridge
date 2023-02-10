# MeowerBot.js
Port of MeowerBot.py to Node.js
## Installing
```bash
npm install meowerbot
```
## Example Bot
```js
import Bot from "meowerbot";

const bot = new Bot("username", "password"); // Init, then login to Meower

bot.onLogin(() => { // Runs when logged in
    bot.post("Hello from MeowerBot.js!");
});

bot.onPost((username, content) => { // Runs when a new post is sent
    if (content.startsWith("!help")) {
        bot.post("Commands: !help");
    }
});

bot.onMessage((data) => { // Runs when the server sends a new message
    console.log(`New message: ${data}`);
});

bot.onClose(() => { // Runs when the bot gets disconnected
    console.log("Disconnected");
});
```
