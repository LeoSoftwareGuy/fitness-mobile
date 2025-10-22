import ProfileField from "@/components/forms/profile-field";
import { Gender, Weight } from "@/state/endpoints/api.schemas";
import { View } from "react-native";
import AgeSelect from "./age-select";
import CountrySelect, { CountrySelectValue } from "./country-select";
import GenderSelect from "./gender-select";
import HeightWeightInput from "./height-weight-input";

interface ProfileFormFieldsProps {
    firstName: string;
    lastName: string;
    nationality: string | null;
    age: number;
    gender: Gender;
    height?: number;
    weight?: Weight;
    onUpdate: (updates: any) => void;
}

export default function ProfileFormFields({
    firstName,
    lastName,
    nationality,
    age,
    gender,
    height,
    weight,
    onUpdate
}: ProfileFormFieldsProps) {
    return (
        <View className="w-full">
            <ProfileField
                title="Name"
                value={firstName}
                handleChangeText={(e: string) => onUpdate({ firstName: e })}
                placehorder="Enter name"
            />

            <ProfileField
                title="Surname"
                value={lastName}
                handleChangeText={(e: string) => onUpdate({ lastName: e })}
                placehorder="Enter surname"
            />

            <GenderSelect
                selectedGender={gender}
                onGenderChange={(e: Gender) => onUpdate({ gender: e })}
            />

            <CountrySelect
                onChange={(e: CountrySelectValue) => onUpdate({ nationality: e.value })}
                value={nationality ? {
                    value: nationality,
                    label: '',
                    flag: '',
                    latlng: [],
                    region: ''
                } : null}
            />

            <AgeSelect
                age={age.toString()}
                onAgeChange={(e: string) => onUpdate({ age: parseInt(e) || 18 })}
            />

            <HeightWeightInput
                height={height}
                weight={weight}
                onHeightChange={(height: number) => onUpdate({ height })}
                onWeightChange={(weight: Weight) => onUpdate({ weight })}
            />
        </View>
    );
}