import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abdulmuntakim44@gmail.com",
    pass: "jrtcgvkknrdyrogt",
  },
});

export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: "abdulmuntakim44@gmail.com",
    to,
    subject,
    text,
  });
};