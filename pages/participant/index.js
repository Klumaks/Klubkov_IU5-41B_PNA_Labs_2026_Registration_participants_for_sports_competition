import { HeaderComponent } from "../../components/header/index.js";
import { ParticipantDetailComponent } from "../../components/participant-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ThreeModelComponent } from "../../components/three-model/index.js";

export class ParticipantPage {
    constructor(parent, id, appState) {
        this.parent = parent;
        this.id = id;
        this.appState = appState;
        this.participants = appState.participants;
        this.participant = this.participants.find(p => p.id == id);
    }

    get pageRoot() {
        return document.getElementById('participant-page');
    }

    getHTML() {
        return `
            <div id="participant-page" class="calculator_body" style="margin-top: 20px;">
                <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start;">
                    <div style="flex: 2; min-width: 280px;" id="detail-container"></div>
                    <div style="flex: 1; min-width: 280px;" id="model-container"></div>
                </div>
            </div>
        `;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent, this.appState);
        mainPage.render();
    }

    clickHome() {
        const mainPage = new MainPage(this.parent, this.appState);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render(true, this.clickHome.bind(this));

        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const detailContainer = document.getElementById('detail-container');
        if (detailContainer && this.participant) {
            const participantDetail = new ParticipantDetailComponent(detailContainer);
            participantDetail.render(this.participant);
        } else if (!this.participant) {
            if (detailContainer) {
                detailContainer.innerHTML = '<div style="text-align:center; padding:40px;">Участник не найден</div>';
            }
        }

        const modelContainer = document.getElementById('model-container');
        if (modelContainer && this.participant) {
            const threeModel = new ThreeModelComponent(modelContainer);
            threeModel.render(this.participant);
        }

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));
    }
}
