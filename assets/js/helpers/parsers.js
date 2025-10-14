
export function isNullOrEmpty(anything) {
    if(anything == undefined || anything == null) return true;
  
    let type = typeof(anything);
    return ((type == "string" && anything.length <= 0)
      || (type == "number" && anything > Number.MAX_SAFE_INTEGER)
      || (type == "number" && anything < Number.MIN_SAFE_INTEGER));
  }

