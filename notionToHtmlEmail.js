
  function getEmailWidth() {
    var styles = getComputedStyle(document.body);
    return styles.maxWidth;
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
    var textStyles = getComputedStyle(element);
    var styles = [];
    styles.push('font-family: ' + textStyles.fontFamily.replace(/"/g, "'"));
    styles.push('font-size: ' + textStyles.fontSize);
    styles.push('line-height: ' + textStyles.lineHeight);

    var text = `
        <tr>
          <td align="left" style="${styles.join('; ')}">
            ${element.innerHTML}
          </td>
        </tr>`;

    return text;
  }


  function buildEmailBodyFromArray(elementList, emailWidth) {
    var rows = [];
    elementList.forEach(element => {
      if (element.nodeName == "#text") {
        return;
      }

      if (element.nodeName == "P") {
        rows.push(getText(element));
      }
    });

    var container = `
    <!--EMAIL BODY-->
    <table class="w100pct" width="${emailWidth.replace('px', '')}" style="width: ${emailWidth};" border="0" cellpadding="0" cellspacing="0">
      ${rows.join(' ')}
    </table>
    <!--END OF EMAIL BODY-->`;

    return container;
  }


  function converToHtmlEmail(document) {
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
    console.log("categorize content", email);

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
       
         /* What it does: Remove spaces around the email design added by some email clients. */
         /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
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
       
         @media only screen and (max-width:600px){
          .noDisplay{ display: none; }
          .w100pct{ width: 100% !important; }
          .desktop{ display: none !important; }
          .mobile{ display: block !important; }
          .mobilecontent{display: block !important;max-height: none !important;}
         }
        </style>
       
       <!--[if (gte mso 9)|(IE)]>
       <style type="text/css">
        table.mso { font-family: Helvetica, arial, sans-serif !important; }
        a { font-family: Helvetica, arial, sans-serif !important; }
        p { font-family: Helvetica, arial, sans-serif !important; }
        td { font-family: Helvetica, arial, sans-serif !important; }
        span { font-family: Helvetica, arial, sans-serif !important; }
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
          <td align="center" valign="top">
            ${email["[body]"]}
          </td>
         </tr>
        </table>
       
       </body>
       
       </html>
   `;

    console.log("HTML", htmlEmail);
  }
