import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center">
            <MaterialIcons 
                name={icon}  
                size={33}
                color={color} 
            />
            {focused && (
                <Text className="font-sfbold text-sm mt-1" style={{ color }}>
                    {name}
                </Text>
            )}
        </View>
    );
};

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#3478f5', // Bright red for active tabs, like the image
                    tabBarInactiveTintColor: '#8e8e93', // Light grey for inactive tabs
                    tabBarStyle: {
                        backgroundColor: '#f2f2f7',  // Light background like the image
                        borderRadius: 0,  // Softer rounding
                        marginHorizontal: 0,
                        paddingTop: 10,
                        height: 100,  // Adjusted height
                        position: 'absolute',
                        bottom: 0,  // Space from the bottom
                        paddingHorizontal: 20, 
                        paddingVertical: 10,  // More padding for a clean layout
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        borderTopWidth: 1,  // Add a small top border
                        borderTopColor: '#d1d1d6',  // Light color for the border
                    },
                }}
            >
                <Tabs.Screen 
                    name="home" 
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon="favorite"
                                color={color}
                                name="Summary"
                               
                            />
                        ),
                    }} 
                />
                <Tabs.Screen 
                    name="records" 
                    options={{
                        title: 'Bookmark',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon="article"
                                color={color}
                                name="Records"
                                
                            />
                        ),
                    }} 
                />
              
                <Tabs.Screen 
                    name="profile" 
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon="settings"
                                color={color}
                                name="Profile"
                                
                            />
                        ),
                    }} 
                />
            </Tabs>
        </>
    );
};

export default TabsLayout;
