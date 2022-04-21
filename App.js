import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
const STORAGE_WORKING = "@working";

export default function App() {
  const [working, setWorking] = useState();
  const [text, setText] = useState("");
  const [changeText, setChangeText] = useState("");
  const [toDos, setToDos] = useState({});
  const onText = (event) => setText(event);
  const onChangeText = (event) => setChangeText(event);
  const travel = async () => {
    try {
      setWorking(false);
      const flag = new Boolean(false);
      await AsyncStorage.setItem(STORAGE_WORKING, flag.toString());
    } catch (error) {
      console.log(error);
    }
  };
  const work = async () => {
    try {
      setWorking(true);
      const flag = new Boolean(true);
      await AsyncStorage.setItem(STORAGE_WORKING, flag.toString());
    } catch (error) {
      console.log(error);
    }
  };
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.log(error);
    }
  };
  const loadWorking = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_WORKING);
      setWorking(JSON.parse(s));
    } catch (error) {
      console.log(error);
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s) {
        setToDos(JSON.parse(s));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadToDos();
    loadWorking();
  }, []);
  const addToDo = async () => {
    try {
      if (text === "") {
        return;
      }
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, working, check: false, change: false },
      };
      setToDos(newToDos);
      await saveToDos(newToDos);
      setText("");
    } catch (error) {
      console.log(error);
    }
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete Works", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Do",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  const checkToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].check = !newToDos[key].check;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const changeToDo = (key) => {
    Alert.alert("Change Works", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Do",
        onPress: () => {
          const newToDos = { ...toDos };
          newToDos[key].change = true;
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  const writeChange = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].change = false;
    newToDos[key].text = changeText;
    setToDos(newToDos);
    saveToDos(newToDos);
    setChangeText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          value={text}
          onChangeText={onText}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.input}
        />
      </View>
      <Text style={styles.object}>ProCeeding</Text>
      <View style={{ height: 300 }}>
        <ScrollView contentContainerStyle={{}}>
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              !toDos[key].check ? (
                <View key={key} style={styles.toDo}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={() => checkToDo(key)}
                    >
                      <Fontisto
                        name="checkbox-passive"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                    <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={() => changeToDo(key)}
                    >
                      {toDos[key].change ? (
                        <TextInput
                          style={styles.semiInput}
                          onChangeText={onChangeText}
                          value={changeText}
                          onSubmitEditing={() => writeChange(key)}
                          placeholder="Write your changes..."
                        />
                      ) : (
                        <Fontisto name="flickr" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteToDo(key)}>
                      <Fontisto name="trash" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            ) : null
          )}
        </ScrollView>
      </View>
      <Text style={styles.object}>Complete</Text>
      <View style={{ height: 300 }}>
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              toDos[key].check ? (
                <View key={key} style={styles.toDo}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={() => checkToDo(key)}
                    >
                      <Fontisto
                        name="checkbox-active"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                    <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={() => changeToDo(key)}
                    >
                      {toDos[key].change ? (
                        <TextInput
                          style={styles.semiInput}
                          onChangeText={onChangeText}
                          value={changeText}
                          onSubmitEditing={() => writeChange(key)}
                          placeholder="Write your changes..."
                        />
                      ) : (
                        <Fontisto name="flickr" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteToDo(key)}>
                      <Fontisto name="trash" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 16,
    marginBottom: 30,
  },
  semiInput: {
    backgroundColor: "white",
    fontSize: 16,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  object: {
    color: "white",
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "700",
  },
});
