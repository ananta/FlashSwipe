import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import AppRoute from "./src/App";

import { store } from "./src/store";

const App = () => (
  <Provider store={store}>
    <AppRoute />
    <StatusBar style="auto" />
  </Provider>
);

export default App;
