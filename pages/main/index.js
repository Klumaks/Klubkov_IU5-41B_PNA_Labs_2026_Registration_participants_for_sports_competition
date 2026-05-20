import { HeaderComponent } from "../../components/header/index.js";
import { ParticipantCardComponent } from "../../components/participant-card/index.js";
import { ParticipantPage } from "../participant/index.js";
import { FormPage } from "../form/index.js";
import { fetchService } from "../../modules/fetchService.js";
import { participantUrls } from "../../modules/participantUrls.js";

export class MainPage {
    constructor(parent, appState) {
        this.parent = parent;
        this.appState = appState;
        this.allParticipants = [];
        this.currentSportFilter = '';
        this.currentSearchTerm = '';
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page">
                <div class="filter-bar">
                    <input type="text" id="search-name-input" placeholder="Поиск по имени...">
                    <button id="search-name-btn" class="my-btn execute">Поиск</button>
                    <select id="sport-filter">
                        <option value="">Все виды спорта</option>
                        <option value="Футбол">Футбол</option>
                        <option value="Баскетбол">Баскетбол</option>
                        <option value="Теннис">Теннис</option>
                        <option value="Плавание">Плавание</option>
                        <option value="Легкая атлетика">Легкая атлетика</option>
                    </select>
                    <button id="add-participant-btn" class="my-btn execute">+ Добавить участника</button>
                </div>
                <div class="participants-grid" id="participants-container"></div>
            </div>
        `;
    }

    async loadParticipants() {
        const url = participantUrls.getParticipants();
        const { data, status } = await fetchService.get(url);
        if (status === 200 && data) {
            this.allParticipants = data;
            this.applyFiltersAndRender();
        } else {
            console.error('Ошибка загрузки участников', status);
            const container = document.getElementById('participants-container');
            if (container) {
                container.innerHTML = '<div style="text-align:center; padding:40px;">Ошибка загрузки данных</div>';
            }
        }
    }

    applyFiltersAndRender() {
        let filtered = [...this.allParticipants];
        if (this.currentSportFilter) {
            filtered = filtered.filter(p => p.sport === this.currentSportFilter);
        }
        if (this.currentSearchTerm.trim()) {
            const keyword = this.currentSearchTerm.toLowerCase();
            const results = [];
            let i = 0;
            do {
                const p = filtered[i];
                if (p && p.name.toLowerCase().includes(keyword)) {
                    results.push(p);
                }
                i++;
            } while (i < filtered.length);
            filtered = results;
        }
        this.renderParticipants(filtered);
    }

    renderParticipants(participants) {
        const container = document.getElementById('participants-container');
        if (!container) return;
        container.innerHTML = '';
        if (participants.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px;">Участников не найдено</div>';
            return;
        }
        participants.forEach(participant => {
            const card = new ParticipantCardComponent(container);
            card.render(
                participant,
                () => this.viewParticipant(participant.id),
                () => this.editParticipant(participant.id),
                () => this.deleteParticipant(participant.id)
            );
        });
    }

    viewParticipant(id) {
        const participantPage = new ParticipantPage(this.parent, id, this.appState);
        participantPage.render();
    }

    editParticipant(id) {
        const formPage = new FormPage(this.parent, id, this.appState);
        formPage.render();
    }

    async deleteParticipant(id) {
        const url = participantUrls.deleteParticipant(id);
        const { status } = await fetchService.delete(url);
        if (status === 204) {
            this.allParticipants = this.allParticipants.filter(p => p.id !== id);
            this.applyFiltersAndRender();
        } else {
            console.error('Ошибка удаления', status);
        }
    }

    addParticipant() {
        const formPage = new FormPage(this.parent, null, this.appState);
        formPage.render();
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('search-name-btn');
        const searchInput = document.getElementById('search-name-input');
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.currentSearchTerm = searchInput.value;
                this.applyFiltersAndRender();
            });
        }

        const sportFilter = document.getElementById('sport-filter');
        if (sportFilter) {
            sportFilter.addEventListener('change', (e) => {
                this.currentSportFilter = e.target.value;
                this.applyFiltersAndRender();
            });
        }

        const addBtn = document.getElementById('add-participant-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addParticipant());
        }
    }

    render() {
        this.parent.innerHTML = '';
        const header = new HeaderComponent(this.parent);
        header.render(false);
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.setupEventListeners();
        this.loadParticipants();
    }
}
