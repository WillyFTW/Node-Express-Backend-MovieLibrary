//testing the genres router
const request = require("supertest");
const {Genre} = require("../../models/genre");
const {User} = require("../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
    //we need to start and close the server for each test because if we make changes and run tests again there would be already a server running.
    //runns before every test in this test-suite.
    beforeEach(() => { 
        server = require("../../index"); 
    });
    afterEach(async() => {
        await Genre.remove({}); //this line removes all documents in the genres collection because next test we would get 4 instead of 2 documents.
        await server.close();
    });
    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: "genre1"},
                { name: "genre2"}
            ])

            const res = await request(server).get("/api/genres");
            expect(res.status).toBe(200); //status should be 200
            expect(res.body.length).toBe(2); //we should get 2 documents
            expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
            expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("should return a genre if valid id is passed", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();

            const res = await request(server).get("/api/genres/" + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });

        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/genres/1");

            expect(res.status).toBe(404);
        })

        it("should return 404 if no genre with the given id exists", async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get("/api/genres/" + id);

            expect(res.status).toBe(404);
        })
    })

    

    describe("POST /", () => {
        //Define the happy path, and then in each test, we change one parameter that clearly aligns the name of the test.
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: name }); // if key and value are the same in ecma script 6 you can just add the key: .send({ name });
        }

        //before each we set the values of the happy path
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "genre1";
        })

        it("should return 401 if client is not logged in", async () => {
            token = "";
            
            const res = await exec();
        
            expect(res.status).toBe(401);
        })

        it("should return 400 if client is logged in but genre is less than 5 characters", async () => {
            name = "1234";
            
           const res = await exec();
        
            expect(res.status).toBe(400);
        })

        it("should return 400 if client is logged in but genre i more than 50 characters", async () => {
            name = new Array(52).join("a");//workaround for creating a 51 long string.(join puts an "a" inbetween each of the 52 elements)
            
            const res = await exec();
        
            expect(res.status).toBe(400);
        })

        it("should save the genre if it is valid", async () => {
            await exec()

            const genre = await Genre.find({ name: "genre1"});
        
            expect(genre).not.toBeNull();
        })

        it("should return the genre if it is valid", async () => {
            const res = await await exec();
        
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genre1");
        })
    })
});