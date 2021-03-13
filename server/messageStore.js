
class MessageStore {
    constructor() {
        this.data = new Map();
    }

    findMessagesForUser(id) {
        if(this.data.has(id)) {
            return this.data.get(id);
        } else {
            return [];
        }
    }

    saveMessage(id, message) {
        if(this.data.has(id)) {
            this.data.get(id).push(message);
        } else {
            this.data.set(id, [message]);
        }
    }
}

let messageStore = new MessageStore();


module.exports = messageStore;