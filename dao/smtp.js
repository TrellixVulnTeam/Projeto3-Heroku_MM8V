require('dotenv').config();

module.exports = {
    host: "smtp.gmail.com",
    port: 587,
    user: "matchagasbit@gmail.com",
    pass: process.env.PASS_SMTP
}