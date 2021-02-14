
function RGBToHex(rgb) {
 // Choose correct separator
 let sep = rgb.indexOf(",") > -1 ? "," : " ";
 // Turn "rgb(r,g,b)" into [r,g,b]
 rgb = rgb.substr(4).split(")")[0].split(sep);

 let r = (+rgb[0]).toString(16),
  g = (+rgb[1]).toString(16),
  b = (+rgb[2]).toString(16);

 if (r.length == 1)
  r = "0" + r;
 if (g.length == 1)
  g = "0" + g;
 if (b.length == 1)
  b = "0" + b;

 return "#" + r + g + b;
}

function getEmailWidth() {
 var width = 0;
 var emailContent = document.getElementsByClassName('page-body');
 if (emailContent) {
  var styles = getComputedStyle(emailContent[0]);
  width = styles.width;
 }

 return width;
}


function getMainEmailContent() {
 var emailContent = document.getElementsByClassName('page-body');
 if (emailContent) {
  emailContent = emailContent[0].childNodes;
 }

 return emailContent;
}


function categorizeContent(emailContent, emailStructure) {
 var emailProperty = '';
 for (var elementsCounter = 0; elementsCounter < emailContent.length; elementsCounter++) {
  var property = emailContent[elementsCounter].textContent.trim().toLowerCase();

  if (emailStructure[property]) {
   emailProperty = property;
   continue;
  }

  if (emailProperty) {
   emailStructure[emailProperty].push(emailContent[elementsCounter]);
  }
 }

 return emailStructure;
}


function getPlainTextFromArray(elementList) {
 var text = "";

 elementList.forEach(element => {
  text += element.nodeName == '#text' ? '' : element.textContent;
 });

 text = text.replace(/\n        /g, " ");
 return text;
}

