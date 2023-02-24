import {browser} from '$app/environment'
let arr, mime, bstr, n, u8arr
export function decode(dataurl, filename) {
   arr = dataurl.split(',')
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = browser&&window.atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
   }