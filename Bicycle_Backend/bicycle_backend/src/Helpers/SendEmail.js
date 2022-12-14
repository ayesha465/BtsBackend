var nodemailer = require('nodemailer');
const sendEmail = async ( subject, text) => 
{
    try
    {
       const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
        user: 'ashbike123@gmail.com',
        pass: 'eueilmagylgoeyhj'
        }
      });

       var mailOptions = {
       from: 'ashbike123@gmail.com',
       to: 'ashbike123@gmail.com',
       subject: 'Sending Email using Node.js',
        text: 'That was easy!'
       };

      transporter.sendMail(mailOptions, function(error, info)
      {
       if (error) {
      console.log(error);
       } else 
       {
       console.log('Email sent: ' + info.response);
       }

     })
     
  }
  catch (error) {
    console.log(error, "email not sent");
}
};
      


module.exports = sendEmail;