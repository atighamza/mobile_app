import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import firebase from "../../config";
import ProfilItem from "./ProfilItem";
const data = [];

const database = firebase.database();

export default function ListProfils() {
  const [profilsData, setProfilsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let x = database.ref("profile").on("value", (snapshot) => {
        let data = [];
        console.log("profils");
        snapshot.forEach((profil) => {
          console.log("profil : ", profil.val());
          data.push(profil.val());
        });
        setProfilsData(data);
        //console.log("snapshot : ", snapshot.val());
      });
    };
    fetchData();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 30 }}>List profils</Text>
      <FlatList
        style={{
          width: "95%",
          marginBottom: 20,
          height: "80%",

          flexGrow: 0,
        }}
        data={profilsData}
        renderItem={({ item }) => {
          return (
            <ProfilItem
              firstName={item.nom}
              lastName={item.prenom}
              num={item.numero}
              url={item.url}
            />
          );
        }}
      />
    </View>
  );
}
