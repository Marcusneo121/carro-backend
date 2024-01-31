// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Tester from "App/Models/Tester";

export default class TestersController {
    public async show({ auth }) {
        await auth.use('api').authenticate()
        console.log(auth.use('api').user!)
        const testers = Tester.all();
        return testers;

        // return {
        //     "testing": {
        //         "a": 1,
        //         "b": 2,
        //         "c": 3,
        //     }
        // };
    }

    // public async store({ response, request }) {
    public async store({ request }) {

        const newTesterSchema = schema.create({
            testerTitle: schema.string(),
            name: schema.string(),
            age: schema.string(),
            power: schema.string(),
            content: schema.string(),
        })

        const payload = await request.validate({ schema: newTesterSchema })

        await Tester.create(payload);

        return {
            "data": request.body(),
            "message": "New tester added to Database"
        }
    }

}
