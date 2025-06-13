import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Title, Text, Card } from "react-native-paper";
import axios from "axios";

// Componente simple de estrellitas (puedes usar una librería si prefieres)
function StarRating({ rating, onRate }) {
  return (
    <View
      style={{ flexDirection: "row", alignSelf: "center", marginVertical: 6 }}
    >
      {[1, 2, 3, 4, 5].map((num) => (
        <Text
          key={num}
          style={{
            fontSize: 30,
            color: num <= rating ? "#FFD600" : "#ccc",
            marginHorizontal: 2,
          }}
          onPress={() => onRate(num)}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

export default function CommentsScreen({ route }) {
  const { servicio, usuario } = route.params || {};
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComentarios = async () => {
    try {
      const res = await axios.get(
        `http://172.24.98.189:4000/api/comentarios/servicio/${servicio.id}`
      );
      setComentarios(res.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los comentarios");
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  const handleComentar = async () => {
    if (!comentario || comentario.trim().length < 5) {
      Alert.alert(
        "Atención",
        "El comentario debe tener al menos 5 caracteres."
      );
      return;
    }
    if (calificacion < 1 || calificacion > 5) {
      Alert.alert("Atención", "La calificación debe estar entre 1 y 5.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`http://172.24.98.189:4000/api/comentarios/crear`, {
        comentario,
        calificacion,
        clienteId: usuario.id,
        servicioId: servicio.id,
      });
      setComentario("");
      setCalificacion(5);
      fetchComentarios();
      Alert.alert("¡Listo!", "Comentario publicado correctamente");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Comentarios y Calificación</Title>
      <Text style={styles.label}>Servicio: {servicio?.titulo}</Text>
      <Text style={styles.label}>Califica el servicio:</Text>
      <StarRating rating={calificacion} onRate={setCalificacion} />
      <TextInput
        label="Comentario"
        value={comentario}
        onChangeText={setComentario}
        style={styles.input}
        multiline
      />
      <Button
        mode="contained"
        loading={loading}
        onPress={handleComentar}
        style={styles.button}
      >
        Comentar
      </Button>
      <Title style={styles.titleSec}>Otros comentarios</Title>
      {comentarios.length === 0 && (
        <Text style={styles.label}>No hay comentarios aún.</Text>
      )}
      {comentarios.map((c) => (
        <Card key={c.id} style={styles.commentCard}>
          <Card.Content>
            <Text style={{ fontWeight: "bold" }}>
              Cliente ID: {c.clienteId}
            </Text>
            <Text>
              {"★".repeat(c.calificacion)}
              {"☆".repeat(5 - c.calificacion)}
            </Text>
            <Text>{c.comentario}</Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  label: { marginVertical: 6, color: "#222" },
  input: { marginBottom: 12 },
  button: { marginTop: 10, marginBottom: 16 },
  titleSec: { fontSize: 18, marginTop: 18, marginBottom: 4 },
  commentCard: { marginBottom: 10, backgroundColor: "#f8f8f8" },
});
