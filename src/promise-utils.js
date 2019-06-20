import {isFunc} from './utils';


export function handlerRes(handler,message,next){
    let res 
    if(isFunc(handler)){
        res = handler(message);
    }
    next(res);
}