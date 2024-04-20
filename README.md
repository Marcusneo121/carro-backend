![Logo](https://i.ibb.co/wN4LCJb/carros.png)

# Carro Backend

Carro is a P2P Car Sharing Platform. Carro allow user to rent their car out and allow Host and Guest to bargain for agreeable price. This platform consist of Web and Mobile version. This repo the Backend API developed in Node.ks with Framework Adonis.js. Mobile and Web App is in another repo (link to repo attached below).

**However, if I can choose again, I might use basic setup of Node.js + Express. Adonis.js is still growing, maturing. Hence quite a lot of things and feature are not mature yet. But with Adonis.js, it saved me a lot of time to setup things that I need to setup on my own with Express. Adonis.js is quite a good framework to use for beginner. Because it ease the process to setup complicated integration with technologies.**

## Technologies

<img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.png" width="150"/> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" width="90"/> <img src="https://www.influxdata.com/wp-content/uploads/PostgreSQL-logo.jpg" width="150"/> <img src="https://opengraph.githubassets.com/f941e96725ce490647d44f9f5f6f7de7d53182ef4188047f530c6bd60f1f5552/adonisjs/lucid" width="150"/> <img src="https://1000logos.net/wp-content/uploads/2020/08/Redis-Logo-500x313.jpg" width="150"/> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5hPnQgYIb2fp0KenorFRSOXY268hay_nISrnJtv-6ng&s" width="150"/> <img src="https://cdn.invicti.com/statics/img/drive/h2jfrvzrbyh1yff2n3wfu2hkqqps6x_uvqo.png" width="150"/> <img src="https://domain-forward.com/wp-content/uploads/2023/07/google-cloud-run-logo.webp" width="150"/> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" width="150"/>

> <h2>CI/CD with Github Actions -> Build Docker Image and push to Google Artifact Registry and Deploy image to Google Cloud Run whenever Main branch has new commit.</h2>

## Features

- Login, Sign Up & Logout with JWT Authentication
- Email verification with NodeMailer
- Check Username taken with Redis
- Get Car List & Get Car Detail by ID
- Add Car as a Host
- Get Renter Booking List & Get Renter Booking Detail by ID (as Host)
- Get My Booking List & Get My Booking by ID (as Guest)
- Bargaining between Host and User
- Payment with Stripe integration and complete payment flow (Create Payment Intent -> Create Stripe User -> Make Payment on FrontEnd with Intent ID return from API -> Confirm Payment API from Frontend)

## Build & Run

- Clone the app to local

```bash
  npm install
```

```bash
  npm run dev
```

## Related

[Carro Mobile Repo - Flutter](https://github.com/Marcusneo121/carro_flutter_app)

[Carro Web App Repo - Node JS](https://github.com/Marcusneo121/carro-web-app)

## Contributor

- [@Marcusneo121](https://github.com/Marcusneo121)
