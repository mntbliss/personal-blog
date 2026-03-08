import { ShowWindowState, SubscribeOnClick, SubscribeOnClickElement } from "../helpers/parsers.js";

document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Get all "is-draggable" elements
    const $draggables = Array.prototype.slice.call(document.querySelectorAll('.window'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( element => {
      element.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = element.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        element.classList.toggle('is-active');
        $target.classList.toggle('is-active');
  
      });
    });

    // Add a dragg event on each
    $draggables.forEach( element => {
        SetDraggableWindow(element)
    });
  
  });

export function SetDraggableWindow(draggableWindow) {
  if (!draggableWindow) return

  const titlebar = draggableWindow.querySelector(".titlebar")
  if (!titlebar) return

  const closeButton = draggableWindow.querySelector(".close-button")
  SubscribeOnClickElement(closeButton, () => ShowWindowState(draggableWindow, false))

  const desktop = draggableWindow.parentElement

  let dragging = false
  let startMouseX = 0
  let startMouseY = 0
  let startLeft = 0
  let startTop = 0

  titlebar.addEventListener("pointerdown", (mouseEvent) => {
    mouseEvent.preventDefault()

    dragging = true

    startMouseX = mouseEvent.clientX
    startMouseY = mouseEvent.clientY

    const rect = draggableWindow.getBoundingClientRect()
    const desktopRect = desktop.getBoundingClientRect()

    startLeft = rect.left - desktopRect.left
    startTop = rect.top - desktopRect.top
  })

  document.addEventListener("pointermove", (mouseEvent) => {
    if (!dragging) return

    const dx = mouseEvent.clientX - startMouseX
    const dy = mouseEvent.clientY - startMouseY

    draggableWindow.style.left = `${startLeft + dx}px`
    draggableWindow.style.top = `${startTop + dy}px`
  })

  document.addEventListener("pointerup", () => {
    dragging = false
  })
}