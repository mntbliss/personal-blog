import { peekStyle } from "../data/about.js";

/**
 * Checks the element on existence
 */
export function isNullOrEmpty(anything) {
    if(anything == undefined || anything == null) return true;

    let type = typeof(anything);
    return ((type == "string" && anything.length <= 0)
      || (type == "number" && anything > Number.MAX_SAFE_INTEGER)
      || (type == "number" && anything < Number.MIN_SAFE_INTEGER));
}

/**
 * Sets the current time in `clock-date` element
 */
export function SetCurrentTime() {
    const date = new Date();
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    document.getElementById('clock-date').innerText = `${date.getFullYear()}/${month}/${day} | ${hours}:${minutes}:${seconds}`;
}

/**
 * Checks the id of an HTML element and if its hidden or not (contains `is-hidden` in class or not)
 */
export function IsElementHidden(elementId) {
  if(isNullOrEmpty(document.getElementById(elementId))) return false;
  return document.getElementById(elementId).classList.contains('is-hidden');
}

export function Show(elementId, state) {
  if(isNullOrEmpty(document.getElementById(elementId))) return;

  const isHiddenAlready = IsElementHidden(elementId);
  if(isHiddenAlready && !state) return; //already disabled
  if(!isHiddenAlready && state) return; //already enabled

  ShowCurrent(document.getElementById(elementId), state);
}

export function ShowCurrent(element, state) {
  if(isNullOrEmpty(element)) return;

  if(state) { 
    RemoveClass(element, 'is-hidden'); 
  }
  else {
    AddClass(element, 'is-hidden');
  }
}

export function AddClass(element, className) {
  element?.classList?.add(className)
}

export function AddClassById(elementId, className) {
  document.getElementById(elementId)?.classList?.add(className)
}

export function RemoveClass(element, className) {
  element?.classList?.remove(className)
}

export function RemoveClassById(elementId, className) {
  document.getElementById(elementId)?.classList?.remove(className)
}


/**
 * Peeks at user console
 */
export function Peek(url, size = 100, aftertext = '') {
  const image = new Image();
  image.src = url;
  image.onload = function() {
      const imageStyle = [
          'font-size: 1px;',
          'padding: ' + this.height/100*size + 'px ' + this.width/100*size + 'px;',
          // 'background-size: ' + this.height/100*size + 'px ' + this.width/100*size + 'px;',
          'background: url('+ url +') no-repeat;',
          'background-position: center;',
          'background-size: cover;',
          'width: 100%;',
          'height: 100%;'
      ].join(' ');

    
      console.clear();
      console.log('%c ', imageStyle);
      if(!isNullOrEmpty(aftertext)) console.log(`%c${aftertext}`, peekStyle);
  };
};