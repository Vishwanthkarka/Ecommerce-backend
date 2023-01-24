const nodemailer = require("nodemailer");

const mailHelper = async (option) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port:process.env.MAILER_PORT ,
        auth: {
          user: process.env.MAILER_US,
          pass: process.env.MAILER_PS
        }
      });
    
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <vishwa.com>', 
        to: option.email, 
        subject: option.subject, 
        text: option.message, 
      });
    
      
}


module.exports = mailHelper