import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, Pressable, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, TextInput, Alert } from 'react-native';
import { theme } from './colors';
import { useEffect, useRef, useState } from 'react';
import AsnyncStorage from "@react-native-async-storage/async-storage"
import Fontisto from '@expo/vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const STORAGE_KEY = "@toDos"
const ENTERKEY = "@work"

export default function App() {

  const inputRef = useRef(null);

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("")
  const [toDos, setTodos] = useState({}) // 화면에 보여줄것들


  /*  수정코드  */
  const [editingKey, setEditingKey] = useState(null);
  const [editingText, setEditingText] = useState("");


  useEffect(() => {
    loadToDos();
    loadWorking();
  }, [])


  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(ENTERKEY, JSON.stringify(true))
  }

  const travel = async () => {
    setWorking(false)
    await AsyncStorage.setItem(ENTERKEY, JSON.stringify(false))
  };


  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => { // string으로 변환해서 스토리지에 저장

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))

  }
  /// 내가 마지막에 눌렀던 working 기억해서 true 면 work 보여주고 false 면 travel 보여준다 .. 

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s !== null) {
        setTodos(JSON.parse(s));
      }
    } catch (e) {
      console.log(e, "니에러야?");
    }
  }

  const loadWorking = async () => {
    try {
      const s = await AsyncStorage.getItem(ENTERKEY);
      if (s !== null) {
        setWorking(JSON.parse(s));
      }
    } catch (e) {
      console.log(e);
    }
  }

  const addTodo = async () => {
    if (text === "") {
      return
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working, complete: false } };
    setTodos(newToDos);
    await saveToDos(newToDos)  // 스토리지에 저장
    setText("");

  }
  const completeTodo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].complete = !newToDos[key].complete
    setTodos(newToDos);
    saveToDos(newToDos);

  }
  const deleteTodo = (key) => {
    Alert.alert("지울꺼야?", "확실해?",
      [{
        text: "I'm Sure", onPress: async () => {
          const newToDos = { ...toDos }
          delete newToDos[key];
          setTodos(newToDos);
          await saveToDos(newToDos)
        }
      }, { text: "Cancel" },]
    )
    return;

  }
  const startEditing = (key, text) => {
    setEditingKey(key);
    setEditingText(text);
    setTimeout(() => {
      inputRef.current.focus();
    }, 100); // 작은 지연시간을 두고 포커스를 설정
  }
  const updateTodo = async (key) => {
    console.log(key)
    const newToDos = { ...toDos };
    newToDos[key].text = editingText;
    setTodos(newToDos);
    await saveToDos(newToDos);
    setEditingKey(null);
    setEditingText("");
  }

  return (
    <View style={styles.container}>

      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>

          <Text style={[styles.btnText, { color: working ? "white" : theme.grey }]}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={travel}>
          <Text style={[styles.btnText, { color: !working ? "white" : theme.grey }]}>Travel</Text>

        </TouchableOpacity>
      </View>

      <TextInput
        returnKeyType='done'
        onSubmitEditing={addTodo}
        value={text}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={working ? "할일을 추가하세요" : "어디 갈까?"} />

      <ScrollView>
        {Object.keys(toDos).map((key) => {
          const toDo = toDos[key];
          if (toDo && toDo.working === working) {
            return (
              <View style={styles.toDo} key={key}>
                {editingKey === key ? (
                  <TextInput
                    ref={inputRef}
                    style={styles.toDoText}
                    value={editingText}
                    onChangeText={setEditingText}
                    onSubmitEditing={() => updateTodo(key)}
                  />
                ) : (
                  <Text style={[styles.toDoText, toDo.complete && styles.completedText]}>{toDo.text}</Text>
                )}
                <TouchableOpacity onPress={() => completeTodo(key)}>
                  <Fontisto name="checkbox-active" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startEditing(key, toDo.text)}>
                  <MaterialIcons name="edit" size={24} color="white" />
                </TouchableOpacity>
              </View>
            );
          } else {
            return null;
          }
        })}
      </ScrollView>
    </View >
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

  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,

    fontSize: 15,
    marginVertical: 20,
  },
  toDo: {
    flexDirection: "row",
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    // textDecorationLine: 'line-through',

  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  }

});
