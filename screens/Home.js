import { View, Text } from "react-native";
import React from "react";
import MyAccount from "./HomeScreens/MyAccount";
import ListProfils from "./HomeScreens/ListProfils";
import Groupe from "./HomeScreens/Groupe";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  //const currentId = props.currentId;
  return (
    <Tab.Navigator>
      <Tab.Screen name="listprofils" component={ListProfils} />
      <Tab.Screen name="groupe" component={Groupe} />
      <Tab.Screen name="myAccount" component={MyAccount} />
    </Tab.Navigator>
  );
}
