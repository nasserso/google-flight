import axios from "axios"

const BASE_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/"

const flight_base = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: { 'x-rapidapi-key': '' }
});

export const flightApi = {
    searchAirport: async (query: string) => {
        const response = await flight_base.get("searchAirport", { params: { query } })
        return response;
    }
}