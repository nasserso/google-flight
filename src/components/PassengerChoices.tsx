import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { Dispatch } from "react";
import { PassengersCountType, PassengersType, SeatClassType, TripType } from "../types/PassengerChoices";
import styles from "../css/PassengerChoices.module.css"

interface IPassengerChoices {
    tripType: TripType;
    setTripType: Dispatch<TripType>;
    seatClass: SeatClassType;
    setSeatClass: Dispatch<SeatClassType>;
    passengers: PassengersCountType;
    setPassengers: Dispatch<PassengersCountType>;
}

const PassengerChoices = ({
    tripType,
    setTripType,
    seatClass,
    setSeatClass,
    passengers,
    setPassengers,
}: IPassengerChoices) => {
    const countPassengers = () => {
        return Object.keys(passengers).reduce(
            (acc, key) => acc + passengers[key as PassengersType], 0
        );
    }

    const canReducePassengerCount = (type: PassengersType) => {
        return passengers[type] - 1 >= (type === "adults" ? 1 : 0);
    }

    const canAddPassengerCount = (type: PassengersType) => {
        return passengers[type] + 1 <= 9;
    }

    const updatePassengerCount = (type: PassengersType, value: number) => {
        setPassengers({ ...passengers, [type]: passengers[type] + value });
    }

    const getPassengerText = (type: PassengersType) => {
        return {
            "adults": "Adults",
            "children": "Children",
            "infants_seat": "Infants",
            // "infants_lap": "Infants",
        }[type]
    }

    const getPassengerSubText = (type: PassengersType) => {
        return {
            "adults": "",
            "children": "Aged 2-11",
            "infants_seat": "In seat",
            // "infants_lap": "On lap",
        }[type]
    }

    const PassengengerItemChoice = ({ type }: { type: PassengersType }) => {
        return (
            <div className={styles.passengerItemContainer}>
                <div className={styles.passengerItemTextContainer}>
                    <Typography>{getPassengerText(type)}</Typography>
                    <Typography variant="caption">{getPassengerSubText(type)}</Typography>
                </div>
                <Button
                    onClick={() => updatePassengerCount(type, -1)}
                    disabled={!canReducePassengerCount(type)}
                    variant="contained"
                    className={styles.passengerItemBtn}
                >
                    -
                </Button>
                {passengers[type]}
                <Button
                    onClick={() => updatePassengerCount(type, 1)}
                    disabled={!canAddPassengerCount(type)}
                    variant="contained"
                    className={styles.passengerItemBtn}
                >
                    +
                </Button>
            </div >
        )
    }

    return (
        <div>
            <FormControl>
                <Select
                    labelId="trip-select"
                    id="trip-select"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as TripType)}
                >
                    <MenuItem value={"round_trip"}>Round trip</MenuItem>
                    <MenuItem value={"one_way"}>One way</MenuItem>
                    {/* <MenuItem value={"multi_city"}>Multi-city</MenuItem> */}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="passenger-select">{countPassengers()}</InputLabel>
                <Select
                    labelId="passenger-select"
                    id="passenger-select"
                >
                    <PassengengerItemChoice type="adults" />
                    <PassengengerItemChoice type="children" />
                    <PassengengerItemChoice type="infants_seat" />
                    {/* <PassengengerItemChoice type="infants_lap" /> */}
                </Select>
            </FormControl>
            <FormControl>
                <Select
                    labelId="seat-class-select"
                    id="seat-class-select"
                    value={seatClass}
                    onChange={(e) => setSeatClass(e.target.value as SeatClassType)}
                >
                    <MenuItem value={"economy"}>Economy</MenuItem>
                    <MenuItem value={"premium_economy"}>Premium Economy</MenuItem>
                    <MenuItem value={"business"}>Business</MenuItem>
                    <MenuItem value={"first"}>First</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}

export default PassengerChoices;