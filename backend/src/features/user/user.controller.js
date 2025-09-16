import jwt from 'jsonwebtoken';
import userRepo from './user.repository.js';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../../utils/sendEmail.js';
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    googleSignIn = async (req, res) => {
    try {
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const email = payload.email;
      const name = payload.name;

      // see if user exists
      let user = await this.userRepo.getUserByEmail(email);
      if (!user) {
        // create a new user without password
        user = await this.userRepo.signUp({
          name,
          email,
          password: "google_oauth_dummy", // you can leave null but schema requires password
          verified: true, // skip email verification
        });
        // get actual user doc
        user = await this.userRepo.getUserByEmail(email);
      }

      // issue JWT for your app
      const jwtToken = jwt.sign(
        { email: user.email, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      // strip password
      const { password, ...userWithoutPassword } = user._doc;

      res.json({ token: jwtToken, user: userWithoutPassword });
    } catch (err) {
      console.error("Google Sign-In error:", err);
      res.status(401).json({ message: "Invalid Google token" });
    }
  };
}