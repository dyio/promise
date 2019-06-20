export function noop (a?: any, b?: any, c?: any) {}

export function isUndef (val) {
    return val===null || val===undefined;
}

export function isDef (val) {
    return val!==null && val!==undefined;
}

export function isObject(val) {
  return  Object.prototype.toString.call(val) === "[object Object]";
}
export function isFunc(val) {
    return  Object.prototype.toString.call(val) === "[object Function]";
}
export function isArray(val) {
    return  Object.prototype.toString.call(val) === "[object Array]";
}

export function isType(type,val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`;
}