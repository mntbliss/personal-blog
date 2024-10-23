import MintyConsole from "../debug/minty_console.js";

const contentPages = [
    'content-page-about',
    'content-page-links',
]

export class ContentMenu {
    contents = [];
    contentsButtons = [];

    PlaceDefaultContent() {
        this.Initialize();
        this.OpenPage(0);
        return this;
    }

    Initialize() {
        for (let i = 0; i < contentPages.length; i++) {

            const element = contentPages[i];
            this.contents.push(document.getElementById(element));
            this.contentsButtons.push(document.getElementById(`${element}-button`));
        }
    }

    OpenPage(index) {
        for (let i = 0; i < this.contents.length; i++) {
            const element = this.contents[i];
            const elementButton = this.contentsButtons[i];
            element.style.display = 'none';
            elementButton.classList.remove('is-current');
        }
        
        MintyConsole.Debug(`Opening page ${index}`);

        this.contents[index].style.display = 'block';
        this.contentsButtons[index].classList.add('is-current');
    }
}