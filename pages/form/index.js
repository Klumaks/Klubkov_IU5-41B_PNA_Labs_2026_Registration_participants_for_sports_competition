import { HeaderComponent } from "../../components/header/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { participantUrls } from "../../modules/participantUrls.js";

export class FormPage {
    constructor(parent, id, appState) {
        this.parent = parent;
        this.id = id;
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
                        <div class="alert alert-info" style="background: #1b3042; color: #94a5bf; border: 1px solid #3577a0;">
                            ⚠️ В данной версии сохранение недоступно. Кнопка «Сохранить» появится в следующей лабораторной работе.
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    loadParticipantForEdit() {
        const url = participantUrls.getParticipantById(this.id);
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.fillForm(data);
            } else {
                console.error('Не удалось загрузить данные для редактирования', status);
            }
        });
    }

    fillForm(participant) {
        document.getElementById('name').value = participant.name || '';
        document.getElementById('sport').value = participant.sport || '';
        document.getElementById('team').value = participant.team || '';
        document.getElementById('age').value = participant.age || '';
        document.getElementById('photo').value = participant.photo || './static/avatar.jpg';
        document.getElementById('achievements').value = participant.achievements || '';
        document.getElementById('phone').value = participant.phone || '';
        document.getElementById('email').value = participant.email || '';
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

        // Добавляем стили для полей ввода
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

        // const backButton = new BackButtonComponent(this.pageRoot);
        // backButton.render(this.clickBack.bind(this));

        // if (this.id) {
        //     this.loadParticipantForEdit();
        // }
    }
}
