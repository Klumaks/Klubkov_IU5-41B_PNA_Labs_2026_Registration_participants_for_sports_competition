export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(showHomeButton = false) {
        if (showHomeButton) {
            return `
                <div class="header-with-home">
                    <div class="logo">Соревнования РФ</div>
                    <button id="home-button" class="home-btn">На главную</button>
                </div>
            `;
        }
        return `
            <header>
                <div class="logo">Соревнования РФ</div>
                <div>Регистрация участников на спортивные соревнования</div>
            </header>
        `;
    }

    addHomeListener(listener) {
        const homeButton = document.getElementById('home-button');
        if (homeButton) {
            homeButton.addEventListener('click', listener);
        }
    }

    render(showHomeButton = false, homeListener = null) {
        const html = this.getHTML(showHomeButton);
        this.parent.insertAdjacentHTML('beforeend', html);
        if (showHomeButton && homeListener) {
            this.addHomeListener(homeListener);
        }
    }
}
