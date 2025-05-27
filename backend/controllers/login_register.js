require('dotenv').config();
const prisma = require('../prisma/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isValidEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.register = async (req, res) => {
    try {


        const { email, password, role } = req.body;
        const salt = 12;

        if ( !email || !password ) {
            return res.status(400).json({ message: 'email, password is require' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid Email' });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'email is already' })
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        const userRole = role === 'admin' ? 'admin' : 'user'; // จำกัด role

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole,
            }
        })

        return res.status(201).json({
            message: 'Register is successful!',
            user: { id: newUser.id, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server is already' })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email }});
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, userEmail: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('react_auth_token', token, {
            httpOnly: true,
            scure: process.env.NODE_ENV === 'production', // ใช้ https เท่านั้นใน production
            sameSite: 'lax',
            maxAge: 3600000, // 1 ชั่วโมง (ms)
            path: '/',  // ส่ง cookie ทุก path
        });

        return res.json({ message: 'Login successful', token});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server is already' })
    }
}

exports.me = (req, res) => {
    return res.json({
        authenticated: true,
        user: { id: req.user.userId, role: req.user.role }
    });
//   res.json({ authenticated: true});
};

exports.logout = (req, res) => {
  res.clearCookie('react_auth_token');
  res.json({ message: 'Logged out' });
};