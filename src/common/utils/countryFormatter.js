import flatMap from "lodash/flatMap";
import groupBy from "lodash/groupBy";

// ✅ Step 1: Clean country data
const cleanedData = (countryData) =>
    countryData?.filter(
        (item) => item.region && item.region.trim() !== ""
    );

// ✅ Step 2: Format for dropdown options
export const formatRegionCountryOptions = (countryData) => {
    const data = cleanedData(countryData);

    return flatMap(
        groupBy(data, "region"),
        (countries, regionName) => {
            const region = {
                label: regionName,
                value: regionName,
                isRegion: true
            };

            const countryOptions = countries.map((country) => ({
                label: country.name,
                value: country["alpha-2"],
                parent: regionName
            }));

            return [region, ...countryOptions];
        }
    );
};