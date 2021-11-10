const {vapesMax} = require("./options");
module.exports = {

    gameOpt: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
                [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
                [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
                [{text: '0', callback_data: '0'}],
            ]
        })
    },

    againOpt: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Играть ещё раз', callback_data: '/again'}]
            ]
        })
    },

    typeVapes: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Max", callback_data: "Max"}],
            ]
        })
    },

    vapesMax: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Виноград", callback_data: "max-grape"},
                    {text: "Банан", callback_data: "max-banana"}
                ],
                [
                    {text: 'Манго', callback_data: "max-mango"},
                    {text: "Охлаждающая мята", callback_data: "max-mint"}
                ],
                [
                    {text: "Ледяная дыня", callback_data: "max-melon"},
                    {text: "Мамба", callback_data: "max-mamba"}
                ],
                [
                    {text: "Клубника-арбуз", callback_data: "max-strawberry"},
                    {text: "Ледяной банан", callback_data: "max-icebanana"}
                ],
                [
                    {text: "Ягодный микс", callback_data: "max-mix"},
                    {text: "Арбуз", callback_data: "max-watermelon"},
                ]
                // [{text:"кнопка 3", callback_data: "LL"}]
            ]
        })
    },

    vapesMax1: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Виноград", callback_data: "max-grape1"},
                    {text: "Банан", callback_data: "max-banana"}
                ],
                [
                    {text: 'Манго', callback_data: "max-mango"},
                    {text: "Охлаждающая мята", callback_data: "max-mint"}
                ],
                [
                    {text: "Ледяная дыня", callback_data: "max-melon"},
                    {text: "Мамба", callback_data: "max-mamba"}
                ],
                [
                    {text: "Клубника-арбуз", callback_data: "max-strawberry"},
                    {text: "Ледяной банан", callback_data: "max-icebanana"}
                ],
                [
                    {text: "Ягодный микс", callback_data: "max-mix"},
                    {text: "Арбуз", callback_data: "max-watermelon"},
                ]
                // [{text:"кнопка 3", callback_data: "LL"}]
            ]
        })
    },

    vapesMax2: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Виноград", callback_data: "max-grape2"},
                    {text: "Банан", callback_data: "max-banana"}
                ],
                [
                    {text: 'Манго', callback_data: "max-mango"},
                    {text: "Охлаждающая мята", callback_data: "max-mint"}
                ],
                [
                    {text: "Ледяная дыня", callback_data: "max-melon"},
                    {text: "Мамба", callback_data: "max-mamba"}
                ],
                [
                    {text: "Клубника-арбуз", callback_data: "max-strawberry"},
                    {text: "Ледяной банан", callback_data: "max-icebanana"}
                ],
                [
                    {text: "Ягодный микс", callback_data: "max-mix"},
                    {text: "Арбуз", callback_data: "max-watermelon"},
                ]
                // [{text:"кнопка 3", callback_data: "LL"}]
            ]
        })
    },

    orderButton: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Оформить заказ", callback_data: "place-order"}
                ]
                // [{text:"кнопка 3", callback_data: "LL"}]
            ]
        })
    },

    confirm: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Подтвердить", callback_data: "confirm"}
                ]
                // [{text:"кнопка 3", callback_data: "LL"}]
            ]
        })
    },

    shopOrOrder: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Перейти в корзину", callback_data: "/order"},
                    {text: "Выбрать ещё", callback_data: 'Max'}
                ]
                // [{text:"кнопка 3", callback_data: "LL"}]
            ]
        })
    },

    shopOrOrder1: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Перейти в корзину", callback_data: "/order"},
                    {text: "Перейти к моделям", callback_data: 'max2'}
                ]
                // [{text:"кнопка 3", callback_data: "LL"}]
            ]
        })
    }


}