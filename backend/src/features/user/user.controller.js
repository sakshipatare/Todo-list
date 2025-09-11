import jwt from 'jsonwebtoken';
import userRepo from './user.repository.js';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../../utils/sendEmail.js';

export default class userController {
    constructor(){
        this.userRepo = new userRepo();
    }

    async signUp(req, res, next){
        console.log(req.body);
        const {name, email, password} = req.body;

        try{
            const existingUser = await this.userRepo.getUserByEmail(email);
            if(existingUser){
                return res.status(400).json({message: "Email already exists"});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = ({name, email, password: hashedPassword});

            console.log("User to be saved: ", user); // ✅ Safe now
            await this.userRepo.signUp(user);

            // Generate a verification token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Send email
            await sendVerificationEmail(email, token);

            return res.status(201).json({message: "Verification email sent!"});
        }catch(err){
            console.log("Controller signUp err: ", err );
            return res.status(500).json({message: "Error in signing up user"});
        }
    }

    async signIn(req, res, next){
        try{
            console.log("SignIn Request Body: ", req.body);
            const { email, password } = req.body;
            const user = await this.userRepo.signIn(email);

            console.log("User from DB: ", user); // ✅ Safe now
            if (!user) {
                return res.status(401).json({message: 'Invalid email or password.'});
            }

            console.log("Stored Pass: ", user.password); // ✅ Safe now

            if (!user.password) {
                return res.status(401).json({message: 'Invalid email or password.'});
            }


            // ✅ Add this check here
            if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email before signing in.' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if(isValidPassword){
                const token = jwt.sign(
                    {email: user.email, id: user.id},
                    process.env.JWT_SECRET,
                    {expiresIn: '30d',}
                );
                // Remove password from user object before sending
                const { password, ...userWithoutPassword } = user._doc;

                return res.status(200).json({message: 'User logged in successfully', token, user: userWithoutPassword, });
            }else{
                return res.status(401).json({message: 'Invalid email or password..'});
            }
        }catch(err){
            console.log("Controller signIn err:", err);
            return res.status(500).json({message: 'Error signing in user'});
        }
    }
}