import { HeaderComponent } from "../../components/header/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { fetchService } from "../../modules/fetchService.js";
import { participantUrls } from "../../modules/participantUrls.js";

export class FormPage {
    constructor(parent, id, appState) {
        this.parent = parent;
        this.id = id;          // если есть id – режим редактирования, иначе добавление
        this.appState = appState;
        this.participant = null;
    }

    get pageRoot() {
        return document.getElementById('form-page');
    }

    getHTML() {
        const isEdit = !!this.id;
        const title = isEdit ? 'Редактирование участника' : 'Добавление участника';
        return `
            <div id="form-page" style="margin: 20px;">
                <div class="participant-detail-page" style="max-width: 600px; margin: 0 auto;">
                    <h3 style="color: white; margin-bottom: 20px;">${title}</h3>
                    <form id="participant-form">
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">ФИО *</label>
                            <input type="text" id="name" class="form-control custom-input" placeholder="Иванов Иван Иванович">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">Вид спорта *</label>
                            <input type="text" id="sport" class="form-control custom-input" placeholder="Футбол, баскетбол...">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">Команда *</label>
                            <input type="text" id="team" class="form-control custom-input" placeholder="Название команды">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">Возраст *</label>
                            <input type="number" id="age" class="form-control custom-input age-input" step="1" inputmode="numeric" placeholder="18">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">Фото (URL)</label>
                            <input type="text" id="photo" class="form-control custom-input" placeholder="https://...">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">Достижения</label>
                            <textarea id="achievements" class="form-control custom-input" rows="2" placeholder="Чемпион области, КМС..."></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">Телефон</label>
                            <input type="text" id="phone" class="form-control custom-input" placeholder="+7 (999) 123-45-67">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" style="color: #94a5bf;">Email</label>
                            <input type="email" id="email" class="form-control custom-input" placeholder="example@mail.ru">
                        </div>
                        <div class="d-flex gap-2 mt-4">
                            <button type="button" id="save-participant-btn" class="my-btn execute">Сохранить</button>
                            <button type="button" id="cancel-btn" class="my-btn secondary">Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async loadParticipantForEdit() {
        const url = participantUrls.getParticipantById(this.id);
        const { data, status } = await fetchService.get(url);
        if (status === 200 && data) {
            this.fillForm(data);
        } else {
            console.error('Не удалось загрузить данные для редактирования', status);
        }
    }

    fillForm(participant) {
        document.getElementById('name').value = participant.name || '';
        document.getElementById('sport').value = participant.sport || '';
        document.getElementById('team').value = participant.team || '';
        document.getElementById('age').value = participant.age || '';
        // Если фото не задано, используем ссылку по умолчанию
        const defaultPhoto = 'https://minsknews.by/wp-content/uploads/2024/08/photo_2024-08-03_09-05-59.jpg';
        document.getElementById('photo').value = participant.photo || defaultPhoto;
        document.getElementById('achievements').value = participant.achievements || '';
        document.getElementById('phone').value = participant.phone || '';
        document.getElementById('email').value = participant.email || '';
    }

    getFormData() {
        const defaultPhoto = 'https://minsknews.by/wp-content/uploads/2024/08/photo_2024-08-03_09-05-59.jpg';
        return {
            name: document.getElementById('name').value.trim(),
            sport: document.getElementById('sport').value.trim(),
            team: document.getElementById('team').value.trim(),
            age: parseInt(document.getElementById('age').value, 10),
            photo: document.getElementById('photo').value.trim() || defaultPhoto,
            achievements: document.getElementById('achievements').value.trim() || 'Нет достижений',
            phone: document.getElementById('phone').value.trim() || 'Не указан',
            email: document.getElementById('email').value.trim() || 'Не указан'
        };
    }

    validateForm(data) {
        if (!data.name || !data.sport || !data.team || !data.age) {
            alert('Заполните обязательные поля: ФИО, вид спорта, команда, возраст');
            return false;
        }
        if (isNaN(data.age) || data.age <= 0 || data.age > 120) {
            alert('Возраст должен быть числом от 1 до 120');
            return false;
        }
        return true;
    }

    async saveParticipant() {
        const data = this.getFormData();
        if (!this.validateForm(data)) return;

        let url, method;
        if (this.id) {
            url = participantUrls.updateParticipant(this.id);
            method = 'patch';
        } else {
            url = participantUrls.createParticipant();
            method = 'post';
        }

        const response = await fetchService[method](url, data);
        if (response.status === 200 || response.status === 201) {
            // Успешно – возвращаемся на главную
            this.clickBack();
        } else {
            console.error('Ошибка сохранения', response.status);
            alert('Не удалось сохранить данные. Попробуйте позже.');
        }
    }

    clickBack() {
        const mainPage = new MainPage(this.parent, this.appState);
        mainPage.render();
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('save-participant-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveParticipant());
        }
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.clickBack());
        }
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

        // Стили для полей ввода
        const style = document.createElement('style');
        style.textContent = `
            .custom-input {
                background: #1b3042 !important;
                color: #ffffff !important;
                border: 1px solid #2b4358 !important;
                border-radius: 5px !important;
                padding: 8px 12px !important;
            }
            .custom-input::placeholder {
                color: #6c8a9e !important;
                opacity: 1 !important;
            }
            .custom-input:focus {
                border-color: #3577a0 !important;
                outline: none !important;
                box-shadow: none !important;
            }
            textarea.custom-input {
                resize: vertical;
            }
            .age-input::-webkit-inner-spin-button,
            .age-input::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            .age-input {
                -moz-appearance: textfield;
                appearance: textfield;
            }
        `;
        document.head.appendChild(style);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));
        this.setupEventListeners();

        if (this.id) {
            this.loadParticipantForEdit();
        }
    }
}
