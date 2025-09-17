import { logger } from "@/shared/tools/logger";
import { AppError } from "@/shared/utils/errorHandler/errors";
import nodemailer from "nodemailer";

export const sendNoreply = async (
  subject: string,
  html: string,
  to: string,
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NOREPLY_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.NOREPLY_USERNAME,
      pass: process.env.NOREPLY_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NOREPLY_USERNAME,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent: ${info.response}`);
  } catch (error) {
    logger.error("Error sending verification email:", error);
    throw new AppError("Failed to send verification email", 500);
  }
};
