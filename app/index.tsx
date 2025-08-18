import { Button } from "@react-navigation/elements";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        What do you whant to do?
      </Text>  
      <Button>View the List</Button>
      <Button>Add New Idea</Button>
      <Button>Go to Settings</Button>
    </View>
  );
}
