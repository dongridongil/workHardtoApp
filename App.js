import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { theme } from './colors';

export default function App() {
  return (
    <View style={styles.container}>

      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0}>
          <Text style={styles.btnText}>Work</Text>
        </TouchableOpacity>
        <TouchableHighlight
          underlayColor="red"
          onPress={() => alert('pressed')}>
          <Text style={styles.btnText}>Travel</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20

  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white"
  }
});
