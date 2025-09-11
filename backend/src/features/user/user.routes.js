import express from 'express';
import jwt from 'jsonwebtoken';
import userController from './user.controller.js';
import { userModel } from './user.repository.js';

const userRouter = express.Router();
const UserController = new userController();

userRouter.post('/signup', (req, res, next) => {
    UserController.signUp(req, res, next);
});

userRouter.post('/signin', (req, res, next) => {
    UserController.signIn(req, res, next);
});

// ✅ Email Verification Route
userRouter.get('/verify/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET); // Match the secret used in signUp
        const user = await userModel.findOne({ email });

        if (!user) return res.status(400).send('User not found');
        if (user.verified) return res.status(200).send('Already verified');

        user.verified = true;
        await user.save();

        // Optional: Redirect to your frontend or card dashboard
        return res.status(200).send('✅ Email verified! You can now access the card feature.');
    } catch (err) {
        console.error(err);
        return res.status(400).send('❌ Invalid or expired token');
    }
});

userRouter.get('/test', (req, res) => {
  res.send("Backend is connected");
});


export default userRouter;