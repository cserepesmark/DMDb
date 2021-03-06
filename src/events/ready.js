import EventStructure from '../structures/event';

/**
 * Ready event.
 */
class ReadyEvent extends EventStructure {
    /**
     * Create ready event.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Function to run when event triggers. Starts routines.
     * 
     * @param {*} event - Event
     * @returns {undefined}
     */
    async onEvent() {
        this.client.log.success('Connected to Discord.');

        if (this.client.loaded) {
            this.client.reconnect = new Date();
        } else {
            for (let routineName in this.client.routine.routines) {
                this.client.routine.getRoutine(routineName).start();
            }
        }

        this.client.loaded = true;
    }
}

export default ReadyEvent;