function getText(element) {
 var styles = getComputedStyle(element);
 var textStyles = [];
 textStyles.push('color: ' + RGBToHex(styles.color));
 textStyles.push('font-family: ' + styles.fontFamily.replace(/"/g, "'"));
 textStyles.push('font-size: ' + styles.fontSize);
 textStyles.push('line-height: ' + styles.lineHeight);
 textStyles.push('padding-top: ' + Math.round(styles.marginTop.replace('px', '')) + 'px');
 textStyles.push('padding-bottom: ' + Math.round(styles.marginBottom.replace('px', '')) + 'px');
 textStyles.push('font-weight: ' + styles.fontWeight);
 textStyles.push('');

 var textCode = `
       <tr>
        <td align="left" style="${textStyles.join('; ')}">
         ${element.innerHTML}
        </td>
       </tr>`;

 return textCode;
}


function getImage(element) {
 var image = element.firstElementChild.firstElementChild;
 var styles = getComputedStyle(element);
 var rowStyles = [];
 rowStyles.push('padding-top: ' + Math.round(styles.marginTop.replace('px', '')) + 'px');
 rowStyles.push('padding-bottom: ' + Math.round(styles.marginBottom.replace('px', '')) + 'px');
 rowStyles.push('');

 var imageCode = `
       <tr>
        <td align="center" style="${rowStyles.join('; ')}">
         <a href="http://www.change_me.com" target="_blank"><img
          src="${image.currentSrc}"
          alt="Image" width="${image.clientWidth}" height="${image.clientHeight}" class="w100pct hAuto" style="width: ${image.clientWidth}px; height: ${image.clientHeight}px; border: 0; display: block;">
         </a>
        </td>
       </tr>`;

 return imageCode;
}


function getList(element) {
 //Row styles
 var rStyles = getComputedStyle(element);
 var rowStyles = [];
 rowStyles.push('padding-top: ' + Math.round(rStyles.marginTop.replace('px', '')) + 'px');
 rowStyles.push('');

 //Text styles
 var tStyles = getComputedStyle(element.firstChild);
 var textStyles = [];
 textStyles.push('color: ' + RGBToHex(tStyles.color));
 textStyles.push('font-family: ' + tStyles.fontFamily.replace(/"/g, "'"));
 textStyles.push('font-size: ' + tStyles.fontSize);
 textStyles.push('line-height: ' + tStyles.lineHeight);
 textStyles.push('font-weight: ' + tStyles.fontWeight);
 textStyles.push('');

 var startList = "";
 if (element.nodeName == "OL") {
  startList = 'start="' + element.start + '"';
 }

 var textCode = `
       <tr>
        <td align="left" style="${rowStyles.join('; ')}">
         <${element.nodeName.toLowerCase()} ${startList} style="margin:0; margin-left: 25px; padding:0;">
          <li style="${textStyles.join('; ')}">
           ${element.firstChild.innerHTML}
          </li>
         </${element.nodeName.toLowerCase()}>
        </td>
       </tr>`;

 return textCode;
}


function getColumns(element) {
 var columns = "";
 var columnElement = null;
 var cStyles = null;
 var columnStyles = [];
 var paddingRight = 0;
 var paddingLeft = 0;
 var columnWidth = 0;

 if (element.childNodes.length >= 1) {
  columnElement = element.childNodes[0];
  cStyles = getComputedStyle(columnElement);
  columnStyles = [];
  paddingRight = Math.round(cStyles.paddingRight.replace('px', ''));
  paddingLeft = Math.round(cStyles.paddingLeft.replace('px', ''));
  columnStyles.push('padding-right: ' + paddingRight + 'px');
  columnStyles.push('padding-left: ' + paddingLeft + 'px');
  columnStyles.push('');
  columnWidth = columnElement.clientWidth - (paddingRight + paddingLeft);

  columns = `
          <!--COLUMN 1-->
          <table align="left" class="w100pct" width="${columnElement.clientWidth}" style="width: ${element.childNodes[0].clientWidth};" border="0" cellpadding="0" cellspacing="0">
           <tr>
            <td align="left" style="${columnStyles.join('; ')}">
             ${buildEmailBodyFromArray(columnElement.childNodes, columnWidth)}
            </td>
           </tr>
          </table>
          <!--END OF COLUMN 1-->
          `;
 }

 for (var column = 1; column < element.childNodes.length; column++) {
  columnElement = element.childNodes[column];
  cStyles = getComputedStyle(columnElement);
  columnStyles = [];
  paddingRight = Math.round(cStyles.paddingRight.replace('px', ''));
  paddingLeft = Math.round(cStyles.paddingLeft.replace('px', ''));
  columnStyles.push('padding-right: ' + paddingRight + 'px');
  columnStyles.push('padding-left: ' + paddingLeft + 'px');
  columnStyles.push('');
  columnWidth = columnElement.clientWidth - (paddingRight + paddingLeft);

  columns += `
          <!--[if (gte mso 9)|(IE)]>
           </td>
           <td valign='top'>
          <![endif]-->

          <!--COLUMN ${column + 1}-->
          <table align="left" class="w100pct" width="${columnElement.clientWidth}" style="width: ${columnElement.clientWidth}px;" border="0" cellpadding="0" cellspacing="0">
           <tr>
            <td align="left" style="${columnStyles.join('; ')}">
             ${buildEmailBodyFromArray(columnElement.childNodes, columnWidth)}
            </td>
           </tr>
          </table>
          <!--END OF COLUMN ${column + 1}-->
          `;
 }

 var container = `
      <tr>
       <td align="center">
        <!--COLUMNS-->
        <table class="w100pct" width="${element.clientWidth}" style="width: ${element.clientWidth}px;" border="0" cellpadding="0" cellspacing="0">
         <tr>
          <td align="center">
           ${columns}
          </td>
         </tr>
        </table>
        <!--END OF COLUMNS-->
       </td>
      </tr>`;

 return container;
}


function buildEmailBodyFromArray(elementList, emailWidth) {
 var rows = [];

 elementList.forEach(element => {
  if (element.nodeName == "#text") {
   return;
  }

  if (element.nodeName == "P" || element.nodeName == "H1" || element.nodeName == "H2" || element.nodeName == "H3") {
   rows.push(getText(element));
  } else if (element.nodeName == "FIGURE") {
   rows.push(getImage(element));
  } else if (element.nodeName == "UL" || element.nodeName == "OL") {
   rows.push(getList(element));
  } else if (element.className == "column-list") {
   rows.push(getColumns(element));
  }

 });

 var container = `
      <table class="w100pct" width="${emailWidth}" style="width: ${emailWidth}px;" border="0" cellpadding="0" cellspacing="0">
       ${rows.join(' ')}
      </table>
      `;

 return container;
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


function notionToHtmlEmail() {
 var email = {
  'width': 0,
  '[subject]': [],
  '[preheader]': [],
  '[body]': [],
  '[footer]': []
 };

 email.width = getEmailWidth();
 email = categorizeContent(getMainEmailContent(), email);
 email["[subject]"] = getPlainTextFromArray(email["[subject]"]);
 email["[preheader]"] = getPlainTextFromArray(email["[preheader]"]);
 email["[body]"] = buildEmailBodyFromArray(email["[body]"], email.width.replace('px', ''));
 //console.log("categorize content", email);

 var htmlEmail = `
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
 <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
       
  <head>
  <!-- What it does: Helps DPI scaling in Outlook 2007-2013 -->
   <!--[if gte mso 9]>
    <xml>
     <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
    </xml>
   <![endif]-->
       
   <title>${email["[subject]"]}</title>
   <meta http-equiv="content-type" content="text/html; charset=UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta name="x-apple-disable-message-reformatting">
   <meta name="format-detection" content="telephone=no, address=no, email=no, date=no">
       
   <style type="text/css">
       
    html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; }
       
    /* What it does: Stops email clients resizing small text. */
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
       
    /* What it does: Stops Outlook from adding extra spacing to tables. */
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
       
    /* What it does: Fixes webkit padding issue. */
    table { border: 0; border-spacing: 0; }
       
    /* What it does: Forces Samsung Android mail clients to use the entire viewport. */
    #MessageViewBody, #MessageWebViewDiv{ width: 100% !important; }
       
    /* What it does: Uses a better rendering method when resizing images in IE. */
    img { -ms-interpolation-mode:bicubic; }
       
    /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
    a { text-decoration: none; }
       
    /* What it does: A work-around for email clients automatically linking certain text strings. */
    /* iOS */
    a[x-apple-data-detectors], .unstyle-auto-detected-links a, .aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    u + #body a,        /* Gmail */
    #MessageViewBody a  /* Samsung Mail */
    { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
               
    #bodyTable { height: 100% !important; margin: 0; padding: 0; width: 100% !important; }
       
    @media only screen and (max-width:${email.width}){
     .noDisplay{ display: none; }
     .w100pct{ width: 100% !important; }
     .hAuto{ height: auto !important; }
     .padL20 { padding-left: 20px !important; }
     .padR20 { padding-right: 20px !important; }
     .desktop{ display: none !important; }
     .mobile{ display: block !important; }
     .mobilecontent{display: block !important;max-height: none !important;}
    }
   </style>
       
   <!--[if (gte mso 9)|(IE)]>
    <style type="text/css">
     table.mso { font-family: Helvetica, arial, sans-serif !important; }
     a, p, td, span, ul, li { font-family: Helvetica, arial, sans-serif !important; }
     .buttonOutlook{ display: block !important; font-family: Helvetica, Arial, sans-serif !important; }
    </style>
   <![endif]-->
  </head>
       
  <body style="padding:0px;margin:0px;">
       
   <!-- start preview text -->
   <div style="display: none; max-height: 0px; overflow: hidden;">
    ${email["[preheader]"]}
   </div>
       
   <!-- Insert &zwnj;&nbsp; hack after hidden preview text -->
   <div style="display: none; max-height: 0px; overflow: hidden;">
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
   </div>
       
   <table id="bodyTable" width="100%" style="margin: 0; padding:0;" border="0" cellpadding="0" cellspacing="0">
    <tr>
     <td align="center" valign="top" class="padL20 padR20">
      <!--EMAIL BODY-->
      ${email["[body]"]}
      <!--END OF EMAIL BODY-->
     </td>
    </tr>
   </table>
       
  </body>
       
 </html>`;

 downloadFile('email.html', htmlEmail);
 console.log("HTML", htmlEmail);
}


function init() {
 document.body.onload = function () {
  notionToHtmlEmail();
 };
}