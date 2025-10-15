
import ErrorMessage from "@/components/error-message";
import LoadingIndicator from "@/components/loading-indicator";
import useAuthStore from "@/hooks/use-auth-store";
import { TrainingDayDTO } from "@/state/endpoints/api.schemas";
import { useFindTrainingsForCalendar } from "@/state/endpoints/trainings";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarBottomSheet from "./components/calendar-bottom-sheet";

export default function CalendarScreen() {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return router.replace("/(auth)/sign-in");
    }

    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const [selected, setSelected] = useState<string>("");
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
    const [selectedTraining, setSelectedTraining] = useState<TrainingDayDTO | null>(null);

    const {
        data: monthTrainings,
        isLoading,
        error,
    } = useFindTrainingsForCalendar(
        {
            userId: user.id,
            year: currentYear,
            month: currentMonth,
        },
        {
            query: {
                staleTime: 5 * 60 * 1000,
                enabled: !!user.id && currentMonth >= 1 && currentMonth <= 12,
            },
        }
    );

    const bottomSheetRef = useRef<BottomSheet>(null);

    const date = selectedTraining
        ? `${selectedTraining.trainedAtDay}.${selectedTraining.trainedAtMonth}.${selectedTraining.trainedAtYear}`
        : "";

    const expandBottomSheet = useCallback(() => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.expand();
        }
    }, []);

    const closeBottomSheet = useCallback(() => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.close();
        }
    }, []);

    const selectTrainingDay = (day: DateData) => {
        setSelected(day.dateString);

        const trainingForDay = markedDates[day.dateString]?.training;
        if (trainingForDay) {
            setSelectedTraining(trainingForDay);
            expandBottomSheet();
        }
    };

    const onClose = () => closeBottomSheet();

    // Update marked dates whenever we get new training data for the month
    useEffect(() => {
        if (!monthTrainings) return;

        const newMarkedDates: { [key: string]: any } = {};

        monthTrainings.trainings.forEach((training: TrainingDayDTO) => {
            const trainingDate = `${training.trainedAtYear}-${String(
                training.trainedAtMonth
            ).padStart(2, "0")}-${String(training.trainedAtDay).padStart(2, "0")}`;

            newMarkedDates[trainingDate] = {
                selected: trainingDate === selected,
                marked: true,
                disableTouchEvent: false,
                training: training,
                dotColor: "#2AB38E",
            };
        });

        setMarkedDates(newMarkedDates);
    }, [monthTrainings, selected]);

    return (
        <>
            <SafeAreaView className="h-full bg-primary">
                {isLoading ? (
                    <LoadingIndicator />
                ) : error ? (
                    <ErrorMessage message="Failed to load trainings. Please try again." />
                ) : (
                    <ScrollView>
                        <Calendar
                            theme={{
                                calendarBackground: "transparent",
                                textSectionTitleColor: "#ffffff",
                                selectedDayBackgroundColor: "#2AB38E",
                                selectedDayTextColor: "#ffffff",
                                todayTextColor: "#2AB38E",
                                dayTextColor: "#ffffff",
                                textDisabledColor: "transparent",
                                monthTextColor: "#2AB38E",
                                textMonthFontSize: 20,
                                arrowColor: "#ffffff",
                                textMonthFontFamily: "font-pRegular",
                            }}
                            disableMonthChange={false}
                            current={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
                            enableSwipeMonths={true}
                            onDayPress={(day: DateData) => {
                                if (markedDates[day.dateString]) {
                                    selectTrainingDay(day);
                                }
                            }}
                            onMonthChange={(month: DateData) => {
                                setCurrentMonth(month.month);
                                setCurrentYear(month.year);
                                setSelected("");
                                setSelectedTraining(null);
                                closeBottomSheet();
                            }}
                            markedDates={{ ...markedDates }}
                        />
                    </ScrollView>
                )}

                {selectedTraining && (
                    <CalendarBottomSheet
                        ref={bottomSheetRef}
                        training={selectedTraining}
                        title={date}
                        onClose={onClose}
                    />
                )}
            </SafeAreaView>
        </>
    );
}