"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAddress = void 0;
const axios_1 = __importDefault(require("axios"));
const cache_service_1 = require("../services/cache.service");
const PHOTON_URL = "https://photon.komoot.io/api";
const CACHE_TTL = 60 * 60 * 24;
const searchAddress = async (query) => {
    const normalizedQuery = query.trim().toLowerCase();
    const cacheKey = `address-search:${normalizedQuery}`;
    const cachedData = await (0, cache_service_1.getCache)(cacheKey);
    if (cachedData) {
        return {
            data: cachedData,
            source: "radis",
        };
    }
    const response = await axios_1.default.get(`${PHOTON_URL}`, {
        params: {
            q: query,
            countrycode: "IN",
            limit: 4,
        },
    });
    const results = response.data.features.map((item) => ({
        name: item.properties.name,
        city: item.properties.city,
        type: item.properties.type,
        county: item.properties.county,
        state: item.properties.state,
        country: item.properties.country,
        lat: item.geometry.coordinates[1],
        lng: item.geometry.coordinates[0]
    }));
    await (0, cache_service_1.setCache)(cacheKey, results, CACHE_TTL);
    return {
        source: "photon",
        data: results,
    };
};
exports.searchAddress = searchAddress;
