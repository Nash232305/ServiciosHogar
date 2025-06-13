import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import axios from "axios";

export default function VerContratacionesScreen({ route }) {
  const { servicio } = route.params || {};
  const [contrataciones, setContrataciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContrataciones = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://172.24.98.189:4000/api/contrataciones/listar?servicioId=${servicio.id}`
      );
      setContrataciones(res.data.filter((c) => c.servicioId === servicio.id));
    } catch (err) {
      Alert.alert("Error", "No se pudieron cargar las contrataciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContrataciones();
  }, []);

  // Cambiar estado
  const handleCambiarEstado = async (id, estado) => {
    Alert.alert(
      "Cambiar estado",
      `¿Seguro que deseas marcar esta contratación como "${estado}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await axios.put(
                `http://172.24.98.189:4000/api/contrataciones/estado/${id}`,
                { estado }
              );
              fetchContrataciones();
            } catch (error) {
              Alert.alert("Error", "No se pudo actualizar el estado");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Contrataciones de: {servicio?.titulo}</Title>
      <FlatList
        data={contrataciones}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text>No hay contrataciones para este servicio.</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Paragraph>Cliente ID: {item.clienteId}</Paragraph>
              <Paragraph>Fecha: {item.fecha}</Paragraph>
              <Paragraph>
                Estado:{" "}
                <Text style={{ fontWeight: "bold" }}>{item.estado}</Text>
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              {item.estado !== "aceptada" && (
                <Button
                  onPress={() => handleCambiarEstado(item.id, "aceptada")}
                >
                  Aceptar
                </Button>
              )}
              {item.estado !== "rechazada" && (
                <Button
                  onPress={() => handleCambiarEstado(item.id, "rechazada")}
                >
                  Rechazar
                </Button>
              )}
              {item.estado !== "completada" && (
                <Button
                  onPress={() => handleCambiarEstado(item.id, "completada")}
                >
                  Completar
                </Button>
              )}
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    alignSelf: "center",
  },
  card: { marginBottom: 14, borderRadius: 12 },
});
