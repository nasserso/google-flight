export type TripType = (
    "round_trip" |
    "one_way" |
    "multi_city"
);

export type SeatClassType = (
    "economy" |
    "premium_economy" |
    "business" |
    "first"
);

export type PassengersType = (
    "adults" |
    "children" |
    "infants_seat"
    // "infants_lap"
);

export type PassengersCountType = (
    {
        "adults": number,
        "children": number,
        "infants_seat": number,
        // "infants_lap": number
    }
);