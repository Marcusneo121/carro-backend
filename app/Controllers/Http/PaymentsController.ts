// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import Stripe from 'stripe';
import User from 'App/Models/User';
import Database from '@ioc:Adonis/Lucid/Database'
import PaymentTransaction from 'App/Models/PaymentTransaction';
import Bargain from 'App/Models/Bargain';
const stripe = new Stripe(Env.get('STRIPE_SECRET'));

export default class PaymentsController {
    public async createStripeCustomer({ auth, response, request }) {
        try {
            await auth.use('api').authenticate()
            const tokenUserData = auth.use('api').user

            const findStripeCustomerSchema = schema.create({
                name: schema.string(),
                email: schema.string(),
                phone_number: schema.string(),
            })

            const payload = await request.validate({ schema: findStripeCustomerSchema })

            const customer = await stripe.customers.create({
                name: payload.name,
                email: payload.email,
                metadata: {
                    "carro_id": tokenUserData.id
                },
                phone: payload.phone_number
            });

            console.log(customer);

            return response.status(200).json({
                data: customer,
                message: "Customer found"
            })

        } catch (error) {
            return response.status(404).json({
                "status": "error",
                "message": "Something went wrong. Please try again.",
            })
        }

    }

    public async findStripeCustomer({ auth, response, request }) {
        try {
            await auth.use('api').authenticate()
            const tokenUserData = auth.use('api').user

            const findStripeCustomerSchema = schema.create({
                name: schema.string(),
                email: schema.string(),
            })

            const payload = await request.validate({ schema: findStripeCustomerSchema })

            const customers = await stripe.customers.search({
                query: `name:\'${payload.name}\' AND email:\'${payload.email}\' AND metadata[\'carro_id\']:\'${tokenUserData.id}\'`,
            });

            if (customers.data.length == 0) {
                return response.status(200).json({
                    status: "success",
                    message: "Customer not found"
                })
            } else {
                return response.status(200).json({
                    data: customers.data,
                    message: "Customer found"
                })
            }
        } catch (error) {
            return response.status(404).json({
                "status": "error",
                "message": "Something went wrong. Please try again.",
            })
        }
    }

    public async makePaymentIntent({ auth, response, request }) {
        try {
            await auth.use('api').authenticate()
            const tokenUserData = auth.use('api').user

            const paymentSchema = schema.create({
                // name: schema.string(),
                // email: schema.string(),
                total_amount: schema.string(),
                bargain_id: schema.number(),
                rental_transaction_id: schema.number(),
            })

            const payload = await request.validate({ schema: paymentSchema })

            const userColumns = ['users.id as ori_user_id', 'users.*']; // Explicitly select all columns from bargains table and alias the id column
            const profileColumns = ['profiles.id as ori_profile_id', 'profiles.*'];
            const userAndProfileData = await Database
                .from('users')
                .select(...userColumns, ...profileColumns)
                .innerJoin('profiles', 'users.id', 'profiles.user_id')
                .where('users.id', '=', tokenUserData.id)
                .orderBy('users.id', 'asc');

            if (userAndProfileData.length === 0) {
                return response.status(404).json({
                    "status": "error",
                    "message": "Something went wrong. Please try again.",
                })
            } else {
                const customers = await stripe.customers.search({
                    query: `name:\'${userAndProfileData[0].first_name} ${userAndProfileData[0].last_name}\' AND email:\'${userAndProfileData[0].email}\' AND metadata[\'carro_user_id\']:\'${tokenUserData.id}\' AND metadata[\'carro_phone_number\']:\'${userAndProfileData[0].phone_number}\'`,
                });

                if (customers.data.length === 0) {
                    //Customer not found
                    await stripe.customers.create({
                        name: `${userAndProfileData[0].first_name} ${userAndProfileData[0].last_name}`,
                        email: `${userAndProfileData[0].email}`,
                        metadata: {
                            "carro_user_id": tokenUserData.id,
                            "carro_phone_number": `${userAndProfileData[0].phone_number}`
                        },
                        phone: payload.phone_number
                    }).then(async (customer) => {
                        const toUpdateDataAccept = {
                            "stripe_customer_id": customer.id
                        }
                        await User.query().where('id', tokenUserData.id).update(toUpdateDataAccept)

                        const ephemeralKey = await stripe.ephemeralKeys.create(
                            { customer: customer.id },
                            { apiVersion: '2023-10-16' }
                        );

                        // const paymentIntent = 
                        await stripe.paymentIntents.create({
                            amount: Number(payload.total_amount) * 100,
                            currency: 'myr',
                            automatic_payment_methods: {
                                enabled: true,
                            },
                            customer: customer.id,
                            receipt_email: `${userAndProfileData[0].email}`,
                            metadata: {
                                "bargain_id": payload.bargain_id,
                                "rental_transaction_id": payload.rental_transaction_id,
                                "stripe_customer_id": customer.id
                            }
                        }).then(async (paymentCreatedData) => {

                            const paymentTransactionData = {
                                "stripe_payment_id": paymentCreatedData.id.toString(),
                                "stripe_customer_id": paymentCreatedData.customer?.toString(),
                                "bargain_id": payload.bargain_id,
                                "rental_transaction_id": payload.rental_transaction_id,
                                "payment_status_id": 0,
                                "total_amount": paymentCreatedData.amount.toString(),
                            }
                            const paymentTransaction = await PaymentTransaction.create(paymentTransactionData)

                            console.log(paymentTransaction['$original'].payment_transaction_id)

                            if (!paymentTransaction) {
                                return response.status(404).json({
                                    "status": "error",
                                    "message": "Something went wrong. Please try again.",
                                })
                            } else {
                                return response.status(200).json({
                                    data: {
                                        paymentIntent: paymentCreatedData.client_secret,
                                        ephemeralKey: ephemeralKey.secret,
                                        customer: customer.id, //this is get from search customer result
                                        publishableKey: Env.get('STRIPE_PUBLIC'),
                                        payment_transaction_id: paymentTransaction['$original'].payment_transaction_id
                                    },
                                    message: "Open Stripe payment sheet"
                                })

                            }
                        })
                    })
                } else {
                    //Customer found
                    const ephemeralKey = await stripe.ephemeralKeys.create(
                        { customer: customers.data[0].id },
                        { apiVersion: '2023-10-16' }
                    );

                    // const paymentIntent = 
                    await stripe.paymentIntents.create({
                        amount: Number(payload.total_amount) * 100,
                        currency: 'myr',
                        automatic_payment_methods: {
                            enabled: true,
                        },
                        customer: customers.data[0].id,
                        receipt_email: `${userAndProfileData[0].email}`,
                        metadata: {
                            "bargain_id": payload.bargain_id,
                            "rental_transaction_id": payload.rental_transaction_id,
                            "stripe_customer_id": customers.data[0].id
                        }
                    })
                        .then(async (paymentCreatedData) => {
                            const paymentTransactionData = {
                                "stripe_payment_id": paymentCreatedData.id.toString(),
                                "stripe_customer_id": paymentCreatedData.customer?.toString(),
                                "bargain_id": payload.bargain_id,
                                "rental_transaction_id": payload.rental_transaction_id,
                                "payment_status_id": 0,
                                "total_amount": paymentCreatedData.amount.toString(),
                            }
                            const paymentTransaction = await PaymentTransaction.create(paymentTransactionData)

                            console.log(paymentTransaction['$original'].payment_transaction_id)

                            if (!paymentTransaction) {
                                return response.status(404).json({
                                    "status": "error",
                                    "message": "Something went wrong. Please try again.",
                                })
                            } else {
                                return response.status(200).json({
                                    data: {
                                        paymentIntent: paymentCreatedData.client_secret,
                                        ephemeralKey: ephemeralKey.secret,
                                        customer: customers.data[0].id, //this is get from search customer result
                                        publishableKey: Env.get('STRIPE_PUBLIC'),
                                        payment_transaction_id: paymentTransaction['$original'].payment_transaction_id
                                    },
                                    message: "Open Stripe payment sheet"
                                })
                            }
                        })
                }
            }
        } catch (error) {
            return response.status(404).json({
                "status": "error",
                "message": "Something went wrong. Please try again.",
            })
        }
    }

