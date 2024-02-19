//unit testing the auth middleware
//because supertest cant access the req we have to mock it in a unit test.
const {User} = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
    it("should populate req.user with the payload of a valid JWT", () => {
        //to call auth we have to mock all its parameters (req, res, next)
        //create a user that gets send to auth middleware in the header via token and then saved in req.user
        const user = { 
            _id: mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});