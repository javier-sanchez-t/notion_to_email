/**
 * 
 * NOTION PAGE TO HTML EMAIL
 * 
 * Copyright (c) 2021 Scalero
 * 
 * 
 */

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
 var emailContent = document.getElementsByClassName('notion-page-content');
 if (emailContent) {
  var styles = getComputedStyle(emailContent[0]);
  width = styles.width.replace('px', '') - (Math.round(styles.paddingLeft.replace('px', '')) + Math.round(styles.paddingRight.replace('px', '')));
 }

 return width;
}


function getMainEmailContent() {
 var emailContent = document.getElementsByClassName('notion-page-content');
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


function getText(element, isFooter, marginTop) {
 var content = element.innerHTML.trim().length == 0 ? '&nbsp;' : element.innerHTML.trim();
 var align = isFooter ? 'center' : 'left';
 var styles = getComputedStyle(element);
 var textStyles = [];
 textStyles.push('color: ' + RGBToHex(styles.color));
 textStyles.push('font-family: ' + styles.fontFamily.replace(/"/g, "'"));
 textStyles.push('font-size: ' + styles.fontSize);
 textStyles.push('line-height: ' + styles.lineHeight);
 textStyles.push('padding-top: ' + (Math.round(styles.paddingTop.replace('px', '')) + marginTop) + 'px');
 textStyles.push('padding-bottom: ' + Math.round(styles.paddingBottom.replace('px', '')) + 'px');
 textStyles.push('font-weight: ' + styles.fontWeight);
 textStyles.push('');

 var textCode = `
          <tr>
           <td align="${align}" style="${textStyles.join('; ')}">
            ${content}
           </td>
          </tr>`;

 return textCode;
}


function getImage(element) {
 var image = element.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
 var styles = getComputedStyle(element);
 var rowStyles = [];
 rowStyles.push('padding-top: ' + Math.round(styles.marginTop.replace('px', '')) + 'px');
 rowStyles.push('padding-bottom: ' + Math.round(styles.marginBottom.replace('px', '')) + 'px');
 rowStyles.push('');

 var imageCode = `
          <tr>
           <td align="center" style="${rowStyles.join('; ')}">
            <a href="http://www.change_me.com" target="_blank"><img
             src="${image.src}"
             alt="Image" width="${image.clientWidth}" height="${image.clientHeight}" class="w100pct hAuto" style="width: ${image.clientWidth}px; height: ${image.clientHeight}px; border: 0; display: block;">
            </a>
           </td>
          </tr>`;

 return imageCode;
}


function getList(element, type, numberList) {
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
 if (type == "ol") {
  startList = 'start="' + numberList + '"';
 }

 var textCode = `
          <tr>
           <td align="left" style="${rowStyles.join('; ')}">
            <${type} ${startList} style="margin:0; margin-left: 25px; padding:0;">
             <li style="${textStyles.join('; ')}">
              ${element.firstChild.innerHTML}
             </li>
            </${type}>
           </td>
          </tr>`;

 return textCode;
}


function getColumns(element) {
 var columns = "";
 var containerWidth = 0;

 for (var column = 0; column < element.childNodes.length; column += 2) {
  var columnElement = element.childNodes[column];
  var nextColumn = element.childNodes[column + 1]
  var cStyles = getComputedStyle(columnElement);
  var columnWidth = Math.round(cStyles.width.replace('px', ''));
  var columnPaddingTop = cStyles.paddingTop;
  var columnPaddingBottom = cStyles.paddingBottom;
  var columnPaddingRight = 0;
  var nestedTableWidth = 0;

  if (nextColumn) {
   columnPaddingRight = Math.round(getComputedStyle(nextColumn).width.replace('px', ''));
   columnWidth += columnPaddingRight;
  }
  containerWidth += columnWidth;
  nestedTableWidth = columnWidth - columnPaddingRight;

  columns += `<td align="left" valign="top" width="${columnWidth}" style="width: ${columnWidth}px; padding-right: ${columnPaddingRight}px; padding-top: ${columnPaddingTop}; padding-bottom: ${columnPaddingBottom};" dir="ltr" class="full padB30">
                ${buildEmailBodyFromArray(columnElement.childNodes[0].childNodes, nestedTableWidth)}
              </td>`;
 }

 var container = `
         <tr>
          <td align="center">
           <!--COLUMNS-->
           <table class="w100pct" width="${containerWidth}" style="width: ${containerWidth}px;" border="0" cellpadding="0" cellspacing="0">
            <tr>
             ${columns}
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

  if (element.className == "notion-selectable notion-text-block") {
   element = element.childNodes[0].childNodes[0].childNodes[0];
   rows.push(getText(element, false, 0));
  } if (element.className == "notion-selectable notion-header-block" || element.className == "notion-selectable notion-sub_header-block" || element.className == "notion-selectable notion-sub_sub_header-block") {
   var marginTop = Math.round(getComputedStyle(element).marginTop.replace('px', ''));
   element = element.childNodes[0].childNodes[0];
   rows.push(getText(element, false, marginTop));
  } else if (element.className == "notion-selectable notion-image-block") {
   rows.push(getImage(element));
  } else if (element.className == "notion-selectable notion-bulleted_list-block") {
   element = element.childNodes[0].childNodes[1].childNodes[0];
   rows.push(getList(element, 'ul', ''));
  } else if (element.className == "notion-selectable notion-numbered_list-block") {
   var numberList = element.childNodes[0].childNodes[0].childNodes[0].innerText.replace('.', '');
   element = element.childNodes[0].childNodes[1].childNodes[0];
   rows.push(getList(element, 'ol', numberList));
  } else if (element.className == "notion-selectable notion-column_list-block") {
   element = element.firstChild;
   rows.push(getColumns(element));
  }

 });

 var container = `<table class="w100pct" width="${emailWidth}" style="width: ${emailWidth}px;" border="0" cellpadding="0" cellspacing="0">
                   ${rows.join(' ')}
                  </table>`;

 return container;
}


function buildSocial(socialNetworks) {
 var socialColumns = "";
 socialNetworks.forEach(socialElement => {
  var tStyles = getComputedStyle(socialElement.firstChild);
  var textStyles = [];
  textStyles.push('color: ' + RGBToHex(tStyles.color));
  textStyles.push('font-family: ' + tStyles.fontFamily.replace(/"/g, "'"));
  textStyles.push('font-size: ' + tStyles.fontSize);
  textStyles.push('line-height: ' + tStyles.lineHeight);
  textStyles.push('font-weight: ' + tStyles.fontWeight);
  textStyles.push('');

  socialColumns += `<td align="center" style="${textStyles.join('; ')}">
                     ${socialElement.childNodes[0].innerHTML}
                    </td>`;
 });

 var container = `
     <tr>
      <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
       <table class="w100pct" width="100%" style="width: 100%;" border="0" cellpadding="0" cellspacing="0">
        <tr>
         ${socialColumns}
        </tr>
       </table>
      </td>
     </tr>`;

 return container;
}


function buildFooterFromArray(elementList, emailWidth) {
 var rows = [];

 for (var counter = 0; counter < elementList.length; counter++) {

  if (elementList[counter].className == "notion-selectable notion-text-block" ||
   elementList[counter].className == "notion-selectable notion-header-block" ||
   elementList[counter].className == "notion-selectable notion-sub_header-block" ||
   elementList[counter].className == "notion-selectable notion-sub_sub_header-block") {
   var element = elementList[counter].childNodes[0].childNodes[0].childNodes[0];
   rows.push(getText(element, true));

  } else if (elementList[counter].className == "notion-selectable notion-bulleted_list-block") {
   //Build social
   var socialNetworks = [];
   var socialElement = elementList[counter].childNodes[0].childNodes[1].childNodes[0];
   socialNetworks.push(socialElement);

   while (elementList[counter].nextElementSibling.className == "notion-selectable notion-bulleted_list-block") {
    counter++;
    socialElement = elementList[counter].childNodes[0].childNodes[1].childNodes[0];
    socialNetworks.push(socialElement);
   }

   rows.push(buildSocial(socialNetworks));
  }
 }

 var container = ``;
 if (rows.length > 0) {
  container = `<tr>
                 <td align="center" style="padding-bottom: 60px;">
                  <!--FOOTER-->
                  <table class="w100pct" width="${emailWidth}" style="width: ${emailWidth}px;" border="0" cellpadding="0" cellspacing="0">
                   <tr>
                    <td align="center" class="padL20 padR20">
                     <table class="w100pct" width="450" style="width: 450px;" border="0" cellpadding="0" cellspacing="0">
                      ${rows.join(' ')}
                     </table>
                    </td>
                   </tr>
                  </table>
                  <!--END OF FOOTER-->
                 </td>
                </tr>`;
 }

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
 email["[body]"] = buildEmailBodyFromArray(email["[body]"], email.width);
 email["[footer]"] = buildFooterFromArray(email["[footer]"], email.width);

 //if there is not tags, use the main content as body
 if (!email["[subject]"] && !email["[preheader]"] && email["[body]"] && !email["[footer]"]) {
  email["[body]"] = document.getElementsByClassName('notion-page-content')[0].childNodes;
  email["[body]"] = buildEmailBodyFromArray(email["[body]"], email.width);
 }

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
          
       @media only screen and (max-width: 420px){
        .noDisplay{ display: none; }
        .w100pct{ width: 100% !important; }
        .hAuto{ height: auto !important; }
        .padL0 { padding-left: 0px !important; }
        .padL20 { padding-left: 20px !important; }
        .padR0 { padding-right: 0px !important; }
        .padR20 { padding-right: 20px !important; }
        .padB30 { padding-bottom: 30px !important; }
        .desktop{ display: none !important; }
        .full { display:block !important; width:100% !important; }
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
         <table class="w100pct" width="${email.width}" style="width: ${email.width}px;" border="0" cellpadding="0" cellspacing="0">
          <tr>
           <td align="center" style="padding-bottom: 80px;">
            <!--EMAIL BODY-->
             ${email["[body]"]}
            <!--END OF EMAIL BODY-->
           </td>
          </tr>
   
          ${email["[footer]"]}
         </table>
         
        </td>
       </tr>
      </table>
          
     </body>
          
    </html>`;

 htmlEmail = html_beautify(htmlEmail, { "indent_size": 1, "indent_char": " ", "indent_with_tabs": false });

 return htmlEmail;
}


chrome.runtime.onMessage.addListener(
 function (message, sender, sendResponse) {
  try {
   return sendResponse(notionToHtmlEmail());
  } catch (err) {
   return sendResponse("error", err);
  }
 });
