export interface ILocation {
    skyId: string,
    entityId: string
    presentation: {
        title: string,
        suggestionTitle: string,
        subtitle: string,
    },
    navigation: {
        entityId: string,
        entityType: string,
        localizedName: string,
        relevantFlightParams: {
            skyId: string,
            entityId: string,
            flightPlaceType: string,
            localizedName: string,
        }
        relevantHotelParams: {
            entityId: string,
            entityType: string,
            localizedName: string,
        }
    }
}