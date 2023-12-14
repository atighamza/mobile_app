import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import React from "react";
import userPhoto from "../../assets/user.png";
import firebase from "../../config";
import { pickImage, imageToBlob } from "../../pickImage";
import { AuthContext } from "../../AuthProvider";
import { useIsFocused } from "@react-navigation/native";
import { Storage } from "expo-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const database = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth();

export default function MyAccount({ navigation }) {
  //to check if screen is focused (if true reload the user data )
  const screenIsFocused = useIsFocused();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numero, setNumero] = useState("");
  const [src, setSrc] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [currentProfile, setCurrentProfile] = useState(null);
  const { currentUserID, setCurrentUserID } = useContext(AuthContext);

  const updateProfile = async () => {
    console.log("updating profile");
    //upload image only when src has changed
    let url;
    if (src) {
      url = await upload_Image();
    } else {
      url = currentProfile.url;
    }

    const ref_profils = database.ref("profile");
    let existingProfileKey = null;
    ref_profils.once("value", (snapshot) => {
      snapshot.forEach((profil) => {
        if (profil.val().id === currentUserID) {
          existingProfileKey = profil.key;
        }
      });
    });
    const ref_profil = ref_profils.child(existingProfileKey);
    await ref_profil.update({
      nom,
      prenom,
      url,
    });
    Alert.alert("Updated", " account updated successfully", [
      {
        text: "ok",
        onPress: () => {},
        style: "cancel",
      },
    ]);
    console.log("updated ", existingProfileKey);
  };
  const createProfile = async () => {
    console.log("creating profile");
    if (!nom) {
      alert("first name is required");
      return;
    }

    if (!prenom) {
      alert("last name is required");
      return;
    }
    if (!src) {
      alert("Image is required");
      return;
    }
    let url = await upload_Image(src);
    console.log("image uploaded");
    const ref_profils = database.ref("profile");

    const key = ref_profils.push().key;
    const ref_profil = ref_profils.child("profil" + key);
    await ref_profil.set({
      id: currentUserID,
      nom,
      prenom,
      url,
    });
    console.log("created");
  };

  const handleClickButton = async () => {
    if (currentProfile) {
      await updateProfile();
    } else {
      await createProfile();
    }
  };

  const upload_Image = async () => {
    console.log("blob : ", src);
    const blob = await imageToBlob(src);
    const ref = storage.ref("images").child(`image${currentUserID}.jpg`);
    await ref.put(blob);
    let url = await ref.getDownloadURL();
    console.log("url : ", url);
    return url;
  };

  const showConfirmDialog = () => {
    Alert.alert("Sign out", "are you sure to sign out ?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          signOut();
        },
      },
    ]);
  };
  const signOut = async () => {
    auth
      .signOut()
      .then(async () => {
        await Storage.removeItem({ key: "currentUserID" });
        setCurrentUserID(null);
        navigation.replace("auth");
      })
      .catch((error) => {
        console.log("signout failed");
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      database.ref("profile").on("value", (snapshot) => {
        snapshot.forEach((profil) => {
          if (profil.val().id == currentUserID) {
            console.log("found my id ", profil.val());
            setCurrentProfile(profil.val());
            setNom(profil.val().nom);
            setPrenom(profil.val().prenom);
            setNumero(profil.val().numero);
          }
        });
      });
    };
    console.log("fetched data ");
    console.log("user id :", currentUserID);
    fetchData();
  }, [screenIsFocused]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showConfirmDialog}
        style={{
          position: "absolute",
          top: 50,
          right: 20,
        }}
      >
        <MaterialCommunityIcons name="logout" size={40} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 30 }}>MyAccount</Text>
      <TouchableOpacity
        onPress={async () => {
          let uri = await pickImage();
          setSrc(uri);
        }}
      >
        <Image
          source={
            !src
              ? currentProfile
                ? { uri: currentProfile.url }
                : userPhoto
              : { uri: src }
          }
          style={{
            width: 100,
            height: 100,
            marginVertical: 20,
            borderRadius: 50,
          }}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.text_input}
        placeholder="first name"
        placeholderTextColor="#FFF"
        value={nom}
        onChangeText={(text) => setNom(text)}
      />
      <TextInput
        style={styles.text_input}
        placeholder="last name"
        placeholderTextColor="#FFF"
        value={prenom}
        onChangeText={(text) => setPrenom(text)}
      />
      <Button title="Create" onPress={() => handleClickButton()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text_input: {
    backgroundColor: "#0003",
    width: "60%",
    borderRadius: 10,
    padding: 10,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
});
