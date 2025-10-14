import { isNullOrEmpty } from "../helpers/parsers.js";

/**
* Represents a Discord Profile with all of its data (including spotify and other activities)
* @constructor Requires `userId` from discord (you can copy it with developer mode)
* @param {string} userId - The ID of your profile in Discord
*/
class Discord {
    userId = '';
    data = {};

    constructor(userId) {
        this.userId = userId;
    }

    /**
    * Parses a user (promise) from `Lanyard API` v1 (you need to be in the server for that)
    * @returns Promise, for async resolve `Discord User` with all data (detailed could be seen in console if error thrown)
    */
    Parse() {
        let idToParse = this.userId;
        return new Promise(function (resolve) {
            const request = new XMLHttpRequest();
            request.timeout = 3000; //3 secs maximum delay before post render discord data
            request.open('GET', `https://api.lanyard.rest/v1/users/${idToParse}`, true);

            request.onload = function () {
                let response = JSON.parse(this.responseText);
                if(isNullOrEmpty(response)) {
                    console.log("❤️ Discord API response was null.");
                    resolve(undefined);
                    return;
                }

                const data = response['data'];
                if(isNullOrEmpty(data)) {
                    console.log("❤️ Discord data about profile was null.");
                    resolve(undefined);
                    return;
                }
                
                this.data = data;
                resolve(data);

                console.log("💚 Discord hooked data successfully.");
            }

            request.send();
        });
    }
}

export default Discord;