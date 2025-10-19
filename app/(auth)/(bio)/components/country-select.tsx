import useCountries from "@/hooks/use-countries";
import { Picker } from "@react-native-picker/picker";
import { Text, View } from "react-native";

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
}

interface ConntrySelectProps {
    value: CountrySelectValue | null;
    onChange: (value: CountrySelectValue) => void;
}

export default function CountrySelect({ value, onChange }: ConntrySelectProps) {
    const { getAll } = useCountries();
    const countries = getAll();

    return (
        <View className="mt-2.5 mb-25 items-center w-full">
            <Text className="mb-1.5 text-base text-center text-white">
                Select Country:
            </Text>
            <View className="w-full rounded-lg">
                <Picker
                    selectedValue={value?.value}
                    onValueChange={(itemValue) => {
                        const selectedCountry = countries.find(
                            (country: any) => country.value === itemValue
                        );
                        if (selectedCountry) {
                            onChange(selectedCountry);
                        }
                    }}
                    className="h-25 text-white"
                    itemStyle={{ textAlign: "left", color: "white" }}
                >
                    {countries.map((country: any) => (
                        <Picker.Item
                            key={country.value}
                            label={`${country.flag} ${country.label}`}
                            value={country.value}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}