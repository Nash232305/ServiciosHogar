import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { Card, Title, Paragraph, Button, Text, FAB } from "react-native-paper";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ route, navigation }) {
  const usuario = route.params?.usuario || {};
  const [servicios, setServicios] = useState([]);
  const [misServicios, setMisServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función de logout
  const handleLogout = () => {
    navigation.replace("Login");
  };

  // Cargar servicios desde backend
  const fetchServicios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://172.24.98.189:4000/api/servicios/listar"
      );
      setServicios(res.data);
      if (usuario.rol === "proveedor") {
        setMisServicios(res.data.filter((s) => s.proveedorId === usuario.id));
      }
    } catch (err) {
      Alert.alert("Error", "No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  // Refresca cada vez que la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      fetchServicios();
    }, [usuario])
  );

  // Eliminar servicio
  const handleEliminar = (servicioId) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de eliminar este servicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `http://172.24.98.189:4000/api/servicios/${servicioId}`
              );
              fetchServicios(); // Refresca la lista
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el servicio");
            }
          },
        },
      ]
    );
  };

  // Vista para PROVEEDOR
  if (usuario.rol === "proveedor") {
    return (
      <View style={styles.container}>
        <Button
          mode="text"
          icon="logout"
          onPress={handleLogout}
          style={{ alignSelf: "flex-end", marginBottom: 10 }}
        >
          Salir
        </Button>
        <Text variant="titleLarge" style={styles.title}>
          Bienvenido, {usuario.nombre}
        </Text>
        <Text style={styles.subtitle}>Tus servicios publicados:</Text>
        <FlatList
          data={misServicios}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchServicios} />
          }
          ListEmptyComponent={<Text>No has publicado servicios aún.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated">
              {item.imagen && (
                <Card.Cover
                  source={{
                    uri: `http://172.24.98.189:4000/uploads/${item.imagen}`,
                  }}
                  style={styles.cardImage}
                />
              )}
              <Card.Content>
                <Title style={styles.cardTitle}>{item.titulo}</Title>
                <Paragraph>{item.descripcion}</Paragraph>
                <Text style={styles.precio}>₡{item.precio}</Text>
                <Text>Categoría: {item.categoria}</Text>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                <Button
                  icon="pencil"
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("EditService", {
                      servicio: item,
                      usuario,
                    })
                  }
                  style={styles.actionBtn}
                >
                  Editar
                </Button>
                <Button
                  icon="delete"
                  mode="contained"
                  onPress={() => handleEliminar(item.id)}
                  style={[styles.actionBtn, { backgroundColor: "#E57373" }]}
                >
                  Eliminar
                </Button>
                <Button
                  icon="account-multiple"
                  mode="contained"
                  onPress={() =>
                    navigation.navigate("VerContrataciones", {
                      servicio: item,
                      usuario,
                    })
                  }
                  style={styles.actionBtn}
                >
                  Ver contrataciones
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          label="Crear servicio"
          onPress={() => navigation.navigate("CreateService", { usuario })}
        />
      </View>
    );
  }

  // Vista para CLIENTE
  if (usuario.rol === "cliente") {
    return (
      <View style={styles.container}>
        <Button
          mode="text"
          icon="logout"
          onPress={handleLogout}
          style={{ alignSelf: "flex-end", marginBottom: 10 }}
        >
          Salir
        </Button>
        <Text variant="titleLarge" style={styles.title}>
          Bienvenido, {usuario.nombre}
        </Text>
        <Text style={styles.subtitle}>
          Servicios disponibles para contratar:
        </Text>
        <FlatList
          data={servicios}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchServicios} />
          }
          ListEmptyComponent={<Text>No hay servicios disponibles.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated">
              {item.imagen && (
                <Card.Cover
                  source={{
                    uri: `http://172.24.98.189:4000/uploads/${item.imagen}`,
                  }}
                  style={styles.cardImage}
                />
              )}
              <Card.Content>
                <Title style={styles.cardTitle}>{item.titulo}</Title>
                <Paragraph>{item.descripcion}</Paragraph>
                <Text style={styles.precio}>₡{item.precio}</Text>
                <Text>Categoría: {item.categoria}</Text>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                <Button
                  icon="plus"
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("ContractService", {
                      servicio: item,
                      usuario,
                    })
                  }
                  style={styles.actionBtn}
                >
                  Contratar
                </Button>
                <Button
                  icon="star"
                  mode="contained"
                  onPress={() =>
                    navigation.navigate("CommentsScreen", {
                      servicio: item,
                      usuario,
                    })
                  }
                  style={styles.actionBtn}
                >
                  Comentarios
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      </View>
    );
  }

  // Fallback para usuario no autenticado
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicia sesión para ver los servicios</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: {
    marginBottom: 8,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 22,
  },
  subtitle: { marginBottom: 12, alignSelf: "center", color: "#555" },
  card: { marginBottom: 16, borderRadius: 16 },
  cardImage: { borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 140 },
  cardTitle: { fontSize: 20, marginBottom: 4, fontWeight: "bold" },
  precio: {
    color: "#0a7cff",
    fontWeight: "bold",
    marginVertical: 4,
    fontSize: 16,
  },
  actions: { justifyContent: "flex-end", flexWrap: "wrap" },
  actionBtn: { marginHorizontal: 4, marginVertical: 2 },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
});
