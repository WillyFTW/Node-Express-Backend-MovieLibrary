const moment = require("moment");
const request = require("supertest");
const {Rental} = require("../../models/rental");
const {Movie} = require("../../models/movie");
const {User} = require("../../models/user");

mongoose = require("mongoose");

describe("/api/returns", () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    const exec = () => {
        return request(server)
            .post("/api/returns")
            .set("x-auth-token", token)
            .send({customerId: customerId, movieId: movieId});
    };

    //we need to start and close the server for each test because if we make changes and run tests again there would be already a server running.
    //runns before every test in this test-suite.
    beforeEach(async () => { 
        server = require("../../index");

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 2,
            genre: { name: "12345" },
            numberInStock: 10
        })
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,//we set the id in the test manually so we know the id and can use it in our test.(could also just use rental.customer.customerId)
                name: "12345",
                phone: "12345"
            },
            movie:{
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach(async() => {
        await server.close();
        await Rental.remove({}); //this line removes all documents in the rentals collection because next test we would get 4 instead of 2 documents.
        await Movie.remove({});
    });

    describe("POST /", () => {
        
        it("should return 401 if client is not logged in", async () => {
            token = "";
            
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return 400 if logged in but customerId is not provided", async () => {
            customerId = "";

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return 400 if logged in but movieId is not provided", async () => {
            movieId = "";

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return 404 if logged in but no rental found for this customer/movie", async () => {
            await Rental.remove({});

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it("should return 400 if logged in but no reeturn is already processed", async () => {
            rental.dateReturned = new Date();
            await rental.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return 200 if we have a valid request", async () => {

            const res = await exec();

            expect(res.status).toBe(200);
        });

        it("should set the return date if input is valid", async () => {

            const res = await exec();

            const rentalInDb = await Rental.findById(rental._id);
            const diff = new Date() - rentalInDb.dateReturned;
            
            expect(diff).toBeLessThan(10*1000); //expect the return time and the test time to be inbetween 10 sec.
        });

        it("should set the rental Fee if input is valid", async () => {

            rental.dateOut = moment().add(-7, "days").toDate(); //get the date frome 7 days ago and convert it to standart js format.
            await rental.save();
            
            const res = await exec();

            const rentalInDb = await Rental.findById(rental._id);
            const diff = new Date() - rentalInDb.dateReturned;
            expect(rentalInDb.rentalFee).toBe(14);
        });

        it("should increase the movie stock if input is valid", async () => {
            
            const res = await exec();

            const movieInDb = await Movie.findById(movieId);
            expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
        });

        it("should return the rental in the body if input is valid", async () => {
            
            const res = await exec();

            const rentalInDb = await Rental.findById(rental._id);
            expect(res.body).toHaveProperty("dateOut");
            expect(res.body).toHaveProperty("dateReturned");
            expect(res.body).toHaveProperty("rentalFee");
            expect(res.body).toHaveProperty("customer");
            expect(res.body).toHaveProperty("movie");
        });
    });
    
    
});