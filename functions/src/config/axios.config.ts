import axios from "axios";

export const whatsAppBaseUrl = axios.create({
	baseURL: "https://graph.facebook.com/v18.0",
});

export const nexmoBaseUrl = axios.create({
	baseURL: "",
});
