import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import EditServiceScreen from "./screens/EditServiceScreen";
import VerContratacionesScreen from "./screens/VerContraracionesScreen";
import CreateServiceScreen from "./screens/CreateServiceScreen";
import ContractServiceScreen from "./screens/ContractServiceScreen";
import CommentsScreen from "./screens/CommentsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EditService" component={EditServiceScreen} />
          <Stack.Screen
            name="VerContrataciones"
            component={VerContratacionesScreen}
          />
          <Stack.Screen name="CreateService" component={CreateServiceScreen} />
          <Stack.Screen
            name="ContractService"
            component={ContractServiceScreen}
          />
          <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
