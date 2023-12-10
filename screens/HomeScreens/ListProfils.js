import { View, Text, FlatList, Image } from "react-native";
import { useState, useEffect, useContext } from "react";
import React from "react";
import firebase from "../../config";
import ProfilItem from "./ProfilItem";
import { Button, Dialog } from "react-native-paper";
import { AuthContext } from "../../AuthProvider";
const data = [];

const database = firebase.database();

export default function ListProfils({ navigation }) {
  const [profilsData, setProfilsData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [clickedProfile, setClickedProfile] = useState({});
  const { currentUserID, setCurrentUserID } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      let x = database.ref("profile").on("value", (snapshot) => {
        let data = [];
        snapshot.forEach((profil) => {
          if (profil.val().id != currentUserID) {
            data.push(profil.val());
          }
        });
        setProfilsData(data);
        //console.log("data : ", data);
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
        paddingTop: 30,
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
              id={item.id}
              clickedProfile={setClickedProfile}
              setClickedProfile={setClickedProfile}
              setIsVisible={setIsVisible}
              navigate={navigation}
            />
          );
        }}
      />
      {/*<Dialog visible={isVisible} onDismiss={() => {}}>
        <Dialog.Title>Details</Dialog.Title>
        <Dialog.Content>
          <Text>first name : {clickedProfile.firstName}</Text>
          <Text>last name :{clickedProfile.lastName} </Text>
          <Text>num :{clickedProfile.num} </Text>
          <Image
            resizeMethod="auto"
            style={{ width: 80, height: 80 }}
            source={{ uri: clickedProfile.url }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() =>
              props.navigation.navigate("chat", {
                currentProfile: clickedProfile,
              })
            }
          >
            Done
          </Button>
          <Button>Cancel</Button>
        </Dialog.Actions>
          </Dialog>*/}
    </View>
  );
}
