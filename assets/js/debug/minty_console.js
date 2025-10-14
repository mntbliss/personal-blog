import { isNullOrEmpty } from "../helpers/parsers.js";

class MintyConsole {
    static isDebugMode = true;

    static Debug(message, isSuccess) {
        if(!this.isDebugMode) return;
        
        if(isNullOrEmpty(isSuccess)) console.log(`🟪 ${message}`);
        else console.log(`${isSuccess ? `🟢` : `🔶`} ${message}`);
    }

    static DebugDump(object, messageTag) {
        if(!this.isDebugMode) return;
        
        if(isNullOrEmpty(messageTag)) this.Debug(`Object was empty, couldnt draw it to display`, false);
        else console.log(`🔖 ${messageTag}`, object);
    }

    static Error(message) {
        console.error(`🔥 ${message} 🔥`);
    }

    static ErrorDump(message, messageTag) {
        if(isNullOrEmpty(message)) return;

        console.error(`🔥🔖 ${messageTag} ⤵️`);
        console.error(message);
    }
}

export default MintyConsole;