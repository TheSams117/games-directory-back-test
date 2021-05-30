const { BASE_URL } = require('../utils/constants');
const axios = require('axios');
const { expect } = require('chai');
const faker = require('faker').random;

let responseRemoved;
let gameToRemove;
let responseList;
describe("Given a game created to remove", () => {
    before(async () => {
        const game = {
            name: `WarzoneRemove ${faker.words(2)}`,
            console: "PC",
            genre: "FPS",
            img: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/warzone/common/social-share/zeus-s3-wz-social-share.jpg"
        }
        gameToRemove = await axios.post(BASE_URL + 'games', game);
    });
    describe("When the user wants to remove a game", () => {
        before(async () => {
            responseRemoved = await axios.delete(BASE_URL + `games/${gameToRemove.data.id}`,);
            responseList = await axios.get(BASE_URL + 'games');
        });

        it("Then it should return status code ok", () => {
            expect(responseRemoved.status).eq(200);

        });
        it("Then the game shouldn't exist", () => {
            let exist = responseList.data.some(item => item.name === gameToRemove.name);
            expect(exist).eq(false);

        });
    });
    describe("When the user wants to remove a non-existent game", () => {
        before(async () => {
            await axios
                .delete(
                    BASE_URL + `games/-1`,
                )
                .then((res) => {
                    responseRemoved = res.response
                })
                .catch((err) => {
                    responseRemoved = err.response
                });
        });
        it("Then it should return status code bad request", () => {
            expect(responseRemoved.status).eq(400);
        });
        it("Then it should return the right message", () => {
            expect(responseRemoved.data).eq("The game to delete doesn't exist");
        });
    });

});