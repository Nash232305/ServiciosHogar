import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Title, useTheme, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function CreateServiceScreen({ route, navigation }) {
  const { usuario } = route.params || {};
  const theme = useTheme();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  // Seleccionar imagen
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permiso para acceder a galería es requerido.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.cancelled) {
      setImagen(result.assets ? result.assets[0].uri : result.uri); // para SDK 48+
    }
  };

  // Enviar al backend
  const handleSubmit = async () => {
    if (!titulo || !descripcion || !precio || !categoria) {
      alert("Completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("categoria", categoria);
      formData.append("proveedorId", usuario.id);
      if (imagen) {
        let filename = imagen.split("/").pop();
        let type = `image/${filename.split(".").pop()}`;
        formData.append("imagen", {
          uri: imagen,
          name: filename,
          type,
        });
      }
      await axios.post(
        "http://172.24.98.189:4000/api/servicios/crear",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Servicio creado correctamente");
      navigation.goBack();
    } catch (error) {
      alert("Error al crear servicio");
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear Nuevo Servicio</Title>
      <Text style={styles.label}>Proveedor: {usuario?.nombre}</Text>
      <TextInput
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
        multiline
      />
      <TextInput
        label="Precio"
        value={precio}
        onChangeText={setPrecio}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        label="Categoría"
        value={categoria}
        onChangeText={setCategoria}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imageBtn}>
        <Text style={{ color: theme.colors.primary }}>
          {imagen ? "Cambiar imagen" : "Seleccionar imagen"}
        </Text>
      </TouchableOpacity>
      {imagen && (
        <Image
          source={{ uri: imagen }}
          style={{
            width: 140,
            height: 140,
            alignSelf: "center",
            margin: 8,
            borderRadius: 12,
          }}
        />
      )}

      <Button
        mode="contained"
        loading={loading}
        style={styles.btn}
        onPress={handleSubmit}
      >
        Crear Servicio
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    alignSelf: "center",
  },
  label: { marginBottom: 8, color: "#333", alignSelf: "center" },
  input: { marginBottom: 14 },
  btn: { marginTop: 18 },
  imageBtn: { alignSelf: "center", marginBottom: 8 },
});
