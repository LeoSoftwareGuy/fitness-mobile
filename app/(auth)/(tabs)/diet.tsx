import LoadingIndicator from '@/components/loading-indicator';
import { icons, images } from '@/constants';
import { analyzeNutritionImage } from '@/api/nutrition-ai';
import {
  useCreateNutritionIntake,
  useDeleteNutritionIntake,
} from '@/state/endpoints/nutrition-intakes';
import { findNutritionIntakes } from '@/state/endpoints/nutrition-intakes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { format, startOfDay } from 'date-fns';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabKey = 'daily' | 'ai';

type IntakeForm = {
  protein: string;
  carbs: string;
  fats: string;
  calories: string;
  mealName: string;
};

const initialForm: IntakeForm = {
  protein: '',
  carbs: '',
  fats: '',
  calories: '',
  mealName: '',
};

export default function DietScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('daily');
  const [selectedDate] = useState<Date>(new Date());
  const [form, setForm] = useState<IntakeForm>(initialForm);
  const [analyzing, setAnalyzing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['nutrition-intakes', selectedDate],
    queryFn: ({ signal }) =>
      findNutritionIntakes(
        {
          consumedOn: startOfDay(selectedDate),
          pageSize: 50,
          page: 1,
          all: true,
        },
        signal,
      ),
  });

  const createMutation = useCreateNutritionIntake(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['nutrition-intakes'],
          });
          setForm(initialForm);
        },
      },
    },
    queryClient,
  );

  const deleteMutation = useDeleteNutritionIntake(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['nutrition-intakes'],
          });
        },
      },
    },
    queryClient,
  );

  const totals = useMemo(() => {
    const items = data?.items ?? [];
    return items.reduce(
      (acc, cur) => ({
        protein: acc.protein + (cur.protein ?? 0),
        carbs: acc.carbs + (cur.carbohydrates ?? 0),
        fats: acc.fats + (cur.fats ?? 0),
        calories: acc.calories + (cur.calories ?? 0),
      }),
      { protein: 0, carbs: 0, fats: 0, calories: 0 },
    );
  }, [data?.items]);

  const handleSave = () => {
    const protein = Number(form.protein);
    const carbs = Number(form.carbs);
    const fats = Number(form.fats);
    const calories = Number(form.calories);

    if ([protein, carbs, fats, calories].some((v) => Number.isNaN(v))) {
      Alert.alert('Validation', 'Please enter numeric values for macros.');
      return;
    }

    createMutation.mutate({
      data: {
        protein,
        carbohydrates: carbs,
        fats,
        calories,
        mealName: form.mealName || undefined,
        consumedAt: new Date(),
        source: imageUri ? 'AI' : 'Manual',
      },
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Remove this intake?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  };

  const pickImage = async (mode: 'camera' | 'library') => {
    const permission =
      mode === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera or library access is needed.');
      return;
    }

    const result =
      mode === 'camera'
        ? await ImagePicker.launchCameraAsync({
            quality: 0.4,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            quality: 0.4,
            base64: true,
          });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (asset?.uri) {
      setImageUri(asset.uri);
      if (asset.base64) {
        setImageBase64(asset.base64);
      } else {
        setImageBase64(null);
      }
    }
  };

  const runAiAnalysis = async () => {
    if (!imageBase64) {
      Alert.alert('No image', 'Capture or select a meal image first.');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeNutritionImage(imageBase64, form.mealName || undefined);
      setForm((prev) => ({
        ...prev,
        protein: result.protein.toString(),
        carbs: result.carbohydrates.toString(),
        fats: result.fats.toString(),
        calories: result.calories.toString(),
        mealName: result.mealName || prev.mealName || 'AI meal',
      }));
      if (!imageUri) {
        setImageUri(result.imageUrl);
      }
      Alert.alert('AI analysis', 'Macros estimated. Review and save.');
    } catch (error) {
      Alert.alert('AI error', 'Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const renderTabs = () => (
    <View className="flex-row bg-[#293240] rounded-2xl p-1 mt-3 mb-4">
      {(['daily', 'ai'] as TabKey[]).map((key) => {
        const selected = activeTab === key;
        return (
          <TouchableOpacity
            key={key}
            className={`flex-1 py-2 rounded-xl ${
              selected ? 'bg-[#006F52]' : 'bg-transparent'
            }`}
            onPress={() => setActiveTab(key)}
          >
            <Text className="text-center text-white font-pText">
              {key === 'daily' ? 'Daily intake' : 'AI capture'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderIntakeList = () => {
    if (isLoading) return <LoadingIndicator />;

    const items = data?.items ?? [];
    return (
      <View className="mt-3">
        {items.length === 0 ? (
          <Text className="text-white text-center">No intake logged yet.</Text>
        ) : (
          items.map((item) => (
            <View
              key={item.id}
              className="bg-[#1a222e] rounded-2xl p-3 mb-2 flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  {item.mealName || 'Meal'}
                </Text>
                <Text className="text-gray-300 text-sm">
                  {format(new Date(item.consumedAt), 'HH:mm')} · P
                  {item.protein} C{item.carbohydrates} F{item.fats} ·{' '}
                  {item.calories} kcal
                </Text>
                {item.source && (
                  <Text className="text-gray-400 text-xs mt-1">
                    Source: {item.source}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id!)}
                className="px-3 py-2 bg-[#3a4554] rounded-lg"
              >
                <Text className="text-red-300 font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
  };

  const renderForm = () => (
    <View className="bg-[#1a222e] rounded-2xl p-3 mt-3">
      <Text className="text-white font-semibold mb-2">Add intake</Text>
      <View className="flex-row gap-2">
        <TextInput
          placeholder="Protein"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={form.protein}
          onChangeText={(text) => setForm((f) => ({ ...f, protein: text }))}
          className="flex-1 bg-[#0f1620] text-white rounded-xl px-3 py-2"
        />
        <TextInput
          placeholder="Carbs"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={form.carbs}
          onChangeText={(text) => setForm((f) => ({ ...f, carbs: text }))}
          className="flex-1 bg-[#0f1620] text-white rounded-xl px-3 py-2"
        />
      </View>
      <View className="flex-row gap-2 mt-2">
        <TextInput
          placeholder="Fats"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={form.fats}
          onChangeText={(text) => setForm((f) => ({ ...f, fats: text }))}
          className="flex-1 bg-[#0f1620] text-white rounded-xl px-3 py-2"
        />
        <TextInput
          placeholder="Calories"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={form.calories}
          onChangeText={(text) => setForm((f) => ({ ...f, calories: text }))}
          className="flex-1 bg-[#0f1620] text-white rounded-xl px-3 py-2"
        />
      </View>
      <TextInput
        placeholder="Meal name (optional)"
        placeholderTextColor="#9ca3af"
        value={form.mealName}
        onChangeText={(text) => setForm((f) => ({ ...f, mealName: text }))}
        className="bg-[#0f1620] text-white rounded-xl px-3 py-2 mt-2"
      />
      <TouchableOpacity
        onPress={handleSave}
        disabled={createMutation.isPending}
        className="mt-3 bg-[#006F52] rounded-xl py-3"
      >
        <Text className="text-center text-white font-semibold">
          {createMutation.isPending ? 'Saving...' : 'Save intake'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSummary = () => (
    <View className="bg-[#006F52] rounded-2xl p-3 mt-3">
      <Text className="text-white font-semibold mb-1">Daily total</Text>
      <Text className="text-white">
        Protein: {totals.protein.toFixed(1)} g
      </Text>
      <Text className="text-white">Carbs: {totals.carbs.toFixed(1)} g</Text>
      <Text className="text-white">Fats: {totals.fats.toFixed(1)} g</Text>
      <Text className="text-white">
        Calories: {totals.calories.toFixed(0)} kcal
      </Text>
    </View>
  );

  const renderAi = () => (
    <View className="mt-2">
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 bg-[#006F52] rounded-xl py-3"
          onPress={() => pickImage('camera')}
        >
          <Text className="text-white text-center font-semibold">
            Open camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-[#3a4554] rounded-xl py-3"
          onPress={() => pickImage('library')}
        >
          <Text className="text-white text-center font-semibold">
            Pick from library
          </Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-full h-48 rounded-2xl mt-3"
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        className="mt-3 bg-[#006F52] rounded-xl py-3"
        onPress={runAiAnalysis}
        disabled={analyzing}
      >
        <Text className="text-center text-white font-semibold">
          {analyzing ? 'Analyzing...' : 'Analyze image'}
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-300 text-sm mt-3">
        AI estimates populate the form below. Review and save to log the meal.
      </Text>
      {renderForm()}
    </View>
  );

  return (
    <ImageBackground source={images.logo} className="flex-1 px-2.5 py-0">
      <SafeAreaView edges={['left', 'right']}>
        <ScrollView className="my-0 w-full">
          <View className="px-2 w-full flex-row justify-between items-center">
            <TouchableOpacity onPress={() => router.push('/(calendar)/calendar')}>
              <Image
                source={icons.calendar}
                resizeMode="contain"
                className="mt-5 mx-auto"
              />
            </TouchableOpacity>
            <View className="flex-row items-center justify-between gap-1">
              <TouchableOpacity onPress={() => router.push('/(todays-workout)/todays-workout')}>
                <Image
                  source={icons.dumbel}
                  resizeMode="contain"
                  className="mt-5 mx-auto"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(profile)/profile')}>
                <Image
                  source={icons.bio}
                  resizeMode="contain"
                  className="mt-5 mx-auto"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-white text-xl font-pText mt-4">
            {format(selectedDate, 'MMMM dd, yyyy')}
          </Text>

          {renderTabs()}

          {activeTab === 'daily' ? (
            <>
              {renderSummary()}
              {renderIntakeList()}
              {renderForm()}
            </>
          ) : (
            renderAi()
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
