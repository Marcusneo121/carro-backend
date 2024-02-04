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


// Route.on('/register/email-verification-carro').render("email_verification");

Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')
Route.post('/register/sendEmail/:email', 'AuthController.sendEmail')
Route.post('/register/checkUsername', 'AuthController.checkUsername')
Route.post('/register/checkEmail', 'AuthController.checkEmail')
Route.group(() => {
  Route.post('/logout', 'AuthController.logout')
  Route.get('/car', 'CarsController.getCars')
  Route.post('/car', 'CarsController.addCar')
  Route.patch('/car/:id', 'CarsController.updateCar')
  Route.get('/tester', 'TestersController.show')
  Route.post('/tester', 'TestersController.store')
}).middleware(['auth'])