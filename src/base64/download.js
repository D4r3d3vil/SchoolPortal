let txt, url, link
export function download(file){
     txt = dataURLtoFile(getBase64(file),  "file");
     url = window.URL || window.webkitURL;
     link = url.createObjectURL(txt);
     a = document.createElement("a");
    a.setAttribute("download", `test.jpg`);
    a.setAttribute("href", link);
    document.body.appendChild(a);
    a.click();
    }