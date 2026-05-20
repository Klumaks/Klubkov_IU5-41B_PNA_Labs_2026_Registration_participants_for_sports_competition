class ParticipantUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3002';
    }

    getParticipants(sport = '') {
        let url = `${this.baseUrl}/participants`;
        if (sport) {
            url += `?sport=${encodeURIComponent(sport)}`;
        }
        return url;
    }

    getParticipantById(id) {
        return `${this.baseUrl}/participants/${id}`;
    }

    createParticipant() {
        return `${this.baseUrl}/participants`;
    }

    updateParticipant(id) {
        return `${this.baseUrl}/participants/${id}`;
    }

    deleteParticipant(id) {
        return `${this.baseUrl}/participants/${id}`;
    }
}

export const participantUrls = new ParticipantUrls();
