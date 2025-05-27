require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const auth = require('./middleware/auth')

const app = express();
const { readdirSync } = require('fs');

const PORT = process.env.PORT;
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');
const ENV = process.env.NODE_ENV;

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

readdirSync('./routers').map((file) => {
  if (file === 'auth.js') {
    app.use('/api', auth, require('./routers/' + file)); // ใช้ auth middleware
  } else {
    app.use('/api', require('./routers/' + file)); // ไม่ใช้ auth middleware
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT} \n(env: ${ENV})`);
});