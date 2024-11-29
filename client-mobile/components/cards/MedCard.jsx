import { View, Text } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';



const MedCard = ({ height, weight, hbeat, bmi, hemo, ethni, containerStyles, isModal }) => {
  return (
    <View style={{ borderRadius: 35, ...containerStyles }} className="bg-black p-6 space-y-4">
      <View className="space-y-3">
        
      <View className="flex-row justify-between mb-2">
          <Text className="text-2xl font-bold text-white">Medical Card</Text>
          <FontAwesome5 name="file-medical" size={30} color="skyblue" />
        </View>

        {/* Height */}
        {height && (
          <View className="flex-row justify-between">
            <Text className="text-sm font-sfmedium text-white">Height</Text>
            <Text className="text-xl font-sfbold text-white">{height}<Text className="text-base font-sfbold text-white">ft</Text></Text>
          </View>
        )}

        {/* Weight */}
        {weight && (
          <View className="flex-row justify-between">
            <Text className="text-sm font-sfmedium text-white">Weight</Text>
            <Text className="text-xl font-sfbold text-white">{weight}<Text className="text-base font-sfbold text-white">lbs</Text></Text>
          </View>
        )}

        {/* Heart Beat */}
        {hbeat && (
          <View className="flex-row justify-between">
            <Text className="text-sm font-sfmedium text-white">Heart Beat</Text>
            <Text className="text-xl font-sfbold text-white">{hbeat}<Text className="text-base font-sfbold text-white"> bpm</Text></Text>
          </View>
        )}

        {/* BMI */}
        {bmi && (
          <View className="flex-row justify-between">
            <Text className="text-sm font-sfmedium text-white">BMI</Text>
            <Text className="text-xl font-sfbold text-white">{bmi}</Text>
          </View>
        )}

        {/* Hemoglobin */}
        {hemo && (
          <View className="flex-row justify-between">
            <Text className="text-sm font-sfmedium text-white">Hemoglobin</Text>
            <Text className="text-xl font-sfbold text-white">{hemo}<Text className="text-base font-sfbold text-white"> gm</Text></Text>
          </View>
        )}
        
       
        {isModal && (
          <View className="flex-row justify-between">
          <Text className="text-sm font-sfmedium text-white">Ethnicity</Text>
          <Text className="text-xl font-sfbold text-white">{ethni}<Text className="text-base font-sfbold text-white"></Text></Text>
        </View>
        )}
      </View>
    </View>
  );
};

export default MedCard;
