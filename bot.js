const TelegramBot = require('node-telegram-bot-api');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const openai = require('openai');
const TELEGRAM_BOT_TOKEN = '7931379437:AAFfVDM6yUS-3BP4oYUj22keCw0GoqZCQqg';
const GOOGLE_SHEET_ID = '190BCHXyUN-NZavPGRbUh00v3sRCsg7PpcZsTfgVBcH4';
const OPENAI_API_KEY = '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';
const CREDENTIALS = require('/anuranan1-234335cc44a9.json');
const express = require (express)
const app = express ()
app.get ('/',(req, res) => res.send('hi'))
app.listen (3000, () => console.log(server))
openai.apiKey = OPENAI_API_KEY;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

async function accessGoogleSheet() {
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(CREDENTIALS);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    return sheet;
}

const userStates = {};
const questions = [
    'What is your name?', 'What is your gender? (Male/Female)',
    'What is your date of birth?', 'What is your institution name?',
    'What is your division?', 'What is your home address?',
    'What is your phone number?', 'What is your Facebook profile link?',
    'What is your Telegram profile link?', 'Please send money to 01614887878 and provide the transaction ID.',
    'Do you have a referral code? (Yes/No)', 'What is your past volunteer experience?',
    'What motivates you to join us?'
];

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userStates[chatId] = { step: 0, data: {} };
    bot.sendMessage(chatId, "Welcome to Anuranan! Let's start the registration.");
    bot.sendMessage(chatId, questions[0]);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!userStates[chatId]) return;

    const currentStep = userStates[chatId].step;

    if (currentStep < questions.length) {
        handleRegistrationStep(chatId, text);
    } else if (text === '/chat') {
        await handleChatGPT(chatId, text);
    }
});

async function handleRegistrationStep(chatId, text) {
    const currentStep = userStates[chatId].step;
    userStates[chatId].data[questions[currentStep]] = text;

    if (currentStep + 1 < questions.length) {
        userStates[chatId].step += 1;
        bot.sendMessage(chatId, questions[currentStep + 1]);
    } else {
        await saveToGoogleSheet(chatId, userStates[chatId].data);
        bot.sendMessage(chatId, "Thank you! Registration is complete.");
        delete userStates[chatId];
    }
}

async function saveToGoogleSheet(chatId, data) {
    const sheet = await accessGoogleSheet();
    await sheet.addRow(data);
    bot.sendMessage(chatId, "Your information has been saved!");
}

async function handleChatGPT(chatId, userMessage) {
    try {
        const completion = await openai.Completion.create({
            engine: 'text-davinci-003',
            prompt: userMessage,
            max_tokens: 150
        });
        const response = completion.data.choices[0].text.trim();
        bot.sendMessage(chatId, response);
    } catch (error) {
        console.error("Error in GPT response:", error);
        bot.sendMessage(chatId, "Sorry, I'm having trouble responding right now.");
    }
}

bot.onText(/\/chat/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "What would you like to know? (Type your question)");
});
