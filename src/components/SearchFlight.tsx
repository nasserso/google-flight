import styles from "../css/SearchFlight.module.css"
import { useEffect, useState } from "react";
import { flightApi } from "../api/api";
import PassengerChoices from "./PassengerChoices";
import { PassengersCountType, SeatClassType, TripType } from "../types/PassengerChoices";
import { ILocation } from "../types/location";
import { useDebounce } from "../hooks/useDebounce";
import AutocompleteSearch from "./AutoCompleteSearch";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

function SearchFlight() {
    const [tripType, setTripType] = useState<TripType>("round_trip");
    const [seatClass, setSeatClass] = useState<SeatClassType>("economy");
    const [passengers, setPassengers] = useState<PassengersCountType>({
        "adults": 1,
        "children": 0,
        "infants_seat": 0,
        // "infants_lap": 0
    });
    const [originLocation, setOriginLocation] = useState<ILocation>();
    const [destinationLocation, setDestinationLocation] = useState<ILocation>();

    const [flightDate, setFlightDate] = useState<dayjs.Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<dayjs.Dayjs | null>(null);


    const [airPortsFrom, setAirPortsFrom] = useState<ILocation[]>([]);
    const [airPortsTo, setAirPortsTo] = useState<ILocation[]>([]);

    const [searchTextTo, setSearchTextTo] = useState<string>("");
    const [searchTextFrom, setSearchTextFrom] = useState<string>("");

    const [loadingFrom, setLoadingFrom] = useState<boolean>(false);
    const [loadingTo, setLoadingTo] = useState<boolean>(false);

    const searchDebounceTo = useDebounce(searchTextTo, 1000);
    const searchDebounceFrom = useDebounce(searchTextFrom, 1000);

    const getAirPort = async (
        search: string,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setAirPorts: React.Dispatch<React.SetStateAction<ILocation[]>>,
    ) => {
        setLoading(true);
        try {
            const response = await flightApi.searchAirport(search);
            setAirPorts(response.data.data || []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (searchDebounceFrom.length > 0) {
            getAirPort(searchDebounceFrom, setLoadingFrom, (e) => setAirPortsFrom(e));
        }
    }, [searchDebounceFrom])

    useEffect(() => {
        if (searchDebounceTo.length > 0) {
            getAirPort(searchDebounceTo, setLoadingTo, (e) => setAirPortsTo(e));
        }
    }, [searchDebounceTo])

    return (
        <div className={styles.container}>
            <PassengerChoices
                tripType={tripType}
                setTripType={setTripType}
                seatClass={seatClass}
                setSeatClass={setSeatClass}
                passengers={passengers}
                setPassengers={setPassengers}
            />
            <div className={styles.inputContainer}>
                <AutocompleteSearch
                    options={airPortsFrom}
                    setOptions={setAirPortsFrom}
                    choice={originLocation}
                    setChoice={setOriginLocation}
                    setSearch={setSearchTextFrom}
                    label={"from"}
                    loading={loadingFrom}
                />
                <AutocompleteSearch
                    options={airPortsTo}
                    setOptions={setAirPortsTo}
                    choice={destinationLocation}
                    setChoice={setDestinationLocation}
                    setSearch={setSearchTextTo}
                    label={"destination"}
                    loading={loadingTo}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="flightDate" value={flightDate} onChange={(newDate) => setFlightDate(newDate)} />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="returnDate" value={returnDate} onChange={(newDate) => setReturnDate(newDate)} />
                </LocalizationProvider>
            </div>
            <button onClick={() => null}>Explore</button>
        </div>
    )
}

export default SearchFlight
