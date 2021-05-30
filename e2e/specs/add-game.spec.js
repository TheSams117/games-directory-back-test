const { BASE_URL } = require('../utils/constants');
const axios = require('axios');
const { expect } = require('chai');
const faker = require('faker').random;

let response;
let game = {
    name: `WarzoneAdd ${faker.words(3)}`,
    console: "PC",
    genre: "FPS",
    img: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/warzone/common/social-share/zeus-s3-wz-social-share.jpg"
};
let badGame = {
    name: "Warzone API",
    console: "PC",
    genre: "FPS"
};
let repeatedGame = {
    name: "Halo",
    console: "PC",
    genre: "FPS",
    img: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/warzone/common/social-share/zeus-s3-wz-social-share.jpg"
};

describe("When the user wants to add a new game", () => {
    describe("When the user adds a new game successfully", () => {
        before(async () => {
            response = await axios.post(BASE_URL + 'games', game);
        });
        it("Then it should return a game with properties id, name, console, genre, img", () => {
            const gameCreated = response.data;
            expect(gameCreated).to.have.property("id");
            expect(gameCreated).to.have.property("name");
            expect(gameCreated).to.have.property("console");
            expect(gameCreated).to.have.property("genre");
            expect(gameCreated).to.have.property("img");
        });
        it("Then it should return the created game", () => {
            const gameCreated = response.data;
            expect(gameCreated.name).eq(game.name);
            expect(gameCreated.console).eq(game.console);
            expect(gameCreated.genre).eq(game.genre);
            expect(gameCreated.img).eq(game.img);
        });
        it("Then it should return status code ok", () => {
            expect(response.status).eq(200);
        });
        it("Then it should return a JSON", () => {
            const headers = response.headers
            expect(headers["content-type"]).to.contain("application/json");
        });
    });

    describe("When the user doesn't fill all the fields", () => {
        before(async () => {
            await axios
                .post(
                    BASE_URL + 'games', badGame
                )
                .then((res) => {
                    response = res.response

                })
                .catch((err) => {
                    response = err.response
                });

        });

        it("Then it should return status code bad request", () => {
            expect(response.status).eq(400);
        });
        it("Then it should return the right message", () => {
            expect(response.data).eq("The game data is incomplete");
        });
    });
    describe("When the user adds an existing game", () => {
        before(async () => {
            await axios
                .post(
                    BASE_URL + 'games', repeatedGame
                )
                .then((res) => {
                    response = res.response

                })
                .catch((err) => {
                    response = err.response
                });

        });

        it("Then it should return status code bad request", () => {
            expect(response.status).eq(400);
        });
        it("Then it should return the right message", () => {

            expect(response.data).eq("The game to create already exist");
        });
    });


});
