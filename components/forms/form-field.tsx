import { Image, TextInput, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import React, { useState } from "react";

interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType?: string;
  placehorder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  keyboardType,
  placehorder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`${otherStyles}`}>
      <View
        className="py-[13px] pl-[17px] flex-row items-center w-full h-[48px]
       bg-gray rounded-xl "
      >
        <TextInput
          className="flex-1 text-white font-pRegular text-[16px]"
          value={value}
          placeholder={placehorder}
          placeholderTextColor="white"
          selectionColor="#006F52"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

/* Make flex-row and then flex-1 for element which you want to take all available space */
