import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

import AppNavigator from "./screens/app";
import AuthNavigator from "./screens/auth";
import { selectIsLoggedIn } from "./slices/authSlice";

const AppRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppRoute;
