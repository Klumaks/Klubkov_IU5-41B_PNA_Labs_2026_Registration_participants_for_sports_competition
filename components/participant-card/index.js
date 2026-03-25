export class ParticipantCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
    return `
        <div class="participant-card">
            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">
                ${data.name.charAt(0)}
            </div>
            <div class="participant-info">
                <div class="participant-name">${data.name}</div>
                <div class="participant-detail">Вид спорта: ${data.sport}</div>
                <div class="participant-detail">Команда: ${data.team}</div>
                <div class="participant-detail">Возраст: ${data.age} лет</div>
                <div class="card-actions">
                    <button class="my-btn primary" id="view-card-${data.id}" data-id="${data.id}">Подробнее</button>
                    <button class="my-btn secondary" id="delete-card-${data.id}" data-id="${data.id}">Удалить</button>
                </div>
            </div>
        </div>
    `;
}

    addListeners(data, viewListener, deleteListener) {
        const viewButton = document.getElementById(`view-card-${data.id}`);
        if (viewButton) {
            viewButton.addEventListener("click", viewListener);
        }

        const deleteButton = document.getElementById(`delete-card-${data.id}`);
        if (deleteButton) {
            deleteButton.addEventListener("click", deleteListener);
        }
    }

    render(data, viewListener, deleteListener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, viewListener, deleteListener);
    }
}
