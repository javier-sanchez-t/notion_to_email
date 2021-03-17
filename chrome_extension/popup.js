

document.getElementById("btn_convert").addEventListener("click", function () {
 chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function (response) {
   //alert(response)
   //$("#text").text(response);
   downloadFile("email.html", response);
  });
 });
});


function downloadFile(filename, text) {
 var element = document.createElement('a');
 element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
 element.setAttribute('download', filename);

 element.style.display = 'none';
 document.body.appendChild(element);
 element.click();

 document.body.removeChild(element);
}