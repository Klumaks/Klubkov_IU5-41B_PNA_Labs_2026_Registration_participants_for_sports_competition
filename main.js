import { MainPage } from "./pages/main/index.js";

const appState = {
    participants: null
};

const root = document.getElementById('root');
const mainPage = new MainPage(root, appState);
mainPage.render();
