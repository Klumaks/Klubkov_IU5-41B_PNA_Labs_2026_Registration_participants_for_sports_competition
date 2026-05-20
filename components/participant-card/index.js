import { ParticipantStatsComponent } from "../participant-stats/index.js";

export class ParticipantCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="participant-card" id="participant-card-${data.id}">
                <img src="${data.photo || 'https://minsknews.by/wp-content/uploads/2024/08/photo_2024-08-03_09-05-59.jpg'}" alt="${data.name}" style="width: 100%; height: 200px; object-fit: cover;">
                <div class="participant-info">
                    <div class="participant-name">${data.name}</div>
                    <div class="participant-detail">Вид спорта: ${data.sport}</div>
                    <div class="participant-detail">Команда: ${data.team}</div>
                    <div class="participant-detail">Возраст: ${data.age} лет</div>
                    <div class="card-actions">
                        <button class="my-btn primary" id="view-card-${data.id}">Подробнее</button>
                        <button class="my-btn execute" id="edit-card-${data.id}">Редактировать</button>
                        <button class="my-btn varianse" id="delete-card-${data.id}">Удалить</button>
                    </div>
                    <div id="stats-container-${data.id}"></div>
                </div>
            </div>
        `;
    }

    addListeners(data, viewListener, editListener, deleteListener) {
        const viewBtn = document.getElementById(`view-card-${data.id}`);
        if (viewBtn) viewBtn.addEventListener("click", viewListener);
        const editBtn = document.getElementById(`edit-card-${data.id}`);
        if (editBtn) editBtn.addEventListener("click", editListener);
        const deleteBtn = document.getElementById(`delete-card-${data.id}`);
        if (deleteBtn) deleteBtn.addEventListener("click", deleteListener);
    }

    render(data, viewListener, editListener, deleteListener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, viewListener, editListener, deleteListener);
        const statsContainer = document.getElementById(`stats-container-${data.id}`);
        if (statsContainer) {
            const statsComponent = new ParticipantStatsComponent(statsContainer);
            statsComponent.render(data);
        }
    }
}
