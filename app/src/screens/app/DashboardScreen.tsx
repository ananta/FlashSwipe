import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsLoggedIn,
  selectEmail,
  selectUserName,
  setSignOut
} from "../../slices/authSlice";

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const username = useSelector(selectUserName);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
      }}
    >
      <Text>Wellcome to Dashboard, {username}</Text>
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          paddingHorizontal: 50,
          paddingVertical: 15,
          margin: 10
        }}
        onPress={() => dispatch(setSignOut())}
      >
        <Text style={{ color: "white" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
