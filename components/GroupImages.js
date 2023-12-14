import { View, Text, FlatList, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { PaperProvider, Portal } from "react-native-paper";

import {
  MaterialIcons,
  Fontisto,
  AntDesign,
  Foundation,
} from "@expo/vector-icons";
import firebase from "../config";
const database = firebase.database();
export default function GroupImages({ route }) {
  const { groupId, url, groupName } = route.params;

  const [images, setImages] = useState([]);
  useEffect(() => {
    const ref_group = database
      .ref()
      .child("groupChats")
      .child(groupId)
      .child("messages");

    const fetchImages = async () => {
      ref_group.orderByChild("data").on("value", (snapshot) => {
        const imagesArray = [];

        snapshot.forEach((message) => {
          if (message.val().hasOwnProperty("image")) {
            imagesArray.push({
              date: message.val().date,
              image: message.val().image,
            });
          }
        });
        const sortedImages = imagesArray.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setImages(sortedImages);
      });
    };

    fetchImages();
  }, []);

  return (
    <View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: 10,
          marginTop: 50,
          marginStart: 5,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 10,
            gap: 10,
          }}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Image
            source={{ uri: url }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
          />
          <Text>{groupName}</Text>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          marginVertical: 10,
        }}
      ></View>
      <View>
        <FlatList
          data={images}
          numColumns={3}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.image }}
              style={{ width: 100, height: 100, margin: 5 }}
            />
          )}
        />
      </View>
    </View>
  );
}
