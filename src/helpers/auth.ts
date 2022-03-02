import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

export const emailVerification: any = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const token = await jwt.sign(
    { name, email, password, role },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "10m" }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Account activation link`,
    html: `
        <h1>Please use the following link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/activation/${token}</p>
        <hr/>
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
  };
  sgMail.send(emailData);
};
