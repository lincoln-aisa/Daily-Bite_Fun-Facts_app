console.log("ENTRY: index.ts executing");
import { registerRootComponent } from "expo";
import App from "./App";

console.log("ENTRY: registerRootComponent being called");
registerRootComponent(App);