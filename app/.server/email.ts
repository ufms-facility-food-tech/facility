import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("email successfully connected");
  }
});

export { transporter };
