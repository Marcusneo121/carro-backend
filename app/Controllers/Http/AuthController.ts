import { schema } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile';
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
        //const email = payload.email;

        const user = await User.findBy("username", username)


        if (!user) {
            return response.status(404).json({
                "status": "error",
                "message": "User not found",
            })
        } else {
            const profile = await Profile.findBy('id', user?.id)
            const passwordHashingVerify = await Argon2.verify(user.password, password);
            // if (profile.password == payload["password"]) {
            if (passwordHashingVerify) {

                const token = await auth.use('api').generate(user
                    , { expiresIn: '7 days' }
                )

                return response.status(200).json({
                    "data": {
                        user,
                        profile,
                    },
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

    //public async register({ auth, response, request }) {
    public async register({ request }) {
        const userSchema = schema.create({
            isAdmin: schema.boolean(),
            username: schema.string(),
            email: schema.string(),
            password: schema.string(),
            first_name: schema.string(),
            last_name: schema.string(),
            address1: schema.string(),
            address2: schema.string(),
            address3: schema.string(),
            age: schema.number(),
            phone_number: schema.string(),
            date_of_birth: schema.date(),
            profile_image: schema.string.optional(),
        })

        const payloadData = await request.validate({ schema: userSchema })

        //No need to hash already the hashing already enabled in the User model when we "node ace make:auth"
        // const hashedPassword = await Argon2.hash(payloadData.password)
        // payloadData.password = hashedPassword;

        const userData = {
            "role_id": payloadData.isAdmin === true ? 1 : 0,
            "username": payloadData.username,
            "email": payloadData.email,
            "password": payloadData.password,
        }

        const user = await User.create(userData);
        const profileData = {
            "user_id": user.id,
            "first_name": payloadData.first_name,
            "last_name": payloadData.last_name,
            "address1": payloadData.address1,
            "address2": payloadData.address2,
            "address3": payloadData.address3,
            "age": payloadData.age,
            "phone_number": payloadData.phone_number,
            "date_of_birth": payloadData.date_of_birth,
            "profile_image": payloadData.profile_image === null ? null : payloadData.profile_image
        }
        const profile = await Profile.create(profileData);

        return {
            "data": {
                user,
                profile
            },
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
