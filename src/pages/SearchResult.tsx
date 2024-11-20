import { useEffect, useState } from "react";
import PassengerChoices from "../components/PassengerChoices";
import styles from "../css/SearchResult.module.css";
import { PassengersCountType, SeatClassType, TripType } from "../types/PassengerChoices";
import { useDebounce } from "../hooks/useDebounce";
import { ILocation } from "../types/location";
import dayjs from "dayjs";
import { flightApi } from "../api/api";
import AutocompleteSearch from "../components/AutoCompleteSearch";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLocation } from "react-router-dom";
import Worldmap from "../assets/worldmap.png"

function SearchResult() {
    const { state } = useLocation();
    const { itineraries, destinationImageUrl } = state.response.data;

    const [tripType, setTripType] = useState<TripType>(state.userData.tripType || "round_trip");
    const [seatClass, setSeatClass] = useState<SeatClassType>(state.userData.seatClass || "economy");
    const [passengers, setPassengers] = useState<PassengersCountType>(state.userData.passengers || {
        "adults": 1,
        "children": 0,
        "infants_seat": 0,
    });
    const [originLocation, setOriginLocation] = useState<ILocation>(state.userData.originLocation || null);
    const [destinationLocation, setDestinationLocation] = useState<ILocation>(state.userData.destinationLocation || null);

    const [flightDate, setFlightDate] = useState<dayjs.Dayjs | null>(state.userData.flightDate || null);
    const [returnDate, setReturnDate] = useState<dayjs.Dayjs | null>(state.userData.returnDate || null);


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

    const PlaceList = () => {
        return (
            <div className={styles.leftNavBar}>
                {
                    itineraries.map((itinerary: any) => {
                        if (itinerary.legs.length === 0) {
                            return <p>Not found</p>
                        }

                        return (
                            <div className={styles.itineraryContainer}>
                                <img src={destinationImageUrl} alt="" className={styles.itineraryImg} />
                                <div className={styles.itineraryInfoContainer}>
                                    <div className={styles.infoContainer}>
                                        <p><b>{itinerary.legs[0].destination.city}</b></p>
                                        <p>{itinerary.legs[0].durationInMinutes} minutes</p>
                                        <div className={styles.carrierContainer}>
                                            <img src={itinerary.legs[0].carriers.marketing[0].logoUrl} alt="" className={styles.carrierImg} />
                                            <p>{itinerary.legs[0].carriers.marketing[0].name}</p>
                                        </div>
                                    </div>
                                    <div className={styles.priceContainer}>
                                        <p>{itinerary.price.formatted}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.menuContainer}>
                <PassengerChoices
                    tripType={tripType}
                    setTripType={setTripType}
                    seatClass={seatClass}
                    setSeatClass={setSeatClass}
                    passengers={passengers}
                    setPassengers={setPassengers}
                />
                <div className={styles.inputContainer}>
                    <div className={styles.inputSearch}>
                        <AutocompleteSearch
                            options={airPortsFrom}
                            setOptions={setAirPortsFrom}
                            choice={originLocation}
                            setChoice={setOriginLocation}
                            setSearch={setSearchTextFrom}
                            label={"from"}
                            loading={loadingFrom}
                            required={true}
                        />
                        <AutocompleteSearch
                            options={airPortsTo}
                            setOptions={setAirPortsTo}
                            choice={destinationLocation}
                            setChoice={setDestinationLocation}
                            setSearch={setSearchTextTo}
                            label={"destination"}
                            loading={loadingTo}
                            required={true}
                        />
                    </div>
                    <div className={styles.inputDate}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="flightDate"
                                value={flightDate}
                                onChange={(newDate) => setFlightDate(newDate)}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="returnDate"
                                value={returnDate}
                                onChange={(newDate) => setReturnDate(newDate)}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                <PlaceList />
            </div>
            <div style={{ width: "100%", height: "100%", margin: "10px" }}>
                <img src={Worldmap} alt="" style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    )
}

export default SearchResult
