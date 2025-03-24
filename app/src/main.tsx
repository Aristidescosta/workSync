import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const root = ReactDOM.createRoot(document.getElementById("root")!)

/* if (window.location.hostname === "localhost") {
	connectFirestoreEmulator(getFirestore(), "127.0.0.1", 8080);
	connectAuthEmulator(getAuth(), `http://127.0.0.1:9099`);
	connectStorageEmulator(getStorage(), "127.0.0.1", 9199);
	connectFunctionsEmulator(getFunctions(), "127.0.0.1", 5001);
}
 */

if (window.location.hostname === 'localhost') {
	root.render(
		<>
			<App />
		</>
	)
} else {
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	)
}