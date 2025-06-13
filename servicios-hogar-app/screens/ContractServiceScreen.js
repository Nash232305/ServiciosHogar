import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Title, Text } from "react-native-paper";
import axios from "axios";

export default function ContractServiceScreen({ route, navigation }) {
  const { servicio, usuario } = route.params || {};
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContratar = async () => {
    if (!fecha) {
      Alert.alert("Atención", "Debes ingresar una fecha para la contratación.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://172.24.98.189:4000/api/contrataciones/crear", {
        clienteId: usuario.id,
        servicioId: servicio.id,
        fecha,
        estado: "pendiente",
      });
      Alert.alert("¡Listo!", "Contratación realizada correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Contratar Servicio</Title>
      <Text style={styles.label}>Servicio: {servicio?.titulo}</Text>
      <Text style={styles.label}>Proveedor: {servicio?.proveedorId}</Text>
      <TextInput
        label="Fecha (AAAA-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
        placeholder="2025-07-01"
      />
      <Button
        mode="contained"
        loading={loading}
        onPress={handleContratar}
        style={styles.button}
      >
        Contratar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: { marginBottom: 10, fontSize: 16 },
  input: { marginBottom: 16 },
  button: { marginTop: 16 },
});
