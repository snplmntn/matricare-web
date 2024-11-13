const User = require("../../models/User/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");
const jwt = require("jsonwebtoken");

const createVerificationToken = (length) => {
  // Generate Verification Token
  return crypto.randomBytes(length).toString("hex");
};

// Send Verification Email
const verification_mail = catchAsync(async (req, res, next) => {
  const { userId, email, fullName } = req.query;

  //Generate Token
  const verificationToken = createVerificationToken(3).toUpperCase();

  let user;

  if (userId) {
    user = await User.findByIdAndUpdate(
      userId,
      { token: verificationToken },
      { new: true }
    );

    if (!user) return next(new AppError("User not found", 404));
  } else if (email) {
    user = new User({ email, fullName });
  } else {
    return next(new AppError("Invalid request", 400));
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for SSL, false for TLS
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });

  const mailOptions = {
    from: {
      name: "MatriCare",
      address: process.env.ZOHO_USER,
    },
    to: user.email,
    subject: "Welcome to MatriCare",
    // html template
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MatriCare Email Verification</title>
    <style>
      body {
        font-family: Lucida Sans, sans-serif;
        background-color: #f9f9fb;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 40px;
        text-align: center;
      }
      .email-header {
        font-size: 26px;
        color: #333;
      }
      .email-header span,
      .verification-token {
        font-weight: bold;
        color: #e07e7b;
      }
      .email-icon {
        margin: 20px 0;
      }
      .email-icon img {
        width: 80px;
      }
      .verification-message {
        font-size: 18px;
        color: #666;
        margin-bottom: 20px;
      }
      .verification-message span {
        color: #e07e7b;
        font-weight: bold;
      }
      .btn {
        display: inline-block;
        padding: 15px 30px;
        background-color: #9a6cb4;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        margin-bottom: 30px;
        font-size: 16px;
      }
      .btn:hover {
        background-color: #e39fa9;
        color: #ffffff;
      }
      .email-footer {
        font-size: 12px;
        color: #999;
        margin-top: 20px;
      }
      .email-footer a {
        color: #e07e7b;
        text-decoration: none;
      }
      .matricare-logo {
        width: 100px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/matricare-63671.appspot.com/o/LOGO.png?alt=media&token=56beaa9e-c329-4ab2-a135-447b8016d278"
        alt="MatriCare Logo"
        class="matricare-logo"
      />
      <h1 class="email-header">Welcome to <span>MatriCare</span>,</h1>

      <p class="verification-message">
        Hi <span>${user.fullName}</span>,<br /><br />
        We're excited to have you as part of the MatriCare family, a community
        that supports you throughout your pregnancy journey.<br /><br />
        Please enter the following code for verification:
      </p>

      <h1><span class="verification-token">${verificationToken}</span></h1>

      <p class="email-footer">
        If you didn’t create a MatriCare account, you can safely ignore this
        email. For any questions, visit our
        <a href="[Support Link]">Support Center</a>.
      </p>
    </div>
  </body>
</html>`,
  };
  transporter.sendMail(mailOptions, () => {
    return res.status(200).json({
      message: "Email sent successfully",
      verificationToken: verificationToken,
    });
  });
});

// Verify Email via Token
const verify_email = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  const user = await User.findOne({ token: token });

  if (!user) {
    return next(new AppError("Invalid verification code", 400));
  }

  const jwtToken = jwt.sign({ user: user }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  return res
    .status(200)
    .json({ message: "Email Successfully Verified", user, jwtToken });
});

module.exports = {
  verification_mail,
  verify_email,
};
