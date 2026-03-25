import { HeaderComponent } from "../../components/header/index.js";
import { ParticipantDetailComponent } from "../../components/participant-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class ParticipantPage {
    constructor(parent, id, participants) {
        this.parent = parent;
        this.id = id;
        this.participants = participants;
        this.participant = this.participants.find(p => p.id == id);
    }

    get pageRoot() {
        return document.getElementById('participant-page');
    }

    getHTML() {
        return `
            <div id="participant-page" class="calculator_body" style="margin-top: 20px;"></div>
        `;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    clickHome() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render(true, this.clickHome.bind(this));

        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        if (this.participant) {
            const participantDetail = new ParticipantDetailComponent(this.pageRoot);
            participantDetail.render(this.participant);
        } else {
            this.pageRoot.innerHTML = '<div style="text-align:center; padding:40px;">Участник не найден</div>';
        }

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));
    }
}
