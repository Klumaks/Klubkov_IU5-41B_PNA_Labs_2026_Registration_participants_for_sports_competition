import { HeaderComponent } from "../../components/header/index.js";
import { ParticipantCardComponent } from "../../components/participant-card/index.js";
import { ParticipantPage } from "../participant/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.participants = this.getInitialData();
        this.filteredParticipants = [...this.participants];
        this.searchTerm = '';
        this.sportFilter = '';
    }

    getInitialData() {
        return [
            {
                id: 1,
                name: "Иван Петров",
                sport: "Футбол",
                team: "Спартак",
                age: 25,
                photo: "https://avatars.mds.yandex.net/get-shedevrum/12265565/img_1729606723_2_0/orig",
                achievements: "Чемпион области 2023, Лучший бомбардир",
                registrationDate: "15.01.2024",
                phone: "+7 (999) 123-45-67",
                email: "ivan.petrov@example.com"
            },
            {
                id: 2,
                name: "Анна Сидорова",
                sport: "Теннис",
                team: "Динамо",
                age: 22,
                photo: "https://avatars.mds.yandex.net/get-shedevrum/12265565/img_1729606723_2_0/orig",
                achievements: "Победитель турнира 2024, 3-й разряд",
                registrationDate: "20.01.2024",
                phone: "+7 (999) 234-56-78",
                email: "anna.sidorova@example.com"
            },
            {
                id: 3,
                name: "Михаил Козлов",
                sport: "Баскетбол",
                team: "ЦСКА",
                age: 28,
                photo: "https://avatars.mds.yandex.net/get-shedevrum/12265567/img_1729606723_2_0/orig",
                achievements: "MVP сезона 2023, Чемпион России",
                registrationDate: "10.01.2024",
                phone: "+7 (999) 345-67-89",
                email: "mikhail.kozlov@example.com"
            },
            {
                id: 4,
                name: "Елена Волкова",
                sport: "Плавание",
                team: "Локомотив",
                age: 19,
                photo: "https://avatars.mds.yandex.net/get-shedevrum/12265569/img_1729606723_2_0/orig",
                achievements: "Мастер спорта, Рекордсменка области",
                registrationDate: "05.01.2024",
                phone: "+7 (999) 456-78-90",
                email: "elena.volkova@example.com"
            },
            {
                id: 5,
                name: "Дмитрий Соколов",
                sport: "Легкая атлетика",
                team: "Торпедо",
                age: 26,
                photo: "https://avatars.mds.yandex.net/get-shedevrum/12265571/img_1729606723_2_0/orig",
                achievements: "Призер чемпионата России, КМС",
                registrationDate: "25.01.2024",
                phone: "+7 (999) 567-89-01",
                email: "dmitry.sokolov@example.com"
            }
        ];
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page">
                <div class="filter-bar">
                    <input type="text" id="search-input" placeholder=" Поиск по имени участника...">
                    <select id="sport-filter">
                        <option value="">Все виды спорта</option>
                        <option value="Футбол"> Футбол</option>
                        <option value="Баскетбол"> Баскетбол</option>
                        <option value="Теннис"> Теннис</option>
                        <option value="Плавание"> Плавание</option>
                        <option value="Легкая атлетика"> Легкая атлетика</option>
                    </select>
                    <button id="add-participant" class="my-btn execute">+ Добавить участника</button>
                </div>
                <div class="participants-grid" id="participants-container"></div>
            </div>
        `;
    }

    applyFilters() {
        this.filteredParticipants = this.participants.filter(participant => {
            const matchesSearch = participant.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesSport = !this.sportFilter || participant.sport === this.sportFilter;
            return matchesSearch && matchesSport;
        });
        this.renderParticipants();
    }

    renderParticipants() {
        const container = document.getElementById('participants-container');
        if (container) {
            container.innerHTML = '';
            if (this.filteredParticipants.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:40px;">Участников не найдено</div>';
                return;
            }
            this.filteredParticipants.forEach((participant) => {
                const card = new ParticipantCardComponent(container);
                card.render(
                    participant,
                    () => this.viewParticipant(participant.id),
                    () => this.deleteParticipant(participant.id)
                );
            });
        }
    }

    viewParticipant(id) {
        const participantPage = new ParticipantPage(this.parent, id, this.participants);
        participantPage.render();
    }

    deleteParticipant(id) {
        if (confirm('Вы уверены, что хотите удалить этого участника?')) {
            this.participants = this.participants.filter(p => p.id !== id);
            this.applyFilters();
        }
    }

    addParticipant() {
        const newId = Math.max(...this.participants.map(p => p.id), 0) + 1;
        const newParticipant = {
            id: newId,
            name: "Новый участник",
            sport: "Футбол",
            team: "Новая команда",
            age: 20,
            photo: "https://avatars.mds.yandex.net/get-shedevrum/12265573/img_1729606723_2_0/orig",
            achievements: "Нет достижений",
            registrationDate: new Date().toLocaleDateString('ru-RU'),
            phone: "+7 (999) 000-00-00",
            email: "new.participant@example.com"
        };
        this.participants.push(newParticipant);
        this.applyFilters();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.applyFilters();
            });
        }

        const sportFilter = document.getElementById('sport-filter');
        if (sportFilter) {
            sportFilter.addEventListener('change', (e) => {
                this.sportFilter = e.target.value;
                this.applyFilters();
            });
        }

        const addButton = document.getElementById('add-participant');
        if (addButton) {
            addButton.addEventListener('click', () => this.addParticipant());
        }
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render(false);

        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.renderParticipants();
        this.setupEventListeners();
    }
}
