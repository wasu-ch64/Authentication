const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // สมมติ export default

const { getUser } = require('../controllers/getUser');

router.get('/getUser', auth, getUser);

module.exports = router;
