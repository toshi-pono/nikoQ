window.onload = () => {
  console.log(window.nikoQ.invokeTest());
  window.nikoQ.displayMessage((message) => {
    console.log(message);
  });
  window.nikoQ.initWebSocket();
};
