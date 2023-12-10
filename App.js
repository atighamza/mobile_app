import { View, Text } from "react-native";
import React from "react";
import Auth from "./screens/Auth";
import NewUser from "./screens/NewUser";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import AuthProvider from "./AuthProvider";
import Chat from "./screens/ChatScreens/Chat";
import ListProfils from "./screens/HomeScreens/ListProfils";
import GroupChat from "./screens/ChatScreens/GroupChat";
import Groupe from "./screens/HomeScreens/Groupe";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="auth"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="auth" component={Auth} />
          <Stack.Screen name="newUser" component={NewUser} />
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="listProfils" component={ListProfils} />
          <Stack.Screen name="groupe" component={Groupe} />
          <Stack.Screen name="chat" component={Chat} />
          <Stack.Screen name="groupChat" component={GroupChat} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
