// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile';


export default class ProfilesController {

    public async login({ response, request }) {

        const { username, password } = request.only(["username", "password"]);
        const profile = await Profile.findBy("username", username)

        if (!profile) {
            return response.status(404).json({
                "status": "error",
                "message": "User not found",
            })
        } else {
            if (profile.password == password) {
                return {
                    "data": profile,
                    "message": "Login Succesfully"
                }
            } else {
                return response.status(404).json({
                    "status": "error",
                    "message": "Password is incorrect",
                })
            }

        }
    }

    public async register({ response, request }) {

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

        await Profile.create(payload);

        return {
            "data": request.body(),
            "message": "Account registered succesfully"
        }
    }
}
