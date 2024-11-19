import { Fragment } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { ILocation } from "../types/location";

interface IAutoCompleteSearch {
    options: ILocation[];
    setOptions: React.Dispatch<React.SetStateAction<ILocation[]>>;
    choice: ILocation | undefined;
    setChoice: React.Dispatch<React.SetStateAction<ILocation | undefined>>;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    label: string;
    loading: boolean;
    required?: boolean;
}

function AutocompleteSearch({ options, setOptions, choice, setChoice, setSearch, label, loading, required = false }: IAutoCompleteSearch) {
    return (
        <Autocomplete
            disablePortal
            options={options}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.presentation.title}
            loading={loading}
            onInputChange={(_, newInputValue) => {
                setSearch(newInputValue);
            }}

            filterOptions={(x) => x}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={choice}
            noOptionsText="No locations"
            onChange={(_: any, newValue: any) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setChoice(newValue);
            }}

            renderInput={(params) =>
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </Fragment>
                            ),
                        },
                    }}
                />
            }
        >
        </Autocomplete>
    )
}

export default AutocompleteSearch
