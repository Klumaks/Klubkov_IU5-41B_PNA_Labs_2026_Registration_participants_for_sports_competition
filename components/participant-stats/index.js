export class ParticipantStatsComponent {
    constructor(parent) {
        this.parent = parent;
    }

    // Сумма главной и побочной диагоналей квадратной матрицы (do-while)
    calculateDiagonalSum(matrix) {
        if (!matrix || matrix.length === 0) return 0;
        const n = matrix.length;
        let sum = 0;
        let i = 0;
        do {
            sum += matrix[i][i];
            if (i !== n - 1 - i) {
                sum += matrix[i][n - 1 - i];
            }
            i++;
        } while (i < n);
        return sum;
    }

    // Слияние объектов (значение, встретившееся раньше)
    mergeParticipantData(...objects) {
        const result = {};
        for (const obj of objects) {
            for (const key in obj) {
                if (!(key in result)) {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }

    // Генерация квадратной матрицы результатов (3x3)
    generateResultsMatrix(participant) {
        const tournaments = [
            { name: "Чемпионат области", stages: 3 },
            { name: "Кубок России", stages: 3 },
            { name: "Первенство города", stages: 3 }
        ];
        const matrix = [];
        for (let i = 0; i < tournaments.length; i++) {
            const row = [];
            for (let j = 0; j < tournaments[i].stages; j++) {
                let points = (participant.id * 2 + i * 5 + j * 3) % 15;
                if (participant.age < 25) points += 5;
                if (participant.sport === 'Футбол' || participant.sport === 'Баскетбол') points += 3;
                row.push(points);
            }
            matrix.push(row);
        }
        return {
            matrix,
            tournamentNames: tournaments.map(t => t.name)
        };
    }

    getParticipantStats(participant) {
        const results = this.generateResultsMatrix(participant);
        const totalPoints = this.calculateDiagonalSum(results.matrix);

        const personalData = {
            fullName: participant.name,
            age: participant.age,
            category: this.getAgeCategory(participant.age),
            sportType: participant.sport
        };
        const teamData = {
            team: participant.team,
            teamCategory: this.getTeamCategory(participant.team),
            hasTeamSupport: participant.team !== 'Индивидуально'
        };
        const achievementsData = {
            achievements: participant.achievements,
            title: this.getSportsTitle(participant.achievements),
            isAwardWinner: participant.achievements.toLowerCase().includes('чемпион') || participant.achievements.toLowerCase().includes('призер')
        };
        const mergedData = this.mergeParticipantData(personalData, teamData, achievementsData);

        return {
            totalPoints,
            mergedData
        };
    }

    getAgeCategory(age) {
        if (age < 20) return 'Юниоры';
        if (age < 30) return 'Взрослые';
        if (age < 40) return 'Мастера';
        return 'Ветераны';
    }

    getTeamCategory(team) {
        const categories = {
            'Спартак': 'Профессиональный клуб',
            'Динамо': 'Профессиональный клуб',
            'ЦСКА': 'Профессиональный клуб',
            'Локомотив': 'Профессиональный клуб',
            'Торпедо': 'Профессиональный клуб'
        };
        return categories[team] || 'Любительский клуб';
    }

    getSportsTitle(achievements) {
        if (achievements.includes('Мастер спорта')) return 'Мастер спорта';
        if (achievements.includes('КМС')) return 'Кандидат в мастера спорта';
        if (achievements.toLowerCase().includes('чемпион')) return 'Чемпион';
        if (achievements.toLowerCase().includes('призер')) return 'Призер соревнований';
        return 'Спортсмен';
    }

    // HTML: уменьшенный шрифт и понятный бизнес-смысл
    getHTML(participant, stats) {
        return `
            <div class="participant-stats" style="margin-top: 15px; padding: 10px; background: #1b3042; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="color: #94a5bf; font-size: 11px;">Турнирная статистика</span>
                    <span style="color: #2ecc71; font-size: 13px; font-weight: bold;">Итоговые очки: ${stats.totalPoints}</span>
                </div>
                <div style="font-size: 10px; color: #94a5bf;">
                    <div>Категория: ${stats.mergedData.category}</div>
                    <div>Спортивное звание: ${stats.mergedData.title}</div>
                    <div>Команда: ${stats.mergedData.teamCategory}</div>
                    <div>Награды: ${stats.mergedData.isAwardWinner ? 'Есть' : 'Нет'}</div>
                </div>
            </div>
        `;
    }

    render(participant) {
        const stats = this.getParticipantStats(participant);
        const html = this.getHTML(participant, stats);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
