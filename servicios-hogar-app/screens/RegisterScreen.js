import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import { TextInput, Button, Text, Title, useTheme } from "react-native-paper";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState(""); // <-- CAMBIO
  const [rol, setRol] = useState("cliente");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post("http://172.24.98.189:4000/api/auth/registro", {
        nombre,
        correo,
        contrasena, // <-- CAMBIO
        rol,
      });
      alert("Registro exitoso, ¡ya puedes iniciar sesión!");
      navigation.replace("Login");
    } catch (error) {
      console.log("ERROR AXIOS:", error);
      Alert.alert("Error de conexión", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Title style={styles.title}>Registro</Title>
        <TextInput
          label="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TextInput
          label="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Rol (cliente/proveedor)"
          value={rol}
          onChangeText={setRol}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          style={styles.button}
        >
          Registrar
        </Button>
        <Text
          style={[styles.link, { color: theme.colors.primary }]}
          onPress={() => navigation.navigate("Login")}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 28, flex: 1, justifyContent: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    alignSelf: "center",
  },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 5 },
  link: { marginTop: 22, textAlign: "center", fontWeight: "bold" },
});
