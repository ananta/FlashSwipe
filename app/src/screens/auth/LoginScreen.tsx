import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { setSignIn } from "../../slices/authSlice";

const LoginScreen = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    const user = {
      isLoggedIn: true,
      email: "jdoe@test.com",
      userName: "johnDoe"
    };

    dispatch(setSignIn(user));
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20, fontSize: 15 }}>Flash Swipe</Text>
      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.text}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogin}
        style={[
          styles.btn,
          {
            backgroundColor: "red",
            marginTop: 10
          }
        ]}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  btn: {
    backgroundColor: "blue",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10
  },
  text: {
    color: "white",
    fontSize: 20
  }
});
