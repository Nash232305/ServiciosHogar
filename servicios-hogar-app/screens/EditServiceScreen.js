import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Title, Text, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function EditServiceScreen({ route, navigation }) {
  const { servicio, usuario } = route.params || {};
  const theme = useTheme();

  const [titulo, setTitulo] = useState(servicio?.titulo || "");
  const [descripcion, setDescripcion] = useState(servicio?.descripcion || "");
  const [precio, setPrecio] = useState(String(servicio?.precio || ""));
  const [categoria, setCategoria] = useState(servicio?.categoria || "");
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mostrar imagen previa o seleccionada
  const displayImage = imagen
    ? { uri: imagen }
    : servicio?.imagen
    ? { uri: `http://172.24.98.189:4000/uploads/${servicio.imagen}` }
    : null;

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

  // Guardar cambios
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
      // Solo se envía nueva imagen si el usuario la cambió
      if (imagen) {
        let filename = imagen.split("/").pop();
        let type = `image/${filename.split(".").pop()}`;
        formData.append("imagen", {
          uri: imagen,
          name: filename,
          type,
        });
      }
      await axios.put(
        `http://172.24.98.189:4000/api/servicios/${servicio.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Alert.alert("Listo", "Servicio actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error al editar",
        error.response?.data?.error || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Editar Servicio</Title>
      <Text style={styles.label}>ID: {servicio?.id}</Text>
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
          {displayImage ? "Cambiar imagen" : "Seleccionar imagen"}
        </Text>
      </TouchableOpacity>
      {displayImage && (
        <Image
          source={displayImage}
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
        Guardar Cambios
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
