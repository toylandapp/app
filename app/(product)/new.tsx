import Header from "@/components/navigation/header";
import { Text, View } from "react-native";

export default function Screen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Novo Produto" canBack />
      <Text>Screen</Text>
    </View>
  );
}