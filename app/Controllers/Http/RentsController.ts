// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Bargain from 'App/Models/Bargain'
import Car from 'App/Models/Car'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import RentalTransaction from 'App/Models/RentalTransaction'

function getNumberOfDaysBetweenDates(startDate: string, endDate: string): number | null {
  try {
    const startDateConverted: DateTime = DateTime.fromSQL(startDate)
    const endDateConverted: DateTime = DateTime.fromSQL(endDate)
    // Convert both dates to milliseconds
    const startMilliseconds = startDateConverted.toMillis()
    const endMilliseconds = endDateConverted.toMillis()

    // Calculate the difference in milliseconds
    const millisecondsPerDay = 1000 * 60 * 60 * 24
    const differenceMilliseconds = endMilliseconds - startMilliseconds

    // Convert the difference to days
    const numberOfDays = Math.floor(differenceMilliseconds / millisecondsPerDay)

    return numberOfDays
  } catch (error) {
    return null
  }
}

export default class RentsController {
  public async getBargains({ auth, response }) {
    try {
      await auth.use('api').authenticate()
      // const tokenUserData = auth.use('api').user

      const bargainsData = await Bargain.all()

      return response.status(200).json({
        data: {
          bargainsData,
        },
        message: 'Bargain all data successfully',
      })
    } catch (error) {}
  }