    public async confirmPaymentDone({ auth, response, request }) {
        try {
            await auth.use('api').authenticate()
            const tokenUserData = auth.use('api').user

            const confrimPaymentSchema = schema.create({
                payment_transaction_id: schema.number(),
                bargain_id: schema.number(),
                rental_transaction_id: schema.number(),
                stripe_customer_id: schema.string(),
            })

            const payload = await request.validate({ schema: confrimPaymentSchema })

            const updatePaymentTransactionData = {
                "payment_status_id": 1
            }
            const updateBargainData = {
                "bargain_status_id": 6
            }
            await PaymentTransaction.query().where('payment_transaction_id', payload.payment_transaction_id).update(updatePaymentTransactionData)
            await Bargain.query().where('id', payload.bargain_id).update(updateBargainData)

            const paymentTransactionData = await PaymentTransaction.query().where('payment_transaction_id', payload.payment_transaction_id)

            console.log(paymentTransactionData[0].$original.stripe_payment_id);

            return response.status(200).json({
                "data": {
                    "payment_reference_id": paymentTransactionData[0].$original.stripe_payment_id
                },
                "message": `Confirm Payment Done. Payment ID : ${paymentTransactionData[0].$original.stripe_payment_id}`,
            })
        } catch (error) {
            return response.status(404).json({
                "status": "error",
                "message": "Something went wrong. Please try again.",
            })
        }
    }
}


// {
//     id: 'pi_3OrGVC00aGL9TpAi0d51B8Tm',
//     object: 'payment_intent',
//     amount: 10800,
//     amount_capturable: 0,
//     amount_details: { tip: {} },
//     amount_received: 0,
//     application: null,
//     application_fee_amount: null,
//     automatic_payment_methods: { allow_redirects: 'always', enabled: true },
//     canceled_at: null,
//     cancellation_reason: null,
//     capture_method: 'automatic',
//     client_secret: 'pi_3OrGVC00aGL9TpAi0d51B8Tm_secret_fZV2ablx5jjjtB1YWmUPCWPsz',
//     confirmation_method: 'automatic',
//     created: 1709716266,
//     currency: 'myr',
//     customer: 'cus_PgYBiMH4Aa43di',
//     description: null,
//     invoice: null,
//     last_payment_error: null,
//     latest_charge: null,
//     livemode: false,
//     metadata: { bargain_id: '12', rental_transaction_id: '23' },
//     next_action: null,
//     on_behalf_of: null,
//     payment_method: null,
//     payment_method_configuration_details: { id: 'pmc_1OquFB00aGL9TpAicUR85CZd', parent: null },
//     payment_method_options: {
//       card: {
//         installments: null,
//         mandate_options: null,
//         network: null,
//         request_three_d_secure: 'automatic'
//       },
//       link: { persistent_token: null }
//     },
//     payment_method_types: [ 'card', 'link' ],
//     processing: null,
//     receipt_email: 'carrocarsharing@gmail.com',
//     review: null,
//     setup_future_usage: null,
//     shipping: null,
//     source: null,
//     statement_descriptor: null,
//     statement_descriptor_suffix: null,
//     status: 'requires_payment_method',
//     transfer_data: null,
//     transfer_group: null
//   }