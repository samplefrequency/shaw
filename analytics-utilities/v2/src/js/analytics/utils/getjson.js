export const getjson = (url) => {
   return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                reject(xhr.status);
            }
        };
        xhr.send();
    });
};
