const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agrierp9999@gmail.com",
    pass: "bnqa rahu kcxq eqyd",
  },
});

const sendVerificationMail = (email, token) => {
  const verificationurl = `http://localhost:2000/admin/verify?token=${token}`;
  const mailOptions = {
    from: "no-reply@agrierp.com",
    to: email,
    subject: "Please verify your AgriERP account",
    text: `Please click the link to verify your account: ${verificationurl}`,
    html: `
      <p>Dear User,</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationurl}">${verificationurl}</a>
      <p>If you didn’t sign up, just ignore this email.</p>
      <p>Thanks,<br/>AgriERP Team</p>
    `,
  };

  transport.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent:", data.response);
    }
  });
};

module.exports = sendVerificationMail;
