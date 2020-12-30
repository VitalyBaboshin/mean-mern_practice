const {Router} = require('express');
//Подключаем модуль который позволяет хешировать пароли и потом еще и сравнивать
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
//подключаем модель ранее созданную
const User = require('../models/User');
const router = Router();

// /api/auth/registration
router.post(
    '/registration',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6}),
        check('password', 'Максимальная длина пароля 20 символов').isLength({max: 20})
        // ,
        // check('password', 'Пароль должен иметь верхний регистр').isUppercase(),
        // check('password', 'Пароль должен иметь нижний регистр ').isLowercase()
    ],
    async (req, res) => {
        try {

            //Для обработки валидации express-валидатором
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })

            }
            const {email, password} = req.body;

            const candidate = await User.findOne({email});

            if (candidate) {
                //400 Bad Request «неправильный, некорректный запрос»
                return res.status(400).json({message: 'Такой пользователь уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({email, password: hashedPassword});

            await user.save();
            console.log(user);
            //200 created
            res.status(201).json({message: 'Пользователь создан'});

        } catch (e) {
            //Внутренняя ошибка сервера
            res.status(500).json({message: 'Internal server error'})
        }
    })
// /api/auth/login
router.post(
    '/login',
    [
        check('email','Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {

            //Для обработки валидации express-валидатором
            const errors = validationResult(req);
            if (!errors.isEmpty()) {

                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const {email, password} = req.body;
            //ищем пользователя по email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({message: "Пользователь не найден"});
            }
            const isMatch = await bcrypt.compare(password, user.password);

            //Пароли не совпадают
            if(!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'});
            }

            //Формироуем токен
            const token = jwt.sign(
                { userId: user.id},
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            )

            res.json({ token, userId: user.id})

        } catch (e) {
            //Внутренняя ошибка сервера
            res.status(500).json({message: 'Internal server error !!'})
        }
    })




module.exports = router;


