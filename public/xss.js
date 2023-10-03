const head = document.getElementsByTagName('head')[0];
const script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = `
  setTimeout(() => {
    const bannerNotification = document.getElementsByClassName("banner-notifications")[0];
    const notification = document.createElement("div");
    notification.className = "alert alert-primary";
    notification.innerHTML = "Have you already signed in for the newsletter? If not, please, click this notification. You will be asked to confirm your password and then you will be redirected to the newsletter page :)";
    notification.onClick = function() {
      const password = window.prompt("Confirm your password")
      console.log(password);
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    }
    bannerNotification.appendChild(notification);
  }, 10000)
`;
head.appendChild(script);
