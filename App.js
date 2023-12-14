import { View, Text } from "react-native";
import React from "react";
import Auth from "./screens/Auth";
import NewUser from "./screens/NewUser";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import AuthProvider from "./AuthProvider";
import ListProfils from "./screens/HomeScreens/ListProfils";
import GroupChat from "./screens/ChatScreens/GroupChat";
import Groupe from "./screens/HomeScreens/Groupe";
import Chat from "./screens/ChatScreens/Chat";
import ChatInformations from "./screens/ChatScreens/ChatInformations";
import GroupImages from "./components/GroupImages";
import GroupMembers from "./components/GroupMembers";
import Test from "./screens/Test";
import MyAccount from "./screens/HomeScreens/MyAccount";
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
          <Stack.Screen name="grp" component={GroupMembers} />
          <Stack.Screen name="chatInformations" component={ChatInformations} />
          <Stack.Screen name="groupImages" component={GroupImages} />
          <Stack.Screen name="groupMembers" component={GroupMembers} />
          <Stack.Screen name="test" component={Test} />
          <Stack.Screen name="myAccount" component={MyAccount} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
