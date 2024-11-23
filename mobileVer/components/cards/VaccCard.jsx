import { View, Text } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const VaccCard = ({ vaccCardName, containerStyles }) => {
  return (
    <View 
      className={`bg-rose-600 p-4 w-1/2 ${containerStyles}`} 
      style={{ height: 150, borderRadius: 15, position: 'relative' }} 
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-bold text-white">{vaccCardName}</Text>
        </View>
      </View>

      <View className="absolute bottom-3 right-3">
        <MaterialIcons name="vaccines" size={33} color="white" />
      </View>
    </View>
  );
}

export default VaccCard;
