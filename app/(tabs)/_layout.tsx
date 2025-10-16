import icons from '@/constants/icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';

interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon = ({ icon, color }: TabIconProps) => {
  return (
    <View className="pt-2 items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-[50px] h-[50px]"
      />
    </View>
  )
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#006F52",
        tabBarInactiveTintColor: "#C4C4C4",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#293240",
          borderTopColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          borderRadius: 40,
          height: 80,
          paddingHorizontal: 20,
          paddingBottom: 15,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              focused={focused}
              name="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Stats",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.stats}
              color={color}
              focused={focused}
              name="Profile"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Diet",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.meal}
              color={color}
              focused={focused}
              name="Diet"
            />
          ),
        }}
      />
    </Tabs>
  );
}