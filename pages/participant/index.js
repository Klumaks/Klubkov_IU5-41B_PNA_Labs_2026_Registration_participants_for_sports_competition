import { HeaderComponent } from "../../components/header/index.js";
import { ParticipantDetailComponent } from "../../components/participant-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ThreeModelComponent } from "../../components/three-model/index.js";
import { ajax } from "../../modules/ajax.js";
import { participantUrls } from "../../modules/participantUrls.js";

export class ParticipantPage {
    constructor(parent, id, appState) {
        this.parent = parent;
        this.id = id;
        this.appState = appState;
        this.participant = null;
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

    loadParticipant() {
        const url = participantUrls.getParticipantById(this.id);
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.participant = data;
                this.renderParticipantData();
            } else if (status === 404) {
                document.getElementById('detail-container').innerHTML = '<div style="text-align:center; padding:40px;">Участник не найден</div>';
            } else {
                console.error('Ошибка загрузки', status);
            }
        });
    }

    renderParticipantData() {
        const detailContainer = document.getElementById('detail-container');
        if (detailContainer && this.participant) {
            const participantDetail = new ParticipantDetailComponent(detailContainer);
            participantDetail.render(this.participant);
        }

        const modelContainer = document.getElementById('model-container');
        if (modelContainer && this.participant) {
            const threeModel = new ThreeModelComponent(modelContainer);
            threeModel.render(this.participant);
        }
    }

    clickBack() {
        const mainPage = new MainPage(this.parent, this.appState);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const header = new HeaderComponent(this.parent);
        header.render(true, () => {
            const mainPage = new MainPage(this.parent, this.appState);
            mainPage.render();
        });
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));
        this.loadParticipant();
    }
}
