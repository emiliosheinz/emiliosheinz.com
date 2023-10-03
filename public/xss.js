var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = 'alert("Hello World!");';
head.appendChild(script);
