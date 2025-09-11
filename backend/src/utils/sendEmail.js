import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sakshipatare03@gmail.com', // replace with real email
      pass: 'hrnf terw jagx rudm',    // use Gmail App Password
    },
  });

  const mailOptions = {
    from: 'sakshipatare03@gmail.com',
    to: email,
    subject: 'Verify your email for Todo App',
    html: `<p>Click to verify your email: 
      <a href="http://localhost:4000/users/verify/${token}">Verify Email</a></p>`
  };

  await transporter.sendMail(mailOptions);
};
