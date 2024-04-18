// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Car from 'App/Models/Car'
//import Role from 'App/Models/Role'
import User from 'App/Models/User'
import { Storage } from '@google-cloud/storage'
// import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
// import fs from 'fs/promises';
// import path from 'path';

const storage = new Storage({
  projectId: Env.get('GCP_STORAGE_BUCKET'),
  // keyFilename: "carro-backend-storage.json",
  // keyFilename, this is required if you run locally, not required when you deploy Cloud run with service keys
})
const bucket = storage.bucket(Env.get('GCP_STORAGE_BUCKET'))

const carImageUploader = async (image: any, payload: any, carSide: String, username: String) => {
  try {
    //1. Move image to temp file - Only work with Deployment that have File System, Clour Run dont have
    // await image.move(Application.tmpPath('uploads'))
    //2. Create image name
    const imageName =
      `${username.toString()}` +
      '_' +
      `${payload.car_name.toString()}` +
      '_' +
      `${payload.year_made.toString()}` +
      '_' +
      `${payload.color.toString()}` +
      '_' +
      new Date().getUTCMonth().toString() +
      new Date().getDate().toString() +
      new Date().getFullYear().toString() +
      '_' +
      new Date().getTime().toString() +
      `_${carSide.toString()}` +
      `.${image.extname}`
    //3. Google Cloud Storage (GCS) Path
    const storagepath = `${username.toString()}/${imageName.toString()}`
    //4. Upload Image to GCS
    // const result = await bucket.upload(`/tmp/uploads/${image.data.clientName}`, {
    const result = await bucket.upload(image.tmpPath, {
      destination: storagepath,
      public: true,
    })
    //5. Return Public URL
    return result[0].metadata.mediaLink
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

export default class CarsController {
  // public async getCars({ auth, response, request }) {
  public async getCars({ auth, response }) {
    await auth.use('api').authenticate()
    const tokenUserData = auth.use('api').user
    // const car = await Car.all();
    // const car1 = await Database.rawQuery("select * from cars where available_from_date > NOW()");
    // const car = await Database.from('cars').where('available_to_date', '>', DateTime.local().toSQLDate()).andWhere('available_from_date', '<', DateTime.local().toSQLDate()).orderBy("id", "asc")
    const car = await Database.from('cars')
      .where('available_to_date', '>', DateTime.local().toSQLDate())
      .where('cars.user_id', '!=', tokenUserData.id)
      .orderBy('id', 'asc')

    return response.status(200).json({
      data: car,
      status: 'ok',
      message: 'Car list retrieved successfully',
    })
  }

  public async getCarsByID({ auth, response, params }) {
    await auth.use('api').authenticate()
    // const tokenUserData = auth.use('api').user

    const findCar = await Car.findBy('id', params.id)
    if (!findCar) {
      return response.status(404).json({
        status: 'error',
        message: 'Car not found',
      })
    } else {
      const carOriginal = findCar.$original

      const carDetails = {
        id: carOriginal.id,
        user_id: carOriginal.userId,
        car_name: carOriginal.carName,
        color: carOriginal.color,
        engine_capacity: carOriginal.engineCapacity,
        year_made: carOriginal.yearMade,
        seat: carOriginal.seat,
        location: carOriginal.location,
        car_main_pic: carOriginal.carMainPic,
        car_image_one: carOriginal.carImageOne,
        car_image_two: carOriginal.carImageTwo,
        car_image_three: carOriginal.carImageThree,
        car_image_four: carOriginal.carImageFour,
        car_plate: carOriginal.carPlate,
        price: carOriginal.price,
        available_to_date: carOriginal.availableToDate,
        available_from_date: carOriginal.availableFromDate,
        created_at: carOriginal.createAt,
        updated_at: carOriginal.updateAt,
        is_electric: carOriginal.is_electric,
      }

      return response.status(200).json({
        data: carDetails,
        status: 'ok',
        message: 'Car found',
      })
    }
  }

  public async addCar({ auth, response, request }) {
    try {
      await auth.use('api').authenticate()
      const tokenUserData = auth.use('api').user

      const carSchema = schema.create({
        car_name: schema.string(),
        color: schema.string(),
        engine_capacity: schema.string(),
        year_made: schema.string(),
        seat: schema.string(),
        location: schema.string(),
        car_main_pic: schema.file({
          size: '10mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }),
        car_image_one: schema.file({
          size: '10mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }),
        car_image_two: schema.file({
          size: '10mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }),
        car_image_three: schema.file({
          size: '10mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }),
        car_image_four: schema.file({
          size: '10mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }),
        car_plate: schema.string(),
        price: schema.string(),
        available_from_date: schema.string(),
        available_to_date: schema.string(),
        is_electric: schema.boolean(),
      })

      const payload = await request.validate({
        schema: carSchema,
        messages: {
          car_main_pic: 'Car Main Image is required',
          car_image_one: 'Car Front View Image is required',
          car_image_two: 'Car Rear View Image is required',
          car_image_three: 'Car Left View Image is required',
          car_image_four: 'Car Right View Image is required',
        },
      })

      const carMainViewImageURL = await carImageUploader(
        payload.car_main_pic,
        payload,
        'mainview',
        tokenUserData.username
      )
      const carFrontViewImageURL = await carImageUploader(
        payload.car_image_one,
        payload,
        'frontview',
        tokenUserData.username
      )
      const carBackViewImageURL = await carImageUploader(
        payload.car_image_two,
        payload,
        'backview',
        tokenUserData.username
      )
      const carLeftViewImageURL = await carImageUploader(
        payload.car_image_three,
        payload,
        'lefttview',
        tokenUserData.username
      )
      const carRightViewImageURL = await carImageUploader(
        payload.car_image_four,
        payload,
        'rightview',
        tokenUserData.username
      )

      const carData = {
        user_id: tokenUserData.id,
        car_name: payload.car_name,
        color: payload.color,
        engine_capacity: payload.engine_capacity,
        year_made: payload.year_made,
        seat: payload.seat,
        location: payload.location,
        car_main_pic: carMainViewImageURL,
        car_image_one: carFrontViewImageURL,
        car_image_two: carBackViewImageURL,
        car_image_three: carLeftViewImageURL,
        car_image_four: carRightViewImageURL,
        car_plate: payload.car_plate,
        price: payload.price,
        available_from_date: payload.available_from_date,
        available_to_date: payload.available_to_date,
        is_electric: payload.is_electric,
      }

      const car = await Car.create(carData)

      if (!car) {
        return response.status(404).json({
          status: 'error',
          message: 'Something went wrong adding car. Please try again.',
        })
      }
      // //remove all temp image in uploads folder
      // for (const file of await fs.readdir('tmp/uploads')) {
      //     await fs.unlink(path.join("tmp/uploads", file));
      // }

      return response.status(201).json({
        data: {
          car,
        },
        status: 'ok',
        message: 'Car added successfully',
      })
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  public async updateCar({ auth, response, request, params }) {
    await auth.use('api').authenticate()

    const findCar = await Car.findBy('id', params.id)
    if (!findCar) {
      return response.status(404).json({
        status: 'error',
        message: 'Car not found',
      })
    }

    const tokenUserData = auth.use('api').user
    const user = await User.findBy('id', tokenUserData['id'])

    if (!user) {
      return response.status(404).json({
        status: 'error',
        message: 'User not found',
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
      await Car.query().where('id', params.id).update(payload)

      return response.status(200).json({
        data: payload,
        message: 'Car updated',
      })
    }
  }
}
