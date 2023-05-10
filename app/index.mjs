import express from "express";
import TelegramBot from "node-telegram-bot-api";
import simpleNodeLogger from "simple-node-logger";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

/* Load dotenv */
config();

/* Define lowdb path */
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");

/* Init lowdb database */
const adapter = new JSONFile(file);
const defaultData = { subscribers: [] };
const db = new Low(adapter, defaultData);

/* Read environment variables */
const USED_PORT = process.env["USED_PORT"];
const TEL_TOKEN = process.env["TEL_TOKEN"];
const EMIT_KEY = process.env["EMIT_KEY"];
const SUB_KEY = process.env["SUB_KEY"];
const LOG_LEVEL = process.env["LOG_LEVEL"];

/* Init modules & configure modules */
const bot = new TelegramBot(TEL_TOKEN, { polling: true });
const app = express();
const log = simpleNodeLogger.createSimpleLogger();

app.use(express.json());
log.setLevel(LOG_LEVEL);

/*
 * Wait POST requests
 */
app.post("/", async (req, res) => {
  await db.read();

  const { subscribers } = db.data;

  if (req.body.key === EMIT_KEY) {
    if (subscribers.length > 0) {
      for (let i = 0; i < subscribers.length; i++) {
        bot.sendMessage(subscribers[i], req.body.message, {
          disable_web_page_preview: true, // Remove OpenGraph links preview
        });
      }
      res.end;
    }
  }

  res.end();
});

/*
 * Run http server
 */
app.listen(USED_PORT, (e) => {
  if (e) {
    log.error("Fail run tg-notify-bot...");
    process.exit(1);
  }

  log.info(`TG-NOTIFY-BOT now running on port ${USED_PORT}`);

  bot.onText(/\/subscribe (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const subKey = match[1];

    log.debug(
      `Incomming subscribe message, recieve key ${subKey} from chat ${chatId}`
    );

    if (subKey == SUB_KEY) {
      await db.read();

      const candidate = db.data.subscribers.filter((sub) => {
        return sub == chatId;
      });

      // Add new subscriber if not exist
      if (candidate.length == 0) {
        db.data.subscribers.push(chatId);
        await db.write();
        bot.sendMessage(chatId, "Subscribe successful");
      }
    }
  });
});
