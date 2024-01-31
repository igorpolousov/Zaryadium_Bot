const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
const text = require('./const')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : "Привет незнакомец"}, Какой вопрос вас интересует?`, getMainMenu()))
bot.help((ctx) => ctx.reply(text.commands))

// If buttons menu hided, calls it
bot.command('ask', async (ctx) => {
    try {
       await ctx.reply('Выберете вопрос из списка', getMainMenu())
    } catch (err) {
        console.log(err)
    }
})

// Buttons menu when start method called
function getMainMenu() {
    return Markup.keyboard (
        [
            [Markup.button.callback('Аренда не завершена после возврата повербанка в станцию', 'btn_1')],
            [Markup.button.callback('Депозит не вернулся', 'btn_2')],
            [Markup.button.callback('QR успешно отсканирован, но повербанк не выдан', 'btn_2_1')],
            [Markup.button.callback('Тарифы и правила аренды повербанка', 'btn_3')],
            [Markup.button.callback('Повербанк не заряжает', 'btn_4')],
            [Markup.button.callback('Потерял или повредил повербарк', 'btn_5')],
            [Markup.button.callback('Сотрудничество', 'btn_6')], 
            [Markup.button.callback('Как скачать приложение Зарядиум', 'btn_7')]
        ]
    )
}

// TODO: Сделать чтобы по таймауту выходил из бота, иначе не происходит обновление информации боте и на телефон не поступают обновления

// Add action to button function 
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

// Bot buttons actions

// Button 1 action
addActionBot('Аренда не завершена после возврата повербанка в станцию',false, text.btn_1Text)

// Button 2 action
addActionBot('Депозит не вернулся',false, text.btn_2Text)

// Button 2.1 action
addActionBot('QR успешно отсканирован, но повербанк не выдан',false, text.btn_2_1Text)

// Button 3 action
addActionBot('Тарифы и правила аренды повербанка',false, text.btn_3Text) 

// Button 4 action
addActionBot('Повербанк не заряжает',false, text.btn_4Text) 

// Button 5 action
addActionBot('Потерял или повредил повербарк',false, text.btn_5Text) 

// Button 6 action
addActionBot('Сотрудничество',false, text.btn_6Text) 

// Button 7 action
addActionBot('Как скачать приложение Зарядиум',false, text.btn_7Text) 

//bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
//bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))