  public async getBargain({ auth, response, params }) {
    try {
      if (!params.user_type) {
        return response.status(404).json({
          status: 'error',
          message: `User type needed in order to get data.`,
        })
      }

      await auth.use('api').authenticate()
      const tokenUserData = auth.use('api').user

      const bargainsColumns = ['bargains.id as ori_bargain_id', 'bargains.*'] // Explicitly select all columns from bargains table and alias the id column
      const carsColumns = ['cars.id as ori_car_id', 'cars.*']
      const bargainStatusColumns = [
        'bargain_status.id as ori_bargain_status_id',
        'bargain_status.name as ori_bargain_name',
        'bargain_status.*',
      ]

      if (params.user_type === 'host') {
        // SELECT bargains.*, cars.*
        // FROM bargains
        // JOIN cars ON bargains.car_id = cars.id
        // WHERE bargains.host_id = 2  //the host ID from token
        // ORDER BY bargains.id ASC;

        // const bargainDataByHost = await Database.from('bargains')
        //     .innerJoin('cars', 'bargains.car_id', 'cars.id')
        //     .innerJoin("bargain_status", "bargains.bargain_status_id", "bargain_status.id")
        //     .where("bargains.host_id", "=", tokenUserData.id)
        //     .orderBy('bargains.id', 'asc')

        const bargainDataByHost = await Database.from('bargains')
          .select(...bargainsColumns, ...carsColumns, ...bargainStatusColumns)
          .innerJoin('cars', 'bargains.car_id', 'cars.id')
          .innerJoin('bargain_status', 'bargains.bargain_status_id', 'bargain_status.id')
          .where('bargains.host_id', '=', tokenUserData.id)
          .orderBy('bargains.id', 'asc')

        return response.status(200).json({
          data: bargainDataByHost,
          status: 'ok',
          message: 'Get bargain successfully',
        })
      } else if (params.user_type === 'guest') {
        // const bargainDataByGuest = await Database.from('bargains')
        //     .innerJoin('cars', 'bargains.car_id', 'cars.id')
        //     .innerJoin("bargain_status", "bargains.bargain_status_id", "bargain_status.id")
        //     .where("bargains.renter_id", "=", tokenUserData.id)
        //     .orderBy('bargains.id', 'asc')

        const bargainDataByGuest = await Database.from('bargains')
          .select(...bargainsColumns, ...carsColumns, ...bargainStatusColumns)
          .innerJoin('cars', 'bargains.car_id', 'cars.id')
          .innerJoin('bargain_status', 'bargains.bargain_status_id', 'bargain_status.id')
          .where('bargains.renter_id', '=', tokenUserData.id)
          .orderBy('bargains.id', 'asc')

        return response.status(200).json({
          data: bargainDataByGuest,
          status: 'ok',
          message: 'Get bargain successfully',
        })
      } else {
        return response.status(404).json({
          status: 'error',
          message: `Platform do not recognize ${params.user_type} user type. Please try again`,
        })
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  //For web required this
  public async getBargainByID({ auth, response, params }) {
    try {
      if (!params.user_type) {
        return response.status(404).json({
          status: 'error',
          message: `User type needed in order to get data.`,
        })
      }

      await auth.use('api').authenticate()
      const tokenUserData = auth.use('api').user

      const bargainsColumns = ['bargains.id as ori_bargain_id', 'bargains.*'] // Explicitly select all columns from bargains table and alias the id column
      const carsColumns = ['cars.id as ori_car_id', 'cars.*']
      const bargainStatusColumns = [
        'bargain_status.id as ori_bargain_status_id',
        'bargain_status.name as ori_bargain_name',
        'bargain_status.*',
      ]

      if (params.user_type === 'host') {
        const bargainDataByHost = await Database.from('bargains')
          .select(...bargainsColumns, ...carsColumns, ...bargainStatusColumns)
          .innerJoin('cars', 'bargains.car_id', 'cars.id')
          .innerJoin('bargain_status', 'bargains.bargain_status_id', 'bargain_status.id')
          .where('bargains.host_id', '=', tokenUserData.id)
          .where('bargains.id', '=', params.id)
          .orderBy('bargains.id', 'asc')

        if (bargainDataByHost.length === 0) {
          return response.status(404).json({
            status: 'error',
            message: 'Host Booking not found.',
          })
        } else {
          return response.status(200).json({
            data: bargainDataByHost[0],
            status: 'ok',
            message: 'Get host booking successfully',
          })
        }
      } else if (params.user_type === 'guest') {
        const bargainDataByGuest = await Database.from('bargains')
          .select(...bargainsColumns, ...carsColumns, ...bargainStatusColumns)
          .innerJoin('cars', 'bargains.car_id', 'cars.id')
          .innerJoin('bargain_status', 'bargains.bargain_status_id', 'bargain_status.id')
          .where('bargains.renter_id', '=', tokenUserData.id)
          .where('bargains.id', '=', params.id)
          .orderBy('bargains.id', 'asc')

        if (bargainDataByGuest.length === 0) {
          return response.status(404).json({
            status: 'error',
            message: 'Guest Booking not found.',
          })
        } else {
          return response.status(200).json({
            data: bargainDataByGuest[0],
            status: 'ok',
            message: 'Get guest booking successfully',
          })
        }
      } else {
        return response.status(404).json({
          status: 'error',
          message: `Platform do not recognize ${params.user_type} user type. Please try again`,
        })
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  public async bargain({ auth, response, request }) {
    try {
      await auth.use('api').authenticate()
      //1. Get who is the one that tryna rent/bargain the car
      const tokenUserData = auth.use('api').user

      //2. Validate request
      const bargainSchema = schema.create({
        car_id: schema.number(),
        bargain_amount: schema.string(),
        rent_from_date: schema.string(),
        rent_to_date: schema.string(),
      })

      const payload = await request.validate({ schema: bargainSchema })

      const carData = await Car.findBy('id', payload.car_id)

      if (!carData) {
        return response.status(404).json({
          status: 'error',
          message: 'Something went wrong, please try again',
        })
      } else {
        const numberOfDays: number | null = getNumberOfDaysBetweenDates(
          payload.rent_from_date,
          payload.rent_to_date
        )

        if (numberOfDays === null) {
          return response.status(404).json({
            status: 'error',
            message: 'Something went wrong, please try again',
          })
        }

        const bargainData = {
          renter_id: tokenUserData.id,
          host_id: carData.userId,
          car_id: carData.id,
          bargain_amount: payload.bargain_amount,
          last_bargain_user: tokenUserData.id, //when first time bargain, always is the Guest ID
          last_bargain_amount: payload.bargain_amount, //when first time bargain, always is the Guest requested amount
          days_of_rental: numberOfDays + 1,
          bargain_status_id: 0, //0 = Pending, 1 = Bargaining, 2 = Accepted, 3 = Rejected.
          //when first rent, its always pending.
          //if host try to ask for a new price only then bargaining, this is just for the backend, not apply to business case
          rent_from_date: payload.rent_from_date,
          rent_to_date: payload.rent_to_date,
        }

        const bargainAlready = await Bargain.create(bargainData)

        if (!bargainAlready) {
          return response.status(404).json({
            status: 'error',
            message: 'Something went wrong adding car. Please try again.',
          })
        }

        return response.status(201).json({
          data: {
            bargainAlready,
          },
          status: 'ok',
          message: 'Booking successfully',
        })
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'Something went wrong renting the car. Please try again.',
      })
    }
  }

  public async hostBargainAcceptReject({ auth, response, request }) {
    try {
      await auth.use('api').authenticate()
      const tokenUserData = auth.use('api').user

      const hostBargainAcceptSchema = schema.create({
        action_type: schema.string(),
        bargain_id: schema.number(),
      })

      const payload = await request.validate({
        schema: hostBargainAcceptSchema,
      })

      if (payload.action_type !== 'accept' && payload.action_type !== 'reject') {
        return response.status(404).json({
          status: 'error',
          message: `Platform do not have ${payload.action_type} methods for host`,
        })
      }

      const findBargain = await Database.from('bargains')
        .innerJoin('cars', 'bargains.car_id', 'cars.id')
        .where('bargains.id', '=', payload.bargain_id)
        .orderBy('bargains.id', 'asc')

      if (findBargain.length !== 0) {
        const bargainData = findBargain[0]

        if (tokenUserData.id !== bargainData.host_id) {
          return response.status(404).json({
            status: 'error',
            message: 'User is not the host / owner of this car',
          })
        }

        if (payload.action_type === 'accept') {
          if (bargainData.last_bargain_user === tokenUserData.id) {
            return response.status(404).json({
              status: 'error',
              message: 'Host cannot accept own bargain price.',
            })
          } else {
            if (bargainData.bargain_status_id === 2 || bargainData.bargain_status_id === 4) {
              return response.status(404).json({
                status: 'error',
                message: 'Bargain unable to accept again. It was accepted',
              })
            }
            const acceptedTransaction = {
              car_id: bargainData.car_id,
              renter_id: bargainData.renter_id,
              bargain_id: bargainData.id,
              host_id: bargainData.host_id,
              price_agreed: bargainData.last_bargain_amount,
            }

            const rentalTransactions = await RentalTransaction.create(acceptedTransaction)

            if (!rentalTransactions) {
              return response.status(404).json({
                status: 'error',
                message: 'Something went wrong adding rental transaction',
              })
            }

            const toUpdateDataAccept = {
              bargain_status_id: 2,
              transaction_id: rentalTransactions.transaction_id,
            }
            const updatedBargain = await Bargain.query()
              .where('id', payload.bargain_id)
              .update(toUpdateDataAccept)

            return response.status(200).json({
              data: {
                rentalTransactions,
                updatedBargain,
              },
              message: 'Host accepted guest bargain.',
            })
          }
        } else if (payload.action_type === 'reject') {
          if (bargainData.last_bargain_user === tokenUserData.id) {
            return response.status(404).json({
              status: 'error',
              message: 'Host cannot reject own bargain price.',
            })
          } else {
            if (bargainData.bargain_status_id === 3 || bargainData.bargain_status_id === 5) {
              return response.status(404).json({
                status: 'error',
                message: 'Bargain unable to reject again. it was rejected',
              })
            }
            const toUpdateDataAccept = {
              bargain_status_id: 3,
            }
            await Bargain.query().where('id', payload.bargain_id).update(toUpdateDataAccept)

            return response.status(200).json({
              status: 'success',
              message: 'Host rejected guest bargain.',
            })
          }
        } else {
          return response.status(400).json({
            status: 'error',
            message: 'Platform do not accept other action except Reject & Accept',
          })
        }
      } else {
        return response.status(404).json({
          status: 'error',
          message: 'Could not find this rent request',
        })
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  public async guestBargainAcceptReject({ auth, response, request }) {
    try {
      await auth.use('api').authenticate()
      const tokenUserData = auth.use('api').user

      const guestBargainAcceptSchema = schema.create({
        action_type: schema.string(),
        bargain_id: schema.number(),
      })

      const payload = await request.validate({
        schema: guestBargainAcceptSchema,
      })

      if (payload.action_type !== 'accept' && payload.action_type !== 'reject') {
        return response.status(404).json({
          status: 'error',
          message: `Platform do not have ${payload.action_type} methods for guest`,
        })
      }

      const bargainsColumns = ['bargains.id as ori_bargain_id', 'bargains.*'] // Explicitly select all columns from bargains table and alias the id column
      const carsColumns = ['cars.id as ori_car_id', 'cars.*']
      const bargainStatusColumns = [
        'bargain_status.id as ori_bargain_status_id',
        'bargain_status.name as ori_bargain_name',
        'bargain_status.*',
      ]

      const findBargain = await Database.from('bargains')
        .select(...bargainsColumns, ...carsColumns, ...bargainStatusColumns)
        .innerJoin('cars', 'bargains.car_id', 'cars.id')
        .innerJoin('bargain_status', 'bargains.bargain_status_id', 'bargain_status.id')
        .where('bargains.id', '=', payload.bargain_id)
        .orderBy('bargains.id', 'asc')

      if (findBargain.length !== 0) {
        const bargainData = findBargain[0]
        if (tokenUserData.id !== bargainData.renter_id) {
          return response.status(404).json({
            status: 'error',
            message: 'User is not the renter / guest of this car',
          })
        }

        if (payload.action_type === 'accept') {
          if (bargainData.last_bargain_user === tokenUserData.id) {
            return response.status(404).json({
              status: 'error',
              message: 'Guest cannot accept own bargain price.',
            })
          } else {
            if (bargainData.bargain_status_id === 2 || bargainData.bargain_status_id === 4) {
              return response.status(404).json({
                status: 'error',
                message: 'Bargain unable to accept again. It was accepted',
              })
            }

            const acceptedTransaction = {
              car_id: bargainData.car_id,
              renter_id: bargainData.renter_id,
              bargain_id: bargainData.ori_bargain_id,
              host_id: bargainData.host_id,
              price_agreed: bargainData.last_bargain_amount,
            }

            const rentalTransactions = await RentalTransaction.create(acceptedTransaction)

            if (!rentalTransactions) {
              return response.status(404).json({
                status: 'error',
                message: 'Something went wrong adding rental transaction',
              })
            }

            const toUpdateDataAccept = {
              bargain_status_id: 4,
              transaction_id: rentalTransactions.transaction_id,
            }

            const updatedBargain = await Bargain.query()
              .where('id', payload.bargain_id)
              .update(toUpdateDataAccept)

            return response.status(200).json({
              data: {
                rentalTransactions,
                // updatedBargain,
              },
              status: 'success',
              message: 'Guest accepted host bargain.',
            })
          }
        } else if (payload.action_type === 'reject') {
          if (bargainData.last_bargain_user === tokenUserData.id) {
            return response.status(404).json({
              status: 'error',
              message: 'Guest / Renter cannot reject own bargain price.',
            })
          } else {
            if (bargainData.bargain_status_id === 3 || bargainData.bargain_status_id === 5) {
              return response.status(404).json({
                status: 'error',
                message: 'Bargain unable to reject again. It was rejected',
              })
            }
            const toUpdateDataAccept = {
              bargain_status_id: 5,
            }
            await Bargain.query().where('id', bargainData.ori_bargain_id).update(toUpdateDataAccept)

            return response.status(200).json({
              status: 'success',
              message: 'Guest rejected host bargain.',
            })
          }
        } else {
          return response.status(400).json({
            status: 'error',
            message: 'Platform do not accept other action except Reject & Accept',
          })
        }
      } else {
        return response.status(404).json({
          status: 'error',
          message: 'Could not find this rent request',
        })
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  public async updateBargain({ auth, response, request }) {
    try {
      await auth.use('api').authenticate()
      const tokenUserData = auth.use('api').user

      const userBargainSchema = schema.create({
        bargain_id: schema.number(),
        bargain_amount: schema.string(),
      })

      const payload = await request.validate({
        schema: userBargainSchema,
      })

      const findBargain = await Database.from('bargains')
        .innerJoin('cars', 'bargains.car_id', 'cars.id')
        .where('bargains.id', '=', payload.bargain_id)
        .innerJoin('bargain_status', 'bargains.bargain_status_id', 'bargain_status.id')
        .orderBy('bargains.id', 'asc')

      if (findBargain.length !== 0) {
        const bargainData = findBargain[0]
        if (bargainData.bargain_status_id === 0 || bargainData.bargain_status_id === 1) {
          var bargainingData

          if (
            bargainData.last_bargain_user === tokenUserData.id &&
            bargainData.bargain_status_id === 0
          ) {
            bargainingData = {
              bargain_status_id: 0,
              last_bargain_user: tokenUserData.id,
              last_bargain_amount: payload.bargain_amount,
            }
          } else {
            bargainingData = {
              bargain_status_id: 1,
              last_bargain_user: tokenUserData.id,
              last_bargain_amount: payload.bargain_amount,
            }
          }

          // const bargainingData = {
          //     "bargain_status_id": bargainData.host_id === tokenUserData.id ? 1 : 0,
          //     "last_bargain_user": tokenUserData.id,
          //     "last_bargain_amount": payload.bargain_amount
          // }

          await Bargain.query().where('id', payload.bargain_id).update(bargainingData)

          return response.status(200).json({
            status: 'success',
            message: 'Bargain done.',
          })
        } else {
          return response.status(404).json({
            status: 'error',
            message: 'Unable to bargain, because this bargain already closed.',
          })
        }
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      })
    }
  }
}
