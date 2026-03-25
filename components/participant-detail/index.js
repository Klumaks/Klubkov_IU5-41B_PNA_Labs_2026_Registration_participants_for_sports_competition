export class ParticipantDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="participant-detail-page">
                <div class="row">
                    <div class="col-md-5">
                        <div style="width:100%; height:300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius:10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 96px;">
                            ${data.name.charAt(0)}
                        </div>
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
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
