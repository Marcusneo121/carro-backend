import { schema } from '@ioc:Adonis/Core/Validator'
import User from "App/Models/User";
import Argon2 from "phc-argon2";


export default class AuthController {
    public async login({ auth, response, request }) {

        const newAuthSchema = schema.create({
            username: schema.string(),
            password: schema.string(),
        })

        const payload = await request.validate({ schema: newAuthSchema })
        const username = payload.username
        const password = payload.password;
        const email = payload.email;

        const profile = await User.findBy("username", username)

        if (!profile) {
            return response.status(404).json({
                "status": "error",
                "message": "User not found",
            })
        } else {

            const passwordHashingVerify = await Argon2.verify(profile.password, password);
            // if (profile.password == payload["password"]) {
            if (passwordHashingVerify) {

                const token = await auth.use('api').generate(profile, {
                    expiresIn: '30 mins'
                })

                return response.status(200).json({
                    "data": profile,
                    "token": token,
                    "message": "Login Succesfully"
                })
            } else {
                return response.status(404).json({
                    "status": "error",
                    "message": "Password is incorrect",
                })
            }
        }
    }

    public async register({ auth, response, request }) {
        const newProfileSchema = schema.create({
            username: schema.string(),
            first_name: schema.string(),
            last_name: schema.string(),
            age: schema.number(),
            email: schema.string(),
            password: schema.string(),
            date_of_birth: schema.date(),
            profile_image: schema.string.optional(),
        })

        const payload = await request.validate({ schema: newProfileSchema })

        //No need to hash already the hashing already enabled in the User model when we "node ace make:auth"
        // const hashedPassword = await Argon2.hash(payload.password)
        // payload.password = hashedPassword;

        await User.create(payload);

        return {
            "data": payload,
            "message": "Account registered succesfully"
        }
    }

    public async logout({ auth, response }) {
        await auth.use('api').revoke()
        return response.status(200).json({
            "revoked": true,
            "message": "Logout Succesfully"
        })
    }
}
