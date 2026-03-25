export class ParticipantStatsComponent {
    constructor(parent) {
        this.parent = parent;
    }

    calculateTotalPoints(resultsMatrix) {
        if (!resultsMatrix || resultsMatrix.length === 0) return 0;

        let totalPoints = 0;
        const n = resultsMatrix.length;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                totalPoints += resultsMatrix[i][j];
            }
        }

        return totalPoints;
    }

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
        const totalPoints = this.calculateTotalPoints(results.matrix);

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
            isAwardWinner: participant.achievements.includes('чемпион') || participant.achievements.includes('призер')
        };

        const mergedData = this.mergeParticipantData(personalData, teamData, achievementsData);

        return {
            totalPoints,
            resultsMatrix: results.matrix,
            tournamentNames: results.tournamentNames,
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
        if (achievements.includes('чемпион')) return 'Чемпион';
        if (achievements.includes('призер')) return 'Призер соревнований';
        return 'Спортсмен';
    }

    getHTML(participant, stats) {
        return `
            <div class="participant-stats" style="margin-top: 15px; padding: 10px; background: #1b3042; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #94a5bf; font-size: 12px;">Турнирная статистика</span>
                    <span style="color: #2ecc71; font-size: 14px; font-weight: bold;">Всего очков: ${stats.totalPoints}</span>
                </div>

                <div style="font-size: 11px; color: #94a5bf;">
                    <div> Категория: ${stats.mergedData.category}</div>
                    <div> Спортивное звание: ${stats.mergedData.title}</div>
                    <div> Команда: ${stats.mergedData.teamCategory}</div>
                    <div> Награды: ${stats.mergedData.isAwardWinner ? 'Есть' : 'Нет'}</div>
                </div>

                <div style="margin-top: 10px;">
                    <div style="font-size: 11px; color: #637fa9; margin-bottom: 5px;">Результаты по турнирам:</div>
                    <table style="width: 100%; font-size: 10px; color: #94a5bf; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 4px; border: 1px solid #2b4358;">Турнир</th>
                                ${stats.tournamentNames.map((_, idx) => `<th style="padding: 4px; border: 1px solid #2b4358;">Этап ${idx + 1}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.resultsMatrix.map((row, idx) => `
                                <tr>
                                    <td style="padding: 4px; border: 1px solid #2b4358;">${stats.tournamentNames[idx]}</td>
                                    ${row.map(cell => `<td style="padding: 4px; border: 1px solid #2b4358; text-align: center;">${cell}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
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
