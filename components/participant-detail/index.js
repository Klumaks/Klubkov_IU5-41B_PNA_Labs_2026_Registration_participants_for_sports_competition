import { ParticipantStatsComponent } from "../participant-stats/index.js";

export class ParticipantDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="participant-detail-page" id="participant-detail-${data.id}">
                <div class="row">
                    <div class="col-md-5">
                        <img src="${data.photo || './static/avatar.jpg'}" alt="${data.name}" style="width:100%; height:300px; border-radius:10px; object-fit: cover;">
                    </div>
                    <div class="col-md-7">
                        <div class="detail-info">
                            <p><span class="detail-label">ФИО:</span> ${data.name}</p>
                            <p><span class="detail-label">Вид спорта:</span> ${data.sport}</p>
                            <p><span class="detail-label">Команда:</span> ${data.team}</p>
                            <p><span class="detail-label">Возраст:</span> ${data.age} лет</p>
                            <p><span class="detail-label">Достижения:</span> ${data.achievements}</p>
                            <p><span class="detail-label">Дата регистрации:</span> ${data.registrationDate}</p>
                            <p><span class="detail-label">Телефон:</span> ${data.phone}</p>
                            <p><span class="detail-label">Email:</span> ${data.email}</p>
                        </div>
                    </div>
                </div>
                <div id="detail-stats-container"></div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        const statsContainer = document.getElementById('detail-stats-container');
        if (statsContainer) {
            const statsComponent = new ParticipantStatsComponent(statsContainer);
            statsComponent.render(data);
        }
    }
}
