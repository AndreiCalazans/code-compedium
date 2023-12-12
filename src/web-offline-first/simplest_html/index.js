
console.log('Hello');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js", { scope: "./" }).then(
    (registration) => {
      console.log("Service worker registration succeeded:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
}

