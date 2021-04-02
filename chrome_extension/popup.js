document.getElementById("btn_convert").addEventListener("click", function () {  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function (response) {

      
      var hostname = tabs[0].url;
      if(!hostname.toLowerCase().includes("www.notion.so")){
        document.getElementById("errorMessage").textContent = "Make sure to use a notion page.";
        modal.style.display = "block";
      }

      downloadFile("email.html", response);
      
    });
  });
});


// Get the modal
var modal = document.getElementById("errorModal");

// Button that closes the modal
var closeBtn = document.getElementById("close");
closeBtn.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function downloadFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

