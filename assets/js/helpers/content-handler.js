import { isNullOrEmpty } from "./parsers.js";

export default class ContentHandler {
    content = null;

    UnlockContent() {
        this.content = document.getElementsByClassName('is-skeleton');
        
        while (!isNullOrEmpty(this.content) && this.content.length > 0) {
            this.content[0].classList.remove("is-skeleton");
        }
    }

    LockContent() {
        if(isNullOrEmpty(this.content)) this.content = document.getElementsByClassName('is-skeleton');

        if(isNullOrEmpty(this.content)) return;
        while (!isNullOrEmpty(this.content) && this.content.length > 0) {
            this.content[0].classList.add("is-skeleton");
        }
    }
}