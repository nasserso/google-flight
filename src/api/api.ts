import axios from "axios"

const BASE_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/"

const flight_base = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
    }
});

export const flightApi = {
    searchAirport: async (query: string) => {
        const response = await flight_base.get("searchAirport", { params: { query } })
        return response;
    },

    searchFlights: async (
        originSkyId: string,
        destinationSkyId: string,
        originEntityId: string,
        destinationEntityId: string,
        date: string,
        returnDate?: string,
        cabinClass?: string,
        adults?: number,
        children?: number,
        infants?: number,
    ) => {
        const response = await flight_base.get("searchFlights", {
            params: {
                originSkyId,
                destinationSkyId,
                originEntityId,
                destinationEntityId,
                date,
                returnDate,
                cabinClass,
                adults,
                children,
                infants,
            }
        })
        return response;
    },
}