const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
const text = require('./const')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : "Привет незнакомец"}, Какой вопрос вас интересует?`, getMainMenu()))
bot.help((ctx) => ctx.reply(text.commands))

bot.command('ask', async (ctx) => {
    try {
       await ctx.reply('Выберете вопрос из списка', getMainMenu())
    } catch (err) {
        console.log(err)
    }
})

// Функция получения кнопок при вызове команды старт
function getMainMenu() {
    return Markup.keyboard (
        [
            [Markup.button.callback('Аренда не завершилась, павербанк возвращён', 'btn_1')],
            [Markup.button.callback('Депозит не вернулся', 'btn_2')],
            [Markup.button.callback('Тарифы и условия аренды', 'btn_3')],
            [Markup.button.callback('Сотрудничество', 'btn_4')], // 6 позиция
            [Markup.button.callback('Как скачать приложение Зарядиум', 'btn_5')], // 7 позиция
            [ Markup.button.callback('Павербанк не заряжает', 'btn_6')],
            [Markup.button.callback('Аккумулятор увезен/утерян/украден', 'btn_7')]
        ]
    )
}

// TODO: Сделать чтобы по таймауту выходил из бота, иначе не происходит обновление информации боте и на телефон не поступают обновления
// Все слова банки, аккумклятор и тд поменять на - павербанк
// Добавить QR отсканирован, павербанк не выдан - 3 позиция - ответ из приложения  
// Знаки препинания

// Функция добавление действий к кнопкам 
function addActionBot(name, src, text) {
    bot.hears(name, async (ctx) => {
        try {
            //await ctx.answerCbQuery()
            if (src !== false) {
                await ctx.replyWithPhoto({
                    source: src
                })
            }
          await ctx.replyWithHTML(text, {
            disable_web_page_preview: true
          }) 
        } catch (e) {
            console.error(e)
        }
    })
}

// Действия бота при нажатии на кнопки
addActionBot('Аренда не завершилась, павербанк возвращён',false, text.btn_1Text)
addActionBot('Депозит не вернулся',false, text.btn_2Text)
addActionBot('Тарифы и условия аренды',false, text.btn_3Text) // Взять текст из приложения меню Тарифы
addActionBot('Сотрудничество',false, text.btn_4Text) // 6 позиция
addActionBot('Как скачать приложение Зарядиум',false, text.btn_5Text) // 7 позиция
addActionBot('Павербанк не заряжает',false, text.btn_6Text) // Взять описание из приложения
addActionBot('Аккумулятор увезен/утерян/украден',false, text.btn_7Text) // Название взять из приложения

//bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
//bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))