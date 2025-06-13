import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TextInput, Button, Text, Title, useTheme } from "react-native-paper";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Ejemplo
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://172.24.98.189:4000/api/auth/login", {
        correo,
        contrasena,
      });
      if (res.data.usuario) {
        navigation.replace("Home", { usuario: res.data.usuario });
      } else {
        Alert.alert("Error", "No se pudo obtener el usuario");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Title style={styles.title}>Servicios del Hogar</Title>
        <TextInput
          label="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          label="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        >
          Ingresar
        </Button>
        <Text
          style={[styles.link, { color: theme.colors.primary }]}
          onPress={() => navigation.navigate("Register")}
        >
          ¿No tienes cuenta? Regístrate
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
