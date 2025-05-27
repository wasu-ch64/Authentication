const prisma = require('../prisma/prisma');

exports.getUser = async (req, res) => {
    try {
        const getUsers = await prisma.user.findMany();
        return res.json(getUsers); // ส่งข้อมูล users กลับไป

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server is already' })
    }
}