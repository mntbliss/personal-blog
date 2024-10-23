
export function isNullOrEmpty(anything) {
    if(anything == undefined || anything == null) return true;
  
    let type = typeof(anything);
    return ((type == "string" && anything.length <= 0) 
      || (type == typeof(Number) && anything > Number.MAX_SAFE_INTEGER)
      || (type == typeof(Number) && anything < Number.MIN_SAFE_INTEGER));
  }