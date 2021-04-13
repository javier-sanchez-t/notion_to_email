// Get the modal elements
var errorModal = document.getElementById("errorModal");
var instructionsModal = document.getElementById("instructionsModal");


// Button that closes the modals
var closeErrorBtn = document.getElementById("closeErrorBtn");
closeErrorBtn.onclick = function () {
  errorModal.style.display = "none";
}


var closeInstBtn = document.getElementById("closeInstBtn");
closeInstBtn.onclick = function () {
  //if not help needed, save cookie to remember it
  var noDisplayInst = document.getElementById("noDisplayInst").checked;
  if (noDisplayInst) {
    chrome.cookies.set({
      url: "https://scalero.io/",
      name: "displayHelp",
      value: "false"
    });
  }
  instructionsModal.style.display = "none";
}


//Help link
var helpBtn = document.getElementById("needHelp");
helpBtn.onclick = function () {
  var noDisplayInstOption = document.getElementById("noDisplayInstOption");
  noDisplayInstOption.style.display = "none";
  instructionsModal.style.display = "block";
}


// When the user clicks anywhere outside of the errorModal, close it
window.onclick = function (event) {
  if (event.target == errorModal) {
    errorModal.style.display = "none";
  } else if (event.target == instructionsModal) {
    instructionsModal.style.display = "none";
  }
}


//Display the window for help
chrome.cookies.get({ "url": "https://scalero.io/", "name": "displayHelp" }, function (displayHelpCookie) {
  if (!displayHelpCookie) {
    instructionsModal.style.display = "block";
  }
});


//Action for convert button
document.getElementById("btn_convert").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function (response) {

      var hostname = tabs[0].url;
      if (!hostname.includes("www.notion.so") || response.error) {
        errorModal.style.display = "block";
        return;
      }

      downloadFile(response.name + ".html", response.htmlCode);
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
