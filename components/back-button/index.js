export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        const backButton = document.getElementById("back-button");
        if (backButton) {
            backButton.addEventListener("click", listener);
        }
    }

    getHTML() {
        return `
            <div class="back-button" style="margin-top: 20px;">
                <button id="back-button" class="my-btn secondary">← Назад к списку</button>
            </div>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}
