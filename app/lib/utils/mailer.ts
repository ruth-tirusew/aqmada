import Mail from "nodemailer/lib/mailer";

  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    secure: true,
    port: '465',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  
  export const sendEmail = async(reciever:string, mail: string) =>{
    try{
      const mailOptions: Mail.Options = {
          from: process.env.EMAIL,
          to: reciever,
          html : mail,
          subject: "Invitation to Participate as a Beta Tester | Aqmada",      
          };
      mailOptions.html = mail;
      await transporter.sendMail(mailOptions);
        }catch(err){
      console.log(err);
  }
  }
  
  