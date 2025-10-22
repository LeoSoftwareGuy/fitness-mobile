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

interface CountrySelectProps {
    value: CountrySelectValue | null;
    onChange: (value: CountrySelectValue) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
    const { getAll } = useCountries();
    const countries = getAll();

    return (
        <View className="mb-3">
            <Text className="text-white font-pText text-base mb-2">
                Select Country
            </Text>
            <View className="bg-[#2C2C2C] rounded-lg overflow-hidden">
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
                    style={{
                        color: "white",
                        backgroundColor: "transparent"
                    }}
                    itemStyle={{
                        color: "white",
                        fontSize: 16,
                        height: 150
                    }}
                >
                    <Picker.Item
                        label="Select a country..."
                        value=""
                        color="#666666"
                    />
                    {countries.map((country: any) => (
                        <Picker.Item
                            key={country.value}
                            label={`${country.flag} ${country.label}`}
                            value={country.value}
                            color="white"
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}