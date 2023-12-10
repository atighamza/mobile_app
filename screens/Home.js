import { View, Text } from "react-native";
import React, { useEffect } from "react";
import MyAccount from "./HomeScreens/MyAccount";
import ListProfils from "./HomeScreens/ListProfils";
import Groupe from "./HomeScreens/Groupe";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ChatScreen from "./ChatScreens/Chat";
import useAuth from "../hooks/useAuth";
const Tab = createMaterialBottomTabNavigator();

export default function Home({ navigation }) {
  const [currentUserID, setCurrentUserID] = useAuth();
  useEffect(() => {
    console.log("home userId :", currentUserID);
  }, []);
  return (
    <Tab.Navigator>
      <Tab.Screen name="listprofils" component={ListProfils} />
      <Tab.Screen name="groupe" component={Groupe} />
      <Tab.Screen name="myAccount" component={MyAccount} />
    </Tab.Navigator>
  );
}
