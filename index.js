const TelegramApi = require('node-telegram-bot-api')
const {gameOpt, againOpt, typeVapes, vapesLumia, vapesLumias, orderButton, confirm, shopOrOrder, vapesMax} = require('./options')

// const mongo = require('./db')
const UserModel = require('./models')
const mongoose = require("mongoose");
const db = require("./models");
const events = require("events");
const User = require("./models");
db.mongoose = mongoose;


const token = '2089873313:AAFD2RxxHKuoyFr1K1IlC07mxLDu0h0JNMo'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const start = async () => {

    try {
        db.mongoose
            .connect(`mongodb+srv://dbUser:dbUser@cluster0.tx88g.mongodb.net/myFirstDatabase`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log("Successfully connect to MongoDB.");
            })
            .catch(err => {
                console.error("Connection error", err);
                process.exit();
            });
    } catch (e) {
        console.log(e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {

                // await UserModel.create({chatId})

                // const user = new User({
                //     username: "telega"
                // });
                //
                // user.save(user)

                // console.log(chatId)

                await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1OEpT-auK8REO9pcHZ00J5C-ef2-TiIJ4/view?usp=sharing")

                return bot.sendMessage(chatId, `Привет ${msg.from.first_name}! \nЭто официальный магазин товаров HiFive! \nТут вы можете купить и оформить доставку \nСписок команд: \n/shop - Ознакомиться с продуктами hi5, оплатить и оформить доставку в пункт выдачи \n/history - история покупок \n/bonus - партнерская программа \n/friends - посмотреть, кто перешел по партнерской программе \n/social - наши соц.сети \n/help - если что-то пошло не так...`)
            }

            if (text === '/shop') {
                // await UserModel.create({chatId})

                // await bot.sendMessage(chatId, `Поздравляю ты угадал цифру ${chats[chatId]}`, againOpt)


                // switch () {
                //     case:
                // }

                return bot.sendMessage(
                    chatId,
                    `Выберите товар:`,
                    typeVapes)


                // await user.save();
            }


            if (text === '/social') {
                return bot.sendMessage(chatId, `Наши соцсети: \nvk: https://vk.com/hi5russia\ntiktok: https://www.tiktok.com/@hi5russia?lang=en\nfacebook: www.FB.com/hi5russia\nсайт: www.hi5russia.com\nwww.hi5russia.ru\nhttps://www.instagram.com/hi5russia/`)
            }

            if (text === '/help') {
                return bot.sendMessage(chatId, `Напишите вашу проблему`)
            }

            if (text === '/info') {
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`)
            }



            if (text === '/order') {

                User.find({username: msg.chat.username}, function (err, user) {
                    // console.log(user[0].order)

                    let order = []


                    console.log(user[0].order[0].substring(1))




                    for (let i = 0; user.length > i; i++) {
                        // console.log(i)
                        // console.log(user[i].order)
                        order.push(user[i].order[0])

                    }



                    // console.log(user[0].order[0].findIndex(element => element === ','))

                    // console.log(order)

                    return bot.sendMessage(chatId, `Твоя корзина: \n\n${order}`, orderButton)


                })

                bot.on('callback_query', async msg => {
                    const data = msg.data;
                    const chatId = msg.message.chat.id;
                    console.log(data)

                    if (data === 'place-order') {
                        bot.sendMessage(chatId, "Напишите ваш адрес доставки");

                        bot.on('message', async msg => {
                            if (msg.text !== '/order') {
                                if (msg.text !== '/shop') {
                                    if (msg.text !== '/start') {
                                        // console.log(msg)
                                        bot.sendMessage(chatId, `${msg.text}`, confirm)

                                    }
                                }
                            }
                        })
                    }
                })


            }

            return;

        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая-то ошибочка!)')
        }

    })


    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        switch (data) {
            case 'Max':
                await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1VwDwEPp70qmmP2N_ItP-8zXMevb_O0pK/view?usp=sharing")
                await bot.sendMessage(chatId, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesMax)

                // console.log(vapesLumia)

                bot.on('callback_query', async msg => {


                    // const data = msg.data

                    console.log(msg.data)


                    switch (msg.data) {
                        case 'max-grape':

                            // console.log(msg.data)

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            // console.log(msg.text)
                                            // console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    // console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max с виноградным вкусом \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()


                                                    bot.sendMessage(chatId, "Хотите ещё?", shopOrOrder)

                                                    if ('max') {
                                                        await bot.sendMessage(chatId, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesMax)
                                                    }

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                    case 'max-banana':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            // console.log('lumia')
                                            // console.log(msg.text)
                                            // console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    // console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max с банановым вкусом \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                    case 'max-mango':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            // console.log('lumia')
                                            // console.log(msg.text)
                                            // console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    // console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max с манговым вкусом \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                     case 'max-mint':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            // console.log(msg.text)
                                            // console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max с мятным вкусом \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                    case 'max-melon':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            console.log('lumia')
                                            console.log(msg.text)
                                            console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max со вкусом дыни \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                        case 'max-mamba':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            console.log('lumia')
                                            console.log(msg.text)
                                            console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max со вкусом мамбы \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                    case 'max-strawberry':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            console.log('lumia')
                                            console.log(msg.text)
                                            console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max со вкусом клубники \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                    case 'max-icebanana':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            console.log('lumia')
                                            console.log(msg.text)
                                            console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max со вкусом холодного банана \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                     case 'max-mix':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            console.log('lumia')
                                            console.log(msg.text)
                                            console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max со вкусом "Mix" \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                    // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;
                    case 'max-watermelon':

                            bot.sendMessage(chatId, "Напиши количество");


                            bot.on('message', async msg => {

                                // console.log(msg)
                                if (msg.text !== '/order') {
                                    if (msg.text !== '/shop') {
                                        if (msg.text !== '/start') {
                                            console.log('lumia')
                                            console.log(msg.text)
                                            console.log('1')

                                            let isNumber = Number(msg.text)
                                            if (!isNumber) {
                                                bot.sendMessage(chatId, "Отправьте число")
                                            } else {

                                                if (Number.isInteger(isNumber) > 0) {
                                                    console.log('2')

                                                    const user = new User({
                                                        username: msg.chat.username,
                                                        order: `Название: Max со вкусом арбуза \nКоличество: ${msg.text} \n\n`
                                                    })
                                                    user.save()

                                                }
                                            }


                                        }
                                    }
                                }
                            })

                            break;

                    }

                    return;
                });
                break;

            // case 'Lumia':
            //     await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1UdCV-znEJnh0QBTOhCeLn2HeyBgrCVXj/view?usp=sharing")
            //     return bot.sendMessage(chatId, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesLumia)
            //     break;
            //
            // case 'Lite':
            //     await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1UdCV-znEJnh0QBTOhCeLn2HeyBgrCVXj/view?usp=sharing")
            //     return bot.sendMessage(chatId, "Lumia-Zen \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesLumia)
            //     break;
        }
    })
}

start()