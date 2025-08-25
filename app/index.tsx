import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },

  indexHeader:{
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
  },
  button: {
    marginLeft: 20,
    padding: 10,
    marginBottom: 10,
    cursor: "pointer"
  },
});

export default function Index() {
  return (
    <View
      style={styles.container}
    >

      <Text style={styles.indexHeader}>
        What do you whant to do?
      </Text> 
      <View style={[styles.container, styles.buttonContainer]}>
        <Button icon="format-list-text" mode="contained" style={styles.button}>View the List</Button>
        <Button icon="grease-pencil" mode="contained" style={styles.button}>Add New Idea</Button>
      </View> 
      <Button>Go to Settings</Button>
    </View>
  );
}

