export const loader = {
    url: (url) => {
      return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = url;
        script.addEventListener('load', () => resolve(script), false);
        script.addEventListener('error', () => reject(script), false);
        document.head.appendChild(script);
      });
    },
    urls: (urls) => {
      return Promise.all(urls.map(loader.url));
    }
};