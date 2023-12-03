import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import userPhoto from "../../assets/user.png";
import firebase from "../../config";
import { pickImage, imageToBlob } from "../../pickImage";

const database = firebase.database();
const storage = firebase.storage();

export default function MyAccount({ currentId }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numero, setNumero] = useState("");
  const [src, setSrc] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const createProfile = async () => {
    let url = await upload_Image();
    const ref_profils = database.ref("profile");
    const key = ref_profils.push().key;
    const ref_profil = ref_profils.child("profil" + key);
    ref_profil.set({
      id: currentId,
      nom,
      prenom,
      numero,
      url,
    });
  };

  const upload_Image = async () => {
    const blob = await imageToBlob(src);
    const ref = storage.ref("images").child("image.jpg");
    ref.put(blob);
    let url = await ref.getDownloadURL();
    console.log("url : ", url);
    return url;
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>MyAccount</Text>
      <TouchableOpacity
        onPress={async () => {
          let uri = await pickImage();
          setSrc(uri);
        }}
      >
        <Image
          source={src ? { uri: src } : userPhoto}
          style={{ width: 100, height: 100, marginVertical: 20 }}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.text_input}
        placeholder="Nom"
        placeholderTextColor="#FFF"
        onChangeText={(text) => setNom(text)}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Prenom"
        placeholderTextColor="#FFF"
        onChangeText={(text) => setPrenom(text)}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Numero"
        placeholderTextColor="#FFF"
        onChangeText={(text) => setNumero(text)}
      />
      <Button title="Create" onPress={createProfile} />
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
