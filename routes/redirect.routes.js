const {Router} = require('express');
const Link = require('../models/Link');
const router = Router();

router.get('/:code', async (req, res) => {
    try {

        //Получаем ссылку с которой мы сейчас работаем по коду
        const link = await Link.findOne({ code: req.params.code});

        if (link) {
            link.clicks++;
            await link.save();
            return res.redirect(link.from);
        }

        res.status(404).json('Ссылка не найдена');

    } catch (e) {
        //Внутренняя ошибка сервера
        res.status(500).json({message: 'Internal server error !!'})
    }
})

module.exports = router;
