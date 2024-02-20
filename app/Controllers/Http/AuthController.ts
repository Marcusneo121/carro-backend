import { schema } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile';
import User from "App/Models/User";
import Argon2 from "phc-argon2";

import Env from '@ioc:Adonis/Core/Env'
import path from 'path';
import nodemailer from "nodemailer"
import Redis from '@ioc:Adonis/Addons/Redis'
// import hbs from 'nodemailer-express-handlebars'
const hbs = require('nodemailer-express-handlebars');

const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: Env.get('EMAIL_USER'),
        pass: Env.get('EMAIL_PASSWORD')
    },
    logger: true
})

const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('./resources/views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./resources/views'),
    extName: ".handlebars",
}
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
            const profile = await Profile.findBy('user_id', user?.id)

            if (!profile) {
                return response.status(404).json({
                    "status": "error",
                    "message": "User not found",
                })
            } else {
                if (profile.is_email_verified == false) {
                    return response.status(404).json({
                        "status": "error",
                        "message": "Account is not verified. Please go to your email to verify your account.",
                    })
                } else {
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
        }
    }

    //public async register({ auth, response, request }) {
    public async register({ response, request }) {
        try {
            const userSchema = schema.create({
                isAdmin: schema.boolean(),
                username: schema.string(),
                email: schema.string(),
                password: schema.string(),
                first_name: schema.string(),
                last_name: schema.string(),
                address1: schema.string(),
                address2: schema.string.optional(),
                address3: schema.string.optional(),
                poscode: schema.string(),
                city: schema.string(),
                state: schema.string(),
                age: schema.number(),
                phone_number: schema.string(),
                date_of_birth: schema.date(),
                profile_image: schema.string.optional(),
            })

            const payloadData = await request.validate({ schema: userSchema })

            //No need to hash already the hashing already enabled in the User model when we "node ace make:auth"
            // const hashedPassword = await Argon2.hash(payloadData.password)
            // payloadData.password = hashedPassword;

            const userFindEmail = await User.findBy("email", payloadData.email)

            if (userFindEmail) {
                return response.status(400).json({
                    "status": "error",
                    "message": "Email already registered. Please login with this email.",
                })
            } else {
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
                    "poscode": payloadData.poscode,
                    "city": payloadData.city,
                    "state": payloadData.state,
                    "age": payloadData.age,
                    "phone_number": payloadData.phone_number,
                    "date_of_birth": payloadData.date_of_birth,
                    "profile_image": payloadData.profile_image === null ? null : payloadData.profile_image
                }
                const profile = await Profile.create(profileData);

                emailTransporter.use('compile', hbs(handlebarOptions));

                const email = {
                    from: {
                        name: "Carro Car Sharing",
                        address: Env.get('EMAIL_USER')
                    },
                    to: user.email,
                    subject: "Carro Email Address Verification",
                    template: 'email_verification',
                    context: {
                        email: user.email,
                    }
                };

                await Redis.sadd('usernames', user.username);

                await emailTransporter.sendMail(email).then(() => {
                    return response.status(200).json({
                        "data": {
                            user,
                            profile
                        },
                        "email-verification": "Email verification sent",
                        "status": "ok",
                        "message": "Account registered succesfully"
                    })
                }).catch(error => {
                    console.error(error);
                });
            }
        } catch (error) {
            return response.status(404).json({
                "status": "error",
                "message": "Account register failed. Please try again."
            })
        }
    }

    public async logout({ auth, response }) {
        await auth.use('api').revoke()
        return response.status(200).json({
            "revoked": true,
            "message": "Logout Succesfully"
        })
    }

    public async checkUsername({ response, request }) {
        const usernameSchema = schema.create({
            username: schema.string(),
        })

        const payload = await request.validate({ schema: usernameSchema })
        const username = payload.username

        const redisCheck = await Redis.sismember('usernames', username)

        if (redisCheck === 0) {
            return response.status(200).json({
                "status": "ok",
                "message": "Username not registered yet. Able to register.",
            })
        } else {
            return response.status(200).json({
                "status": "error",
                "message": "Username already taken. Please try other username.",
            })
        }

        // const user = await User.findBy("username", username)
        // if (user) {
        //     return response.status(200).json({
        //         "status": "error",
        //         "message": "Username already taken. Please try other username.",
        //     })
        // } else {
        //     return response.status(200).json({
        //         "status": "ok",
        //         "message": "Username not registered yet. Able to register.",
        //     })
        // }
    }

    public async checkEmail({ response, request }) {
        const emailSchema = schema.create({
            email: schema.string(),
        })

        const payload = await request.validate({ schema: emailSchema })
        const email = payload.email

        const user = await User.findBy("email", email)

        if (user) {
            return response.status(200).json({
                "status": "error",
                "message": "Email already registered. Please login with this email.",
            })
        } else {
            return response.status(200).json({
                "status": "ok",
                "message": "Email not registered yet. Able to register.",
            })
        }
    }

    public async sendEmail({ response, params }) {
        emailTransporter.use('compile', hbs(handlebarOptions));

        const email = {
            from: {
                name: "Carro Car Sharing",
                address: Env.get('EMAIL_USER')
            },
            to: params.email,
            subject: "Carro Email Address Verification",
            template: 'email_verification',
            context: {
                email: params.email,
            }
        };

        await emailTransporter.sendMail(email).then(() => {
            return response.status(200).json({
                "status": "ok",
                "message": "Email sent",
            });
        }).catch(error => {
            console.error(error);
        });
    }

    public async verifyEmail({ view, params }) {

        try {
            const findUser = await User.findBy('email', params.email);
            if (!findUser) {
                return view.render('email_verify_fail')
                // return response.status(404).json({
                //     "status": "error",
                //     "message": "Error",
                // })
            }

            const findProfile = await Profile.findBy('user_id', findUser.id);

            if (!findProfile) {
                return view.render('email_verify_fail')
                // return response.status(404).json({
                //     "status": "error",
                //     "message": "User not found",
                // })
            } else {
                await Profile.query().where('user_id', findUser.id).update({ "is_email_verified": true });
                return view.render('email_verify_success')
                // return response.status(200).json({
                //     "data": payload,
                //     "message": "Car updated",
                // })
            }
        } catch (error) {
            return view.render('email_verify_error')
        }
    }
}
