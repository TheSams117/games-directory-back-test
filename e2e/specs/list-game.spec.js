const axios = require('axios');
const { expect } = require('chai');
const { BASE_URL } = require('../utils/constants');

let response;

describe("When the user wants to list all the games", () => {
    before(async () => {
        response = await axios.get(BASE_URL + '/games');
    });
    it("Then it should return games with properties id, name, console, genre and img", () => {
        const game = response.data[0];
        expect(game).to.have.property("id");
        expect(game).to.have.property("name");
        expect(game).to.have.property("console");
        expect(game).to.have.property("genre");
        expect(game).to.have.property("img");
    });
    it("Then it should return status code ok", () => {
        expect(response.status).eq(200);
    });
    it("Then it should return a JSON", () => {
        const headers = response.headers
        expect(headers["content-type"]).to.contain("application/json");
    });
});