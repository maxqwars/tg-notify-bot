# tg-notify-bot

Easiest way to send you notifications

## So now does it work?

### For the **notifier**

The notification sendler only needs to send POST request with JSON body that has a structure.
Where the "message" field is the text of the notification you are sending, and the key "key" field is the key of the notification sendler.

```json
{
  "message": "You push message",
  "key": "you-notify-emit-key"
}
```

### For the recipient of notifications

It is sufficient to send the bot the command "/subscribe" containing
the key of the recipient of notifications.

> /subsribe \<you-subsriber-key>

## Subsriber commands reference

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| /subsribe \<subsribe-key> | Subscribe to notifications     |
| /silent                   | Set "silent" notification mode |
| /unsubscribe              | Unsubscribe from notifications |

## Installation

1. Clone repository
1. Set environment variables
1. Run

## Environment variables

| key       | description                                           |
| --------- | ----------------------------------------------------- |
| USED_PORT | Used network port                                     |
| TEL_TOKEN | You Telegram bot token                                |
| EMIT_KEY  | Key for send notifications                            |
| SUB_KEY   | Key for subscribe to notifications                    |
| LOG_LEVEL | Logger level (all \| info \| error \| debug \| trace) |
