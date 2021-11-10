const TelegramApi = require('node-telegram-bot-api')
const {
    gameOpt,
    againOpt,
    typeVapes,
    vapesLumia,
    vapesLumias,
    orderButton,
    confirm,
    shopOrOrder,
    vapesMax,
    vapesMax1, shopOrOrder1, vapesMax2
} = require('./options')

// const mongo = require('./db')
const UserModel = require('./models')
const mongoose = require("mongoose");
const db = require("./models");
const events = require("events");
const User = require("./models");
const {log} = require("nodemon/lib/utils");
db.mongoose = mongoose;

const History = require('./History.model')
const Bonus = require("./Bonus.model");


const token = '2089873313:AAFD2RxxHKuoyFr1K1IlC07mxLDu0h0JNMo'
// const token = '2105531379:AAGFWiV5egnpF6TIx3gQdyjNYoHV9SO4nq4'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async () => {

    try {
        db.mongoose
            .connect(`mongodb+srv://dbUser:dbUser@cluster0.16yqr.mongodb.net/myFirstDatabase`, {
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

    var answerCallbacks = {};

    bot.on('message', function (message) {
        var callback = answerCallbacks[message.chat.id];
        if (callback) {
            delete answerCallbacks[message.chat.id];
            return callback(message);
        }
    });


    bot.on('callback_query', async message => {

        if (message.data === 'Max') {

            // bot.onText(/\/shops/, async function (message, match) {

            console.log(message)

            await bot.sendPhoto(message.message.chat.id, "https://drive.google.com/file/d/1VwDwEPp70qmmP2N_ItP-8zXMevb_O0pK/view?usp=sharing")
            await bot.sendMessage(message.message.chat.id, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesMax)

        }

    })

    bot.on('callback_query', async message => {


        if (message.data === 'place-order') {

            console.log(message)

            const date = new Date()

            const qwerty = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
            console.log(qwerty)

            User.findOne({username: message.message.chat.username}, function (err, user) {
                console.log(user)

                const history = new History({
                    status: 'В ожидании оплаты',
                    date: qwerty,
                    check: 4512512,
                    username: user.username,
                    order: user.order
                })

                history.save()

                bot.sendMessage(message.message.chat.id, "Заказ оформлен")
                // bot.sendMessage(message.message.chat.id, `${history}`)
            })

            //
            // history.save()
            console.log('placeqwe')

        }

        console.log(message.data)
        if (message.data === '/order') {

            console.log('order')

            console.log(message)


            User.find({username: message.message.chat.username}, function (err, user) {
                // console.log(user[0].order)

                // let order = []


                console.log(user[0].order.length)


                let qwe = user[0].order

                console.log(qwe[1])

                let gre = qwe.join("")

                console.log(gre)


                return bot.sendMessage(message.message.chat.id, `Твоя корзина: \n\n${gre}`, orderButton)

            })

            // bot.on('callback_query', async msg => {
            //     const data = msg.data;
            //     const chatId = msg.message.chat.id;
            //     console.log(data)
            //
            //     if (data === 'place-order') {
            //         bot.sendMessage(chatId, "Напишите ваш адрес доставки");
            //
            //         bot.on('message', async msg => {
            //             if (msg.text !== '/order') {
            //                 if (msg.text !== '/shop') {
            //                     if (msg.text !== '/start') {
            //                         // console.log(msg)
            //                         bot.sendMessage(chatId, `${msg.text}`, confirm)
            //
            //                     }
            //                 }
            //             }
            //         })
            //     }
            // })


        }


        if (message.data === 'max-grape') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;
                    console.log(name)

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        // console.log(user.order)
                        if (user.order == null) {

                            // console.log('0')

                            user.order = [` `]

                            // console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом винограда \n`)

                            // console.log(user.order)

                            user.save()

                        } else {

                            // console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом винограда \n`)
                            // console.log(user.order[0])

                            user.save()
                        }
                    })

                    await bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом винограда добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }

        if (message.data === 'max-banana') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом банана \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом банана \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом банана добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-mango') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    // console.log(Number.isInteger(parseInt(name)))

                    // console.log(parseInt(name) >= 0 || parseInt(name) <= 0)

                    console.log(parseInt(name))


                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом манго \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом манго \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом манго добавлена в корзину");

                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-mint') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом мяты \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом мяты \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом мяты добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-melon') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом дыни \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом дыни \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом дыни добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-mamba') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом мамбы \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом мамбы \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом мамбы добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-strawberry') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом клубники \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом клубники \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом клубники добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-icebanana') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом холодного банана \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом холодного банана \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом холодного банана добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-mix') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом mix \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом mix \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом mix добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }
        if (message.data === 'max-watermelon') {
            bot.sendMessage(message.message.chat.id, "Введите количество").then(function () {
                answerCallbacks[message.message.chat.id] = async function (answer) {
                    var name = answer.text;

                    if (!Number.isInteger(parseInt(name))) {
                        return bot.sendMessage(message.message.chat.id, 'Вам нужно ввести число, повторите попытку ещё раз', typeVapes)
                    }

                    User.findOne({username: message.from.username}, function (err, user) {

                        // let qwe = user.order.length
                        // console.log(user.order.order[user.order.length + 1])
                        // let wqe = user.order[qwe].order.length ;


                        console.log(user.order)
                        if (user.order == null) {

                            console.log('0')

                            user.order = [` `]

                            console.log(user.order[0])

                            user.order.push(`${parseInt(name)} Max со вкусом арбуза \n`)

                            console.log(user.order)

                            user.save()

                        } else {

                            console.log('1')
                            user.order.push(`${parseInt(name)} Max со вкусом арбуза \n`)
                            console.log(user.order[0])

                            user.save()
                        }
                    })

                    bot.sendMessage(message.message.chat.id, parseInt(name) + " Max со вкусом арбуза добавлена в корзину");
                    await bot.sendMessage(message.message.chat.id, "Что будем делать дальше ?", shopOrOrder);
                }
            });
        }


    })


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        console.log(msg)

        try {

            if (text === '/friends') {
                Bonus.findOne({username: msg.from.username}, (err, bonus) => {


                    console.log(bonus !== null)
                    console.log(bonus.counterVisitors.length !== 0)

                    if (bonus !== null && bonus.counterVisitors.length !== 0) {

                        console.log("1")
                        console.log("123")

                        let mySet = new Set();

                        for (let i = 0; i < bonus.counterVisitors.length; i++) {
                            mySet.add(bonus.counterVisitors[i]);
                        }

                        console.log(mySet)

                        let array = []
                        for (let user of mySet) {
                            array.push(user); // John (потом Pete и Mary)
                        }

                        let gre = array.join("\n")

                        console.log(gre)

                        return bot.sendMessage(chatId, `${gre}`)

                    } else {
                        return bot.sendMessage(chatId, 'Никто не перешёл по вашей реферальной ссылке ;(')
                    }



                })
            }

            if (text === '/bonus') {

                Bonus.findOne({username: msg.from.username}, (err, bonus) => {

                    console.log(bonus)

                    if (bonus != null) {

                        console.log("1")
                        return bot.sendMessage(chatId, `Реферальная ссылка: t.me/hifive_store_bot?start=${bonus.token}`)

                    } else {
                        console.log("2")
                        console.log(msg.from.username)

                        const bonus = new Bonus({
                            username: msg.from.username,
                            token: chatId,
                            money: 0,
                            counterVisitors: [],
                        })

                        bonus.save()
                        return bot.sendMessage(chatId, `Реферальная ссылка: t.me/hifive_store_bot?start=${bonus.token}`)

                    }
                })


                // const bonus = new Bonus({
                //     username: msg.from.username,
                //     token: chatId,
                //     money: 0
                // })
                //
                // bonus.save()

            }


            if (text === '/start' || text.length === 16) {


                if (text.length === 16) {

                    let number = text.slice(7, 16)

                    Bonus.findOne({token: number}, (err, bonus) => {
                        console.log(bonus.counterVisitors.length)

                        bonus.counterVisitors.push(`${msg.from.username} ${msg.from.first_name} ${msg.from.last_name}`);

                        bonus.save()

                    })

                    console.log(number)
                }

                // await UserModel.create({chatId})

                // console.log(msg.from.username)
                const username = msg.from.username;


                User.findOne({username: msg.from.username}, function (err, user) {

                    if (!user) {

                        user = new User({
                            username: msg.from.username,
                            order: []

                        })

                        user.save()
                    }

                    user.order = []
                    user.save()

                    // if (user !== msg.from.username) {
                    //     user.username = msg.from.username
                    //     user.order = []
                    //     user.save()
                    // }
                })


                // user.save(user)

                // console.log(chatId)

                await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1OEpT-auK8REO9pcHZ00J5C-ef2-TiIJ4/view?usp=sharing")

                return bot.sendMessage(chatId, `Привет ${msg.from.first_name}! \nЭто официальный магазин товаров HiFive! \nТут вы можете купить и оформить доставку \nСписок команд: \n/shop - Ознакомиться с продуктами hi5, оплатить и оформить доставку в пункт выдачи \n/history - история покупок \n/bonus - партнерская программа \n/friends - посмотреть, кто перешел по партнерской программе \n/social - наши соц.сети \n/help - если что-то пошло не так...`)
            }

            if (text === '/info') {
                History.find({}, function (err, history) {

                    let arr = []
                    for (let i = 0; i < history.length; i++) {
                        arr.push({
                            'Статус:': history[i].status,
                            'Имя': history[i].username,
                            'Товары': history[i].order
                        });
                    }

                    console.log(arr)
                    return bot.sendMessage(chatId, `${arr[0]}`)


                    // return bot.sendMessage(chatId, `Статус активных заказов: \n\nЗаказ №1\nСтатус: ${history[0].status}... \nИмя: ${history[0].username} \nТовары: \n${history[0].order} \nЗаказ №2\nСтатус: ${history[1].status}... \nИмя: ${history[1].username} \nТовары: \n${(history[1].order).join("")}`)

                })

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

            // if (text === '/info') {
            //     return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`)
            // }

            if (text === '/pay') {


                console.log('1')
                const getInvoice = (chatId) => {
                    console.log('2')
                    return {
                        chat_id: chatId, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
                        provider_token: `401643678:TEST:781be3ed-1d08-4818-9e54-113df1a3820f`, // токен выданный через бот @SberbankPaymentBot
                        start_parameter: 'get_access', //Уникальный параметр глубинных ссылок. Если оставить поле пустым, переадресованные копии отправленного сообщения будут иметь кнопку «Оплатить», позволяющую нескольким пользователям производить оплату непосредственно из пересылаемого сообщения, используя один и тот же счет. Если не пусто, перенаправленные копии отправленного сообщения будут иметь кнопку URL с глубокой ссылкой на бота (вместо кнопки оплаты) со значением, используемым в качестве начального параметра.
                        title: 'Hi5 Max', // Название продукта, 1-32 символа
                        description: 'InvoiceDescription', // Описание продукта, 1-255 знаков
                        currency: 'RUB', // Трехбуквенный код валюты ISO 4217
                        prices: [{label: 'Invoice Title', amount: 100 * 100}], // Разбивка цен, сериализованный список компонентов в формате JSON 100 копеек * 100 = 100 рублей
                        photo_url: 'https://s3.eu-central-1.wasabisys.com/ghashtag/JavaScriptBot/Unlock.png', // URL фотографии товара для счета-фактуры. Это может быть фотография товара или рекламное изображение услуги. Людям больше нравится, когда они видят, за что платят.
                        photo_width: 500, // Ширина фото
                        photo_height: 281, // Длина фото
                        payload: { // Полезные данные счета-фактуры, определенные ботом, 1–128 байт. Это не будет отображаться пользователю, используйте его для своих внутренних процессов.
                            unique_id: `${chatId}_${Number(new Date())}`,
                            provider_token: `401643678:TEST:781be3ed-1d08-4818-9e54-113df1a3820f`,

                        }
                    }
                }

                console.log('3')
                return bot.sendInvoice(getInvoice(chatId))
            }

            if (text === '/history') {

                History.find({username: msg.chat.username}, function (err, history) {
                    // console.log(user[0].order)

                    // let order = []

                    console.log(history.length - 1)
                    console.log(history[history.length -1])


                    // console.log(history[0].order.length)


                    let qwe = history[history.length - 1].order

                    // console.log(qwe[1])

                    let gre = qwe.join("")

                    // console.log(gre)


                    return bot.sendMessage(msg.chat.id, `Твоя история заказов: \n\nID заказа: ${history[history.length - 1].check} \nДата заказа: \n${history[history.length - 1].date} \nТовары: \n${gre} Стоимость заказа: 123123`)

                })


            }


            if (text === '/order') {

                console.log('order')

                console.log(msg)

                User.find({username: msg.chat.username}, function (err, user) {
                    // console.log(user[0].order)

                    // let order = []


                    console.log(user[0].order.length)


                    let qwe = user[0].order

                    console.log(qwe[1])

                    let gre = qwe.join("")

                    console.log(gre)


                    return bot.sendMessage(msg.chat.id, `Твоя корзина: \n\n${gre}`, orderButton)

                })

                // bot.on('callback_query', async msg => {
                //     const data = msg.data;
                //     const chatId = msg.message.chat.id;
                //     console.log(data)
                //
                //     if (data === 'place-order') {
                //         bot.sendMessage(chatId, "Напишите ваш адрес доставки");
                //
                //         bot.on('message', async msg => {
                //             if (msg.text !== '/order') {
                //                 if (msg.text !== '/shop') {
                //                     if (msg.text !== '/start') {
                //                         // console.log(msg)
                //                         bot.sendMessage(chatId, `${msg.text}`, confirm)
                //
                //                     }
                //                 }
                //             }
                //         })
                //     }
                // })


            }

            return;

        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая-то ошибочка!)')
        }

    })


    // bot.onText(/questions/, function (message,match) {
    //     bot.sendMessage(message.chat.id, "Enter your name").then(function () {
    //         answerCallbacks[message.chat.id] = function (answer) {
    //             var name = answer.text;
    //             bot.sendMessage(message.chat.id, "Enter your address").then(function () {
    //                 answerCallbacks[message.chat.id] = function (answer) {
    //                     var address = answer.text;
    //                     bot.sendMessage(message.chat.id, "Enter your phone ").then(function () {
    //                         answerCallbacks[message.chat.id] = function (answer) {
    //                             var phone = answer.text;
    //                             bot.sendMessage(message.chat.id, name + address + phone + " saved!");
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // });


    // async function f(chatId) {
    //     await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1VwDwEPp70qmmP2N_ItP-8zXMevb_O0pK/view?usp=sharing")
    //     await bot.sendMessage(chatId, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesMax)
    //
    //     console.log(vapesMax)
    //
    //     bot.on('callback_query', (query) => {
    //
    //         let id = query.message.chat.id;
    //
    //         switch (query.data) {
    //             case 'max-grape':
    //                 bot.sendMessage(id, 'Введите напомнинание');
    //
    //                 bot.on('message', (msg) => {
    //                     bot.sendMessage(id, `Ок, напомню ${msg.text}`);
    //                 });
    //                 break;
    //             case 'myNotes':
    //                 bot.sendMessage(id, 'Здесь будут Ваши напомнинания');
    //                 break;
    //         }
    //
    //     })

    // if (bot.on() === 'max-grape') {
    //     console.log(QEwEw)
    // }
    //
    // bot.on('max-grape', async msg => {
    //     bot.sendMessage(chatId, "Напиши количество").then(function () {
    //         bot.on('message', async msg => {
    //             bot.sendMessage(chatId, "Хотите ещё?1", shopOrOrder).then(async function () {
    //
    //
    //                 if (shopOrOrder.text === 'Хотите ещё?1') {
    //                     console.log("qwe")
    //                     bot.on('max1', async msg => {
    //                         console.log("QWEWQEWQEWQ")
    //                     })
    //                 }
    //                 // console.log(shopOrOrder)
    //                 // if ()
    //                 // f(chatId)
    //
    //             })
    //         })
    //     })
    // })


    // async function f1(chatId) {
    //     bot.on('callback_query', async msg => {
    //         f(chatId)
    //
    //     })
    //
    // }

    let qwe = true;

    // bot.on('callback_query', async msg => {
    //     const data = msg.data;
    //     const chatId = msg.message.chat.id;
    //     // console.log(msg)
    //
    //     let hot1 = true;
    //     let hot2 = true;
    //
    //
    //     switch (data) {
    //         case 'Max':
    //             await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1VwDwEPp70qmmP2N_ItP-8zXMevb_O0pK/view?usp=sharing")
    //             await bot.sendMessage(chatId, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesMax)
    //
    //             // await f(chatId)
    //
    //             bot.on('callback_query', async msg => {
    //
    //
    //
    //                 switch (msg.data) {
    //                     case 'max-grape':
    //
    //                         // console.log(msg.data)
    //
    //                         // console.log(msg)
    //                         bot.sendMessage(chatId, "Напиши количество").then(function () {
    //
    //
    //                             bot.on('message', async msg => {
    //
    //
    //                                 // console.log(msg)
    //                                 if (msg.text !== '/order') {
    //                                     if (msg.text !== '/shop') {
    //                                         if (msg.text !== '/start') {
    //                                             // console.log(msg.text)
    //                                             // console.log('1')
    //
    //                                             // let isNumber = Number(msg.text)
    //                                             // if (!isNumber) {
    //                                             //     bot.sendMessage(chatId, "Отправьте число")
    //                                             // } else {
    //
    //                                             // if (Number.isInteger(isNumber) > 0) {
    //                                             // console.log('2')
    //
    //                                             const user = new User({
    //                                                 username: msg.chat.username,
    //                                                 order: `Название: Max с виноградным вкусом \nКоличество: ${msg.text} \n\n`
    //                                             })
    //                                             user.save()
    //
    //                                             // console.log(msg)
    //                                             bot.sendMessage(chatId, "Хотите ещё?1", shopOrOrder).then(function () {
    //
    //
    //                                             })
    //
    //
    //                                             // if (msg.data === '/start') {
    //                                             //     // return msg.text = '/start'
    //                                             //     // bot.sendMessage(chatId, "/start")
    //                                             // }
    //
    //                                             // bot.sendMessage(chatId, "Хотите ещё?1", shopOrOrder).then(async function () {
    //                                             //
    //                                             //     // console.log(msg.message)
    //                                             //     // console.log("1")
    //                                             //
    //                                             //     bot.on('callback_query', async msg => {
    //                                             //         // console.log("qweqweqwe")
    //                                             //         // console.log(msg.query)
    //                                             //
    //                                             //         if (msg.data === 'max1') {
    //                                             //             await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1VwDwEPp70qmmP2N_ItP-8zXMevb_O0pK/view?usp=sharing")
    //                                             //             await bot.sendMessage(chatId, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesMax1).then(function () {
    //                                             //                 // console.log(msg)
    //                                             //                 bot.on('callback_query', async msg => {
    //                                             //
    //                                             //                     if (msg.data === 'max-grape1') {
    //                                             //                         bot.sendMessage(chatId, "Напиши количество").then(async function () {
    //                                             //                             await bot.on('message', async msg => {
    //                                             //                                 console.log(msg)
    //                                             //
    //                                             //                                 await bot.sendMessage(chatId, "Хотите ещё?", shopOrOrder1).then(async function () {
    //                                             //                                     console.log("qwe")
    //                                             //                                     bot.on('callback_query', async msg => {
    //                                             //                                         if (msg.data === 'max2') {
    //                                             //                                             console.log("Yeeeeee")
    //                                             //                                         }
    //                                             //                                     })
    //                                             //                                 })
    //                                             //
    //                                             //                             })
    //                                             //
    //                                             //                         });
    //                                             //                     }
    //                                             //                 })
    //                                             //             })
    //                                             //
    //                                             //         }
    //                                             //     })
    //                                             //     // if (msg.message === 'max1') {
    //                                             //     //     console.log("123")
    //                                             //     //
    //                                             //     //
    //                                             //     //         console.log("qweqweqwe")
    //                                             //     //         bot.on('callback_query', async msg => {
    //                                             //     //             console.log(msg)
    //                                             //     //
    //                                             //     //             if (msg.data === 'max1') {
    //                                             //     //                 console.log("Success")
    //                                             //     //             }
    //                                             //     //
    //                                             //     //         })
    //                                             //     //
    //                                             //     //         })
    //                                             //     // }
    //                                             //
    //                                             // })
    //
    //                                         }
    //                                     }
    //
    //
    //                                 }
    //                                 // }
    //                                 // }
    //                             })
    //
    //                         });
    //
    //
    //                         break;
    //                     case 'max-banana':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         // console.log('lumia')
    //                                         // console.log(msg.text)
    //                                         // console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 // console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max с банановым вкусом \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-mango':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         // console.log('lumia')
    //                                         // console.log(msg.text)
    //                                         // console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 // console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max с манговым вкусом \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-mint':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         // console.log(msg.text)
    //                                         // console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max с мятным вкусом \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-melon':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         console.log('lumia')
    //                                         console.log(msg.text)
    //                                         console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max со вкусом дыни \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-mamba':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         console.log('lumia')
    //                                         console.log(msg.text)
    //                                         console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max со вкусом мамбы \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-strawberry':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         console.log('lumia')
    //                                         console.log(msg.text)
    //                                         console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max со вкусом клубники \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-icebanana':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         console.log('lumia')
    //                                         console.log(msg.text)
    //                                         console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max со вкусом холодного банана \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-mix':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         console.log('lumia')
    //                                         console.log(msg.text)
    //                                         console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max со вкусом "Mix" \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                                 // bot.sendMessage(chatId, "Что дальше?)", shopOrOrder)
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //                     case 'max-watermelon':
    //
    //                         bot.sendMessage(chatId, "Напиши количество");
    //
    //
    //                         bot.on('message', async msg => {
    //
    //                             // console.log(msg)
    //                             if (msg.text !== '/order') {
    //                                 if (msg.text !== '/shop') {
    //                                     if (msg.text !== '/start') {
    //                                         console.log('lumia')
    //                                         console.log(msg.text)
    //                                         console.log('1')
    //
    //                                         let isNumber = Number(msg.text)
    //                                         if (!isNumber) {
    //                                             bot.sendMessage(chatId, "Отправьте число")
    //                                         } else {
    //
    //                                             if (Number.isInteger(isNumber) > 0) {
    //                                                 console.log('2')
    //
    //                                                 const user = new User({
    //                                                     username: msg.chat.username,
    //                                                     order: `Название: Max со вкусом арбуза \nКоличество: ${msg.text} \n\n`
    //                                                 })
    //                                                 user.save()
    //
    //                                             }
    //                                         }
    //
    //
    //                                     }
    //                                 }
    //                             }
    //                         })
    //
    //                         break;
    //
    //                 }
    //
    //                 return;
    //             });
    //             break;
    //
    //
    //         // case 'Lumia':
    //         //     await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1UdCV-znEJnh0QBTOhCeLn2HeyBgrCVXj/view?usp=sharing")
    //         //     return bot.sendMessage(chatId, "Max \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesLumia)
    //         //     break;
    //         //
    //         // case 'Lite':
    //         //     await bot.sendPhoto(chatId, "https://drive.google.com/file/d/1UdCV-znEJnh0QBTOhCeLn2HeyBgrCVXj/view?usp=sharing")
    //         //     return bot.sendMessage(chatId, "Lumia-Zen \n\nОписание: \n10 вкусов \n1500 затяжек \nОбъем жидкости 6 мл \nАккумулятор 900 мАч \nДизайн с подсветкой \n\nСайт с более подробной информации о товаре: https:/hi5russia/lumia-zen\n", vapesLumia)
    //         //     break;
    //     }
    // })
}

start()