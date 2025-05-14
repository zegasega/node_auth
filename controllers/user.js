const { where } = require("sequelize");
const { User, PasswordReset } = require("../db/config");
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require("../middleware/auth");
const { sendResetCodeEmail } = require("../services/email");
const moment = require('moment');




const createNewPassword = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        const resetRequest = await PasswordReset.findOne({
            where: { userId: user.id, resetToken: verificationCode }
        });

        if (!resetRequest) {
            return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        const isExpired = moment().isAfter(moment(resetRequest.expiresAt));

        if (isExpired) {
            return res.status(400).json({ message: "Reset code has expired." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        await resetRequest.destroy();

        return res.status(200).json({ message: "Password successfully updated." });

    } catch (error) {
        console.error("Error in createNewPassword:", error);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};


function generateFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(400).json({ message: "Email not found." });
    }

    const verificationCode = generateFourDigitNumber();

    const expiresAt = moment().add(10, 'minutes').toDate(); // 10 dakika geçerlilik süresi

    await PasswordReset.create({
      userId: existingUser.id,
      resetToken: verificationCode.toString(),
      expiresAt: expiresAt
    });

    await sendResetCodeEmail(email, verificationCode);

    return res.status(200).json({ message: "Reset code sent to your email." });

  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
};



const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const accessToken = generateAccessToken(user)

    const refreshToken = generateRefreshToken(user)

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'], // hassas verileri dışarda bırak
    });

    return res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    register,
    login,
    getAllUsers,
    resetPassword,
    createNewPassword,
}