// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Car from 'App/Models/Car'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class CarsController {

    public async getCars({ auth, response, request }) {
        await auth.use('api').authenticate()
        // const tokenUserData = auth.use('api').user

        const car = await Car.all();
        return response.status(200).json({
            data: car,
            message: "Car list retrieved successfully"
        })
    }

    public async addCar({ auth, response, request }) {
        await auth.use('api').authenticate()
        const tokenUserData = auth.use('api').user

        const carSchema = schema.create({
            car_name: schema.string(),
            color: schema.string(),
            engine_capacity: schema.string(),
            year_made: schema.string(),
            seat: schema.string(),
            location: schema.string(),
            car_main_pic: schema.string(),
            car_image_one: schema.string(),
            car_image_two: schema.string(),
            car_image_three: schema.string(),
            car_image_four: schema.string(),
            available_from_date: schema.string(),
            available_to_date: schema.string(),
        })

        const payload = await request.validate({ schema: carSchema })

        const carData = {
            "user_id": tokenUserData.id,
            "car_name": payload.car_name,
            "color": payload.color,
            "engine_capacity": payload.engine_capacity,
            "year_made": payload.year_made,
            "seat": payload.seat,
            "location": payload.location,
            "car_main_pic": payload.car_main_pic,
            "car_image_one": payload.car_image_one,
            "car_image_two": payload.car_image_two,
            "car_image_three": payload.car_image_three,
            "car_image_four": payload.car_image_four,
            "available_from_date": payload.available_from_date,
            "available_to_date": payload.available_to_date,
        }

        const car = await Car.create(carData)


        return response.status(201).json({
            data: {
                car
            },
            message: "Car added successfully"
        })
    }

    public async updateCar({ auth, response, request, params }) {

        await auth.use('api').authenticate()

        const findCar = await Car.findBy('id', params.id);
        if (!findCar) {
            return response.status(404).json({
                "status": "error",
                "message": "Car not found",
            })
        }

        const tokenUserData = auth.use('api').user
        const user = await User.findBy("id", tokenUserData['id'])

        if (!user) {
            return response.status(404).json({
                "status": "error",
                "message": "User not found",
            })
        } else {
            const carSchema = schema.create({
                // car_id: schema.bigint(),
                car_name: schema.string(),
                color: schema.string(),
                engine_capacity: schema.string(),
                year_made: schema.string(),
                seat: schema.string(),
                location: schema.string(),
                car_main_pic: schema.string(),
                car_image_one: schema.string(),
                car_image_two: schema.string(),
                car_image_three: schema.string(),
                car_image_four: schema.string(),
                available_from_date: schema.string(),
                available_to_date: schema.string(),
            })

            const payload = await request.validate({ schema: carSchema })
            await Car.query().where('id', params.id).update(payload);

            return response.status(200).json({
                "data": payload,
                "message": "Car updated",
            })
        }
    }
}
