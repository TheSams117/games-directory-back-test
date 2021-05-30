const axios = require('axios');
const { expect } = require('chai');
const { BASE_URL } = require('../utils/constants');
const faker = require('faker').random;

let response;
let createdGame;
let updatedGame;
let badGame = {
    name: "Warzone API-Edit",
    console: "PC",
    genre: "FPS"
};
let repeatedGame = {
    id: "-1",
    name: "Halo",
    console: "PC",
    genre: "FPS",
    img: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/warzone/common/social-share/zeus-s3-wz-social-share.jpg"
};

describe("Given a created game to update", () => {
    before(async () => {
        const game = {
            name: `WarzoneUpdate ${faker.words(2)}`,
            console: "PC",
            genre: "FPS",
            img: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/warzone/common/social-share/zeus-s3-wz-social-share.jpg"
        }
        createdGame = await axios.post(BASE_URL + 'games', game);
    });
    describe("When the user wants to update the game", () => {
        before(async () => {
            updatedGame = {
                id: createdGame.data.id,
                name: `WarzoneUpdated ${faker.words(2)}`,
                console: "PC",
                genre: "FPSUpdated",
                img: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/warzone/common/social-share/zeus-s3-wz-social-share.jpg"
            }
            response = await axios.put(BASE_URL + 'games', updatedGame);
        });
        it("Then it should return a game with properties id, name, console, genre, img", () => {
            const gameUpdated = response.data;
            expect(gameUpdated).to.have.property("id");
            expect(gameUpdated).to.have.property("name");
            expect(gameUpdated).to.have.property("console");
            expect(gameUpdated).to.have.property("genre");
            expect(gameUpdated).to.have.property("img");
        });
        it("Then it should return the updated game", () => {
            const gameUpdated = response.data;
            expect(gameUpdated.name).eq(updatedGame.name);
            expect(gameUpdated.console).eq(updatedGame.console);
            expect(gameUpdated.genre).eq(updatedGame.genre);
            expect(gameUpdated.img).eq(updatedGame.img);
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
                .put(
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
    describe("When the user edits a non-existing game", () => {
        before(async () => {
            await axios
                .put(
                    BASE_URL + 'games', repeatedGame
                )
                .then((res) => {
                    response = res.response

                })
                .catch((err) => {
                    response = err.response
                });

        });

        it("Then it should return status code not found", () => {
            expect(response.status).eq(404);
        });
        it("Then it should return the right message", () => {

            expect(response.data).eq("The game to update doesn't exist");
        });
    });

});
