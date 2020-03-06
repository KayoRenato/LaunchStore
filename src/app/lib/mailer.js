const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f3ccfe47eed7d3",
    pass: "31f1280a29913a"
  }
});
