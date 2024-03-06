/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import authConfig from 'Config/auth'

Route.get('/', async () => {
  return { hello: 'world' }
})


Route.get('/register/carro-verify-email-account/:email', 'AuthController.verifyEmail');
Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')
Route.post('/register/sendEmail/:email', 'AuthController.sendEmail')
Route.post('/register/checkUsername', 'AuthController.checkUsername')
Route.post('/register/checkEmail', 'AuthController.checkEmail')
Route.post('/upload/image', 'AuthController.uploadImage')
Route.group(() => {
  Route.post('/logout', 'AuthController.logout')
  Route.get('/user/:id', 'AuthController.getUserData')
  Route.get('/car', 'CarsController.getCars')
  Route.post('/car', 'CarsController.addCar')
  Route.patch('/car/:id', 'CarsController.updateCar')
  Route.get('/tester', 'TestersController.show')
  Route.post('/tester', 'TestersController.store')
  Route.post('/rent/booking', 'RentsController.bargain')
  Route.get('/rent/bargain', 'RentsController.getBargains')
  Route.get('/rent/bargain/user/:user_type', 'RentsController.getBargain')
  Route.patch('/rent/bargain/host/action', 'RentsController.hostBargainAcceptReject')
  Route.patch('/rent/bargain/guest/action', 'RentsController.guestBargainAcceptReject')
  Route.post('/rent/bargaining', 'RentsController.updateBargain')

  Route.post('/payment/create-customer', 'PaymentsController.createStripeCustomer')
  Route.post('/payment/find-customer', 'PaymentsController.findStripeCustomer')
  Route.post('/payment/make-payment-intent', 'PaymentsController.makePaymentIntent')
  Route.post('/payment/confirm-payment', 'PaymentsController.confirmPaymentDone')
}).middleware(['auth'])