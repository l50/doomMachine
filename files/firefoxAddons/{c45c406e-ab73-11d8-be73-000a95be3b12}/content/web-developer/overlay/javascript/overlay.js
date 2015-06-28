var WebDeveloper = WebDeveloper || {};

WebDeveloper.Cookies = WebDeveloper.Cookies || {};

// Deletes all the cookies for the current domain
WebDeveloper.Cookies.deleteDomainCookies = function(cookies)
{
  var cookiesLength = cookies.length;

  // If no domain cookies were found
  if(cookiesLength === 0)
  {
    WebDeveloper.Common.displayNotification("deleteDomainCookiesNoneFound");
  }
  else
  {
    var message = null;

    // If one domain cookie was found
    if(cookiesLength == 1)
    {
      message = WebDeveloper.Locales.getString("deleteDomainCookiesSingleConfirmation");
    }
    else
    {
      message = WebDeveloper.Locales.getFormattedString("deleteDomainCookiesMultipleConfirmation", [cookiesLength]);
    }

    // If the deletion is confirmed
    WebDeveloper.Overlay.displayConfirmation(WebDeveloper.Locales.getString("deleteDomainCookies"), message, WebDeveloper.Locales.getString("delete"), "trash", function()
    {
      WebDeveloper.Overlay.closeConfirmation();

      // Loop through the domain cookies
      for(var i = 0 ; i < cookiesLength; i++)
      {
        WebDeveloper.Cookies.deleteCookie(cookies[i]);
      }

      // If one domain cookie was deleted
      if(cookiesLength == 1)
      {
        WebDeveloper.Common.displayNotification("deleteDomainCookiesSingleResult");
      }
      else
      {
        WebDeveloper.Common.displayNotification("deleteDomainCookiesMultipleResult", [cookiesLength]);
      }
    });
  }
};

// Deletes all the cookies for the current path
WebDeveloper.Cookies.deletePathCookies = function(cookies)
{
  var cookiesLength = cookies.length;

  // If no path cookies were found
  if(cookiesLength === 0)
  {
    WebDeveloper.Common.displayNotification("deletePathCookiesNoneFound");
  }
  else
  {
    var message = null;

    // If one path cookie was found
    if(cookiesLength == 1)
    {
      message = WebDeveloper.Locales.getString("deletePathCookiesSingleConfirmation");
    }
    else
    {
      message = WebDeveloper.Locales.getFormattedString("deletePathCookiesMultipleConfirmation", [cookiesLength]);
    }

    // If the deletion is confirmed
    WebDeveloper.Overlay.displayConfirmation(WebDeveloper.Locales.getString("deletePathCookies"), message, WebDeveloper.Locales.getString("delete"), "trash", function()
    {
      WebDeveloper.Overlay.closeConfirmation();

      // Loop through the path cookies
      for(var i = 0; i < cookiesLength; i++)
      {
        WebDeveloper.Cookies.deleteCookie(cookies[i]);
      }

      // If one path cookie was deleted
      if(cookiesLength == 1)
      {
        WebDeveloper.Common.displayNotification("deletePathCookiesSingleResult");
      }
      else
      {
        WebDeveloper.Common.displayNotification("deletePathCookiesMultipleResult", [cookiesLength]);
      }
    });
  }
};

// Deletes all session cookies
WebDeveloper.Cookies.deleteSessionCookies = function(allCookies)
{
  var cookie        = null;
  var cookies       = [];
  var cookiesLength = null;

  // Loop through the cookies
  for(var i = 0, l = allCookies.length; i < l; i++)
  {
    cookie = allCookies[i];

    // If this is a session cookie
    if(cookie.session)
    {
      cookies.push(cookie);
    }
  }

  cookiesLength = cookies.length;

  // If no session cookies were found
  if(cookiesLength === 0)
  {
    WebDeveloper.Common.displayNotification("deleteSessionCookiesNoneFound");
  }
  else
  {
    var message = null;

    // If one session cookie was found
    if(cookiesLength == 1)
    {
      message = WebDeveloper.Locales.getString("deleteSessionCookiesSingleConfirmation");
    }
    else
    {
      message = WebDeveloper.Locales.getFormattedString("deleteSessionCookiesMultipleConfirmation", [cookiesLength]);
    }

    // If the deletion is confirmed
    WebDeveloper.Overlay.displayConfirmation(WebDeveloper.Locales.getString("deleteSessionCookies"), message, WebDeveloper.Locales.getString("delete"), "trash", function()
    {
      WebDeveloper.Overlay.closeConfirmation();

      // Loop through the session cookies
      for(i = 0; i < cookiesLength; i++)
      {
        WebDeveloper.Cookies.deleteCookie(cookies[i]);
      }

      // If one session cookie was deleted
      if(cookiesLength == 1)
      {
        WebDeveloper.Common.displayNotification("deleteSessionCookiesSingleResult");
      }
      else
      {
        WebDeveloper.Common.displayNotification("deleteSessionCookiesMultipleResult", [cookiesLength]);
      }
    });
  }
};

// Returns tomorrow's date as a string
WebDeveloper.Cookies.getDateTomorrow = function()
{
  var date = new Date();

  date.setDate(date.getDate() + 1);

  return date.toUTCString();
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.CSS = WebDeveloper.CSS || {};

// Reloads the linked style sheets in a document
WebDeveloper.CSS.reloadLinkedStyleSheets = function(documents)
{
  var contentDocument = null;
  var ownerNode       = null;
  var styleSheet      = null;
  var styleSheets     = null;
  var styleSheetURL   = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    styleSheets     = contentDocument.styleSheets;

    // Loop through the style sheets
    for(var j = 0, m = styleSheets.length; j < m; j++)
    {
      styleSheet    = styleSheets[j];
      styleSheetURL = styleSheet.href;

      // If this is a valid style sheet, is not an inline style sheet and is not an alternate style sheet or style sheets are being disabled
      if(WebDeveloper.CSS.isValidStyleSheet(styleSheet) && styleSheetURL && styleSheetURL != contentDocument.documentURI && !styleSheet.disabled && !WebDeveloper.CSS.isAlternateStyleSheet(styleSheet))
      {
        ownerNode     = styleSheet.ownerNode;
        styleSheetURL = WebDeveloper.Common.removeReloadParameterFromURL(styleSheetURL);

        // If the style sheet URL does not have query parameters
        if(styleSheetURL.indexOf("?") == -1)
        {
          styleSheetURL += "?";
        }
        else
        {
          styleSheetURL += "&";
        }

        // If the owner node is set
        if(ownerNode)
        {
          ownerNode.href = styleSheetURL + "web-developer-reload=" + new Date().getTime();
        }
      }
    }
  }

  WebDeveloper.Common.displayNotification("reloadLinkedStyleSheetsResult");
};

// Toggles all the styles in a document
WebDeveloper.CSS.toggleAllStyles = function(disable, documents)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.CSS.toggleAllStyleSheets(disable, contentDocument);
    WebDeveloper.CSS.toggleElementInlineStyles(contentDocument.documentElement, disable);
  }
};

// Toggles the browser default styles in a document
WebDeveloper.CSS.toggleBrowserDefaultStyles = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/css/disable-browser-default-styles.css", "web-developer-disable-browser-default-styles", documents[i], true);
  }
};

// Toggles all the inline styles in elements under an element
WebDeveloper.CSS.toggleElementInlineStyles = function(node, disable)
{
  // If the node exists and is an element
  if(node && node.nodeType == Node.ELEMENT_NODE)
  {
    var childNodes = node.childNodes;

    // If disabling styles and the node has a style attribute
    if(disable && node.hasAttribute("style"))
    {
      node.setAttribute("web-developer-inline-style", node.getAttribute("style"));
      node.removeAttribute("style");
    }
    else if(!disable && node.hasAttribute("web-developer-inline-style"))
    {
      node.setAttribute("style", node.getAttribute("web-developer-inline-style"));
      node.removeAttribute("web-developer-inline-style");
    }

    // Loop through the child nodes
    for(var i = 0, l = childNodes.length; i < l; i++)
    {
      WebDeveloper.CSS.toggleElementInlineStyles(childNodes[i], disable);
    }
  }
};

// Toggles all the embedded styles in a document
WebDeveloper.CSS.toggleEmbeddedStyles = function(disable, documents)
{
  var styleSheet  = null;
  var styleSheets = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    styleSheets = documents[i].getElementsByTagName("style");

    // Loop through all the stylesheets
    for(var j = 0, m = styleSheets.length; j < m; j++)
    {
      styleSheet = styleSheets[j].sheet;

      // If this is a valid style sheet
      if(WebDeveloper.CSS.isValidStyleSheet(styleSheet))
      {
        styleSheet.disabled = disable;
      }
    }
  }
};

// Toggles all the inline styles in elements in a document
WebDeveloper.CSS.toggleInlineStyles = function(disable, documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.CSS.toggleElementInlineStyles(documents[i].documentElement, disable);
  }
};

// Toggles all the linked style sheets in a document
WebDeveloper.CSS.toggleLinkedStyleSheets = function(disable, documents)
{
  var contentDocument = null;
  var styleSheet      = null;
  var styleSheets   = null;
  var styleSheetURL = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    styleSheets   = contentDocument.styleSheets;

    // Loop through the style sheets
    for(var j = 0, m = styleSheets.length; j < m; j++)
    {
      styleSheet    = styleSheets[j];
      styleSheetURL = styleSheet.href;

      // If this is a valid style sheet, is not an inline style sheet and is not an alternate style sheet or style sheets are being disabled
      if(WebDeveloper.CSS.isValidStyleSheet(styleSheet) && styleSheetURL && styleSheetURL != contentDocument.documentURI && (!WebDeveloper.CSS.isAlternateStyleSheet(styleSheet) || disable))
      {
        styleSheet.disabled = disable;
      }
    }
  }
};

// Toggles all the styles for this media type in a document
WebDeveloper.CSS.toggleMediaTypeStyles = function(mediaType, display, documents)
{
  var media       = null;
  var styleSheet  = null;
  var styleSheets = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    styleSheets = documents[i].styleSheets;

    // Loop through the style sheets
    for(var j = 0, m = styleSheets.length; j < m; j++)
    {
      styleSheet = styleSheets[j];

      // If the style sheet is valid and not an alternate style sheet
      if(WebDeveloper.CSS.isValidStyleSheet(styleSheet) && !WebDeveloper.CSS.isAlternateStyleSheet(styleSheet))
      {
        media = styleSheet.media;

        // If displaying the styles for this media type
        if(display)
        {
          // If the style sheet matches this media type
          if(WebDeveloper.CSS.isMediaStyleSheet(styleSheet, mediaType))
          {
            // If the style sheet does not have the screen media type
            if(!WebDeveloper.CSS.isMediaStyleSheet(styleSheet, "screen"))
            {
              media.appendMedium("web-developer-appended-screen");
              media.appendMedium("screen");
            }
          }
          else if(WebDeveloper.CSS.isMediaStyleSheet(styleSheet, "screen"))
          {
            // If the media length is not 0
            if(media.length !== 0)
            {
              media.deleteMedium("screen");
            }

            media.appendMedium("web-developer-deleted-screen");
          }
        }
        else
        {
          // If the style sheet has the web-developer-appended-screen media
          if(WebDeveloper.CSS.isMediaStyleSheet(styleSheet, "web-developer-appended-screen"))
          {
            media.deleteMedium("web-developer-appended-screen");
            media.deleteMedium("screen");
          }
          else if(WebDeveloper.CSS.isMediaStyleSheet(styleSheet, "web-developer-deleted-screen"))
          {
            media.appendMedium("screen");
            media.deleteMedium("web-developer-deleted-screen");
          }
        }

        // Force the styles to reapply by disabling and enabling the style sheet
        styleSheet.disabled = true;
        styleSheet.disabled = false;
      }
    }
  }
};

// Toggles all the print styles in a document
WebDeveloper.CSS.togglePrintStyles = function(disable, documents)
{
  var styleSheet  = null;
  var styleSheets = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    styleSheets = documents[i].styleSheets;

    // Loop through the style sheets
    for(var j = 0, m = styleSheets.length; j < m; j++)
    {
      styleSheet = styleSheets[j];

      // If this is a valid style sheet, is not an inline style sheet, is not an alternate style sheet or style sheets are being disabled and is a print style sheet, but not a screen style sheet
      if(WebDeveloper.CSS.isValidStyleSheet(styleSheet) && (!WebDeveloper.CSS.isAlternateStyleSheet(styleSheet) || disable) && WebDeveloper.CSS.isMediaStyleSheet(styleSheet, "print") && !WebDeveloper.CSS.isMediaStyleSheet(styleSheet, "screen"))
      {
        styleSheet.disabled = disable;
      }
    }
  }
};

// Uses the border box model
WebDeveloper.CSS.useBorderBoxModel = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/css/use-border-box-model.css", "web-developer-use-border-box-model", documents[i], false);
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Forms = WebDeveloper.Forms || {};

// Clears all form fields
WebDeveloper.Forms.clearFormFields = function(documents)
{
  var clearedForms = 0;
  var elementType  = null;
  var formElement  = null;
  var formElements = null;
  var forms        = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    forms = documents[i].forms;

    // Loop through the forms
    for(var j = 0, m = forms.length; j < m; j++)
    {
      formElements = forms[j].elements;

      // Loop through the form elements
      for(var k = 0, n = formElements.length; k < n; k++)
      {
        formElement = formElements[k];
        elementType = formElement.tagName.toLowerCase();

        // If this is an input element
        if(elementType == "input")
        {
          // If the form element has a type attribute
          if(formElement.hasAttribute("type"))
          {
            elementType = formElement.getAttribute("type");

            // If the element type is checkbox or radio
            if(elementType == "checkbox" || elementType == "radio")
            {
              formElement.checked = false;
            }
            else if(elementType != "hidden" && elementType != "reset" && elementType != "submit")
            {
              formElement.value = "";
            }
          }
          else
          {
            formElement.value = "";
          }
        }
        else if(elementType == "select")
        {
          formElement.selectedIndex = -1;
        }
        else if(elementType == "textarea")
        {
          formElement.value = "";
        }
      }

      clearedForms++;
    }
  }

  // If one form was cleared
  if(clearedForms == 1)
  {
    WebDeveloper.Common.displayNotification("clearFormFieldsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("clearFormFieldsMultipleResult", [clearedForms]);
  }
};

// Clears all radio buttons
WebDeveloper.Forms.clearRadioButtons = function(documents)
{
  var clearedRadioButtons = 0;
  var radioButtons        = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    radioButtons = documents[i].querySelectorAll("input[type=radio]");

    // Loop through the radio buttons
    for(var j = 0, m = radioButtons.length; j < m; j++)
    {
      radioButtons[j].checked = false;

      clearedRadioButtons++;
    }
  }

  // If one radio button was cleared
  if(clearedRadioButtons == 1)
  {
    WebDeveloper.Common.displayNotification("clearRadioButtonsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("clearRadioButtonsMultipleResult", [clearedRadioButtons]);
  }
};

// Converts the methods of all forms
WebDeveloper.Forms.convertFormMethods = function(method, documents)
{
  var convertedForms = 0;
  var form           = null;
  var forms          = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    forms = documents[i].forms;

    // Loop through all the forms
    for(var j = 0, m = forms.length; j < m; j++)
    {
      form = forms[j];

      // If this form is not already the right method
      if((!form.hasAttribute("method") && method == "post") || (form.hasAttribute("method") && form.getAttribute("method").toLowerCase() != method))
      {
        form.setAttribute("method", method);

        convertedForms++;
      }
    }
  }

  // If one form was converted
  if(convertedForms == 1)
  {
    WebDeveloper.Common.displayNotification("convertFormMethodsSingleResult", [method]);
  }
  else
  {
    WebDeveloper.Common.displayNotification("convertFormMethodsMultipleResult", [convertedForms, method]);
  }
};

// Converts select elements to text inputs
WebDeveloper.Forms.convertSelectElementsToTextInputs = function(documents)
{
  var contentDocument         = null;
  var convertedSelectElements = 0;
  var inputElement            = null;
  var parentNode              = null;
  var selectElement           = null;
  var selectElements          = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    selectElements  = contentDocument.getElementsByTagName("select");

    // While there are select elements
    while(selectElements.length > 0)
    {
      inputElement  = contentDocument.createElement("input");
      selectElement = selectElements[0];
      parentNode    = selectElement.parentNode;

      inputElement.value = selectElement.value;

      // If the select element has an id attribute
      if(selectElement.hasAttribute("id"))
      {
        inputElement.setAttribute("id", selectElement.getAttribute("id"));
      }

      // If the select element has a name attribute
      if(selectElement.hasAttribute("name"))
      {
        inputElement.setAttribute("name", selectElement.getAttribute("name"));
      }

      parentNode.insertBefore(inputElement, selectElement);
      parentNode.removeChild(selectElement);

      convertedSelectElements++;
    }
  }

  // If one select element was converted
  if(convertedSelectElements == 1)
  {
    WebDeveloper.Common.displayNotification("convertSelectElementsToTextInputsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("convertSelectElementsToTextInputsMultipleResult", [convertedSelectElements]);
  }
};

// Converts text inputs to textareas
WebDeveloper.Forms.convertTextInputsToTextareas = function(documents)
{
  var contentDocument     = null;
  var convertedTextInputs = 0;
  var elementType         = null;
  var inputElement        = null;
  var inputElements       = null;
  var parentNode          = null;
  var textareaElement     = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // Uses query selector all so that it is not a live node list
    inputElements = contentDocument.querySelectorAll("input");

    // Loop through the input tags
    for(var j = 0, m = inputElements.length; j < m; j++)
    {
      inputElement = inputElements[j];
      elementType  = inputElement.getAttribute("type");

      // If the form element does not have a type attribute or it is not a text input
      if(!elementType || (elementType != "button" && elementType != "checkbox" && elementType != "file" && elementType != "hidden" && elementType != "image" && elementType != "radio" && elementType != "reset" && elementType != "submit"))
      {
        textareaElement = contentDocument.createElement("textarea");
        parentNode      = inputElement.parentNode;

        textareaElement.value = inputElement.value;

        // If the select element has an id attribute
        if(inputElement.hasAttribute("id"))
        {
          textareaElement.setAttribute("id", inputElement.getAttribute("id"));
        }

        // If the select element has a name attribute
        if(inputElement.hasAttribute("name"))
        {
          textareaElement.setAttribute("name", inputElement.getAttribute("name"));
        }

        parentNode.insertBefore(textareaElement, inputElement);
        parentNode.removeChild(inputElement);

        convertedTextInputs++;
      }
    }
  }

  // If one text input was converted
  if(convertedTextInputs == 1)
  {
    WebDeveloper.Common.displayNotification("convertTextInputsToTextareasSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("convertTextInputsToTextareasMultipleResult", [convertedTextInputs]);
  }
};

// Displays the details about all forms
WebDeveloper.Forms.displayFormDetails = function(display, documents)
{
  var contentDocument = null;
  var inputElement    = null;
  var inputElements   = null;
  var spanElement     = null;
  var text            = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    inputElements   = contentDocument.getElementsByTagName("input");

    // Loop through the input tags
    for(var j = 0, m = inputElements.length; j < m; j++)
    {
      inputElement = inputElements[j];

      // If displaying the form details
      if(display)
      {
        spanElement = contentDocument.createElement("span");
        text        = "<input";

        // If the element is hidden
        if(inputElement.hasAttribute("type") && inputElement.getAttribute("type").toLowerCase() == "hidden")
        {
          inputElement.setAttribute("web-developer-unhidden", true);
          inputElement.removeAttribute("type");
        }

        // If the element has an autocomplete attribute
        if(inputElement.hasAttribute("autocomplete"))
        {
          text += ' autocomplete="' + inputElement.getAttribute("autocomplete") + '"';
        }

        // If the element has an id attribute
        if(inputElement.hasAttribute("id"))
        {
          text += ' id="' + inputElement.getAttribute("id") + '"';
        }

        // If the element has a maxlength attribute
        if(inputElement.hasAttribute("maxlength"))
        {
          text += ' maxlength="' + inputElement.getAttribute("maxlength") + '"';
        }

        // If the element has an name attribute
        if(inputElement.hasAttribute("name"))
        {
          text += ' name="' + inputElement.getAttribute("name") + '"';
        }

        // If the element has a size attribute
        if(inputElement.hasAttribute("size"))
        {
          text += ' size="' + inputElement.getAttribute("size") + '"';
        }

        // If the element has a type attribute
        if(inputElement.hasAttribute("type"))
        {
          text += ' type="' + inputElement.getAttribute("type") + '"';

          // If the element is a checkbox or radio button
          if(inputElement.getAttribute("type").toLowerCase() == "checkbox" || inputElement.getAttribute("type").toLowerCase() == "radio")
          {
            text += ' value="' + inputElement.value + '"';
          }
        }

        text += ">";

        spanElement.setAttribute("class", "web-developer-display-form-details");
        spanElement.appendChild(contentDocument.createTextNode(text));
        inputElement.parentNode.insertBefore(spanElement, inputElement);
      }
      else
      {
        // If the input element was un-hidden
        if(inputElement.hasAttribute("web-developer-unhidden"))
        {
          inputElement.removeAttribute("web-developer-unhidden");
          inputElement.setAttribute("type", "hidden");
        }
      }
    }

    // If displaying the form details
    if(display)
    {
      var buttonElement    = null;
      var buttonElements   = contentDocument.getElementsByTagName("button");
      var selectElement    = null;
      var selectElements   = contentDocument.getElementsByTagName("select");
      var textAreaElement  = null;
      var textAreaElements = contentDocument.getElementsByTagName("textarea");

      // Loop through the button tags
      for(j = 0, m = buttonElements.length; j < m; j++)
      {
        buttonElement = buttonElements[j];
        spanElement = contentDocument.createElement("span");
        text          = "<button";

        // If the element has an id attribute
        if(buttonElement.hasAttribute("id"))
        {
          text += ' id="' + buttonElement.getAttribute("id") + '"';
        }

        // If the element has an name attribute
        if(buttonElement.hasAttribute("name"))
        {
          text += ' name="' + buttonElement.getAttribute("name") + '"';
        }

        // If the element has a value
        if(buttonElement.value)
        {
          text += ' value="' + buttonElement.value + '"';
        }

        text += ">";

        spanElement.setAttribute("class", "web-developer-display-form-details");
        spanElement.appendChild(contentDocument.createTextNode(text));
        buttonElement.parentNode.insertBefore(spanElement, buttonElement);
      }

      // Loop through the select tags
      for(j = 0, m = selectElements.length; j < m; j++)
      {
        selectElement = selectElements[j];
        spanElement = contentDocument.createElement("span");
        text          = "<select";

        // If the element has an id attribute
        if(selectElement.hasAttribute("id"))
        {
          text += ' id="' + selectElement.getAttribute("id") + '"';
        }

        // If the element has an name attribute
        if(selectElement.hasAttribute("name"))
        {
          text += ' name="' + selectElement.getAttribute("name") + '"';
        }

        // If the element has a value
        if(selectElement.value)
        {
          text += ' value="' + selectElement.value + '"';
        }

        text += ">";

        spanElement.setAttribute("class", "web-developer-display-form-details");
        spanElement.appendChild(contentDocument.createTextNode(text));
        selectElement.parentNode.insertBefore(spanElement, selectElement);
      }

      // Loop through the textarea tags
      for(j = 0, m = textAreaElements.length; j < m; j++)
      {
        textAreaElement = textAreaElements[j];
        spanElement     = contentDocument.createElement("span");
        text            = "<textarea";

        // If the element has an id attribute
        if(textAreaElement.hasAttribute("id"))
        {
          text += ' id="' + textAreaElement.getAttribute("id") + '"';
        }

        // If the element has a maxlength attribute
        if(textAreaElement.hasAttribute("maxlength"))
        {
          text += ' maxlength="' + textAreaElement.getAttribute("maxlength") + '"';
        }

        // If the element has an name attribute
        if(textAreaElement.hasAttribute("name"))
        {
          text += ' name="' + textAreaElement.getAttribute("name") + '"';
        }

        text += ">";

        spanElement.setAttribute("class", "web-developer-display-form-details");
        spanElement.appendChild(contentDocument.createTextNode(text));
        textAreaElement.parentNode.insertBefore(spanElement, textAreaElement);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-form-details", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-form-details-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/forms/display-form-details.css", "web-developer-display-form-details", contentDocument, false);
  }
};

// Displays all passwords
WebDeveloper.Forms.displayPasswords = function(documents)
{
  var displayedPasswords = 0;
  var passwords          = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    passwords = documents[i].querySelectorAll("input[type=password]");

    // Loop through the passwords
    for(var j = 0, m = passwords.length; j < m; j++)
    {
      passwords[j].removeAttribute("type");

      displayedPasswords++;
    }
  }

  // If one password displayed
  if(displayedPasswords == 1)
  {
    WebDeveloper.Common.displayNotification("displayPasswordsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("displayPasswordsMultipleResult", [displayedPasswords]);
  }
};

// Enables auto completion on all elements
WebDeveloper.Forms.enableAutoCompletion = function(documents)
{
  var autoCompleteElements = null;
  var enabledElements      = 0;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    autoCompleteElements = documents[i].querySelectorAll("[autocomplete]");

    // Loop through the auto complete elements
    for(var j = 0, m = autoCompleteElements.length; j < m; j++)
    {
      autoCompleteElements[j].removeAttribute("autocomplete");

      enabledElements++;
    }
  }

  // If one element was enabled
  if(enabledElements == 1)
  {
    WebDeveloper.Common.displayNotification("enableAutoCompletionSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("enableAutoCompletionMultipleResult", [enabledElements]);
  }
};

// Enables the form elements
WebDeveloper.Forms.enableFormElements = function(formElements)
{
  var enabledElements = 0;
  var formElement     = null;

  // Loop through the form elements
  for(var i = 0, l = formElements.length; i < l; i++)
  {
    formElement = formElements[i];

    // If the form element is disabled
    if(formElement.disabled)
    {
      formElement.disabled = false;

      enabledElements++;
    }
  }

  return enabledElements;
};

// Enables all form fields
WebDeveloper.Forms.enableFormFields = function(documents)
{
  var contentDocument = null;
  var enabledFields   = 0;
  var forms           = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    forms           = contentDocument.forms;

    // Loop through the forms
    for(var j = 0, m = forms.length; j < m; j++)
    {
      enabledFields += WebDeveloper.Forms.enableFormElements(forms[j].elements);
    }

    enabledFields += WebDeveloper.Forms.enableFormElements(contentDocument.querySelectorAll("input[type=image]"));
  }

  // If one field was enabled
  if(enabledFields == 1)
  {
    WebDeveloper.Common.displayNotification("enableFormFieldsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("enableFormFieldsMultipleResult", [enabledFields]);
  }
};

// Expands all select elements
WebDeveloper.Forms.expandSelectElements = function(documents)
{
  var selectElement    = null;
  var selectElements   = null;
  var selectLength     = null;
  var selectSize       = null;
  var expandedElements = 0;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    selectElements = documents[i].querySelectorAll("select");

    // Loop through the select elements
    for(var j = 0, m = selectElements.length; j < m; j++)
    {
      selectElement = selectElements[j];
      selectLength  = selectElement.options.length;
      selectSize    = selectElement.getAttribute("size");

      // If the select size is not set and the select has more than one option or the select has more options than it's size
      if((!selectSize && selectLength > 1) || (selectLength > selectSize))
      {
        selectElement.setAttribute("size", selectLength);

        expandedElements++;
      }
    }
  }

  // If one element was expanded
  if(expandedElements == 1)
  {
    WebDeveloper.Common.displayNotification("expandSelectElementsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("expandSelectElementsMultipleResult", [expandedElements]);
  }
};

// Makes all form fields writable
WebDeveloper.Forms.makeFormFieldsWritable = function(documents)
{
  var readOnlyElements = null;
  var writableElements = 0;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    readOnlyElements = documents[i].querySelectorAll("[readonly]");

    // Loop through the read only elements
    for(var j = 0, m = readOnlyElements.length; j < m; j++)
    {
      readOnlyElements[j].removeAttribute("readonly");

      writableElements++;
    }
  }

  // If one element was enabled
  if(writableElements == 1)
  {
    WebDeveloper.Common.displayNotification("makeFormFieldsWritableSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("makeFormFieldsWritableMultipleResult", [writableElements]);
  }
};

// Outlines all form fields without labels
WebDeveloper.Forms.outlineFormFieldsWithoutLabels = function(outline, documents)
{
  var contentDocument         = null;
  var formElement             = null;
  var formElementId           = null;
  var formElements            = null;
  var formFieldsWithoutLabels = null;
  var forms                   = null;
  var labelElement            = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If outlining form fields without labels
    if(outline)
    {
      forms = contentDocument.forms;

      // Loop through the forms
      for(var j = 0, m = forms.length; j < m; j++)
      {
        formElements = forms[j].elements;

        // Loop through the form elements
        for(var k = 0, n = formElements.length; k < n; k++)
        {
          formElement  = formElements[k];
          labelElement = formElement.parentNode;

          // If the parent element is not a label
          if(labelElement.tagName.toLowerCase() != "label")
          {
            formElementId = formElement.getAttribute("id");

            // If the form element has an id attribute
            if(formElementId)
            {
              labelElement = contentDocument.querySelector("label[for=" + formElementId + "]");

              // If no label element was found
              if(!labelElement)
              {
                WebDeveloper.Common.addClass(formElement, "web-developer-outline-form-fields-without-labels");
              }
            }
          }
        }
      }
    }
    else
    {
      formFieldsWithoutLabels = contentDocument.getElementsByClassName("web-developer-outline-form-fields-without-labels");

      // While there are form fields without labels
      while(formFieldsWithoutLabels.length > 0)
      {
        WebDeveloper.Common.removeClass(formFieldsWithoutLabels[0], "web-developer-outline-form-fields-without-labels");
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/forms/outline-form-fields-without-labels.css", "web-developer-outline-form-fields-without-labels", contentDocument, false);
  }
};

// Populates all form fields
WebDeveloper.Forms.populateFormFields = function(documents, emailAddress, password)
{
  var contentDocument          = null;
  var inputElement             = null;
  var inputElementMaxlength    = null;
  var inputElementName         = null;
  var inputElements            = null;
  var inputElementType         = null;
  var option                   = null;
  var options                  = null;
  var populatedFormFields      = 0;
  var selectElement            = null;
  var selectElements           = null;
  var textAreaElement          = null;
  var textAreaElements         = null;
  var textAreaElementMaxlength = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument  = documents[i];
    inputElements    = contentDocument.getElementsByTagName("input");
    selectElements   = contentDocument.getElementsByTagName("select");
    textAreaElements = contentDocument.getElementsByTagName("textarea");

    // Loop through the input tags
    for(var j = 0, m = inputElements.length; j < m; j++)
    {
      inputElement = inputElements[j];

      // If the input element is not disabled
      if(!inputElement.disabled)
      {
        inputElementType = inputElement.getAttribute("type");

        // If the input element value is not set and the type is not set or is email, password or text
        if(!inputElement.value.trim() && (!inputElementType || inputElementType.toLowerCase() == "email" || inputElementType.toLowerCase() == "password" || inputElementType.toLowerCase() == "search" || inputElementType.toLowerCase() == "text" || inputElementType.toLowerCase() == "url"))
        {
          inputElementName      = inputElement.getAttribute("name");
          inputElementMaxlength = inputElement.getAttribute("maxlength");

          // If the input element type is set and is email or is text and the name contains email
          if((inputElementType && inputElementType.toLowerCase() == "email") || ((!inputElementType || inputElementType == "text") && inputElementName && inputElementName.toLowerCase().indexOf("email") >= 0))
          {
            inputElement.value = emailAddress;

            populatedFormFields++;
          }
          else if(inputElementType && inputElementType.toLowerCase() == "password")
          {
            inputElement.value = password;

            populatedFormFields++;
          }
          else if(inputElementType && inputElementType.toLowerCase() == "url")
          {
            inputElement.value = "http://localhost/";

            populatedFormFields++;
          }
          else if(inputElementName && inputElementName.toLowerCase().indexOf("zip") >= 0)
          {
            inputElement.value = "90210";

            populatedFormFields++;
          }
          else if(inputElementName)
          {
            inputElement.value = inputElementName;

            populatedFormFields++;
          }
          else
          {
            inputElement.value = "Web Developer";

            populatedFormFields++;
          }

          // If the input element has a maxlength attribute
          if(inputElementMaxlength && inputElement.value > inputElementMaxlength)
          {
            inputElement.value = inputElement.value.substr(0, inputElementMaxlength);
          }
        }
        else if(inputElementType && (inputElementType.toLowerCase() == "checkbox" || inputElementType.toLowerCase() == "radio"))
        {
          inputElement.checked = true;

          populatedFormFields++;
        }
      }
    }

    // Loop through the select tags
    for(j = 0, m = selectElements.length; j < m; j++)
    {
      selectElement = selectElements[j];

      // If the select element is not disabled and the value is not set
      if(!selectElement.disabled && !selectElement.value.trim())
      {
        options = selectElement.options;

        // Loop through the options
        for(var k = 0, n = options.length; k < n; k++)
        {
          option = options.item(k);

          // If the option is set and the option text and option value are not empty
          if(option && option.text.trim() && option.value.trim())
          {
            selectElement.selectedIndex = k;

            populatedFormFields++;

            break;
          }
        }
      }
    }

    // Loop through the text area tags
    for(j = 0, m = textAreaElements.length; j < m; j++)
    {
      textAreaElement = textAreaElements[j];

      // If the text area element is not disabled and the value is not set
      if(!textAreaElement.disabled && !textAreaElement.value.trim())
      {
        textAreaElementMaxlength = textAreaElement.getAttribute("maxlength");
        textAreaElement.value    = textAreaElement.getAttribute("name");

        populatedFormFields++;

        // If the text area element has a maxlength attribute
        if(textAreaElementMaxlength && textAreaElement.value > textAreaElementMaxlength)
        {
          textAreaElement.value = textAreaElement.value.substr(0, textAreaElementMaxlength);
        }
      }
    }
  }

  // If one form field was populated
  if(populatedFormFields == 1)
  {
    WebDeveloper.Common.displayNotification("populateFormFieldsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("populateFormFieldsMultipleResult", [populatedFormFields]);
  }
};

// Removes maximum lengths from all elements
WebDeveloper.Forms.removeMaximumLengths = function(documents)
{
  var alteredElements       = 0;
  var maximumLengthElements = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    maximumLengthElements = documents[i].querySelectorAll("[maxlength]");

    // Loop through the maximum length elements
    for(var j = 0, m = maximumLengthElements.length; j < m; j++)
    {
      maximumLengthElements[j].removeAttribute("maxlength");

      alteredElements++;
    }
  }

  // If one element was altered
  if(alteredElements == 1)
  {
    WebDeveloper.Common.displayNotification("removeMaximumLengthsSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("removeMaximumLengthsMultipleResult", [alteredElements]);
  }
};

// Toggles all checkboxes
WebDeveloper.Forms.toggleCheckboxes = function(check, documents)
{
  var checkboxes = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    checkboxes = documents[i].querySelectorAll("input[type=checkbox]");

    // Loop through the checkboxes
    for(var j = 0, m = checkboxes.length; j < m; j++)
    {
      checkboxes[j].checked = check;
    }
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Images                         = WebDeveloper.Images || {};
WebDeveloper.Images.imageDimensionsLocale   = null;
WebDeveloper.Images.imageDimensionsTimeout  = null;
WebDeveloper.Images.imageDimensionsUpdating = false;

// Displays alt attributes for all images
WebDeveloper.Images.displayAltAttributes = function(display, documents)
{
  var contentDocument = null;
  var image           = null;
  var images          = null;
  var spanElement     = null;
  var text            = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the alt attributes
    if(display)
    {
      images = contentDocument.querySelectorAll("img[alt], input[type=image][alt]");

      // Loop through the images
      for(var j = 0, m = images.length; j < m; j++)
      {
        image       = images[j];
        spanElement = contentDocument.createElement("span");
        text        = 'alt="' + image.getAttribute("alt") + '"';

        spanElement.setAttribute("class", "web-developer-display-alt-attributes");
        spanElement.appendChild(contentDocument.createTextNode(text));
        image.parentNode.insertBefore(spanElement, image);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-alt-attributes", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-alt-attributes", contentDocument, false);
  }
};

// Displays the dimensions for all images
WebDeveloper.Images.displayImageDimensions = function(display, documents, locale)
{
  var contentDocument = null;

  // If displaying the image dimensions
  if(display)
  {
    WebDeveloper.Images.imageDimensionsLocale = locale;

    window.addEventListener("resize", WebDeveloper.Images.resizeImageDimensions, false);
  }
  else
  {
    WebDeveloper.Images.imageDimensionsLocale = null;

    window.removeEventListener("resize", WebDeveloper.Images.resizeImageDimensions, false);
  }

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the image dimensions
    if(display)
    {
      WebDeveloper.Images.updateImageDimensions(contentDocument);
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-image-dimensions", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-image-dimensions-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/display-image-dimensions.css", "web-developer-display-image-dimensions", contentDocument, false);
  }
};

// Displays the paths for all images
WebDeveloper.Images.displayImagePaths = function(display, documents)
{
  var contentDocument = null;
  var image           = null;
  var images          = null;
  var imageSrc        = null;
  var linkElement     = null;
  var spanElement     = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the alt attributes
    if(display)
    {
      images = contentDocument.images;

      // Loop through the images
      for(var j = 0, m = images.length; j < m; j++)
      {
        image       = images[j];
        imageSrc    = image.src;
        linkElement = contentDocument.createElement("a");
        spanElement = contentDocument.createElement("span");

        linkElement.setAttribute("href", imageSrc);
        linkElement.appendChild(contentDocument.createTextNode('src="' + imageSrc + '"'));

        spanElement.setAttribute("class", "web-developer-display-image-paths");
        spanElement.appendChild(linkElement);
        image.parentNode.insertBefore(spanElement, image);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-image-paths", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-image-paths", contentDocument, false);
  }
};

// Hides the background images on a page
WebDeveloper.Images.hideBackgroundImages = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/hide-background-images.css", "web-developer-hide-background-images", documents[i], false);
  }
};

// Hides all the images
WebDeveloper.Images.hideImages = function(hide, documents)
{
  var contentDocument = null;
  var inputElement    = null;
  var inputElements   = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    inputElements   = contentDocument.getElementsByTagName("input");

    // Loop through all the input tags
    for(var j = 0, m = inputElements.length; j < m; j++)
    {
      inputElement = inputElements[j];

      // If hiding images and the input element is of type image
      if(hide && inputElement.hasAttribute("type") && inputElement.getAttribute("type").toLowerCase() == "image")
      {
        inputElement.setAttribute("web-developer-hide-images", true);
        inputElement.setAttribute("type", "submit");
      }
      else if(inputElement.hasAttribute("web-developer-hide-images"))
      {
        inputElement.removeAttribute("web-developer-hide-images");
        inputElement.setAttribute("type", "image");
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/hide-images.css", "web-developer-hide-images", contentDocument, false);
  }
};

// Makes all images full size
WebDeveloper.Images.makeImagesFullSize = function(documents)
{
  var alteredImages = 0;
  var image         = null;
  var images        = null;
  var naturalHeight = null;
  var naturalWidth  = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    images = documents[i].images;

    // Loop through the images
    for(var j = 0, m = images.length; j < m; j++)
    {
      image         = images[j];
      naturalHeight = image.naturalHeight;
      naturalWidth  = image.naturalWidth;

      // If the height or width is not the full size
      if((naturalHeight && image.height != naturalHeight) || (naturalWidth && image.width != naturalWidth))
      {
        image.height = image.naturalHeight;
        image.width = image.naturalWidth;

        alteredImages++;
      }
    }
  }

  // If one image was made full size
  if(alteredImages == 1)
  {
    WebDeveloper.Common.displayNotification("makeImagesFullSizeSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("makeImagesFullSizeMultipleResult", [alteredImages]);
  }
};

// Makes all images invisible
WebDeveloper.Images.makeImagesInvisible = function(invisible, documents)
{
  var contentDocument = null;
  var image           = null;
  var imageInput      = null;
  var imageInputs     = null;
  var images          = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    imageInputs     = contentDocument.querySelectorAll("input[type=image], input[web-developer-make-images-invisible]");
    images          = contentDocument.images;

    // Loop through the image input tags
    for(var j = 0, m = imageInputs.length; j < m; j++)
    {
      imageInput = imageInputs[j];

      // If making images invisible
      if(invisible)
      {
        imageInput.setAttribute("web-developer-make-images-invisible", true);
        imageInput.setAttribute("type", "submit");
      }
      else if(imageInput.hasAttribute("web-developer-make-images-invisible"))
      {
        imageInput.removeAttribute("web-developer-make-images-invisible");
        imageInput.setAttribute("type", "image");
      }
    }

    // Loop through the images
    for(j = 0, m = images.length; j < m; j++)
    {
      image = images[j];

      // If making images invisible
      if(invisible)
      {
        // If the image width is not set and the image is not broken
        if(!image.hasAttribute("width") && image.naturalWidth)
        {
          image.setAttribute("width", image.naturalWidth);
        }

        // If the image height is not set and the image is not broken
        if(!image.hasAttribute("height") && image.naturalHeight)
        {
          image.setAttribute("height", image.naturalHeight);
        }

        image.setAttribute("web-developer-make-images-invisible", image.getAttribute("src"));
        image.setAttribute("src", WebDeveloper.Common.getChromeURL("features/style-sheets/images/transparent.png"));
      }
      else
      {
        image.setAttribute("src", image.getAttribute("web-developer-make-images-invisible"));
        image.removeAttribute("web-developer-make-images-invisible");
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/make-images-invisible.css", "web-developer-make-images-invisible", contentDocument, false);
  }
};

// Outlines all images
WebDeveloper.Images.outlineAllImages = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/outline-all-images.css", "web-developer-outline-all-images", documents[i], false);
  }
};

// Outlines all background images
WebDeveloper.Images.outlineBackgroundImages = function(outline, documents)
{
  var backgroundImage  = null;
  var backgroundImages = null;
  var contentDocument  = null;
  var cssURI           = CSSPrimitiveValue.CSS_URI;
  var node             = null;
  var treeWalker       = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If outlining background images
    if(outline)
    {
      treeWalker = contentDocument.createTreeWalker(WebDeveloper.Common.getDocumentBodyElement(contentDocument), NodeFilter.SHOW_ELEMENT, null, false);

      // While the tree walker has more nodes
      while((node = treeWalker.nextNode()) !== null)
      {
        backgroundImage = WebDeveloper.Common.getCSSProperty(node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyCSSValue("background-image"));

        // If this element has a background image and it is a URL
        if(backgroundImage && backgroundImage.primitiveType == cssURI)
        {
          WebDeveloper.Common.addClass(node, "web-developer-outline-background-images");
        }
      }
    }
    else
    {
      backgroundImages = contentDocument.getElementsByClassName("web-developer-outline-background-images");

      // While there are background images
      while(backgroundImages.length > 0)
      {
        WebDeveloper.Common.removeClass(backgroundImages[0], "web-developer-outline-background-images");
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/outline-background-images.css", "web-developer-outline-background-images", contentDocument, false);
  }
};

// Outlines all images with adjusted dimensions
WebDeveloper.Images.outlineImagesWithAdjustedDimensions = function(outline, documents)
{
  var contentDocument              = null;
  var image                        = null;
  var images                       = null;
  var imagesWithAdjustedDimensions = null;
  var naturalHeight                = null;
  var naturalWidth                 = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If outlining images with adjusted dimensions
    if(outline)
    {
      images = contentDocument.images;

      // Loop through the images
      for(var j = 0, m = images.length; j < m; j++)
      {
        image         = images[j];
        naturalHeight = image.naturalHeight;
        naturalWidth  = image.naturalWidth;

        // If the height or width has been adjusted
        if((naturalHeight && image.height != naturalHeight) || (naturalWidth && image.width != naturalWidth))
        {
          WebDeveloper.Common.addClass(image, "web-developer-outline-images-with-adjusted-dimensions");
        }
      }
    }
    else
    {
      imagesWithAdjustedDimensions = contentDocument.getElementsByClassName("web-developer-outline-images-with-adjusted-dimensions");

      // While there are images with adjusted dimensions
      while(imagesWithAdjustedDimensions.length > 0)
      {
        WebDeveloper.Common.removeClass(imagesWithAdjustedDimensions[0], "web-developer-outline-images-with-adjusted-dimensions");
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/outline-images-with-adjusted-dimensions.css", "web-developer-outline-images-with-adjusted-dimensions", contentDocument, false);
  }
};

// Outlines all images with empty alt attributes
WebDeveloper.Images.outlineImagesWithEmptyAltAttributes = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/outline-images-with-empty-alt-attributes.css", "web-developer-outline-images-with-empty-alt-attributes", documents[i], false);
  }
};

// Outlines all images with oversized dimensions
WebDeveloper.Images.outlineImagesWithOversizedDimensions = function(outline, documents)
{
  var contentDocument               = null;
  var image                         = null;
  var images                        = null;
  var imagesWithOversizedDimensions = null;
  var naturalHeight                 = null;
  var naturalWidth                  = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If outlining images with oversized dimensions
    if(outline)
    {
      images = contentDocument.images;

      // Loop through the images
      for(var j = 0, m = images.length; j < m; j++)
      {
        image         = images[j];
        naturalHeight = image.naturalHeight;
        naturalWidth  = image.naturalWidth;

        // If the height or width has been oversized
        if((naturalHeight && image.height > naturalHeight) || (naturalWidth && image.width > naturalWidth))
        {
          WebDeveloper.Common.addClass(image, "web-developer-outline-images-with-oversized-dimensions");
        }
      }
    }
    else
    {
      imagesWithOversizedDimensions = contentDocument.getElementsByClassName("web-developer-outline-images-with-oversized-dimensions");

      // While there are images with oversized dimensions
      while(imagesWithOversizedDimensions.length > 0)
      {
        WebDeveloper.Common.removeClass(imagesWithOversizedDimensions[0], "web-developer-outline-images-with-oversized-dimensions");
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/outline-images-with-oversized-dimensions.css", "web-developer-outline-images-with-oversized-dimensions", contentDocument, false);
  }
};

// Outlines all images without alt attributes
WebDeveloper.Images.outlineImagesWithoutAltAttributes = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/outline-images-without-alt-attributes.css", "web-developer-outline-images-without-alt-attributes", documents[i], false);
  }
};

// Outlines all images without dimensions
WebDeveloper.Images.outlineImagesWithoutDimensions = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/outline-images-without-dimensions.css", "web-developer-outline-images-without-dimensions", documents[i], false);
  }
};

// Reloads the images in a document
WebDeveloper.Images.reloadImages = function(documents)
{
  var computedStyle   = null;
  var contentDocument = null;
  var cssURI          = CSSPrimitiveValue.CSS_URI;
  var imageURL        = null;
  var node            = null;
  var styleImage      = null;
  var treeWalker      = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    treeWalker      = contentDocument.createTreeWalker(contentDocument, NodeFilter.SHOW_ELEMENT, null, false);

    // While the tree walker has more nodes
    while((node = treeWalker.nextNode()) !== null)
    {
      // If this is an image element
      if(node.tagName.toLowerCase() == "img" || (node.tagName.toLowerCase() == "input" && node.src && node.type && node.type.toLowerCase() == "image"))
      {
        imageURL = node.src;

        // If this is not a chrome image
        if(imageURL.indexOf("chrome://") !== 0)
        {
          node.src = WebDeveloper.Images.updateReloadImageURL(imageURL);
        }
      }
      else if(node.tagName.toLowerCase() == "link" && node.href && node.href.indexOf("chrome://") !== 0 && node.rel && node.rel.indexOf("icon") != -1)
      {
        node.href = WebDeveloper.Images.updateReloadImageURL(node.href);
      }
      else
      {
        computedStyle = node.ownerDocument.defaultView.getComputedStyle(node, null);

        // If the computed style is set
        if(computedStyle)
        {
          styleImage = WebDeveloper.Common.getCSSProperty(computedStyle.getPropertyCSSValue("background-image"));

          // If this element has a background image and it is a URI
          if(styleImage && styleImage.primitiveType == cssURI)
          {
            imageURL = styleImage.getStringValue();

            // If this is not a chrome image
            if(imageURL.indexOf("chrome://") !== 0)
            {
              node.style.backgroundImage = WebDeveloper.Images.updateReloadImageURL(imageURL);
            }
          }

          styleImage = computedStyle.getPropertyCSSValue("list-style-image");

          // If this element has a background image and it is a URI
          if(styleImage && styleImage.primitiveType == cssURI)
          {
            imageURL = styleImage.getStringValue();

            // If this is not a chrome image
            if(imageURL.indexOf("chrome://") !== 0)
            {
              node.style.listStyleImage = WebDeveloper.Images.updateReloadImageURL(imageURL);
            }
          }
        }
      }
    }
  }

  WebDeveloper.Common.displayNotification("reloadImagesResult");
};

// Replaces all images with alt attributes
WebDeveloper.Images.replaceImagesWithAltAttributes = function(replace, documents)
{
  var contentDocument = null;
  var image           = null;
  var images          = null;
  var spanElement     = null;
  var text            = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If replacing the images
    if(replace)
    {
      images = contentDocument.images;

      // Loop through the images
      for(var j = 0, m = images.length; j < m; j++)
      {
        image       = images[j];
        spanElement = contentDocument.createElement("span");
        text        = image.getAttribute("alt");

        spanElement.setAttribute("class", "web-developer-replace-images-with-alt-attributes");
        spanElement.appendChild(contentDocument.createTextNode(text));
        image.parentNode.insertBefore(spanElement, image);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-replace-images-with-alt-attributes", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/hide-images.css", "web-developer-replace-images-with-alt-attributes", contentDocument, false);
  }
};

// Resizes the dimensions for all images
WebDeveloper.Images.resizeImageDimensions = function()
{
  // If there is a timeout set
  if(WebDeveloper.Images.imageDimensionsTimeout)
  {
    window.clearTimeout(WebDeveloper.Images.imageDimensionsTimeout);

    WebDeveloper.Images.imageDimensionsTimeout = null;
  }

  // If the image dimensions are not already updating
  if(!WebDeveloper.Images.imageDimensionsUpdating)
  {
    var documents = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());

    // Loop through the documents
    for(var i = 0, l = documents.length; i < l; i++)
    {
      WebDeveloper.Images.updateImageDimensions(documents[i]);
    }
  }
  else
  {
    WebDeveloper.Images.imageDimensionsTimeout = window.setTimeout(WebDeveloper.Images.resizeImageDimensions, 0);
  }
};

// Updates the dimensions for all images
WebDeveloper.Images.updateImageDimensions = function(contentDocument)
{
  var image       = null;
  var images      = contentDocument.images;
  var spanElement = null;
  var text        = null;

  WebDeveloper.Images.imageDimensionsUpdating = true;

  WebDeveloper.Common.removeMatchingElements(".web-developer-display-image-dimensions", contentDocument);

  // Loop through the images
  for(var i = 0, l = images.length; i < l; i++)
  {
    image = images[i];
    text  = WebDeveloper.Common.formatDimensions(image.width, image.height, WebDeveloper.Images.imageDimensionsLocale);

    // If the text is set
    if(text)
    {
      spanElement = contentDocument.createElement("span");

      spanElement.setAttribute("class", "web-developer-display-image-dimensions");
      spanElement.appendChild(contentDocument.createTextNode(text));
      image.parentNode.insertBefore(spanElement, image);
    }
  }

  WebDeveloper.Images.imageDimensionsUpdating = false;
};

// Updates a reload image URL
WebDeveloper.Images.updateReloadImageURL = function(imageURL)
{
  var newImageURL = WebDeveloper.Common.removeReloadParameterFromURL(imageURL);

  // If the image URL does not have query parameters
  if(newImageURL.indexOf("?") == -1)
  {
    newImageURL += "?";
  }
  else
  {
    newImageURL += "&";
  }

  return newImageURL + "web-developer-reload=" + new Date().getTime();
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Information                       = WebDeveloper.Information || {};
WebDeveloper.Information.divDimensionsLocale   = null;
WebDeveloper.Information.divDimensionsTimeout  = null;
WebDeveloper.Information.divDimensionsUpdating = false;

// Displays the abbreviations on a page
WebDeveloper.Information.displayAbbreviations = function(documents)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-abbreviations-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-abbreviations.css", "web-developer-display-abbreviations", contentDocument, false);
  }
};

// Displays the access keys on a page
WebDeveloper.Information.displayAccessKeys = function(display, documents)
{
  var accessKeyElement  = null;
  var accessKeyElements = null;
  var contentDocument = null;
  var spanElement       = null;
  var text              = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.removeMatchingElements(".web-developer-display-access-keys", contentDocument);

    // If displaying the access keys
    if(display)
    {
      accessKeyElements = contentDocument.querySelectorAll("[accesskey]");

      // Loop through the access key elements
      for(var j = 0, m = accessKeyElements.length; j < m; j++)
      {
        accessKeyElement = accessKeyElements[j];
        spanElement      = contentDocument.createElement("span");
        text             = 'accesskey="' + accessKeyElement.getAttribute("accesskey") + '"';

        spanElement.setAttribute("class", "web-developer-display-access-keys");
        spanElement.appendChild(contentDocument.createTextNode(text));
        accessKeyElement.parentNode.insertBefore(spanElement, accessKeyElement);
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-access-keys", contentDocument, false);
  }
};

// Displays the anchors on a page
WebDeveloper.Information.displayAnchors = function(display, documents)
{
  var anchorElement    = null;
  var anchorElements   = null;
  var contentDocument  = null;
  var documentLocation = null;
  var anchorLocation   = null;
  var linkElement      = null;
  var spanElement      = null;
  var text             = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.removeMatchingElements(".web-developer-display-anchors", contentDocument);

    // If displaying the anchors
    if(display)
    {
      anchorElements   = contentDocument.querySelectorAll("[id], [name]");
      documentLocation = contentDocument.location;
      anchorLocation   = documentLocation.pathname + documentLocation.search;

      // Loop through the anchor elements
      for(var j = 0, m = anchorElements.length; j < m; j++)
      {
        anchorElement = anchorElements[j];

        // If the anchor element is not the document root element
        if(anchorElement != contentDocument.documentElement)
        {
          linkElement = contentDocument.createElement("a");
          spanElement = contentDocument.createElement("span");
          text        = anchorLocation;

          // If the anchor element has an id attribute
          if(anchorElement.hasAttribute("id"))
          {
            text = "#" + anchorElement.getAttribute("id");
          }
          else if(anchorElement.hasAttribute("name"))
          {
            text = "#" + anchorElement.getAttribute("name");
          }

          linkElement.setAttribute("href", text);
          linkElement.appendChild(contentDocument.createTextNode(text));

          spanElement.setAttribute("class", "web-developer-display-anchors");
          spanElement.appendChild(linkElement);
          anchorElement.parentNode.insertBefore(spanElement, anchorElement);
        }
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-anchors", contentDocument, false);
  }
};

// Displays the ARIA roles on a page
WebDeveloper.Information.displayARIARoles = function(documents)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-aria-roles-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-aria-roles.css", "web-developer-display-aria-roles", contentDocument, false);
  }
};

// Displays the dimensions for divs on a page
WebDeveloper.Information.displayDivDimensions = function(display, documents, locale)
{
  var contentDocument = null;

  // If displaying the div dimensions
  if(display)
  {
    WebDeveloper.Information.divDimensionsLocale = locale;

    window.addEventListener("resize", WebDeveloper.Information.resizeDivDimensions, false);
  }
  else
  {
    WebDeveloper.Information.divDimensionsLocale = null;

    window.removeEventListener("resize", WebDeveloper.Information.resizeDivDimensions, false);
  }

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the div size
    if(display)
    {
      WebDeveloper.Information.updateDivDimensions(contentDocument);
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-div-dimensions", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-div-dimensions-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-div-dimensions.css", "web-developer-display-div-dimensions", contentDocument, false);
  }
};

// Displays the order of the divs on a page
WebDeveloper.Information.displayDivOrder = function(display, documents)
{
  var contentDocument  = null;
  var div              = null;
  var divs             = null;
  var spanElement      = null;
  var text             = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the div order
    if(display)
    {
      divs = contentDocument.getElementsByTagName("div");

      // Loop through the divs
      for(var j = 0, m = divs.length; j < m; j++)
      {
        div         = divs[j];
        spanElement = contentDocument.createElement("span");
        text        = WebDeveloper.Information.getElementDescription(div) + " " + (j + 1);

        spanElement.setAttribute("class", "web-developer-display-div-order");
        spanElement.appendChild(contentDocument.createTextNode(text));

        WebDeveloper.Common.insertAsFirstChild(div, spanElement);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-div-order", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-div-order-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-div-order.css", "web-developer-display-div-order", contentDocument, false);
  }
};

// Displays the id and class details for a page
WebDeveloper.Information.displayIdClassDetails = function(display, documents)
{
  var contentDocument = null;
  var idClassElement  = null;
  var idClassElements = null;
  var spanElement     = null;
  var text            = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the id and class details
    if(display)
    {
      idClassElements = contentDocument.querySelectorAll("[class], [id]");

      // Loop through the id and class elements
      for(var j = 0, m = idClassElements.length; j < m; j++)
      {
        idClassElement = idClassElements[j];

        // If the id class element is not the document root element or a Web Developer element
        if(idClassElement != contentDocument.documentElement && ((idClassElement.hasAttribute("class") && idClassElement.getAttribute("class").indexOf("web-developer-") !== 0) || (idClassElement.hasAttribute("id") && idClassElement.getAttribute("id").indexOf("web-developer-") !== 0)))
        {
          spanElement = contentDocument.createElement("span");
          text         = WebDeveloper.Information.getElementDescription(idClassElement);

          spanElement.setAttribute("class", "web-developer-id-class-details");
          spanElement.appendChild(contentDocument.createTextNode(text));
          idClassElement.parentNode.insertBefore(spanElement, idClassElement);
        }
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-id-class-details", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-id-class-details", contentDocument, false);
  }
};

// Displays the details for the links on a page
WebDeveloper.Information.displayLinkDetails = function(documents)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-link-details-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-link-details.css", "web-developer-display-link-details", contentDocument, false);
  }
};

// Displays the information for objects on a page
WebDeveloper.Information.displayObjectInformation = function(display, documents)
{
  var contentDocument  = null;
  var divElement       = null;
  var object           = null;
  var objectAttributes = null;
  var objects          = null;
  var param            = null;
  var paramAttributes  = null;
  var params           = null;
  var pElement         = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the object information
    if(display)
    {
      objects = contentDocument.getElementsByTagName("object");

      // Loop through the objects
      for(var j = 0, m = objects.length; j < m; j++)
      {
        divElement       = contentDocument.createElement("div");
        object           = objects[j];
        objectAttributes = "";
        params           = object.getElementsByTagName("param");
        pElement         = contentDocument.createElement("p");

        // If the object has an width attribute
        if(object.hasAttribute("width"))
        {
          objectAttributes += ' width="' + object.getAttribute("width") + '"';
        }

        // If the object has an height attribute
        if(object.hasAttribute("height"))
        {
          objectAttributes += ' height="' + object.getAttribute("height") + '"';
        }

        // If the object has an archive attribute
        if(object.hasAttribute("archive"))
        {
          objectAttributes += ' archive="' + object.getAttribute("archive") + '"';
        }

        // If the object has an classid attribute
        if(object.hasAttribute("classid"))
        {
          objectAttributes += ' classid="' + object.getAttribute("classid") + '"';
        }

        // If the object has an codebase attribute
        if(object.hasAttribute("codebase"))
        {
          objectAttributes += ' codebase="' + object.getAttribute("codebase") + '"';
        }

        // If the object has an codetype attribute
        if(object.hasAttribute("codetype"))
        {
          objectAttributes += ' codetype="' + object.getAttribute("codetype") + '"';
        }

        // If the object has an data attribute
        if(object.hasAttribute("data"))
        {
          objectAttributes += ' data="' + object.getAttribute("data") + '"';
        }

        // If the object has an standby attribute
        if(object.hasAttribute("standby"))
        {
          objectAttributes += ' standby="' + object.getAttribute("standby") + '"';
        }

        // If the object has an type attribute
        if(object.hasAttribute("type"))
        {
          objectAttributes += ' type="' + object.getAttribute("type") + '"';
        }

        pElement.appendChild(contentDocument.createTextNode("<object" + objectAttributes + ">"));
        divElement.appendChild(pElement);

        // Loop through the params
        for(j = 0, m = params.length; j < m; j++)
        {
          param           = params[j];
          paramAttributes = "";
          pElement        = contentDocument.createElement("p");

          // If the param has a name attribute
          if(param.hasAttribute("name"))
          {
            paramAttributes += ' name="' + param.getAttribute("name") + '"';
          }

          // If the param has a value attribute
          if(param.hasAttribute("value"))
          {
            paramAttributes += ' value="' + param.getAttribute("value") + '"';
          }

          pElement.appendChild(contentDocument.createTextNode("<param" + paramAttributes + ">"));
          pElement.setAttribute("class", "web-developer-object-information-param");
          divElement.appendChild(pElement);
        }

        pElement = contentDocument.createElement("p");

        pElement.appendChild(contentDocument.createTextNode("</object>"));
        divElement.appendChild(pElement);

        divElement.setAttribute("class", "web-developer-display-object-information");
        object.parentNode.insertBefore(divElement, object);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-object-information", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-object-information-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-object-information.css", "web-developer-display-object-information", contentDocument, false);
  }
};

// Displays the stack levels on a page
WebDeveloper.Information.displayStackLevels = function(display, documents)
{
  var contentDocument = null;
  var node            = null;
  var spanElement     = null;
  var text            = null;
  var treeWalker      = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the stack levels
    if(display)
    {
      treeWalker = contentDocument.createTreeWalker(WebDeveloper.Common.getDocumentBodyElement(contentDocument), NodeFilter.SHOW_ELEMENT, WebDeveloper.Information.stackLevelFilter, false);

      // While the tree walker has more nodes
      while((node = treeWalker.nextNode()) !== null)
      {
        spanElement = contentDocument.createElement("span");
        text        = WebDeveloper.Information.getElementDescription(node) + ' z-index="' + node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyCSSValue("z-index").cssText + '"';

        spanElement.setAttribute("class", "web-developer-display-stack-levels");
        spanElement.appendChild(contentDocument.createTextNode(text));

        node.parentNode.insertBefore(spanElement, node);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-stack-levels", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-stack-levels", contentDocument, false);
  }
};

// Displays the tab indices on a page
WebDeveloper.Information.displayTabIndex = function(display, documents)
{
  var contentDocument  = null;
  var spanElement      = null;
  var tabIndexElement  = null;
  var tabIndexElements = null;
  var text             = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the tab indices
    if(display)
    {
      tabIndexElements = contentDocument.querySelectorAll("[tabindex]");

      // Loop through the tab index elements
      for(var j = 0, m = tabIndexElements.length; j < m; j++)
      {
        spanElement     = contentDocument.createElement("span");
        tabIndexElement = tabIndexElements[j];
        text            = 'tabindex="' + tabIndexElement.getAttribute("tabindex") + '"';

        spanElement.setAttribute("class", "web-developer-display-tab-index");
        spanElement.appendChild(contentDocument.createTextNode(text));
        tabIndexElement.parentNode.insertBefore(spanElement, tabIndexElement);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-tab-index", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-tab-index", contentDocument, false);
  }
};

// Displays the information for a table cell
WebDeveloper.Information.displayTableCellInformation = function(tableCell, contentDocument)
{
  var divElement = contentDocument.createElement("div");
  var pElement   = null;

  // If the table cell has an abbr attribute
  if(tableCell.hasAttribute("abbr"))
  {
    pElement = contentDocument.createElement("p");

    pElement.appendChild(contentDocument.createTextNode('abbr="' + tableCell.getAttribute("abbr") + '"'));
    divElement.appendChild(pElement);
  }

  // If the table cell has an axis attribute
  if(tableCell.hasAttribute("axis"))
  {
    pElement = contentDocument.createElement("p");

    pElement.appendChild(contentDocument.createTextNode('axis="' + tableCell.getAttribute("axis") + '"'));
    divElement.appendChild(pElement);
  }

  // If the table cell has a headers attribute
  if(tableCell.hasAttribute("headers"))
  {
    pElement = contentDocument.createElement("p");

    pElement.appendChild(contentDocument.createTextNode('headers="' + tableCell.getAttribute("headers") + '"'));
    divElement.appendChild(pElement);
  }

  // If the table cell has a scope attribute
  if(tableCell.hasAttribute("scope"))
  {
    pElement = contentDocument.createElement("p");

    pElement.appendChild(contentDocument.createTextNode('scope="' + tableCell.getAttribute("scope") + '"'));
    divElement.appendChild(pElement);
  }

  // If the div element has child nodes
  if(divElement.childNodes.length > 0)
  {
    divElement.setAttribute("class", "web-developer-display-table-information");
    WebDeveloper.Common.insertAsFirstChild(tableCell, divElement);
  }
};

// Displays the depth of all tables on a page
WebDeveloper.Information.displayTableDepth = function(display, documents, depth)
{
  var contentDocument = null;
  var spanElement     = null;
  var table           = null;
  var tables          = null;
  var text            = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the tab indices
    if(display)
    {
      tables = contentDocument.getElementsByTagName("table");

      // Loop through the table elements
      for(var j = 0, m = tables.length; j < m; j++)
      {
        spanElement = contentDocument.createElement("span");
        table       = tables[j];
        text        = depth + " = " + WebDeveloper.Information.getTableDepth(table);

        spanElement.setAttribute("class", "web-developer-display-table-depth");
        spanElement.appendChild(contentDocument.createTextNode(text));
        table.parentNode.insertBefore(spanElement, table);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-table-depth", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-table-depth", contentDocument, false);
  }
};

// Displays the information for tables on a page
WebDeveloper.Information.displayTableInformation = function(display, documents)
{
  var contentDocument = null;
  var divElement      = null;
  var table           = null;
  var tableCells      = null;
  var tables          = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the table information
    if(display)
    {
      tables = contentDocument.getElementsByTagName("table");

      // Loop through the table elements
      for(var j = 0, m = tables.length; j < m; j++)
      {
        table      = tables[j];
        tableCells = table.getElementsByTagName("th");

        // If the table has a summary attribute
        if(table.hasAttribute("summary"))
        {
          divElement = contentDocument.createElement("div");

          divElement.setAttribute("class", "web-developer-display-table-information");
          divElement.appendChild(contentDocument.createTextNode('summary="' + table.getAttribute("summary") + '"'));
          table.parentNode.insertBefore(divElement, table);
        }

        // Loop through the cell elements
        for(var k = 0, n = tableCells.length; k < n; k++)
        {
          WebDeveloper.Information.displayTableCellInformation(tableCells[k], contentDocument);
        }

        tableCells = table.getElementsByTagName("td");

        // Loop through the cell elements
        for(k = 0, n = tableCells.length; k < n; k++)
        {
          WebDeveloper.Information.displayTableCellInformation(tableCells[k], contentDocument);
        }
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-table-information", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-table-information-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-table-information.css", "web-developer-display-table-information", contentDocument, false);
  }
};

// Displays the title attributes on a page
WebDeveloper.Information.displayTitleAttributes = function(display, documents)
{
  var contentDocument        = null;
  var spanElement            = null;
  var text                   = null;
  var titleAttributeElement  = null;
  var titleAttributeElements = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the title attributes
    if(display)
    {
      titleAttributeElements = contentDocument.querySelectorAll("[title]");

      // Loop through the title attribute elements
      for(var j = 0, m = titleAttributeElements.length; j < m; j++)
      {
        spanElement           = contentDocument.createElement("span");
        titleAttributeElement = titleAttributeElements[j];
        text                  = 'title="' + titleAttributeElement.getAttribute("title") + '"';

        spanElement.setAttribute("class", "web-developer-display-title-attributes");
        spanElement.appendChild(contentDocument.createTextNode(text));
        titleAttributeElement.parentNode.insertBefore(spanElement, titleAttributeElement);
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-title-attributes", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-title-attributes", contentDocument, false);
  }
};

// Displays the topographic information for a page
WebDeveloper.Information.displayTopographicInformation = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/information/display-topographic-information.css", "web-developer-display-topographic-information", documents[i], false);
  }
};

// Returns the description for an element
WebDeveloper.Information.getElementDescription = function(element)
{
  var description = "";

  // If the element has an id attribute
  if(element.hasAttribute("id"))
  {
    description += "#" + element.getAttribute("id");
  }

  // If the element has a class attribute
  if(element.hasAttribute("class"))
  {
    var classes = element.getAttribute("class").split(" ");

    // Loop through the element classes
    for(var i = 0, l = classes.length; i < l; i++)
    {
      description += "." + classes[i].trim();
    }
  }

  return description;
};

// Returns the depth of the table
WebDeveloper.Information.getTableDepth = function(table)
{
  var depth = 1;

  // If the table is set
  if(table)
  {
    var element       = table;
    var parentElement = null;
    var tagName       = null;

    // While there is a parent element
    while((parentElement = element.parentNode) !== null)
    {
      element = parentElement;
      tagName = element.tagName;

      // If the tag name is set and equals table
      if(tagName && tagName.toLowerCase() == "table")
      {
        depth++;
      }
    }
  }

  return depth;
};

// Resizes the dimensions for divs on a page
WebDeveloper.Information.resizeDivDimensions = function()
{
  // If there is a timeout set
  if(WebDeveloper.Information.divDimensionsTimeout)
  {
    window.clearTimeout(WebDeveloper.Information.divDimensionsTimeout);

    WebDeveloper.Information.divDimensionsTimeout = null;
  }

  // If the div dimensions are not already updating
  if(!WebDeveloper.Information.divDimensionsUpdating)
  {
    var documents = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());

    // Loop through the documents
    for(var i = 0, l = documents.length; i < l; i++)
    {
      WebDeveloper.Information.updateDivDimensions(documents[i]);
    }
  }
  else
  {
    WebDeveloper.Information.divDimensionsTimeout = window.setTimeout(WebDeveloper.Information.resizeDivDimensions, 0);
  }
};

// Filter for the stack level tree walker
WebDeveloper.Information.stackLevelFilter = function(node)
{
  // If the node does not have a class attribute or it does not start with web-developer
  if(node && (!node.hasAttribute("class") || node.getAttribute("class").indexOf("web-developer-") !== 0))
  {
    var zIndex = node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyCSSValue("z-index").cssText;

    // If the node has a z-index and it is not set to auto
    if(zIndex && zIndex != "auto")
    {
      return NodeFilter.FILTER_ACCEPT;
    }
  }

  return NodeFilter.FILTER_SKIP;
};

// Updates the dimensions for divs on a page
WebDeveloper.Information.updateDivDimensions = function(contentDocument)
{
  var div         = null;
  var divs        = contentDocument.getElementsByTagName("div");
  var spanElement = null;
  var text        = null;

  WebDeveloper.Information.divDimensionsUpdating = true;

  WebDeveloper.Common.removeMatchingElements(".web-developer-display-div-dimensions", contentDocument);

  // Loop through the divs
  for(var i = 0, l = divs.length; i < l; i++)
  {
    div         = divs[i];
    spanElement = contentDocument.createElement("span");
    text        = WebDeveloper.Information.getElementDescription(div) + " " + WebDeveloper.Common.formatDimensions(div.offsetWidth, div.offsetHeight, WebDeveloper.Information.divDimensionsLocale);

    spanElement.style.left     = div.offsetLeft + "px";
    spanElement.style.position = "absolute";
    spanElement.style.top      = div.offsetTop + "px";

    spanElement.setAttribute("class", "web-developer-display-div-dimensions");
    spanElement.appendChild(contentDocument.createTextNode(text));

    WebDeveloper.Common.insertAsFirstChild(div, spanElement);
  }

  WebDeveloper.Information.divDimensionsUpdating = false;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Miscellaneous = WebDeveloper.Miscellaneous || {};

// Displays all hidden elements
WebDeveloper.Miscellaneous.displayHiddenElements = function(documents)
{
  var contentDocument = null;
  var inputElements   = null;
  var node            = null;
  var treeWalker      = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    inputElements   = contentDocument.querySelectorAll("input[type=hidden]");
    treeWalker      = contentDocument.createTreeWalker(WebDeveloper.Common.getDocumentBodyElement(contentDocument), NodeFilter.SHOW_ELEMENT, WebDeveloper.Miscellaneous.hiddenNodeFilter, false);

    // Loop through the input elements
    for(var j = 0, m = inputElements.length; j < m; j++)
    {
      inputElements[j].removeAttribute("type");
    }

    // While the tree walker has more nodes
    while((node = treeWalker.nextNode()) !== null)
    {
      node.style.display = "";
    }
  }
};

// Filter for the hidden node tree walker
WebDeveloper.Miscellaneous.hiddenNodeFilter = function(node)
{
  // If the node is set and is not a Web Developer node
  if(node && (!node.hasAttribute("id") || node.getAttribute("id").indexOf("web-developer") !== 0))
  {
    var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node, null);

    // If the computed style is set
    if(computedStyle)
    {
      var display = computedStyle.getPropertyCSSValue("display");
      var tagName = node.tagName;

      // If this element has a display and tag name, the display is set to none and the tag name is not script
      if(display && tagName && display.cssText == "none")
      {
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  }

  return NodeFilter.FILTER_SKIP;
};

// Linearizes the page
WebDeveloper.Miscellaneous.linearizePage = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/miscellaneous/linearize-page.css", "web-developer-linearize-page", documents[i], false);
  }
};

// Makes all frames resizable
WebDeveloper.Miscellaneous.makeFramesResizable = function(documents)
{
  var frame           = null;
  var frames          = null;
  var resizableFrames = 0;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    frames = documents[i].getElementsByTagName("frame");

    // Loop through the frames
    for(var j = 0, m = frames.length; j < m; j++)
    {
      frame = frames[j];

      // If the frame has a no resize attribute
      if(frame.hasAttribute("noresize"))
      {
        frame.removeAttribute("noresize");

        resizableFrames++;
      }
    }
  }

  // If one frame was made resizable
  if(resizableFrames == 1)
  {
    WebDeveloper.Common.displayNotification("makeFramesResizableSingleResult");
  }
  else
  {
    WebDeveloper.Common.displayNotification("makeFramesResizableMultipleResult", [resizableFrames]);
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Outline = WebDeveloper.Outline || {};

// Outlines all block level elements
WebDeveloper.Outline.outlineBlockLevelElements = function(documents, showElementTagNames)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-block-level-elements.css", "web-developer-outline-block-level-elements", contentDocument, false);

    // If showing element tag names
    if(showElementTagNames)
    {
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-block-level-elements-before-common", contentDocument, false);
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-block-level-elements-before.css", "web-developer-outline-block-level-elements-before", contentDocument, false);
    }
  }
};

// Outlines all deprecated elements
WebDeveloper.Outline.outlineDeprecatedElements = function(documents, showElementTagNames)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-deprecated-elements.css", "web-developer-outline-deprecated-elements", contentDocument, false);

    // If showing element tag names
    if(showElementTagNames)
    {
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-deprecated-elements-before-common", contentDocument, false);
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-deprecated-elements-before.css", "web-developer-outline-deprecated-elements-before", contentDocument, false);
    }
  }
};

// Outlines all external links
WebDeveloper.Outline.outlineExternalLinks = function(outline, documents)
{
  var contentDocument = null;
  var hostName        = null;
  var location        = null;
  var protocol        = null;
  var styleElement    = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If outlining external links
    if(outline)
    {
      location     = contentDocument.location;
      hostName     = location.hostname.replace(/\./gi, "\\.");
      protocol     = location.protocol.replace(/:/gi, "\\:");
      styleElement = contentDocument.createElement("style");

      styleElement.setAttribute("id", "web-developer-outline-external-links");
      styleElement.appendChild(contentDocument.createTextNode("a:not([href^=http\\:\\/\\/" + hostName + "]):not([href^=https\\:\\/\\/" + hostName + "]) { outline: 1px solid #b94a48 !important; }"));
      styleElement.appendChild(contentDocument.createTextNode("a:not([href^=http\\:\\/\\/]):not([href^=https\\:\\/\\/]) { outline-style: none !important; }"));

      WebDeveloper.Common.getDocumentHeadElement(contentDocument).appendChild(styleElement);
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements("#web-developer-outline-external-links", contentDocument);
    }
  }
};

// Outlines all floated elements
WebDeveloper.Outline.outlineFloatedElements = function(outline, documents)
{
  var contentDocument = null;
  var float           = null;
  var floatedElements = null;
  var node            = null;
  var treeWalker      = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If outlining floated elements
    if(outline)
    {
      treeWalker = contentDocument.createTreeWalker(WebDeveloper.Common.getDocumentBodyElement(contentDocument), NodeFilter.SHOW_ELEMENT, null, false);

      // While the tree walker has more nodes
      while((node = treeWalker.nextNode()) !== null)
      {
        float = node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyCSSValue("float").cssText;

        // If this element has a background image and it is a URL
        if(float && float != "none")
        {
          WebDeveloper.Common.addClass(node, "web-developer-outline-floated-elements");
        }
      }
    }
    else
    {
      floatedElements = contentDocument.getElementsByClassName("web-developer-outline-floated-elements");

      // While there are floated elements
      while(floatedElements.length > 0)
      {
        WebDeveloper.Common.removeClass(floatedElements[0], "web-developer-outline-floated-elements");
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-floated-elements.css", "web-developer-outline-floated-elements", contentDocument, false);
  }
};

// Outlines all frames
WebDeveloper.Outline.outlineFrames = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-frames.css", "web-developer-outline-frames", documents[i], false);
  }
};

// Outlines all headingss
WebDeveloper.Outline.outlineHeadings = function(documents, showElementTagNames)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-headings.css", "web-developer-outline-headings", contentDocument, false);

    // If showing element tag names
    if(showElementTagNames)
    {
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-headings-before-common", contentDocument, false);
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-headings-before.css", "web-developer-outline-headings-before", contentDocument, false);
    }
  }
};

// Outlines all non-secure elements
WebDeveloper.Outline.outlineNonSecureElements = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-non-secure-elements.css", "web-developer-outline-non-secure-elements", documents[i], false);
  }
};

// Outlines all positioned elements
WebDeveloper.Outline.outlinePositionedElements = function(positionType, outline, documents)
{
  var className     = "web-developer-outline-" + positionType + "-positioned-elements";
  var contentDocument = null;
  var node            = null;
  var position        = null;
  var treeWalker      = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If outlining positioned elements
    if(outline)
    {
      treeWalker = contentDocument.createTreeWalker(WebDeveloper.Common.getDocumentBodyElement(contentDocument), NodeFilter.SHOW_ELEMENT, null, false);

      // While the tree walker has more nodes
      while((node = treeWalker.nextNode()) !== null)
      {
        position = node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyCSSValue("position").cssText;

        // If this element has a background image and it is a URL
        if(position && position == positionType)
        {
          WebDeveloper.Common.addClass(node, className);
        }
      }
    }
    else
    {
      var positionedElements = contentDocument.getElementsByClassName(className);

      // While there are positioned elements
      while(positionedElements.length > 0)
      {
        WebDeveloper.Common.removeClass(positionedElements[0], className);
      }
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-positioned-elements.css", className, contentDocument, false);
  }
};

// Outlines all table captions
WebDeveloper.Outline.outlineTableCaptions = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-table-captions.css", "web-developer-outline-table-captions", documents[i], false);
  }
};

// Outlines all table cells
WebDeveloper.Outline.outlineTableCells = function(documents, showElementTagNames)
{
  var contentDocument = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-table-cells.css", "web-developer-outline-table-cells", contentDocument, false);

    // If showing element tag names
    if(showElementTagNames)
    {
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-table-cells-before-common", contentDocument, false);
      WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-table-cells-before.css", "web-developer-outline-table-cells-before", contentDocument, false);
    }
  }
};

// Outlines all tables
WebDeveloper.Outline.outlineTables = function(documents)
{
  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-tables.css", "web-developer-outline-tables", documents[i], false);
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay         = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Cookies = WebDeveloper.Overlay.Cookies || {};

// Returns the locale for the view cookie information feature
WebDeveloper.Overlay.Cookies.getViewCookieInformationLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.atEndOfSession             = WebDeveloper.Locales.getString("atEndOfSession");
  locale.cancel                     = WebDeveloper.Locales.getString("cancel");
  locale.cannotEdit                 = WebDeveloper.Locales.getString("cannotEdit");
  locale.cannotEditHTTPOnlyCookies  = WebDeveloper.Locales.getString("cannotEditHTTPOnlyCookies");
  locale.cannotEditLocalhostCookies = WebDeveloper.Locales.getString("cannotEditLocalhostCookies");
  locale.cookie                     = WebDeveloper.Locales.getString("cookie");
  locale.cookieDeleted              = WebDeveloper.Locales.getString("cookieDeleted");
  locale.cookieEdited               = WebDeveloper.Locales.getString("cookieEdited");
  locale.cookieInformation          = WebDeveloper.Locales.getString("cookieInformation");
  locale.cookies                    = WebDeveloper.Locales.getString("cookies");
  locale.deleteConfirmation         = WebDeveloper.Locales.getString("deleteConfirmation");
  locale.deleteCookie               = WebDeveloper.Locales.getString("deleteCookie");
  locale.deleteCookieConfirmation   = WebDeveloper.Locales.getString("deleteCookieConfirmation");
  locale.deleteLabel                = WebDeveloper.Locales.getString("delete");
  locale.edit                       = WebDeveloper.Locales.getString("edit");
  locale.editCookie                 = WebDeveloper.Locales.getString("editCookie");
  locale.expires                    = WebDeveloper.Locales.getString("expires");
  locale.expiresCannotBeEmpty       = WebDeveloper.Locales.getString("expiresCannotBeEmpty");
  locale.expiresNotValid            = WebDeveloper.Locales.getString("expiresNotValid");
  locale.host                       = WebDeveloper.Locales.getString("host");
  locale.hostCannotBeEmpty          = WebDeveloper.Locales.getString("hostCannotBeEmpty");
  locale.httpOnly                   = WebDeveloper.Locales.getString("httpOnly");
  locale.name                       = WebDeveloper.Locales.getString("name");
  locale.nameCannotBeEmpty          = WebDeveloper.Locales.getString("nameCannotBeEmpty");
  locale.no                         = WebDeveloper.Locales.getString("no");
  locale.path                       = WebDeveloper.Locales.getString("path");
  locale.pathCannotBeEmpty          = WebDeveloper.Locales.getString("pathCannotBeEmpty");
  locale.property                   = WebDeveloper.Locales.getString("property");
  locale.save                       = WebDeveloper.Locales.getString("save");
  locale.secure                     = WebDeveloper.Locales.getString("secure");
  locale.secureCookie               = WebDeveloper.Locales.getString("secureCookie");
  locale.sessionCookie              = WebDeveloper.Locales.getString("sessionCookie");
  locale.value                      = WebDeveloper.Locales.getString("value");
  locale.yes                        = WebDeveloper.Locales.getString("yes");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay     = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.CSS = WebDeveloper.Overlay.CSS || {};

// Returns the locale for the view CSS feature
WebDeveloper.Overlay.CSS.getViewCSSLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.couldNotLoadCSS    = WebDeveloper.Locales.getString("couldNotLoadCSS");
  locale.css                = WebDeveloper.Locales.getString("css");
  locale.dark               = WebDeveloper.Locales.getString("dark");
  locale.embeddedCSSFrom    = WebDeveloper.Locales.getString("embeddedCSSFrom");
  locale.light              = WebDeveloper.Locales.getString("light");
  locale.none               = WebDeveloper.Locales.getString("none");
  locale.syntaxHighlighting = WebDeveloper.Locales.getString("syntaxHighlighting");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay       = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Forms = WebDeveloper.Overlay.Forms || {};

// Returns the locale for the view form information feature
WebDeveloper.Overlay.Forms.getViewFormInformationLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.action        = WebDeveloper.Locales.getString("action");
  locale.elements      = WebDeveloper.Locales.getString("elements");
  locale.form          = WebDeveloper.Locales.getString("form");
  locale.forms         = WebDeveloper.Locales.getString("forms");
  locale.id            = WebDeveloper.Locales.getString("id");
  locale.label         = WebDeveloper.Locales.getString("label");
  locale.maximumLength = WebDeveloper.Locales.getString("maximumLength");
  locale.method        = WebDeveloper.Locales.getString("method");
  locale.name          = WebDeveloper.Locales.getString("name");
  locale.size          = WebDeveloper.Locales.getString("size");
  locale.type          = WebDeveloper.Locales.getString("type");
  locale.value         = WebDeveloper.Locales.getString("value");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay        = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Images = WebDeveloper.Overlay.Images || {};

// Returns the locale for the view image information feature
WebDeveloper.Overlay.Images.getViewImageInformationLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.alt      = WebDeveloper.Locales.getString("alt");
  locale.height   = WebDeveloper.Locales.getString("height");
  locale.image    = WebDeveloper.Locales.getString("image");
  locale.images   = WebDeveloper.Locales.getString("images");
  locale.property = WebDeveloper.Locales.getString("property");
  locale.src      = WebDeveloper.Locales.getString("src");
  locale.value    = WebDeveloper.Locales.getString("value");
  locale.width    = WebDeveloper.Locales.getString("width");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay             = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Information = WebDeveloper.Overlay.Information || {};

// Returns the locale for the view anchor information feature
WebDeveloper.Overlay.Information.getViewAnchorInformationLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.anchor            = WebDeveloper.Locales.getString("anchor");
  locale.anchorInformation = WebDeveloper.Locales.getString("anchorInformation");
  locale.anchors           = WebDeveloper.Locales.getString("anchors");

  return locale;
};

// Returns the locale for the view color information feature
WebDeveloper.Overlay.Information.getViewColorInformationLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.color            = WebDeveloper.Locales.getString("color");
  locale.colorInformation = WebDeveloper.Locales.getString("colorInformation");
  locale.colors           = WebDeveloper.Locales.getString("colors");

  return locale;
};

// Returns the locale for the view document outline feature
WebDeveloper.Overlay.Information.getViewDocumentOutlineLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.documentOutline = WebDeveloper.Locales.getString("documentOutline");
  locale.heading         = WebDeveloper.Locales.getString("heading");
  locale.headings        = WebDeveloper.Locales.getString("headings");
  locale.missingHeading  = WebDeveloper.Locales.getString("missingHeading");
  locale.noHeadingText   = WebDeveloper.Locales.getString("noHeadingText");

  return locale;
};

// Returns the locale for the view JavaScript feature
WebDeveloper.Overlay.Information.getViewJavaScriptLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.beautifyJavaScript     = WebDeveloper.Locales.getString("beautifyJavaScript");
  locale.couldNotLoadJavaScript = WebDeveloper.Locales.getString("couldNotLoadJavaScript");
  locale.dark                   = WebDeveloper.Locales.getString("dark");
  locale.embeddedJavaScriptFrom = WebDeveloper.Locales.getString("embeddedJavaScriptFrom");
  locale.javaScript             = WebDeveloper.Locales.getString("javaScript");
  locale.light                  = WebDeveloper.Locales.getString("light");
  locale.none                   = WebDeveloper.Locales.getString("none");
  locale.syntaxHighlighting     = WebDeveloper.Locales.getString("syntaxHighlighting");
  locale.undoBeautifyJavaScript = WebDeveloper.Locales.getString("undoBeautifyJavaScript");

  return locale;
};

// Returns the locale for the view link information feature
WebDeveloper.Overlay.Information.getViewLinkInformationLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.link            = WebDeveloper.Locales.getString("link");
  locale.linkInformation = WebDeveloper.Locales.getString("linkInformation");
  locale.links           = WebDeveloper.Locales.getString("links");

  return locale;
};

// Returns the locale for the view meta tag information feature
WebDeveloper.Overlay.Information.getViewMetaTagInformationLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.content  = WebDeveloper.Locales.getString("content");
  locale.metaTag  = WebDeveloper.Locales.getString("metaTag");
  locale.metaTags = WebDeveloper.Locales.getString("metaTags");
  locale.name     = WebDeveloper.Locales.getString("name");

  return locale;
};

// Returns the locale for the view response headers feature
WebDeveloper.Overlay.Information.getViewResponseHeadersLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.couldNotLoadResponseHeaders = WebDeveloper.Locales.getString("couldNotLoadResponseHeaders");
  locale.responseHeaders             = WebDeveloper.Locales.getString("responseHeaders");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay         = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Options = WebDeveloper.Overlay.Options || {};

// Returns the locale for the about feature
WebDeveloper.Overlay.Options.getAboutLocale = function()
{
  var locale = {};

  locale.about                = WebDeveloper.Locales.getString("about");
  locale.author               = WebDeveloper.Locales.getString("author");
  locale.buildDate            = WebDeveloper.Locales.getString("buildDate");
  locale.extensionDescription = WebDeveloper.Locales.getString("extensionDescription");
  locale.extensionName        = WebDeveloper.Locales.getString("extensionName");
  locale.version              = WebDeveloper.Locales.getString("version");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay        = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Resize = WebDeveloper.Overlay.Resize || {};

// Returns the locale for the view responsive layouts feature
WebDeveloper.Overlay.Resize.getViewResponsiveLayoutsLocale = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.layouts           = WebDeveloper.Locales.getString("layouts");
  locale.reloadLayouts     = WebDeveloper.Locales.getString("reloadLayouts");
  locale.responsiveLayouts = WebDeveloper.Locales.getString("responsiveLayouts");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.ElementAncestors         = WebDeveloper.ElementAncestors || {};
WebDeveloper.ElementAncestors.element = null;

// Returns the ancestor information for an element
WebDeveloper.ElementAncestors.getAncestorInformation = function(element, contentDocument)
{
  var ancestorInformation = contentDocument.createElement("ul");
  var parentElement       = null;

  ancestorInformation.setAttribute("class", "breadcrumb");
  WebDeveloper.Common.insertAsFirstChild(ancestorInformation, WebDeveloper.ElementAncestors.getElementDescription(element, contentDocument, true));

  // While there is a parent element
  while((parentElement = element.parentNode) !== null)
  {
    element = parentElement;

    WebDeveloper.Common.insertAsFirstChild(ancestorInformation, WebDeveloper.ElementAncestors.getElementDescription(element, contentDocument, false));
  }

  return ancestorInformation;
};

// Returns the description for an element
WebDeveloper.ElementAncestors.getElementDescription = function(element, contentDocument, active)
{
  var description = null;

  // If the element and tag name are set
  if(element && element.tagName)
  {
    var classList = element.className.split(" ");

    description = contentDocument.createElement("li");

    // If this is the active element
    if(active)
    {
      description.setAttribute("class", "active");
    }

    description.setAttribute("data-web-developer-element-tag", element.tagName.toLowerCase());

    // If the element has an id attribute
    if(element.hasAttribute("id"))
    {
      description.setAttribute("data-web-developer-element-id", "#" + element.getAttribute("id"));
    }

    // If the element has an class attribute
    if(element.hasAttribute("class"))
    {
      var className = null;
      var classes   = "";

      // Loop through the classes
      for(var i = 0, l = classList.length; i < l; i++)
      {
        className = classList[i].trim();

        // If the class name is set
        if(className)
        {
          classes += "." + className;
        }
      }

      description.setAttribute("data-web-developer-element-classes", classes);
    }

    // If this is not the active element
    if(!active)
    {
      var childElement = contentDocument.createElement("a");

      childElement.setAttribute("href", "#");
      childElement.setAttribute("class", "web-developer-ancestor");
      description.appendChild(childElement);

      childElement = contentDocument.createElement("span");

      childElement.appendChild(contentDocument.createTextNode(">"));
      childElement.setAttribute("class", "divider");
      description.appendChild(childElement);
    }
  }

  return description;
};

// Handles the mouse over event
WebDeveloper.ElementAncestors.mouseOver = function(event)
{
  var eventTarget = event.target;

  // If the event target is set
  if(eventTarget)
  {
    var ownerDocument = eventTarget.ownerDocument;

    // If the owner document is set
    if(ownerDocument)
    {
      // If the event target is not the element
      if(eventTarget != WebDeveloper.ElementAncestors.element)
      {
        // If the event target has a style property
        if(eventTarget.style)
        {
          WebDeveloper.ElementAncestors.removeOutline(ownerDocument);

          eventTarget.style.outline             = "1px solid #b94a48";
          WebDeveloper.ElementAncestors.element = eventTarget;

          WebDeveloper.ElementAncestors.displayElementAncestors(eventTarget);

          // Needed for Chrome to keep track of
          eventTarget.setAttribute("data-web-developer-element-ancestors-outline", "true");
        }
      }
    }
  }
};

// Removes the outline
WebDeveloper.ElementAncestors.removeOutline = function(contentDocument)
{
  var element = contentDocument.querySelector("[data-web-developer-element-ancestors-outline=true]");

  // If the element is set
  if(element)
  {
    element.style.outline = "";

    // If the element has an empty style attribute
    if(element.hasAttribute("style") && element.getAttribute("style").trim() === "")
    {
      element.removeAttribute("style");
    }

    // Needed for Chrome to keep track of
    element.removeAttribute("data-web-developer-element-ancestors-outline");
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.LineGuides                   = WebDeveloper.LineGuides || {};
WebDeveloper.LineGuides.padding           = 2;
WebDeveloper.LineGuides.selectedlineGuide = null;
WebDeveloper.LineGuides.spacing           = 98;

// Adds a horizontal line guide
WebDeveloper.LineGuides.addHorizontalLineGuide = function()
{
  var contentDocument    = WebDeveloper.Common.getContentDocument();
  var contentWindow      = WebDeveloper.Common.getContentWindow();
  var documentHeight     = contentDocument.body.offsetHeight;
  var lineGuide          = contentDocument.createElement("div");
  var lineGuideColor     = contentDocument.createElement("div");
  var lineGuidePositions = WebDeveloper.LineGuides.getHorizontalLineGuidePositions(contentDocument);
  var spacing            = contentWindow.pageYOffset + WebDeveloper.LineGuides.spacing;

  lineGuideColor.style.backgroundColor = WebDeveloper.LineGuides.getColor();
  lineGuide.style.top                  = 0;

  lineGuide.addEventListener("mousedown", WebDeveloper.LineGuides.mouseDown, false);
  lineGuide.addEventListener("mouseout", WebDeveloper.LineGuides.mouseOut, false);
  lineGuide.addEventListener("mouseover", WebDeveloper.LineGuides.mouseOver, false);
  lineGuide.addEventListener("mouseup", WebDeveloper.LineGuides.mouseUp, false);

  lineGuide.setAttribute("class", "web-developer-line-guide web-developer-horizontal-line-guide");
  lineGuide.appendChild(lineGuideColor);
  WebDeveloper.LineGuides.sizeLineGuide(lineGuide, contentDocument, contentWindow);

  // While the spacing is less than the document height
  while(spacing < documentHeight)
  {
    // If there is already a line guide at this position
    if(WebDeveloper.Common.contains(lineGuidePositions, spacing + "px"))
    {
      spacing += WebDeveloper.LineGuides.spacing + WebDeveloper.LineGuides.padding;
    }
    else
    {
      lineGuide.style.top = spacing + "px";

      break;
    }
  }

  WebDeveloper.Common.getDocumentBodyElement(contentDocument).appendChild(lineGuide);
};

// Adds a vertical line guide
WebDeveloper.LineGuides.addVerticalLineGuide = function()
{
  var contentDocument    = WebDeveloper.Common.getContentDocument();
  var contentWindow      = WebDeveloper.Common.getContentWindow();
  var documentWidth      = contentDocument.body.offsetWidth;
  var lineGuide          = contentDocument.createElement("div");
  var lineGuideColor     = contentDocument.createElement("div");
  var lineGuidePositions = WebDeveloper.LineGuides.getVerticalLineGuidePositions(contentDocument);
  var spacing            = contentWindow.pageXOffset + WebDeveloper.LineGuides.spacing;

  lineGuideColor.style.backgroundColor = WebDeveloper.LineGuides.getColor();
  lineGuide.style.left                 = 0;

  lineGuide.addEventListener("mousedown", WebDeveloper.LineGuides.mouseDown, false);
  lineGuide.addEventListener("mouseout", WebDeveloper.LineGuides.mouseOut, false);
  lineGuide.addEventListener("mouseover", WebDeveloper.LineGuides.mouseOver, false);
  lineGuide.addEventListener("mouseup", WebDeveloper.LineGuides.mouseUp, false);

  lineGuide.setAttribute("class", "web-developer-line-guide web-developer-vertical-line-guide");
  lineGuide.appendChild(lineGuideColor);
  WebDeveloper.LineGuides.sizeLineGuide(lineGuide, contentDocument, contentWindow);

  // While the spacing is less than the document width
  while(spacing < documentWidth)
  {
    // If there is already a line guide at this position
    if(WebDeveloper.Common.contains(lineGuidePositions, spacing + "px"))
    {
      spacing += WebDeveloper.LineGuides.spacing + WebDeveloper.LineGuides.padding;
    }
    else
    {
      lineGuide.style.left = spacing + "px";

      break;
    }
  }

  WebDeveloper.Common.getDocumentBodyElement(contentDocument).appendChild(lineGuide);
};

// Creates the line guides
WebDeveloper.LineGuides.createLineGuides = function()
{
  WebDeveloper.LineGuides.addHorizontalLineGuide();
  WebDeveloper.LineGuides.addVerticalLineGuide();
};

// Displays line guides
WebDeveloper.LineGuides.displayLineGuides = function(display, contentDocument, toolbarHTML)
{
  // If displaying line guides
  if(display)
  {
    WebDeveloper.LineGuides.createLineGuides(contentDocument);
    WebDeveloper.LineGuides.createEvents(contentDocument);
    WebDeveloper.LineGuides.createToolbar(contentDocument, toolbarHTML);
  }
  else
  {
    WebDeveloper.LineGuides.removeLineGuides(contentDocument);
    WebDeveloper.LineGuides.removeEvents(contentDocument);
    WebDeveloper.LineGuides.removeToolbar(contentDocument);
  }

  WebDeveloper.Common.toggleStyleSheet("toolbar/line-guides.css", "web-developer-display-line-guides", contentDocument, false);
};

// Returns an array containing the horizontal line guide positions
WebDeveloper.LineGuides.getHorizontalLineGuidePositions = function(contentDocument)
{
  return WebDeveloper.LineGuides.getLineGuidePositions(contentDocument, "horizontal");
};

// Returns the line guide position nearest to the given line guide position
WebDeveloper.LineGuides.getLineGuidePosition = function(contentDocument, direction, lineGuidePosition, next)
{
  var lineGuidePositions     = WebDeveloper.LineGuides.getLineGuidePositions(contentDocument, direction);
  var otherLineGuidePosition = 0;
  var position               = 0;

  // Loop through the line guide positions
  for(var i = 0, l = lineGuidePositions.length; i < l; i++)
  {
    otherLineGuidePosition = parseInt(lineGuidePositions[i].replace(/px/gi, ""), 10) + WebDeveloper.LineGuides.padding;

    // If looking for the next line guide position, the other line guide position is greater than the line guide position and the other line guide position is greater than the saved position
    if(next && otherLineGuidePosition > lineGuidePosition && otherLineGuidePosition > position)
    {
      position = otherLineGuidePosition;
    }
    else if(!next && otherLineGuidePosition < lineGuidePosition && otherLineGuidePosition > position)
    {
      position = otherLineGuidePosition;
    }
  }

  return position;
};

// Returns an array containing the line guide positions
WebDeveloper.LineGuides.getLineGuidePositions = function(contentDocument, direction)
{
  var lineGuidePositions = [];
  var lineGuides         = contentDocument.getElementsByClassName("web-developer-" + direction + "-line-guide");

  // Loop through the line guides
  for(var i = 0, l = lineGuides.length; i < l; i++)
  {
    // If we are looking at horizontal line guides
    if(direction == "horizontal")
    {
      lineGuidePositions.push(lineGuides[i].style.top);
    }
    else
    {
      lineGuidePositions.push(lineGuides[i].style.left);
    }
  }

  return lineGuidePositions;
};

// Returns an array containing the vertical line guide positions
WebDeveloper.LineGuides.getVerticalLineGuidePositions = function(contentDocument)
{
  return WebDeveloper.LineGuides.getLineGuidePositions(contentDocument, "vertical");
};

// Handles the mouse down event on a line guide
WebDeveloper.LineGuides.mouseDown = function(event)
{
  // If the click was not a right click
  if(event.button != 2)
  {
    var element = event.target;

    // If the element is set
    if(element)
    {
      WebDeveloper.LineGuides.selectedlineGuide = element;
    }
  }
};

// Handles the mouse move event on the document
WebDeveloper.LineGuides.mouseMove = function(event)
{
  // If a line guide is selected
  if(WebDeveloper.LineGuides.selectedlineGuide)
  {
    // If the line guide is horizontal
    if(WebDeveloper.Common.hasClass(WebDeveloper.LineGuides.selectedlineGuide, "web-developer-horizontal-line-guide"))
    {
      WebDeveloper.LineGuides.selectedlineGuide.style.top = event.pageY + "px";
    }
    else
    {
      WebDeveloper.LineGuides.selectedlineGuide.style.left = event.pageX + "px";
    }

    WebDeveloper.LineGuides.updateLineGuideInformation(WebDeveloper.LineGuides.selectedlineGuide);
  }
};

// Handles the mouse out event on a line guide
WebDeveloper.LineGuides.mouseOut = function(event)
{
  var eventTarget = event.target;

  // If the event target is set
  if(eventTarget)
  {
    var ownerDocument = eventTarget.ownerDocument;

    // If the owner document is set
    if(ownerDocument)
    {
      WebDeveloper.LineGuides.hideInformation();
    }
  }
};

// Handles the mouse over event on a line guide
WebDeveloper.LineGuides.mouseOver = function(event)
{
  var lineGuide = event.target;

  // If the line guide is set
  if(lineGuide)
  {
    var ownerDocument = lineGuide.ownerDocument;

    // If the owner document is set
    if(ownerDocument)
    {
      // If this is not a line guide
      if(!WebDeveloper.Common.hasClass(lineGuide, "web-developer-line-guide"))
      {
        lineGuide = lineGuide.parentNode;
      }

      WebDeveloper.LineGuides.updateLineGuideInformation(lineGuide);
    }
  }
};

// Handles the mouse up event on a line guide
WebDeveloper.LineGuides.mouseUp = function()
{
  WebDeveloper.LineGuides.selectedlineGuide = null;
};

// Removes the line guides
WebDeveloper.LineGuides.removeLineGuides = function(contentDocument)
{
  WebDeveloper.Common.removeMatchingElements("#web-developer-line-guide-information, .web-developer-line-guide", contentDocument);
};

// Handles the resize event on the window
WebDeveloper.LineGuides.resize = function()
{
  var contentDocument = WebDeveloper.Common.getContentDocument();
  var contentWindow   = WebDeveloper.Common.getContentWindow();
  var lineGuides      = contentDocument.getElementsByClassName("web-developer-line-guide");

  // Loop through the line guides
  for(var i = 0, l = lineGuides.length; i < l; i++)
  {
    WebDeveloper.LineGuides.sizeLineGuide(lineGuides[i], contentDocument, contentWindow);
  }
};

// Sets the size of a line guide
WebDeveloper.LineGuides.sizeLineGuide = function(lineGuide, contentDocument, contentWindow)
{
  // If the line guide is horizontal
  if(WebDeveloper.Common.hasClass(lineGuide, "web-developer-horizontal-line-guide"))
  {
    var documentWidth = contentDocument.body.offsetWidth;
    var viewportWidth = contentWindow.innerWidth;

    // If the viewport width is greater than the document width
    if(viewportWidth > documentWidth)
    {
      lineGuide.style.width = viewportWidth + "px";
    }
    else
    {
      lineGuide.style.width = documentWidth + "px";
    }
  }
  else
  {
    var documentHeight = contentDocument.body.offsetHeight;
    var viewportHeight = contentWindow.innerHeight;

    // If the viewport height is greater than the document height
    if(viewportHeight > documentHeight)
    {
      lineGuide.style.height = viewportHeight + "px";
    }
    else
    {
      lineGuide.style.height = documentHeight + "px";
    }
  }
};

// Updates the line guide information
WebDeveloper.LineGuides.updateLineGuideInformation = function(lineGuide)
{
  var nextPosition     = null;
  var ownerDocument    = lineGuide.ownerDocument;
  var position         = null;
  var previousPosition = null;

  // If the owner document is set
  if(ownerDocument)
  {
    // If this is not a line guide
    if(!WebDeveloper.Common.hasClass(lineGuide, "web-developer-line-guide"))
    {
      lineGuide = lineGuide.parentNode;
    }

    // If this is a horizontal line guide
    if(WebDeveloper.Common.hasClass(lineGuide, "web-developer-horizontal-line-guide"))
    {
      position         = WebDeveloper.Common.getElementPositionY(lineGuide) + WebDeveloper.LineGuides.padding;
      nextPosition     = WebDeveloper.LineGuides.getLineGuidePosition(ownerDocument, "horizontal", position, true);
      previousPosition = WebDeveloper.LineGuides.getLineGuidePosition(ownerDocument, "horizontal", position, false);
    }
    else
    {
      position         = WebDeveloper.Common.getElementPositionX(lineGuide) + WebDeveloper.LineGuides.padding;
      nextPosition     = WebDeveloper.LineGuides.getLineGuidePosition(ownerDocument, "vertical", position, true);
      previousPosition = WebDeveloper.LineGuides.getLineGuidePosition(ownerDocument, "vertical", position, false);
    }

    WebDeveloper.LineGuides.updateInformation(position, previousPosition, nextPosition);
  }
};

var WebDeveloper = WebDeveloper || {};

WebDeveloper.Ruler = WebDeveloper.Ruler || {};

// Creates the ruler
WebDeveloper.Ruler.createRuler = function(contentDocument)
{
  var divElement = null;

  WebDeveloper.Ruler.container = contentDocument.createElement("div");

  WebDeveloper.Ruler.container.setAttribute("id", "web-developer-ruler-container");
  WebDeveloper.Common.getDocumentBodyElement(contentDocument).appendChild(WebDeveloper.Ruler.container);
  WebDeveloper.Ruler.resizeContainer();

  WebDeveloper.Ruler.backgroundBottom = contentDocument.createElement("div");

  WebDeveloper.Ruler.backgroundBottom.setAttribute("id", "web-developer-ruler-background-bottom");
  WebDeveloper.Ruler.container.appendChild(WebDeveloper.Ruler.backgroundBottom);

  WebDeveloper.Ruler.backgroundLeft = contentDocument.createElement("div");

  WebDeveloper.Ruler.backgroundLeft.setAttribute("id", "web-developer-ruler-background-left");
  WebDeveloper.Ruler.container.appendChild(WebDeveloper.Ruler.backgroundLeft);

  WebDeveloper.Ruler.backgroundRight = contentDocument.createElement("div");

  WebDeveloper.Ruler.backgroundRight.setAttribute("id", "web-developer-ruler-background-right");
  WebDeveloper.Ruler.container.appendChild(WebDeveloper.Ruler.backgroundRight);

  WebDeveloper.Ruler.backgroundTop = contentDocument.createElement("div");

  WebDeveloper.Ruler.backgroundTop.setAttribute("id", "web-developer-ruler-background-top");
  WebDeveloper.Ruler.container.appendChild(WebDeveloper.Ruler.backgroundTop);

  WebDeveloper.Ruler.ruler = contentDocument.createElement("div");

  divElement = contentDocument.createElement("div");

  divElement.setAttribute("id", "web-developer-ruler-bottom-left");
  WebDeveloper.Ruler.ruler.appendChild(divElement);

  divElement = contentDocument.createElement("div");

  divElement.setAttribute("id", "web-developer-ruler-bottom-right");
  WebDeveloper.Ruler.ruler.appendChild(divElement);

  divElement = contentDocument.createElement("div");

  divElement.setAttribute("id", "web-developer-ruler-top-left");
  WebDeveloper.Ruler.ruler.appendChild(divElement);

  divElement = contentDocument.createElement("div");

  divElement.setAttribute("id", "web-developer-ruler-top-right");
  WebDeveloper.Ruler.ruler.appendChild(divElement);

  WebDeveloper.Ruler.ruler.setAttribute("id", "web-developer-ruler");
  WebDeveloper.Ruler.container.appendChild(WebDeveloper.Ruler.ruler);

  WebDeveloper.Ruler.ruler.style.height = (WebDeveloper.Ruler.endY - WebDeveloper.Ruler.startY) + "px";
  WebDeveloper.Ruler.ruler.style.left   = WebDeveloper.Ruler.startX + "px";
  WebDeveloper.Ruler.ruler.style.top    = WebDeveloper.Ruler.startY + "px";
  WebDeveloper.Ruler.ruler.style.width  = (WebDeveloper.Ruler.endX - WebDeveloper.Ruler.startX) + "px";

  // Run this on a delay because the styles must be all setup
  window.setTimeout(function()
  {
    WebDeveloper.Ruler.resizeBackgrounds();
    WebDeveloper.Ruler.updateInformation();
  }, 100);
};

// Displays the ruler
WebDeveloper.Ruler.displayRuler = function(display, contentDocument, toolbarHTML)
{
  // Run first so that the size calculations are accurate on setup
  WebDeveloper.Common.toggleStyleSheet("toolbar/ruler.css", "web-developer-ruler-styles", contentDocument, false);

  // If displaying the ruler
  if(display)
  {
    WebDeveloper.Ruler.reset();
    WebDeveloper.Ruler.createRuler(contentDocument);
    WebDeveloper.Ruler.createEvents(contentDocument);
    WebDeveloper.Ruler.createToolbar(contentDocument, toolbarHTML);
  }
  else
  {
    WebDeveloper.Ruler.removeRuler(contentDocument);
    WebDeveloper.Ruler.removeEvents(contentDocument);
    WebDeveloper.Ruler.removeToolbar(contentDocument);
    WebDeveloper.Ruler.reset();
  }

};

// Handles the mouse down event
WebDeveloper.Ruler.mouseDown = function(event)
{
  // If the click was not a right click
  if(event.button != 2)
  {
    var eventTarget = event.target;

    // If the event target is set
    if(eventTarget)
    {
      var ownerDocument = eventTarget.ownerDocument;

      // If the owner document is set
      if(ownerDocument)
      {
        var tagName = eventTarget.tagName;
        var toolbar = ownerDocument.getElementById("web-developer-ruler-toolbar");

        // If the event target is not the toolbar, the toolbar is not an ancestor of the event target and the event target is not a scrollbar
        if(eventTarget != toolbar && !WebDeveloper.Common.isAncestor(eventTarget, toolbar) && tagName && tagName.toLowerCase() != "scrollbar")
        {
          var xPosition = event.pageX;
          var yPosition = event.pageY;

          // If event target is the container element
          if(eventTarget == WebDeveloper.Ruler.ruler)
          {
            WebDeveloper.Ruler.move  = true;
            WebDeveloper.Ruler.moveX = xPosition - WebDeveloper.Ruler.ruler.offsetLeft;
            WebDeveloper.Ruler.moveY = yPosition - WebDeveloper.Ruler.ruler.offsetTop;
          }
          else if(eventTarget == ownerDocument.getElementById("web-developer-ruler-bottom-left"))
          {
            WebDeveloper.Ruler.resize = true;
            WebDeveloper.Ruler.startX = WebDeveloper.Ruler.ruler.offsetLeft + WebDeveloper.Ruler.ruler.offsetWidth;
            WebDeveloper.Ruler.startY = WebDeveloper.Ruler.ruler.offsetTop;
          }
          else if(eventTarget == ownerDocument.getElementById("web-developer-ruler-bottom-right"))
          {
            WebDeveloper.Ruler.resize = true;
            WebDeveloper.Ruler.startX = WebDeveloper.Ruler.ruler.offsetLeft;
            WebDeveloper.Ruler.startY = WebDeveloper.Ruler.ruler.offsetTop;
          }
          else if(eventTarget == ownerDocument.getElementById("web-developer-ruler-top-left"))
          {
            WebDeveloper.Ruler.resize = true;
            WebDeveloper.Ruler.startX = WebDeveloper.Ruler.ruler.offsetLeft + WebDeveloper.Ruler.ruler.offsetWidth;
            WebDeveloper.Ruler.startY = WebDeveloper.Ruler.ruler.offsetTop + WebDeveloper.Ruler.ruler.offsetHeight;
          }
          else if(eventTarget == ownerDocument.getElementById("web-developer-ruler-top-right"))
          {
            WebDeveloper.Ruler.resize = true;
            WebDeveloper.Ruler.startX = WebDeveloper.Ruler.ruler.offsetLeft;
            WebDeveloper.Ruler.startY = WebDeveloper.Ruler.ruler.offsetTop + WebDeveloper.Ruler.ruler.offsetHeight;
          }
          else
          {
            WebDeveloper.Ruler.drag   = true;
            WebDeveloper.Ruler.endX   = 0;
            WebDeveloper.Ruler.endY   = 0;
            WebDeveloper.Ruler.startX = xPosition;
            WebDeveloper.Ruler.startY = yPosition;

            WebDeveloper.Ruler.updateInformation();
          }

          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  }
};

// Handles the mouse move event
WebDeveloper.Ruler.mouseMove = function(event)
{
  // If the ruler is being dragged, moved or resized
  if(WebDeveloper.Ruler.drag || WebDeveloper.Ruler.move || WebDeveloper.Ruler.resize)
  {
    var eventTarget = event.target;

    // If the event target is set
    if(eventTarget)
    {
      var ownerDocument = eventTarget.ownerDocument;

      // If the event target has an owner document
      if(ownerDocument)
      {
        var xPosition = event.pageX;
        var yPosition = event.pageY;

        // If the ruler is being dragged or resized
        if(WebDeveloper.Ruler.drag || WebDeveloper.Ruler.resize)
        {
          var height = 0;
          var width  = 0;

          WebDeveloper.Ruler.endX = xPosition;
          WebDeveloper.Ruler.endY = yPosition;

          // If the end x position is greater than the start x position
          if(WebDeveloper.Ruler.endX > WebDeveloper.Ruler.startX)
          {
            width = WebDeveloper.Ruler.endX - WebDeveloper.Ruler.startX;

            WebDeveloper.Ruler.ruler.style.left = WebDeveloper.Ruler.startX + "px";
          }
          else
          {
            width = WebDeveloper.Ruler.startX - WebDeveloper.Ruler.endX;

            WebDeveloper.Ruler.ruler.style.left = xPosition + "px";
          }

          // If the end y position is greater than the start y position
          if(WebDeveloper.Ruler.endY > WebDeveloper.Ruler.startY)
          {
            height = WebDeveloper.Ruler.endY - WebDeveloper.Ruler.startY;

            WebDeveloper.Ruler.ruler.style.top = WebDeveloper.Ruler.startY + "px";
          }
          else
          {
            height = WebDeveloper.Ruler.startY - WebDeveloper.Ruler.endY;

            WebDeveloper.Ruler.ruler.style.top = WebDeveloper.Ruler.endY + "px";
          }

          WebDeveloper.Ruler.ruler.style.height = height + "px";
          WebDeveloper.Ruler.ruler.style.width  = width + "px";
        }
        else if(WebDeveloper.Ruler.move)
        {
          var newXPosition = xPosition - WebDeveloper.Ruler.moveX;
          var newYPosition = yPosition - WebDeveloper.Ruler.moveY;

          WebDeveloper.Ruler.ruler.style.left = newXPosition + "px";
          WebDeveloper.Ruler.ruler.style.top  = newYPosition + "px";

          WebDeveloper.Ruler.endX   = newXPosition + WebDeveloper.Ruler.ruler.offsetWidth - 2;
          WebDeveloper.Ruler.endY   = newYPosition + WebDeveloper.Ruler.ruler.offsetHeight - 2;
          WebDeveloper.Ruler.startX = newXPosition;
          WebDeveloper.Ruler.startY = newYPosition;
        }

        WebDeveloper.Ruler.resizeBackgrounds();
        WebDeveloper.Ruler.updateInformation();
      }
    }
  }
};

// Handles the mouse up event
WebDeveloper.Ruler.mouseUp = function(event)
{
  // If the click was not a right click
  if(event.button != 2)
  {
    var eventTarget = event.target;

    // If the event target is set
    if(eventTarget)
    {
      var ownerDocument = eventTarget.ownerDocument;

      // If the event target has an owner document
      if(ownerDocument)
      {
        var tagName = eventTarget.tagName;
        var toolbar = ownerDocument.getElementById("web-developer-ruler-toolbar");

        // If the event target is not the toolbar, the toolbar is not an ancestor of the event target and the event target is not a scrollbar
        if(eventTarget != toolbar && !WebDeveloper.Common.isAncestor(eventTarget, toolbar) && tagName && tagName.toLowerCase() != "scrollbar")
        {
          // If not moving the ruler
          if(!WebDeveloper.Ruler.move)
          {
            var xPosition = event.pageX;
            var yPosition = event.pageY;

            // If the X position is greater than the start X position
            if(xPosition > WebDeveloper.Ruler.startX)
            {
              WebDeveloper.Ruler.endX = xPosition;
            }
            else
            {
              WebDeveloper.Ruler.endX   = WebDeveloper.Ruler.startX;
              WebDeveloper.Ruler.startX = xPosition;
            }

            // If the Y position is greater than the start Y position
            if(yPosition > WebDeveloper.Ruler.startY)
            {
              WebDeveloper.Ruler.endY = yPosition;
            }
            else
            {
              WebDeveloper.Ruler.endY   = WebDeveloper.Ruler.startY;
              WebDeveloper.Ruler.startY = yPosition;
            }
          }

          WebDeveloper.Ruler.drag   = false;
          WebDeveloper.Ruler.move   = false;
          WebDeveloper.Ruler.moveX  = 0;
          WebDeveloper.Ruler.moveY  = 0;
          WebDeveloper.Ruler.resize = false;

          WebDeveloper.Ruler.updateInformation();
        }
      }
    }
  }
};

// Removes the ruler
WebDeveloper.Ruler.removeRuler = function(contentDocument)
{
  WebDeveloper.Common.removeMatchingElements("#web-developer-ruler-container", contentDocument);
};

// Resets the ruler
WebDeveloper.Ruler.reset = function()
{
  WebDeveloper.Ruler.backgroundBottom = null;
  WebDeveloper.Ruler.backgroundLeft   = null;
  WebDeveloper.Ruler.backgroundRight  = null;
  WebDeveloper.Ruler.backgroundTop    = null;
  WebDeveloper.Ruler.container        = null;
  WebDeveloper.Ruler.drag             = false;
  WebDeveloper.Ruler.endX             = 498;
  WebDeveloper.Ruler.endY             = 398;
  WebDeveloper.Ruler.move             = false;
  WebDeveloper.Ruler.moveX            = 0;
  WebDeveloper.Ruler.moveY            = 0;
  WebDeveloper.Ruler.resize           = false;
  WebDeveloper.Ruler.ruler            = null;
  WebDeveloper.Ruler.startX           = 200;
  WebDeveloper.Ruler.startY           = 200;
};

// Resizes the ruler backgrounds
WebDeveloper.Ruler.resizeBackgrounds = function()
{
  var containerHeight = WebDeveloper.Ruler.container.offsetHeight;
  var containerWidth  = WebDeveloper.Ruler.container.offsetWidth;
  var rulerHeight     = WebDeveloper.Ruler.ruler.offsetHeight;
  var rulerPositionX  = WebDeveloper.Common.getElementPositionX(WebDeveloper.Ruler.ruler);
  var rulerPositionY  = WebDeveloper.Common.getElementPositionY(WebDeveloper.Ruler.ruler);
  var rulerWidth      = WebDeveloper.Ruler.ruler.offsetWidth;

  WebDeveloper.Ruler.backgroundBottom.style.height = (containerHeight - rulerPositionY - rulerHeight) + "px";
  WebDeveloper.Ruler.backgroundBottom.style.width  = containerWidth + "px";
  WebDeveloper.Ruler.backgroundLeft.style.height   = rulerHeight + "px";
  WebDeveloper.Ruler.backgroundLeft.style.top      = rulerPositionY + "px";
  WebDeveloper.Ruler.backgroundLeft.style.width    = rulerPositionX + "px";
  WebDeveloper.Ruler.backgroundRight.style.top     = rulerPositionY + "px";
  WebDeveloper.Ruler.backgroundRight.style.height  = rulerHeight + "px";
  WebDeveloper.Ruler.backgroundRight.style.width   = (containerWidth - rulerPositionX - rulerWidth) + "px";
  WebDeveloper.Ruler.backgroundTop.style.height    = rulerPositionY + "px";
  WebDeveloper.Ruler.backgroundTop.style.width     = containerWidth + "px";
};

// Resizes the ruler container
WebDeveloper.Ruler.resizeContainer = function()
{
  var contentDocument = WebDeveloper.Common.getContentDocument();
  var contentWindow   = WebDeveloper.Common.getContentWindow();
  var documentHeight  = WebDeveloper.Common.getDocumentBodyElement(contentDocument).offsetHeight;
  var documentWidth   = WebDeveloper.Common.getDocumentBodyElement(contentDocument).offsetWidth;
  var viewportHeight  = contentWindow.innerHeight;
  var viewportWidth   = contentWindow.innerWidth;

  // If the viewport width is greater than the document width
  if(viewportWidth > documentWidth)
  {
    WebDeveloper.Ruler.container.style.width = viewportWidth + "px";
  }
  else
  {
    WebDeveloper.Ruler.container.style.width = documentWidth + "px";
  }

  // If the viewport height is greater than the document height
  if(viewportHeight > documentHeight)
  {
    WebDeveloper.Ruler.container.style.height = viewportHeight + "px";
  }
  else
  {
    WebDeveloper.Ruler.container.style.height = documentHeight + "px";
  }
};

// Handles the resize event
WebDeveloper.Ruler.resizeDocument = function()
{
  WebDeveloper.Ruler.resizeContainer();
  WebDeveloper.Ruler.resizeBackgrounds();
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Upgrade = WebDeveloper.Upgrade || {};

// Formats the version as a number
WebDeveloper.Upgrade.formatVersionNumber = function(versionString)
{
  var betaVersion       = versionString.indexOf("b");
  var firstDecimalPlace = versionString.indexOf(".");
  var versionNumber     = versionString.substring(0, firstDecimalPlace) + ".";

  // If this is not a beta version
  if(betaVersion == -1)
  {
    versionNumber += versionString.substring(firstDecimalPlace + 1);
  }
  else
  {
    versionNumber += versionString.substring(firstDecimalPlace + 1, betaVersion);
  }

  return parseFloat(versionNumber, 10) + "";
};
// Constructs an application object
function WebDeveloperApplication(applicationPath)
{
  this.applicationPath = applicationPath;
  this.executable    = this.getExecutable();
  this.file          = null;
}

// Creates a source file
WebDeveloperApplication.prototype.createSourceFile = function(temporaryDirectory, uri)
{
  var sourceFile = null;

  // If the URI has a file scheme
  if(uri.scheme == "file")
  {
    var fileProtocolHandler = Components.classes["@mozilla.org/network/protocol;1?name=file"].createInstance(Components.interfaces.nsIFileProtocolHandler);

    sourceFile = fileProtocolHandler.getFileFromURLSpec(uri.spec);
  }

  // If the source file is not set
  if(!sourceFile)
  {
    var fileExtension = "html";
    var fileName      = uri.host;
    var url         = Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURL);

    sourceFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    url.spec   = uri.spec;

    // If the URL has a file extension
    if(url.fileExtension)
    {
        fileExtension = url.fileExtension;
    }

    temporaryDirectory.append("webdeveloper-" + fileName + "-" + new Date().getTime() + "." + fileExtension);
    sourceFile.initWithPath(temporaryDirectory.path);
  }

  return sourceFile;
};

// Returns an executable for the application
WebDeveloperApplication.prototype.getExecutable = function()
{
  var executable = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

  // If the extension is running on a Mac and the application path points at an application bundle
  if(WebDeveloper.Common.isMac() && WebDeveloper.Common.endsWith(this.applicationPath, ".app"))
  {
    executable.initWithPath("/usr/bin/open");
  }
  else
  {
    executable.initWithPath(this.applicationPath);
  }

  return executable;
};

// Returns the post data
WebDeveloperApplication.prototype.getPostData = function()
{
  // Try to get the post data
  try
  {
    var sessionHistory = getWebNavigation().sessionHistory;
    var entry        = sessionHistory.getEntryAtIndex(sessionHistory.index, false).QueryInterface(Components.interfaces.nsISHEntry);

    return entry.postData;
  }
  catch(exception)
  {
    return null;
  }
};

// Launch the application with the given file
WebDeveloperApplication.prototype.launchWithFile = function()
{
  var process        = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
  var processArguments = [this.file.path];

  process.init(this.executable);

  // If the extension is running on a Mac and the application path points at an application bundle
  if(WebDeveloper.Common.isMac() && WebDeveloper.Common.endsWith(this.applicationPath, ".app"))
  {
    processArguments = ["-a", this.applicationPath, this.file.path];
  }

  process.run(false, processArguments, processArguments.length);
};

// Launch the application with the source from the given URI
WebDeveloperApplication.prototype.launchWithSource = function(uri, contentWindow)
{
  var temporaryDirectory = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);

  // If the temporary directory exists, is a directory and is writable
  if(temporaryDirectory.exists() && temporaryDirectory.isDirectory() && temporaryDirectory.isWritable())
  {
    // If the executable exists and is executable
    if(this.executable.exists() && this.executable.isExecutable())
    {
      this.file = this.createSourceFile(temporaryDirectory, uri);

      if(uri.scheme == "file")
      {
        this.launchWithFile();
      }
      else
      {
        var webBrowserPersistInterface = Components.interfaces.nsIWebBrowserPersist;
        var webBrowserPersist        = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(webBrowserPersistInterface);

        webBrowserPersist.persistFlags     = webBrowserPersistInterface.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION | webBrowserPersistInterface.PERSIST_FLAGS_FROM_CACHE | webBrowserPersistInterface.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
        webBrowserPersist.progressListener = this;

        webBrowserPersist.saveURI(uri, null, uri, this.getPostData(), null, this.file, contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsILoadContext));
      }
    }
    else
    {
      WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("viewSourceWith"), WebDeveloper.Locales.getFormattedString("launchApplicationFailed", [this.applicationPath]));
    }
  }
  else
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("viewSourceWith"), WebDeveloper.Locales.getFormattedString("temporaryDirectoryFailed", [temporaryDirectory.path]));
  }
};

// Launch the application with the given URL
WebDeveloperApplication.prototype.launchWithURL = function(url)
{
  // If the executable exists and is executable
  if(this.executable.exists() && this.executable.isExecutable())
  {
    var process        = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    var processArguments = [url];

    process.init(this.executable);

    // If the extension is running on a Mac and the application path points at an application bundle
    if(WebDeveloper.Common.isMac() && WebDeveloper.Common.endsWith(this.applicationPath, ".app"))
    {
      processArguments = ["-a", this.applicationPath, url];
    }

    process.run(false, processArguments, processArguments.length);
  }
  else
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("openApplication"), WebDeveloper.Locales.getFormattedString("launchApplicationFailed", [this.applicationPath]));
  }
};

// Called when the progress state changes
WebDeveloperApplication.prototype.onStateChange = function(webProgress, request, stateFlags)
{
  // If the progress has stopped
  if(stateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP)
  {
    this.launchWithFile();
  }
};

// Indicates the interfaces this object supports
WebDeveloperApplication.prototype.QueryInterface = function(id)
{
  // If the query is for a supported interface
  if(id.equals(Components.interfaces.nsISupports) || id.equals(Components.interfaces.nsIWebProgressListener))
  {
    return this;
  }

  throw Components.results.NS_NOINTERFACE;
};

// Dummy methods requiring implementations
WebDeveloperApplication.prototype.onLocationChange = function() {};
WebDeveloperApplication.prototype.onProgressChange = function() {};
WebDeveloperApplication.prototype.onSecurityChange = function() {};
WebDeveloperApplication.prototype.onStatusChange   = function() {};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Cookies = WebDeveloper.Cookies || {};

// Adds a cookie
WebDeveloper.Cookies.addCookie = function(cookie)
{
  var path             = cookie.path.trim();
  var cookieString     = cookie.name.trim() + "=" + cookie.value.trim() + ";path=" + path + ";";
  var cookiePreference = WebDeveloper.Preferences.getIntegerPreference("network.cookie.cookieBehavior");
  var host             = cookie.host.trim();
  var scheme           = "http://";
  var uri              = null;

  // If the host is a domain
  if(host.charAt(0) == ".")
  {
    cookieString += "domain=" + host + ";";
    host          = host.substring(1);
  }

  // If this is not a session cookie
  if(!cookie.session)
  {
    cookieString += "expires=" + new Date(cookie.expires.trim()).toUTCString() + ";";
  }

  // If the cookie is secure
  if(cookie.secure)
  {
    cookieString += "secure;";
    scheme        = "https://";
  }

  uri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(scheme + host + path, null, null);

  // If the cookie preference is not allowing all cookies
  if(cookiePreference !== 0)
  {
    WebDeveloper.Preferences.setIntegerPreference("network.cookie.cookieBehavior", 0);
  }

  Components.classes["@mozilla.org/cookieService;1"].getService().QueryInterface(Components.interfaces.nsICookieService).setCookieString(uri, null, cookieString.substring(0, cookieString.length - 1), null);

  // If the cookie preference was not allowing all cookies
  if(cookiePreference !== 0)
  {
    WebDeveloper.Preferences.setIntegerPreference("network.cookie.cookieBehavior", cookiePreference);
  }
};

// Returns true if you can edit a local cookie
WebDeveloper.Cookies.canEditLocalCookie = function()
{
  return true;
};

// Deletes a cookie
WebDeveloper.Cookies.deleteCookie = function(cookie)
{
  Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager2).remove(cookie.host, cookie.name, cookie.path, false);
};

// Returns all cookies
WebDeveloper.Cookies.getAllCookies = function()
{
  var allCookies        = [];
  var cookie            = null;
  var cookieEnumeration = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager2).enumerator;
  var cookieObject      = null;

  // Loop through the cookies
  while(cookieEnumeration.hasMoreElements())
  {
    cookie       = {};
    cookieObject = cookieEnumeration.getNext().QueryInterface(Components.interfaces.nsICookie2);

    cookie.expires  = cookieObject.expires;
    cookie.host     = cookieObject.host;
    cookie.httpOnly = cookieObject.isHttpOnly;
    cookie.name     = cookieObject.name;
    cookie.path     = cookieObject.path;
    cookie.secure   = cookieObject.isSecure;
    cookie.session  = cookieObject.isSession;
    cookie.value    = cookieObject.value;

    allCookies.push(cookie);
  }

  return allCookies;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Images = WebDeveloper.Images || {};

// Displays the file sizes for all images
WebDeveloper.Images.displayImageFileSizes = function(display, documents)
{
  var contentDocument  = null;
  var fileSizeRequests = [];
  var image            = null;
  var images           = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // If displaying the file sizes
    if(display)
    {
      images = contentDocument.images;

      // Loop through the images
      for(var j = 0, m = images.length; j < m; j++)
      {
        image = images[j];

        fileSizeRequests.push({ "fileObject": {}, "image": image, "includeUncompressed": false, "url": image.src });
      }
    }
    else
    {
      WebDeveloper.Common.removeMatchingElements(".web-developer-display-image-file-sizes", contentDocument);
    }

    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-image-file-sizes-before", contentDocument, false);
    WebDeveloper.Common.toggleStyleSheet("features/style-sheets/images/display-image-file-sizes.css", "web-developer-display-image-file-sizes", contentDocument, false);
  }

  // If display the file sizes and there are requests
  if(display && fileSizeRequests.length)
  {
    WebDeveloper.Common.getFileSizes(fileSizeRequests, function()
    {
      var bytes           = WebDeveloper.Locales.getString("bytes");
      var fileSizeRequest = null;
      var image           = null;
      var kilobytes       = WebDeveloper.Locales.getString("kilobytes");
      var spanElement     = null;
      var text            = null;

      // Loop through the file size requests
      for(i = 0, l = fileSizeRequests.length; i < l; i++)
      {
        fileSizeRequest = fileSizeRequests[i];
        image           = fileSizeRequest.image;
        contentDocument = image.ownerDocument;
        text            = WebDeveloper.Common.formatFileSize(fileSizeRequest.fileObject.size.size, bytes, kilobytes);

        // If the text is set
        if(text)
        {
          spanElement = contentDocument.createElement("span");

          spanElement.setAttribute("class", "web-developer-display-image-file-sizes");
          spanElement.appendChild(contentDocument.createTextNode(text));
          image.parentNode.insertBefore(spanElement, image);
        }
      }
    });
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay         = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Cookies = WebDeveloper.Overlay.Cookies || {};

// Adds a cookie
WebDeveloper.Overlay.Cookies.addCookie = function()
{
  window.openDialog("chrome://web-developer/content/dialogs/cookie.xul", "web-developer-cookie-dialog", "centerscreen,chrome,modal", "add");
};

// Deletes all the cookies for the current domain
WebDeveloper.Overlay.Cookies.deleteDomainCookies = function()
{
  var allCookies    = WebDeveloper.Cookies.getAllCookies();
  var documents     = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());
  var domainCookies = [];

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    // Try to get the host
    try
    {
      domainCookies = domainCookies.concat(WebDeveloper.Content.filterCookies(allCookies, documents[i].location.hostname, "/", false));
    }
    catch(exception)
    {
      // Ignore
    }
  }

  WebDeveloper.Cookies.deleteDomainCookies(domainCookies);
};

// Deletes all the cookies for the current path
WebDeveloper.Overlay.Cookies.deletePathCookies = function()
{
  var allCookies      = WebDeveloper.Cookies.getAllCookies();
  var contentDocument = null;
  var documents       = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());
  var pathCookies     = [];

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];

    // Try to get the host and path
    try
    {
      pathCookies = pathCookies.concat(WebDeveloper.Content.filterCookies(allCookies, contentDocument.location.hostname, contentDocument.location.pathname, false));
    }
    catch(exception)
    {
      // Ignore
    }
  }

  WebDeveloper.Cookies.deletePathCookies(pathCookies);
};

// Deletes all session cookies
WebDeveloper.Overlay.Cookies.deleteSessionCookies = function()
{
  WebDeveloper.Cookies.deleteSessionCookies(WebDeveloper.Cookies.getAllCookies());
};

// Toggles cookies
WebDeveloper.Overlay.Cookies.toggleCookies = function(element)
{
  var cookieBehavior = 2;

  // If enabling cookies
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    cookieBehavior = 0;
  }

  WebDeveloper.Preferences.setIntegerPreference("network.cookie.cookieBehavior", cookieBehavior);
};

// Toggles third-party cookies
WebDeveloper.Overlay.Cookies.toggleThirdPartyCookies = function(element)
{
  var cookieBehavior = 1;

  // If enabling third-party cookies
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    cookieBehavior = 0;
  }

  WebDeveloper.Preferences.setIntegerPreference("network.cookie.cookieBehavior", cookieBehavior);
};

// Updates the disable cookies menu
WebDeveloper.Overlay.Cookies.updateDisableCookiesMenu = function()
{
  var disableThirdPartyCookiesChecked = false;
  var disableThirdPartyCookiesMenu    = document.getElementById("web-developer-disable-third-party-cookies-command");
  var disableCookiesChecked           = false;
  var disableCookiesPreferenceValue   = WebDeveloper.Preferences.getIntegerPreference("network.cookie.cookieBehavior");

  // If the cookie preference value is set to 2
  if(disableCookiesPreferenceValue == 2)
  {
    disableCookiesChecked = true;
  }
  else if(disableCookiesPreferenceValue == 1)
  {
    disableThirdPartyCookiesChecked = true;
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-all-cookies-command"), "checked", disableCookiesChecked);
  WebDeveloper.Common.configureElement(disableThirdPartyCookiesMenu, "checked", disableThirdPartyCookiesChecked);
  WebDeveloper.Common.configureElement(disableThirdPartyCookiesMenu, "disabled", disableCookiesChecked);
};

// Displays all the cookies for the page
WebDeveloper.Overlay.Cookies.viewCookieInformation = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-cookie-information.html"), WebDeveloper.Content.getCookies(WebDeveloper.Cookies.getAllCookies()), WebDeveloper.Overlay.Cookies.getViewCookieInformationLocale());
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay                    = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.CSS                = WebDeveloper.Overlay.CSS || {};
WebDeveloper.Overlay.CSS.userStyleSheet = null;

// Adds a user style sheet to the page
WebDeveloper.Overlay.CSS.addUserStyleSheet = function(element)
{
  var addStyleSheet = !WebDeveloper.Common.convertToBoolean(element.getAttribute("checked"));
  var documents     = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());
  var i             = 0;
  var l             = 0;

  // If adding a style sheet
  if(addStyleSheet)
  {
    var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

    filePicker.appendFilter(WebDeveloper.Locales.getString("styleSheets"), "*.css");
    filePicker.init(window, WebDeveloper.Locales.getString("addUserStyleSheet"), filePicker.modeOpen);

    // If the user selected a style sheet
    if(filePicker.show() == filePicker.returnOK)
    {
      var inputStream      = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
      var scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);

      inputStream.init(filePicker.file, parseInt(1, 16), parseInt(444, 8), null);
      scriptableStream.init(inputStream);

      WebDeveloper.Overlay.CSS.userStyleSheet = scriptableStream.read(scriptableStream.available());

      scriptableStream.close();
      inputStream.close();
    }
    else
    {
      addStyleSheet                           = false;
      WebDeveloper.Overlay.CSS.userStyleSheet = null;
    }
  }

  // If adding a style sheet and the style sheet is not empty
  if(addStyleSheet && WebDeveloper.Overlay.CSS.userStyleSheet)
  {
    var contentDocument = null;
    var styleElement    = null;

    // Loop through the documents
    for(i = 0, l = documents.length; i < l; i++)
    {
      contentDocument = documents[i];
      styleElement    = contentDocument.createElement("style");

      styleElement.setAttribute("id", "web-developer-add-user-style-sheet");
      styleElement.appendChild(contentDocument.createTextNode(WebDeveloper.Overlay.CSS.userStyleSheet));

      WebDeveloper.Common.getDocumentHeadElement(contentDocument).appendChild(styleElement);
    }

    // If the feature is not active
    if(!WebDeveloper.Storage.isFeatureActive("add-user-style-sheet"))
    {
      WebDeveloper.Storage.toggleFeature("add-user-style-sheet");
    }
  }
  else
  {
    WebDeveloper.Overlay.CSS.userStyleSheet = null;

    // Loop through the documents
    for(i = 0, l = documents.length; i < l; i++)
    {
      WebDeveloper.Common.removeMatchingElements("#web-developer-add-user-style-sheet", documents[i]);
    }

    // If the feature is active
    if(WebDeveloper.Storage.isFeatureActive("add-user-style-sheet"))
    {
      WebDeveloper.Storage.toggleFeature("add-user-style-sheet");
    }
  }
};

// Disables all styles
WebDeveloper.Overlay.CSS.disableAllStyles = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.CSS.toggleAllStyles(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Disables the browser default styles
WebDeveloper.Overlay.CSS.disableBrowserDefaultStyles = function(element)
{
  WebDeveloper.CSS.toggleBrowserDefaultStyles(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Disables embedded styles
WebDeveloper.Overlay.CSS.disableEmbeddedStyles = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.CSS.toggleEmbeddedStyles(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Disables an individual style sheet
WebDeveloper.Overlay.CSS.disableIndividualStyleSheet = function(disableStyleSheetURL)
{
  var styleSheet    = null;
  var styleSheets   = WebDeveloper.Common.getContentDocument().styleSheets;
  var styleSheetURL = null;

  // Loop through the style sheets
  for(var i = 0, l = styleSheets.length; i < l; i++)
  {
    styleSheet    = styleSheets[i];
    styleSheetURL = styleSheet.href;

    // If this is the style sheet to disable
    if(styleSheetURL == disableStyleSheetURL)
    {
      styleSheet.disabled = !styleSheet.disabled;
    }
  }
};

// Disables inline styles
WebDeveloper.Overlay.CSS.disableInlineStyles = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.CSS.toggleInlineStyles(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Disables linked style sheets
WebDeveloper.Overlay.CSS.disableLinkedStyleSheets = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.CSS.toggleLinkedStyleSheets(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Disables print styles
WebDeveloper.Overlay.CSS.disablePrintStyles = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.CSS.togglePrintStyles(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays handheld styles
WebDeveloper.Overlay.CSS.displayHandheldStyles = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));
  var display   = !WebDeveloper.Storage.isFeatureActive(featureId);

  // If displaying handheld styles and print styles are being displayed
  if(display && WebDeveloper.Storage.isFeatureActive("display-print-styles"))
  {
    WebDeveloper.CSS.toggleMediaTypeStyles("print", false, WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
    WebDeveloper.Storage.toggleFeature("display-print-styles");
  }

  WebDeveloper.CSS.toggleMediaTypeStyles("handheld", display, WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature("display-handheld-styles");
};

// Displays print styles
WebDeveloper.Overlay.CSS.displayPrintStyles = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));
  var display   = !WebDeveloper.Storage.isFeatureActive(featureId);

  // If displaying print styles and handheld styles are being displayed
  if(display && WebDeveloper.Storage.isFeatureActive("display-handheld-styles"))
  {
    WebDeveloper.CSS.toggleMediaTypeStyles("handheld", false, WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
    WebDeveloper.Storage.toggleFeature("display-handheld-styles");
  }

  WebDeveloper.CSS.toggleMediaTypeStyles("print", display, WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature("display-print-styles");
};

// Displays style information for an element
WebDeveloper.Overlay.CSS.displayStyleInformation = function()
{
  var styleInformation = WebDeveloper.Locales.getString("styleInformation");

  // If style information is open in the dashboard
  if(WebDeveloper.Dashboard.isOpenInDashboard(styleInformation))
  {
    WebDeveloper.Dashboard.closeDashboardTab(styleInformation);
  }
  else if(WebDeveloper.Overlay.isDOMInspectorAvailable())
  {
    WebDeveloper.Dashboard.openInDashboard(styleInformation, "chrome://web-developer/content/dashboard/style-information.xul");
  }
  else
  {
    WebDeveloper.Common.displayURLMessage(WebDeveloper.Locales.getString("domInspectorRequired"), "http://chrispederick.com/work/web-developer/firefox/faq/#dom-inspector");
  }
};

// Edits the CSS of the page
WebDeveloper.Overlay.CSS.editCSS = function()
{
  var editCSS = WebDeveloper.Locales.getString("editCSS");

  // If edit CSS is open in the dashboard
  if(WebDeveloper.Dashboard.isOpenInDashboard(editCSS))
  {
    WebDeveloper.Dashboard.closeDashboardTab(editCSS);
  }
  else if(WebDeveloper.Common.pageHasFrames())
  {
    WebDeveloper.Common.displayError(editCSS, WebDeveloper.Locales.getString("framesNotSupported"));
  }
  else
  {
    WebDeveloper.Dashboard.openInDashboard(editCSS, "chrome://web-developer/content/dashboard/edit-css.xul");
  }
};

// Reloads linked style sheets
WebDeveloper.Overlay.CSS.reloadLinkedStyleSheets = function()
{
  WebDeveloper.CSS.reloadLinkedStyleSheets(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Updates the CSS menu
WebDeveloper.Overlay.CSS.updateCSSMenu = function(suffix)
{
  var command                     = document.getElementById("web-developer-edit-css-command");
  var disableAllStyles            = WebDeveloper.Storage.isFeatureActive("disable-all-styles");
  var displayStyleInformationOpen = WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("styleInformation"));
  var editCSSOpen                 = WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("editCSS"));
  var menu                        = document.getElementById("web-developer-edit-css-" + suffix);

  WebDeveloper.Common.configureElement(command, "checked", editCSSOpen);
  WebDeveloper.Common.configureElement(command, "disabled", disableAllStyles);

  // If the menu exists
  if(menu)
  {
    // If edit CSS is not open and the page has frames
    if(!editCSSOpen && WebDeveloper.Common.pageHasFrames())
    {
      menu.setAttribute("class", "menuitem-iconic");
    }
    else if(menu.hasAttribute("class"))
    {
      menu.removeAttribute("class");
    }
  }

  command = document.getElementById("web-developer-display-style-information-command");
  menu    = document.getElementById("web-developer-display-style-information-" + suffix);

  WebDeveloper.Common.configureElement(command, "checked", displayStyleInformationOpen);
  WebDeveloper.Common.configureElement(command, "disabled", disableAllStyles);

  // If the menu exists
  if(menu)
  {
    // If display style information is not open and the DOM Inspector is not found
    if(!displayStyleInformationOpen && !WebDeveloper.Overlay.isDOMInspectorAvailable())
    {
      menu.setAttribute("class", "menuitem-iconic");
    }
    else if(menu.hasAttribute("class"))
    {
      menu.removeAttribute("class");
    }
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-add-user-style-sheet-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-styles-media-type-" + suffix), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-reload-linked-style-sheets-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-use-border-box-model-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-view-css-command"), "disabled", disableAllStyles);
  WebDeveloper.Overlay.configureFeatureElement("web-developer-add-user-style-sheet-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-use-border-box-model-command", "checked");
};

// Updates the disable individual style sheet menu
WebDeveloper.Overlay.CSS.updateDisableIndividualStyleSheetMenu = function(menu)
{
  var contentDocument = WebDeveloper.Common.getContentDocument();
  var menuItem        = null;
  var styleSheet      = null;
  var styleSheets     = contentDocument.styleSheets;
  var styleSheetURL   = null;

  WebDeveloper.Overlay.removeGeneratedMenuItems(menu);

  // Loop through the style sheets
  for(var i = 0, l = styleSheets.length; i < l; i++)
  {
    styleSheet    = styleSheets[i];
    styleSheetURL = styleSheet.href;

    // If this is a valid style sheet, is not an line style sheet and is not an alternate style sheet
    if(WebDeveloper.CSS.isValidStyleSheet(styleSheet) && styleSheetURL && styleSheetURL != contentDocument.documentURI)
    {
      menuItem = document.createElement("menuitem");

      menuItem.setAttribute("class", "web-developer-generated-menu");
      menuItem.setAttribute("label", WebDeveloper.Common.removeReloadParameterFromURL(styleSheetURL));
      menuItem.setAttribute("oncommand", "WebDeveloper.Overlay.CSS.disableIndividualStyleSheet('" + styleSheetURL + "')");
      menuItem.setAttribute("type", "checkbox");

      // If the style sheet is disabled
      if(!styleSheet.disabled)
      {
        menuItem.setAttribute("checked", true);
      }

      menu.appendChild(menuItem);
    }
  }

  // If the menu has no children
  if(!menu.hasChildNodes())
  {
    menuItem = document.createElement("menuitem");

    menuItem.setAttribute("class", "webdeveloper-generated-menu");
    menuItem.setAttribute("disabled", true);
    menuItem.setAttribute("label", WebDeveloper.Locales.getString("noStyleSheets"));
    menu.appendChild(menuItem);
  }
};

// Updates the disable styles menu
WebDeveloper.Overlay.CSS.updateDisableStylesMenu = function(suffix)
{
  var disableAllStyles = WebDeveloper.Storage.isFeatureActive("disable-all-styles");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-browser-default-styles-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-embedded-styles-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-inline-styles-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-linked-style-sheets-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-print-styles-command"), "disabled", disableAllStyles);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-individual-style-sheet-" + suffix), "disabled", disableAllStyles);
  WebDeveloper.Overlay.configureFeatureElement("web-developer-disable-all-styles-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-disable-browser-default-styles-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-disable-embedded-styles-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-disable-inline-styles-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-disable-linked-style-sheets-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-disable-print-styles-command", "checked");
};

// Updates the display styles by media type menu
WebDeveloper.Overlay.CSS.updateDisplayStylesMediaTypeMenu = function()
{
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-handheld-styles-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-print-styles-command", "checked");
};

// Uses the border box model
WebDeveloper.Overlay.CSS.useBorderBoxModel = function(element)
{
  WebDeveloper.CSS.useBorderBoxModel(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Displays the CSS
WebDeveloper.Overlay.CSS.viewCSS = function()
{
  var data = WebDeveloper.Content.getCSS();

  data.theme = WebDeveloper.Preferences.getExtensionStringPreference("syntax.highlight.theme");

  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-css.html"), data, WebDeveloper.Overlay.CSS.getViewCSSLocale());
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay         = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Disable = WebDeveloper.Overlay.Disable || {};

// Toggles the cache
WebDeveloper.Overlay.Disable.toggleCache = function(element)
{
  WebDeveloper.Preferences.enablePreference(element, "browser.cache.disk.enable");
  WebDeveloper.Preferences.enablePreference(element, "browser.cache.memory.enable");
};

// Toggles the check for newer version of page setting
WebDeveloper.Overlay.Disable.toggleCheckForNewerVersionOfPage = function(frequency)
{
  WebDeveloper.Preferences.setIntegerPreference("browser.cache.check_doc_frequency", frequency);
};

// Toggles DNS cache
WebDeveloper.Overlay.Disable.toggleDNSCache = function(element)
{
  // If enabling the DNS cache
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    WebDeveloper.Preferences.deletePreference("network.dnsCacheExpiration");
  }
  else
  {
    WebDeveloper.Preferences.setIntegerPreference("network.dnsCacheExpiration", 0);
  }
};

// Toggles Java
WebDeveloper.Overlay.Disable.toggleJava = function(element)
{
  WebDeveloper.Preferences.enablePreference(element, "security.enable_java");
};

// Toggle JavaScript
WebDeveloper.Overlay.Disable.toggleJavaScript = function(element)
{
  var javaScriptButton = document.getElementById("web-developer-javascript-statusbar");

  WebDeveloper.Preferences.enablePreference(element, "javascript.enabled");

  // If the JavaScript button exists
  if(javaScriptButton)
  {
    // If enabling JavaScript
    if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
    {
      // If the JavaScript button has a class attribute
      if(javaScriptButton.hasAttribute("class"))
      {
        javaScriptButton.removeAttribute("class");
      }

      // If the JavaScript button has a tooltip text attribute
      if(javaScriptButton.hasAttribute("tooltiptext"))
      {
        javaScriptButton.removeAttribute("tooltiptext");
      }
    }
    else
    {
      javaScriptButton.setAttribute("class", "disabled");
      javaScriptButton.setAttribute("tooltiptext", WebDeveloper.Locales.getString("javaScriptDisabledTooltip"));
    }
  }
};

// Toggles meta redirects
WebDeveloper.Overlay.Disable.toggleMetaRedirects = function(element)
{
  var allowMetaRedirects = false;
  var browsers           = WebDeveloper.Common.getTabBrowser().browsers;

  // If the element is checked
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    allowMetaRedirects = true;
  }

  // Loop through the browsers
  for(var i = 0, l = browsers.length; i < l; i++)
  {
    browsers[i].docShell.allowMetaRedirects = allowMetaRedirects;
  }

  WebDeveloper.Preferences.setExtensionBooleanPreference("meta.redirects.disable", !allowMetaRedirects);
};

// Toggles the minimum font size
WebDeveloper.Overlay.Disable.toggleMinimumFontSize = function(element)
{
  var defaultFontSize = 10;
  var minimumFontSize = null;

  // If enabling the minimum font size
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    minimumFontSize = WebDeveloper.Preferences.getExtensionIntegerPreference("font.minimum.size");

    // If the minimum font size is not set
    if(minimumFontSize === 0)
    {
      minimumFontSize = defaultFontSize;
    }

    WebDeveloper.Preferences.deleteExtensionPreference("font.minimum.size");
    WebDeveloper.Preferences.setIntegerPreference("font.minimum-size.x-western", minimumFontSize);
  }
  else
  {
    minimumFontSize = WebDeveloper.Preferences.getIntegerPreference("font.minimum-size.x-western");

    // If the minimum font size is not set
    if(minimumFontSize === 0)
    {
      minimumFontSize = defaultFontSize;
    }

    WebDeveloper.Preferences.deletePreference("font.minimum-size.x-western");
    WebDeveloper.Preferences.setExtensionIntegerPreference("font.minimum.size", minimumFontSize);
  }

  BrowserReload();
};

// Toggles the page colors
WebDeveloper.Overlay.Disable.togglePageColors = function(element)
{
    WebDeveloper.Preferences.enablePreference(element, "browser.display.use_document_colors");
    BrowserReload();
};

// Toggles the proxy settings
WebDeveloper.Overlay.Disable.toggleProxy = function(proxyType)
{
  WebDeveloper.Preferences.setIntegerPreference("network.proxy.type", proxyType);
};

// Toggles referrers
WebDeveloper.Overlay.Disable.toggleReferrers = function(element)
{
  var sendReferrer = 0;

  // If enabling referrers
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    sendReferrer = 2;
  }

  WebDeveloper.Preferences.setIntegerPreference("network.http.sendRefererHeader", sendReferrer);
};

// Updates the check for newer version of page menu
WebDeveloper.Overlay.Disable.updateCheckForNewerVersionOfPageMenu = function()
{
  var checkForNewerVersionOfPageType = WebDeveloper.Preferences.getIntegerPreference("browser.cache.check_doc_frequency");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-check-for-newer-version-of-page-when-page-is-out-of-date-command"), "checked", checkForNewerVersionOfPageType == 3);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-check-for-newer-version-of-page-every-time-command"), "checked", checkForNewerVersionOfPageType == 1);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-check-for-newer-version-of-page-once-per-session-command"), "checked", checkForNewerVersionOfPageType === 0);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-never-check-for-newer-version-of-page-command"), "checked", checkForNewerVersionOfPageType == 2);
};

// Updates the disable cache menu
WebDeveloper.Overlay.Disable.updateDisableCacheMenu = function()
{
  var cacheDisabled = !WebDeveloper.Preferences.getBooleanPreference("browser.cache.disk.enable") && !WebDeveloper.Preferences.getBooleanPreference("browser.cache.memory.enable");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-entire-cache-command"), "checked", cacheDisabled);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-check-for-newer-version-of-page-command"), "disabled", cacheDisabled);
};

// Updates the disable menu
WebDeveloper.Overlay.Disable.updateDisableMenu = function()
{
  var dnsCacheDisabled  = false;
  var referrersDisabled = false;

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-java-command"), "checked", !WebDeveloper.Preferences.getBooleanPreference("security.enable_java"));
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-javascript-command"), "checked", !WebDeveloper.Preferences.getBooleanPreference("javascript.enabled"));
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-meta-redirects-command"), "checked", WebDeveloper.Preferences.getExtensionBooleanPreference("meta.redirects.disable"));
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-minimum-font-size-command"), "checked", WebDeveloper.Preferences.getIntegerPreference("font.minimum-size.x-western") === 0);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-page-colors-command"), "checked", !WebDeveloper.Preferences.getBooleanPreference("browser.display.use_document_colors"));
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-popup-blocker-command"), "checked", !WebDeveloper.Preferences.getBooleanPreference("dom.disable_open_during_load"));

  // If the DNS cache preference is set to 0
  if(WebDeveloper.Preferences.isPreferenceSet("network.dnsCacheExpiration") && WebDeveloper.Preferences.getIntegerPreference("network.dnsCacheExpiration") === 0)
  {
    dnsCacheDisabled = true;
  }

  // If the referrer preference is not set or is set to 0
  if(WebDeveloper.Preferences.isPreferenceSet("network.http.sendRefererHeader") && WebDeveloper.Preferences.getIntegerPreference("network.http.sendRefererHeader") === 0)
  {
    referrersDisabled = true;
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-dns-cache-command"), "checked", dnsCacheDisabled);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-referrers-command"), "checked", referrersDisabled);
};

// Updates the disable JavaScript menu
WebDeveloper.Overlay.Disable.updateDisableJavaScriptMenu = function()
{
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-all-javascript-command"), "checked", !WebDeveloper.Preferences.getBooleanPreference("javascript.enabled"));
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-strict-javascript-warnings-command"), "checked", !WebDeveloper.Preferences.getBooleanPreference("javascript.options.strict"));
};

// Updates the disable proxy menu
WebDeveloper.Overlay.Disable.updateDisableProxyMenu = function()
{
  var proxyType = WebDeveloper.Preferences.getIntegerPreference("network.proxy.type");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-use-auto-detect-proxy-command"), "checked", proxyType == 4);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-use-configuration-url-proxy-command"), "checked", proxyType == 2);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-use-manual-proxy-command"), "checked", proxyType == 1);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-use-no-proxy-command"), "checked", proxyType === 0);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-use-system-proxy-command"), "checked", proxyType == 5);
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay       = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Forms = WebDeveloper.Overlay.Forms || {};

// Clears all form fields
WebDeveloper.Overlay.Forms.clearFormFields = function()
{
  WebDeveloper.Forms.clearFormFields(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Clears all radio buttons
WebDeveloper.Overlay.Forms.clearRadioButtons = function()
{
  WebDeveloper.Forms.clearRadioButtons(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Converts the methods of all forms
WebDeveloper.Overlay.Forms.convertFormMethods = function(method)
{
  WebDeveloper.Forms.convertFormMethods(method, WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Converts select elements to text inputs
WebDeveloper.Overlay.Forms.convertSelectElementsToTextInputs = function()
{
  WebDeveloper.Forms.convertSelectElementsToTextInputs(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Converts text inputs to textareas
WebDeveloper.Overlay.Forms.convertTextInputsToTextareas = function()
{
  WebDeveloper.Forms.convertTextInputsToTextareas(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Displays the details about all forms
WebDeveloper.Overlay.Forms.displayFormDetails = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Forms.displayFormDetails(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays all passwords
WebDeveloper.Overlay.Forms.displayPasswords = function()
{
  WebDeveloper.Forms.displayPasswords(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Enables auto completion on all elements
WebDeveloper.Overlay.Forms.enableAutoCompletion = function()
{
  WebDeveloper.Forms.enableAutoCompletion(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Enables the form elements
WebDeveloper.Overlay.Forms.enableFormElements = function()
{
  WebDeveloper.Forms.enableFormElements(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Enables all form fields
WebDeveloper.Overlay.Forms.enableFormFields = function()
{
  WebDeveloper.Forms.enableFormFields(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Expands all select elements
WebDeveloper.Overlay.Forms.expandSelectElements = function()
{
  WebDeveloper.Forms.expandSelectElements(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Makes all form fields writable
WebDeveloper.Overlay.Forms.makeFormFieldsWritable = function()
{
  WebDeveloper.Forms.makeFormFieldsWritable(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Outlines all form fields without labels
WebDeveloper.Overlay.Forms.outlineFormFieldsWithoutLabels = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Forms.outlineFormFieldsWithoutLabels(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Populates all form fields
WebDeveloper.Overlay.Forms.populateFormFields = function()
{
  WebDeveloper.Forms.populateFormFields(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), WebDeveloper.Preferences.getExtensionStringPreference("populate.email.address"), WebDeveloper.Locales.getString("password").toLowerCase());
};

// Removes maximum lengths from all elements
WebDeveloper.Overlay.Forms.removeMaximumLengths = function()
{
  WebDeveloper.Forms.removeMaximumLengths(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Toggles all the checkboxes on the page
WebDeveloper.Overlay.Forms.toggleCheckboxes = function(check)
{
  WebDeveloper.Forms.toggleCheckboxes(check, WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Updates the forms menu
WebDeveloper.Overlay.Forms.updateFormsMenu = function()
{
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-form-details-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-form-fields-without-labels-command", "checked");
};

// Displays information about all forms
WebDeveloper.Overlay.Forms.viewFormInformation = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-form-information.html"), WebDeveloper.Content.getForms(), WebDeveloper.Overlay.Forms.getViewFormInformationLocale());
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay        = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Images = WebDeveloper.Overlay.Images || {};

// Disables external site images
WebDeveloper.Overlay.Images.disableExternalSiteImages = function(element)
{
  var imageBehavior = 3;

  // If enabling external images
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    imageBehavior = 1;
  }

  WebDeveloper.Preferences.setIntegerPreference("permissions.default.image", imageBehavior);
  BrowserReload();
};

// Disables image animations
WebDeveloper.Overlay.Images.disableImageAnimations = function(element)
{
  var imageBehavior = "none";

  // If enabling images
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    imageBehavior = "normal";
  }

  WebDeveloper.Preferences.setStringPreference("image.animation_mode", imageBehavior);
  BrowserReload();
};

// Disables images
WebDeveloper.Overlay.Images.disableImages = function(element)
{
  var imageBehavior = 2;

  // If enabling images
  if(WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    imageBehavior = 1;
  }

  WebDeveloper.Preferences.setIntegerPreference("permissions.default.image", imageBehavior);
  BrowserReload();
};

// Displays alt attributes for all images
WebDeveloper.Overlay.Images.displayAltAttributes = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.displayAltAttributes(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the dimensions for all images
WebDeveloper.Overlay.Images.displayImageDimensions = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));
  var locale    = WebDeveloper.Locales.setupGeneratedLocale();

  locale.height = WebDeveloper.Locales.getString("height");
  locale.width  = WebDeveloper.Locales.getString("width");

  WebDeveloper.Images.displayImageDimensions(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), locale);
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the file sizes for all images
WebDeveloper.Overlay.Images.displayImageFileSizes = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.displayImageFileSizes(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the paths for all images
WebDeveloper.Overlay.Images.displayImagePaths = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.displayImagePaths(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Finds all the broken images on a page
WebDeveloper.Overlay.Images.findBrokenImages = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.brokenImage  = WebDeveloper.Locales.getString("brokenImage");
  locale.brokenImages = WebDeveloper.Locales.getString("brokenImages");

  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/find-broken-images.html"), WebDeveloper.Content.getBrokenImages(), locale);
};

// Hides the background images in a document
WebDeveloper.Overlay.Images.hideBackgroundImages = function(element)
{
  WebDeveloper.Images.hideBackgroundImages(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Hides the images
WebDeveloper.Overlay.Images.hideImages = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.hideImages(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Makes all images full size
WebDeveloper.Overlay.Images.makeImagesFullSize = function()
{
  WebDeveloper.Images.makeImagesFullSize(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Makes all images invisible
WebDeveloper.Overlay.Images.makeImagesInvisible = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.makeImagesInvisible(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Outlines all images
WebDeveloper.Overlay.Images.outlineAllImages = function(element)
{
  WebDeveloper.Images.outlineAllImages(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all background images
WebDeveloper.Overlay.Images.outlineBackgroundImages = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.outlineBackgroundImages(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Outlines all images with adjusted dimensions
WebDeveloper.Overlay.Images.outlineImagesWithAdjustedDimensions = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.outlineImagesWithAdjustedDimensions(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Outlines all images with empty alt attributes
WebDeveloper.Overlay.Images.outlineImagesWithEmptyAltAttributes = function(element)
{
  WebDeveloper.Images.outlineImagesWithEmptyAltAttributes(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all images with oversized dimensions
WebDeveloper.Overlay.Images.outlineImagesWithOversizedDimensions = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.outlineImagesWithOversizedDimensions(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Outlines all images without alt attributes
WebDeveloper.Overlay.Images.outlineImagesWithoutAltAttributes = function(element)
{
  WebDeveloper.Images.outlineImagesWithoutAltAttributes(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all images without dimensions
WebDeveloper.Overlay.Images.outlineImagesWithoutDimensions = function(element)
{
  WebDeveloper.Images.outlineImagesWithEmptyAltAttributes(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Reloads images
WebDeveloper.Overlay.Images.reloadImages = function()
{
  WebDeveloper.Images.reloadImages(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Replaces all images with alt attributes
WebDeveloper.Overlay.Images.replaceImagesWithAltAttributes = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Images.replaceImagesWithAltAttributes(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Updates the disable images menu
WebDeveloper.Overlay.Images.updateDisableImagesMenu = function()
{
  var disableImageAnimations        = false;
  var disableImageAnimationsMenu    = document.getElementById("web-developer-disable-image-animations-command");
  var disableExternalSiteImages     = false;
  var disableExternalSiteImagesMenu = document.getElementById("web-developer-disable-external-site-images-command");
  var disableImages                 = false;
  var disableImagesPreference       = WebDeveloper.Preferences.getIntegerPreference("permissions.default.image");

  // If the image preference is set to 2
  if(disableImagesPreference == 2)
  {
    disableImages = true;
  }
  else if(disableImagesPreference == 3)
  {
    disableExternalSiteImages = true;
  }

  // If the image animation preference is set to none
  if(WebDeveloper.Preferences.getStringPreference("image.animation_mode") == "none")
  {
    disableImageAnimations = true;
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-disable-all-images-command"), "checked", disableImages);
  WebDeveloper.Common.configureElement(disableExternalSiteImagesMenu, "checked", disableExternalSiteImages);
  WebDeveloper.Common.configureElement(disableExternalSiteImagesMenu, "disabled", disableImages);
  WebDeveloper.Common.configureElement(disableImageAnimationsMenu, "checked", disableImageAnimations);
  WebDeveloper.Common.configureElement(disableImageAnimationsMenu, "disabled", disableImages);
};

// Updates the images menu
WebDeveloper.Overlay.Images.updateImagesMenu = function(suffix)
{
  var disableImages = (WebDeveloper.Preferences.getIntegerPreference("permissions.default.image") == 2);

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-alt-attributes-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-image-dimensions-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-image-file-sizes-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-image-paths-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-find-broken-images-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-hide-background-images-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-hide-images-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-make-images-full-size-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-make-images-invisible-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-outline-images-" + suffix), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-reload-images-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-replace-images-with-alt-attributes-command"), "disabled", disableImages);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-view-image-information-command"), "disabled", disableImages);
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-alt-attributes-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-image-dimensions-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-image-file-sizes-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-image-paths-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-hide-background-images-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-hide-images-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-replace-images-with-alt-attributes-command", "checked");
};

// Updates the outline images menu
WebDeveloper.Overlay.Images.updateOutlineImagesMenu = function()
{
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-all-images-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-background-images-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-images-with-adjusted-dimensions-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-images-with-empty-alt-attributes-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-images-with-oversized-dimensions-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-images-without-alt-attributes-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-images-without-dimensions-command", "checked");
};

// Displays all the images
WebDeveloper.Overlay.Images.viewImageInformation = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-image-information.html"), WebDeveloper.Content.getImages(), WebDeveloper.Overlay.Images.getViewImageInformationLocale());
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay             = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Information = WebDeveloper.Overlay.Information || {};

// Displays the abbreviations on a page
WebDeveloper.Overlay.Information.displayAbbreviations = function(element)
{
  WebDeveloper.Information.displayAbbreviations(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Displays the access keys on a page
WebDeveloper.Overlay.Information.displayAccessKeys = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayAccessKeys(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the anchors on a page
WebDeveloper.Overlay.Information.displayAnchors = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayAnchors(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the ARIA roles on a page
WebDeveloper.Overlay.Information.displayARIARoles = function(element)
{
  WebDeveloper.Information.displayARIARoles(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Displays the order of the divs on a page
WebDeveloper.Overlay.Information.displayDivOrder = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayDivOrder(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the dimensions of the divs on a page
WebDeveloper.Overlay.Information.displayDivDimensions = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));
  var locale    = WebDeveloper.Locales.setupGeneratedLocale();

  locale.height = WebDeveloper.Locales.getString("height");
  locale.width  = WebDeveloper.Locales.getString("width");

  WebDeveloper.Information.displayDivDimensions(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), locale);
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays information about the selected element
WebDeveloper.Overlay.Information.displayElementInformation = function()
{
  var elementInformation = WebDeveloper.Locales.getString("elementInformation");

  // If element information is open in the dashboard
  if(WebDeveloper.Dashboard.isOpenInDashboard(elementInformation))
  {
    WebDeveloper.Dashboard.closeDashboardTab(elementInformation);
  }
  else
  {
    WebDeveloper.Dashboard.openInDashboard(elementInformation, "chrome://web-developer/content/dashboard/element-information.xul");
  }
};

// Displays the id and class details for a page
WebDeveloper.Overlay.Information.displayIdClassDetails = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayIdClassDetails(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the details for the links on a page
WebDeveloper.Overlay.Information.displayLinkDetails = function(element)
{
  WebDeveloper.Information.displayLinkDetails(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Displays the information for objects on a page
WebDeveloper.Overlay.Information.displayObjectInformation = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayObjectInformation(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the stack levels on a page
WebDeveloper.Overlay.Information.displayStackLevels = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayStackLevels(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the tab indices on a page
WebDeveloper.Overlay.Information.displayTabIndex = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayTabIndex(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the depth of all tables on a page
WebDeveloper.Overlay.Information.displayTableDepth = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayTableDepth(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), WebDeveloper.Locales.getString("depth"));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the information for tables on a page
WebDeveloper.Overlay.Information.displayTableInformation = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayTableInformation(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the title attributes on a page
WebDeveloper.Overlay.Information.displayTitleAttributes = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Information.displayTitleAttributes(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Displays the topographic information for a page
WebDeveloper.Overlay.Information.displayTopographicInformation = function(element)
{
  WebDeveloper.Information.displayTopographicInformation(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Finds all the duplicate ids on a page
WebDeveloper.Overlay.Information.findDuplicateIds = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.duplicateId  = WebDeveloper.Locales.getString("duplicateId");
  locale.duplicateIds = WebDeveloper.Locales.getString("duplicateIds");

  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/find-duplicate-ids.html"), WebDeveloper.Content.getDuplicateIds(), locale);
};

// Updates the information menu
WebDeveloper.Overlay.Information.updateInformationMenu = function()
{
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-abbreviations-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-access-keys-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-anchors-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-div-order", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-div-size", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-id-class-details-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-link-details-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-object-information-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-stack-levels-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-tab-index-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-table-depth-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-table-information-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-title-attributes-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-topographic-information-command", "checked");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-element-information-command"), "checked", WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("elementInformation")));
};

// Displays the anchor information for a page
WebDeveloper.Overlay.Information.viewAnchorInformation = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-anchor-information.html"), WebDeveloper.Content.getAnchors(), WebDeveloper.Overlay.Information.getViewAnchorInformationLocale());
};

// Displays the color information for a page
WebDeveloper.Overlay.Information.viewColorInformation = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-color-information.html"), WebDeveloper.Content.getColors(), WebDeveloper.Overlay.Information.getViewColorInformationLocale());
};

// Displays the document outline
WebDeveloper.Overlay.Information.viewDocumentOutline = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-document-outline.html"), WebDeveloper.Content.getDocumentOutline(), WebDeveloper.Overlay.Information.getViewDocumentOutlineLocale());
};

// Displays the document size
WebDeveloper.Overlay.Information.viewDocumentSize = function()
{
  var locale = WebDeveloper.Locales.setupGeneratedLocale();

  locale.bytes            = WebDeveloper.Locales.getString("bytes");
  locale.document         = WebDeveloper.Locales.getString("document");
  locale.documents        = WebDeveloper.Locales.getString("documents");
  locale.documentSize     = WebDeveloper.Locales.getString("documentSize");
  locale.file             = WebDeveloper.Locales.getString("file");
  locale.files            = WebDeveloper.Locales.getString("files");
  locale.image            = WebDeveloper.Locales.getString("image");
  locale.images           = WebDeveloper.Locales.getString("images");
  locale.kilobytes        = WebDeveloper.Locales.getString("kilobytes");
  locale.object           = WebDeveloper.Locales.getString("object");
  locale.objects          = WebDeveloper.Locales.getString("objects");
  locale.script           = WebDeveloper.Locales.getString("script");
  locale.scripts          = WebDeveloper.Locales.getString("scripts");
  locale.size             = WebDeveloper.Locales.getString("size");
  locale.styleSheet       = WebDeveloper.Locales.getString("styleSheet");
  locale.styleSheets      = WebDeveloper.Locales.getString("styleSheets");
  locale.uncompressedSize = WebDeveloper.Locales.getString("uncompressedSize");

  WebDeveloper.Content.getDocumentSize(function(data)
  {
    WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-document-size.html"), data, locale);
  });
};

// Displays the JavaScript
WebDeveloper.Overlay.Information.viewJavaScript = function()
{
  var data = WebDeveloper.Content.getJavaScript();

  data.theme = WebDeveloper.Preferences.getExtensionStringPreference("syntax.highlight.theme");

  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-javascript.html"), data, WebDeveloper.Overlay.Information.getViewJavaScriptLocale());
};

// Displays the link information for a page
WebDeveloper.Overlay.Information.viewLinkInformation = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-link-information.html"), WebDeveloper.Content.getLinks(), WebDeveloper.Overlay.Information.getViewLinkInformationLocale());
};

// Displays the meta tag information for a page
WebDeveloper.Overlay.Information.viewMetaTagInformation = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-meta-tag-information.html"), WebDeveloper.Content.getMetaTags(), WebDeveloper.Overlay.Information.getViewMetaTagInformationLocale());
};

// View page information
WebDeveloper.Overlay.Information.viewPageInformation = function()
{
  BrowserPageInfo(null);
};

// Displays the response headers
WebDeveloper.Overlay.Information.viewResponseHeaders = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-response-headers.html"), WebDeveloper.Content.getDocumentDetails(), WebDeveloper.Overlay.Information.getViewResponseHeadersLocale());
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay               = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Miscellaneous = WebDeveloper.Overlay.Miscellaneous || {};

// Adds an href to the history
WebDeveloper.Overlay.Miscellaneous.addToHistory = function(uri)
{
  var globalHistory = Components.classes["@mozilla.org/browser/global-history;2"].getService(Components.interfaces.nsIGlobalHistory2);

  // If the URI is not already in the history
  if(!globalHistory.isVisited(uri))
  {
    globalHistory.addURI(uri, false, false, null);
  }
};

// Clears all private data
WebDeveloper.Overlay.Miscellaneous.clearAllPrivateData = function()
{
  Components.classes["@mozilla.org/browser/browserglue;1"].getService(Components.interfaces.nsIBrowserGlue).sanitize(window || null);
};

// Clears the cache
WebDeveloper.Overlay.Miscellaneous.clearCache = function()
{
  // If the clearing is confirmed
  WebDeveloper.Overlay.displayConfirmation(WebDeveloper.Locales.getString("clearCache"), WebDeveloper.Locales.getString("clearCacheConfirmation"), WebDeveloper.Locales.getString("clear"), null, function()
  {
    var cacheInterface = Components.interfaces.nsICache;
    var cacheService   = Components.classes["@mozilla.org/network/cache-service;1"].getService(Components.interfaces.nsICacheService);

    try
    {
      cacheService.evictEntries(cacheInterface.STORE_ANYWHERE);

      WebDeveloper.Common.displayNotification("clearCacheResult");
    }
    catch(exception)
    {
      // Ignore
    }
  });
};

// Clears the history
WebDeveloper.Overlay.Miscellaneous.clearHistory = function()
{
  // If the clearing is confirmed
  WebDeveloper.Overlay.displayConfirmation(WebDeveloper.Locales.getString("clearHistory"), WebDeveloper.Locales.getString("clearHistoryConfirmation"), WebDeveloper.Locales.getString("clear"), null, function()
  {
    WebDeveloper.Overlay.Miscellaneous.removeAllFromHistory();

    WebDeveloper.Common.displayNotification("clearHistoryResult");
  });
};

// Clears the HTTP authentication
WebDeveloper.Overlay.Miscellaneous.clearHTTPAuthentication = function()
{
  // If the clearing is confirmed
  WebDeveloper.Overlay.displayConfirmation(WebDeveloper.Locales.getString("clearHTTPAuthentication"), WebDeveloper.Locales.getString("clearHTTPAuthenticationConfirmation"), WebDeveloper.Locales.getString("clear"), null, function()
  {
    var authenticationManager = Components.classes["@mozilla.org/network/http-auth-manager;1"].getService(Components.interfaces.nsIHttpAuthManager);

    authenticationManager.clearAll();

    WebDeveloper.Common.displayNotification("clearHTTPAuthenticationResult");
  });
};

// Displays all hidden elements
WebDeveloper.Overlay.Miscellaneous.displayHiddenElements = function()
{
  WebDeveloper.Miscellaneous.displayHiddenElements(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Displays line guides
WebDeveloper.Overlay.Miscellaneous.displayLineGuides = function(element)
{
  // If the page has frames
  if(WebDeveloper.Common.pageHasFrames())
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("displayLineGuides"), WebDeveloper.Locales.getString("framesNotSupported"));
  }
  else
  {
    var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

    WebDeveloper.LineGuides.displayLineGuides(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Common.getContentDocument());
    WebDeveloper.Storage.toggleFeature(featureId);
  }
};

// Displays a page magnifier
WebDeveloper.Overlay.Miscellaneous.displayPageMagnifier = function(element)
{
  // If the page has frames
  if(WebDeveloper.Common.pageHasFrames())
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("displayPageMagnifier"), WebDeveloper.Locales.getString("framesNotSupported"));
  }
  else
  {
    var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

    WebDeveloper.PageMagnifier.displayPageMagnifier(!WebDeveloper.Storage.isFeatureActive(featureId));
    WebDeveloper.Storage.toggleFeature(featureId);
  }
};

// Displays a ruler
WebDeveloper.Overlay.Miscellaneous.displayRuler = function(element)
{
  // If the page has frames
  if(WebDeveloper.Common.pageHasFrames())
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("displayRuler"), WebDeveloper.Locales.getString("framesNotSupported"));
  }
  else
  {
    var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

    WebDeveloper.Ruler.displayRuler(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Common.getContentDocument());
    WebDeveloper.Storage.toggleFeature(featureId);
  }
};

// Edits the HTML of the page
WebDeveloper.Overlay.Miscellaneous.editHTML = function()
{
  var editHTML = WebDeveloper.Locales.getString("editHTML");

  // If edit HTML is open in the dashboard
  if(WebDeveloper.Dashboard.isOpenInDashboard(editHTML))
  {
    WebDeveloper.Dashboard.closeDashboardTab(editHTML);
  }
  else if(WebDeveloper.Common.pageHasFrames())
  {
    WebDeveloper.Common.displayError(editHTML, WebDeveloper.Locales.getString("framesNotSupported"));
  }
  else
  {
    WebDeveloper.Dashboard.openInDashboard(editHTML, WebDeveloper.Common.getChromeURL("dashboard/edit-html.xul"));
  }
};

// Linearizes the page
WebDeveloper.Overlay.Miscellaneous.linearizePage = function(element)
{
  WebDeveloper.Miscellaneous.linearizePage(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Makes all frames resizable
WebDeveloper.Overlay.Miscellaneous.makeFramesResizable = function()
{
  WebDeveloper.Miscellaneous.makeFramesResizable(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
};

// Removes an href from the history
WebDeveloper.Overlay.Miscellaneous.removeFromHistory = function(uri)
{
  // If the URI is in the history
  if(Components.classes["@mozilla.org/browser/global-history;2"].getService(Components.interfaces.nsIGlobalHistory2).isVisited(uri))
  {
    Components.classes["@mozilla.org/browser/global-history;2"].getService(Components.interfaces.nsIBrowserHistory).removePage(uri);
  }
};

// Clears the history
WebDeveloper.Overlay.Miscellaneous.removeAllFromHistory = function()
{
  Components.classes["@mozilla.org/browser/global-history;2"].getService(Components.interfaces.nsIBrowserHistory).removeAllPages();
};

// Toggles all links on the page between visited and unvisited
WebDeveloper.Overlay.Miscellaneous.toggleVisitedLinks = function(visited)
{
  var documents = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());
  var href      = null;
  var link      = null;
  var links     = null;
  var uri       = null;

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    links = documents[i].links;

    // Loop through all the links
    for(var j = 0, m = links.length; j < m; j++)
    {
      link = links[j];
      href = link.href;

      // If this link has an href
      if(href)
      {
        uri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(href, null, null);

        // If marking links as visited
        if(visited)
        {
          WebDeveloper.Overlay.Miscellaneous.addToHistory(uri);
        }
        else
        {
          WebDeveloper.Overlay.Miscellaneous.removeFromHistory(uri);
        }

        // Force the browser to recheck the history by changing the href
        link.href = "";
        link.href = href;
      }
    }
  }
};

// Updates the miscellaneous menu
WebDeveloper.Overlay.Miscellaneous.updateMiscellaneousMenu = function(suffix)
{
  var command       = document.getElementById("web-developer-edit-html-command");
  var editHTMLOpen  = WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("editHTML"));
  var menu          = document.getElementById("web-developer-edit-html-" + suffix);
  var pageHasFrames = WebDeveloper.Common.pageHasFrames();

  WebDeveloper.Common.configureElement(command, "checked", editHTMLOpen);

  // If the menu exists
  if(menu)
  {
    // If edit HTML is not open and the page has frames
    if(!editHTMLOpen && pageHasFrames)
    {
      menu.setAttribute("class", "menuitem-iconic");
    }
    else if(menu.hasAttribute("class"))
    {
      menu.removeAttribute("class");
    }
  }

  menu = document.getElementById("web-developer-display-line-guides-" + suffix);

  // If the menu exists
  if(menu)
  {
    // If the page has frames
    if(pageHasFrames)
    {
      menu.setAttribute("class", "menuitem-iconic");
    }
    else if(menu.hasAttribute("class"))
    {
      menu.removeAttribute("class");
    }
  }

  menu = document.getElementById("web-developer-display-page-magnifier-" + suffix);

  // If the menu exists
  if(menu)
  {
    var canvas = document.getElementById("web-developer-page-magnifier");

    // If the canvas is not set or has no context
    if(!canvas || !canvas.getContext)
    {
      menu.setAttribute("class", "menuitem-iconic");
    }
    else if(menu.hasAttribute("class"))
    {
      menu.removeAttribute("class");
    }
  }

  menu = document.getElementById("web-developer-display-ruler-" + suffix);

  // If the menu exists
  if(menu)
  {
    // If the page has frames
    if(pageHasFrames)
    {
      menu.setAttribute("class", "menuitem-iconic");
    }
    else if(menu.hasAttribute("class"))
    {
      menu.removeAttribute("class");
    }
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-page-magnifier-command"), "checked", !document.getElementById("web-developer-page-magnifier-toolbar").hidden);
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-line-guides-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-ruler-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-linearize-page-command", "checked");
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay         = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Options = WebDeveloper.Overlay.Options || {};

// Displays the about dialog
WebDeveloper.Overlay.Options.about = function()
{
  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("about/about.html"), null, WebDeveloper.Overlay.Options.getAboutLocale());
};

WebDeveloper.Overlay.Options.generateCommandMenu = function(commandId)
{
  var command  = document.getElementById(commandId);
  var menuItem = null;

  // If the command is set
  if(command)
  {
    menuItem = document.createElement("menuitem");

    menuItem.setAttribute("class", "web-developer-generated-menu");
    menuItem.setAttribute("label", command.getAttribute("label"));
    menuItem.setAttribute("command", commandId);
    menuItem.setAttribute("type", "checkbox");
  }

  return menuItem;
};

// Opens the help
WebDeveloper.Overlay.Options.help = function()
{
  WebDeveloper.Common.openURL("http://chrispederick.com/work/web-developer/firefox/help/");
};

// Displays the options dialog
WebDeveloper.Overlay.Options.options = function(openPane)
{
  // If an open pane is set
  if(openPane)
  {
    window.openDialog("chrome://web-developer/content/options/options.xul", "web-developer-options-dialog", "centerscreen,chrome,dialog=yes,titlebar,toolbar", openPane);
  }
  else
  {
    window.openDialog("chrome://web-developer/content/options/options.xul", "web-developer-options-dialog", "centerscreen,chrome,dialog=yes,titlebar,toolbar");
  }
};

// Resets the page
WebDeveloper.Overlay.Options.resetPage = function()
{
  var tabFeature = WebDeveloper.Locales.getString("elementInformation");

  WebDeveloper.Overlay.toggleFeatures(WebDeveloper.Common.getTabBrowser().selectedTab, true);

  // If the display element information feature is active
  if(WebDeveloper.Dashboard.isOpenInDashboard(tabFeature))
  {
    WebDeveloper.Dashboard.closeDashboardTab(tabFeature);
  }

  tabFeature = WebDeveloper.Locales.getString("styleInformation");

  // If the display style information feature is active
  if(WebDeveloper.Dashboard.isOpenInDashboard(tabFeature))
  {
    WebDeveloper.Dashboard.closeDashboardTab(tabFeature);
  }

  tabFeature = WebDeveloper.Locales.getString("editCSS");

  // If the edit CSS feature is active
  if(WebDeveloper.Dashboard.isOpenInDashboard(tabFeature))
  {
    WebDeveloper.Dashboard.closeDashboardTab(tabFeature);
  }

  tabFeature = WebDeveloper.Locales.getString("editHTML");

  // If the edit HTML feature is active
  if(WebDeveloper.Dashboard.isOpenInDashboard(tabFeature))
  {
    WebDeveloper.Dashboard.closeDashboardTab(tabFeature);
  }
};

// Updates the active features menu
WebDeveloper.Overlay.Options.updateActiveFeaturesMenu = function(menu)
{
  var activeFeatures = WebDeveloper.Storage.getFeatures(WebDeveloper.Common.getTabBrowser().selectedTab);
  var menuItem       = null;
  var separator      = menu.getElementsByTagName("menuseparator")[0];

  WebDeveloper.Overlay.removeGeneratedMenuItems(menu);

  // If the separator exists
  if(separator)
  {
    // If there are active features
    if(activeFeatures)
    {
      activeFeatures.sort();

      // Loop through the active features
      for(var i = 0, l = activeFeatures.length; i < l; i++)
      {
        menuItem = WebDeveloper.Overlay.Options.generateCommandMenu(WebDeveloper.Common.getCommandId(activeFeatures[i]));

        // If the menu item is set
        if(menuItem)
        {
          menu.insertBefore(menuItem, separator);
        }
      }
    }

    // If the edit CSS feature is active
    if(WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("editCSS")))
    {
      menuItem = WebDeveloper.Overlay.Options.generateCommandMenu("web-developer-edit-css-command");

      // If the menu item is set
      if(menuItem)
      {
        menu.insertBefore(menuItem, separator);
      }
    }

    // If the edit HTML feature is active
    if(WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("editHTML")))
    {
      menuItem = WebDeveloper.Overlay.Options.generateCommandMenu("web-developer-edit-html-command");

      // If the menu item is set
      if(menuItem)
      {
        menu.insertBefore(menuItem, separator);
      }
    }

    // If the element information feature is active
    if(WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("elementInformation")))
    {
      menuItem = WebDeveloper.Overlay.Options.generateCommandMenu("web-developer-display-element-information-command");

      // If the menu item is set
      if(menuItem)
      {
        menu.insertBefore(menuItem, separator);
      }
    }

    // If the style information feature is active
    if(WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("styleInformation")))
    {
      menuItem = WebDeveloper.Overlay.Options.generateCommandMenu("web-developer-display-style-information-command");

      // If the menu item is set
      if(menuItem)
      {
        menu.insertBefore(menuItem, separator);
      }
    }
  }
};

// Updates the options menu
WebDeveloper.Overlay.Options.updateOptionsMenu = function(suffix)
{
  var activeFeatures = WebDeveloper.Storage.hasFeatures();

  // If there are no active features
  if(!activeFeatures)
  {
    activeFeatures = WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("editCSS"));
  }

  // If there are no active features
  if(!activeFeatures)
  {
    activeFeatures = WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("editHTML"));
  }

  // If there are no active features
  if(!activeFeatures)
  {
    activeFeatures = WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("elementInformation"));
  }

  // If there are no active features
  if(!activeFeatures)
  {
    activeFeatures = WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("styleInformation"));
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-active-features-" + suffix), "disabled", !activeFeatures);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-pin-features-command"), "checked", WebDeveloper.Preferences.getExtensionBooleanPreference("pin.features"));
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay         = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Outline = WebDeveloper.Overlay.Outline || {};

// Outlines all block level elements
WebDeveloper.Overlay.Outline.outlineBlockLevelElements = function(element)
{
  WebDeveloper.Outline.outlineBlockLevelElements(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), WebDeveloper.Preferences.getExtensionBooleanPreference("outline.show.element.tag.names"));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines the specified elements
WebDeveloper.Overlay.Outline.outlineCustomElements = function(element)
{
  var elementId = element.getAttribute("id");
  var featureId = WebDeveloper.Common.getFeatureId(elementId);

  // If custom elements are already being outlined
  if(WebDeveloper.Storage.isFeatureActive(featureId))
  {
    var contentDocument = null;
    var documents       = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());

    // Loop through the documents
    for(var i = 0, l = documents.length; i < l; i++)
    {
      contentDocument = documents[i];

      WebDeveloper.Common.removeMatchingElements("#web-developer-outline-custom-elements", contentDocument);

      // If showing element tag names
      if(WebDeveloper.Preferences.getExtensionBooleanPreference("outline.show.element.tag.names"))
      {
        WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-custom-elements-before", contentDocument, false);
      }
    }

    WebDeveloper.Storage.toggleFeature(featureId);
  }
  else
  {
    window.openDialog("chrome://web-developer/content/dialogs/outline-custom-elements.xul", "web-developer-outline-dialog", "centerscreen,chrome,modal", featureId);
  }
};

// Outlines all deprecated elements
WebDeveloper.Overlay.Outline.outlineDeprecatedElements = function(element)
{
  WebDeveloper.Outline.outlineDeprecatedElements(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), WebDeveloper.Preferences.getExtensionBooleanPreference("outline.show.element.tag.names"));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all external links
WebDeveloper.Overlay.Outline.outlineExternalLinks = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Outline.outlineExternalLinks(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Outlines all floated elements
WebDeveloper.Overlay.Outline.outlineFloatedElements = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Outline.outlineFloatedElements(!WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Outlines all frames
WebDeveloper.Overlay.Outline.outlineFrames = function(element)
{
  WebDeveloper.Outline.outlineFrames(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all headings
WebDeveloper.Overlay.Outline.outlineHeadings = function(element)
{
  WebDeveloper.Outline.outlineHeadings(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), WebDeveloper.Preferences.getExtensionBooleanPreference("outline.show.element.tag.names"));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all non-secure elements
WebDeveloper.Overlay.Outline.outlineNonSecureElements = function(element)
{
  WebDeveloper.Outline.outlineNonSecureElements(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all positioned elements
WebDeveloper.Overlay.Outline.outlinePositionedElements = function(positionType, element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.Outline.outlinePositionedElements(positionType, !WebDeveloper.Storage.isFeatureActive(featureId), WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Outlines all tables
WebDeveloper.Overlay.Outline.outlineTables = function(element)
{
  WebDeveloper.Outline.outlineTables(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all table captions
WebDeveloper.Overlay.Outline.outlineTableCaptions = function(element)
{
  WebDeveloper.Outline.outlineTableCaptions(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Outlines all table cells
WebDeveloper.Overlay.Outline.outlineTableCells = function(element)
{
  WebDeveloper.Outline.outlineTableCells(WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()), WebDeveloper.Preferences.getExtensionBooleanPreference("outline.show.element.tag.names"));
  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Toggles whether to show element tag names when outlining
WebDeveloper.Overlay.Outline.toggleShowElementTagNames = function(element)
{
  WebDeveloper.Preferences.disableExtensionPreference(element, "outline.show.element.tag.names");
};

// Updates the outline menu
WebDeveloper.Overlay.Outline.updateOutlineMenu = function()
{
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-block-level-elements-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-custom-elements-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-deprecated-elements-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-external-links-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-floated-elements-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-frames-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-headings-command", "checked");
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-outline-show-element-tag-names-command"), "checked", WebDeveloper.Preferences.getExtensionBooleanPreference("outline.show.element.tag.names"));
};

// Updates the outline positioned elements menu
WebDeveloper.Overlay.Outline.updateOutlinePositionedElementsMenu = function()
{
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-absolute-positioned-elements-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-fixed-positioned-elements-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-relative-positioned-elements-command", "checked");
};

// Updates the outline tables menu
WebDeveloper.Overlay.Outline.updateOutlineTablesMenu = function()
{
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-all-tables-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-table-captions-command", "checked");
  WebDeveloper.Overlay.configureFeatureElement("web-developer-outline-table-cells-command", "checked");
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay                  = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.featureSuffixes  = ["app-menu", "context", "menu", "toolbar", "toolbar-button"];
WebDeveloper.Overlay.preferenceBranch = null;

// Closes the confirmation
WebDeveloper.Overlay.closeConfirmation = function()
{
  // Ignore
};

// Configures an element for a feature
WebDeveloper.Overlay.configureFeatureElement = function(id, attribute)
{
  WebDeveloper.Common.configureElement(document.getElementById(id), attribute, WebDeveloper.Storage.isFeatureActive(WebDeveloper.Common.getFeatureId(id)));
};

// Displays a confirmation dialog
WebDeveloper.Overlay.displayConfirmation = function(title, message, buttonText, buttonIcon, callback)
{
  // If the hide confirmation dialogs preference is set
  if(WebDeveloper.Preferences.getExtensionBooleanPreference("confirmation.dialogs.hide"))
  {
    callback();
  }
  else
  {
    var checkBox      = {value: false};
    var promptService = Components.interfaces.nsIPromptService;
    var result        = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(promptService).confirmEx(null, title, message, promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_0 + promptService.BUTTON_TITLE_CANCEL * promptService.BUTTON_POS_1, buttonText, null, null, WebDeveloper.Locales.getString("stopConfirmation"), checkBox);

    // If the check box was checked
    if(checkBox.value)
    {
      WebDeveloper.Preferences.setExtensionBooleanPreference("confirmation.dialogs.hide", true);
    }

    // If the question was confirmed
    if(result === 0)
    {
      callback();
    }
  }
};

// Initializes the extension
WebDeveloper.Overlay.initialize = function()
{
  // Try to get the tab browser
  try
  {
    var tabBrowser = WebDeveloper.Common.getTabBrowser();

    // If the tab browser is set
    if(tabBrowser)
    {
      var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService().QueryInterface(Components.interfaces.nsIConsoleService);
      var tabContainer   = tabBrowser.tabContainer;

      WebDeveloper.Overlay.preferenceBranch = WebDeveloper.Preferences.getExtensionBranch().QueryInterface(Components.interfaces.nsIPrefBranch2);

      WebDeveloper.Upgrade.upgrade();
      WebDeveloper.Overlay.setupKeyboardShortcuts();
      WebDeveloper.Overlay.updateChrome();

      tabBrowser.addEventListener("load", WebDeveloper.Overlay.pageLoad, true);
      tabBrowser.addEventListener("unload", WebDeveloper.Overlay.pageUnload, true);

      // If the tab container is set
      if(tabContainer)
      {
        tabContainer.addEventListener("TabSelect", WebDeveloper.Overlay.tabSelect, false);
      }

      // If the console service is set
      if(consoleService)
      {
        consoleService.registerListener(WebDeveloper.Overlay.ErrorConsoleListener);
      }

      // If the preference branch is set
      if(WebDeveloper.Overlay.preferenceBranch)
      {
        WebDeveloper.Overlay.preferenceBranch.addObserver("", WebDeveloper.Overlay.PreferenceObserver, false);
      }

      window.removeEventListener("load", WebDeveloper.Overlay.initialize, false);
    }
  }
  catch(exception)
  {
    // Ignore
  }
};

// Returns true if the DOM Inspector is available
WebDeveloper.Overlay.isDOMInspectorAvailable = function()
{
  // Try to load the DOM Inspector
  try
  {
    Components.classes["@mozilla.org/inspector/dom-utils;1"].getService(Components.interfaces.inIDOMUtils);

    return true;
  }
  catch(exception)
  {
    // Ignore
  }

  return false;
};

// Opens the error console
WebDeveloper.Overlay.openErrorConsole = function()
{
  toJavaScriptConsole();
};

// Opens a generated tab
WebDeveloper.Overlay.openGeneratedTab = function(url, data, locale)
{
  var tab  = WebDeveloper.Common.getTabBrowser().getBrowserForTab(WebDeveloper.Common.openURL(url));
  var load = (function(dataContent, localeContent)
  {
    var handler = function()
    {
      var contentDocument = tab.contentDocument;
      var dispatchEvent   = contentDocument.createEvent("Events");
      var headElement     = WebDeveloper.Common.getDocumentHeadElement(contentDocument);

      dispatchEvent.initEvent("web-developer-generated-event", true, false);
      headElement.setAttribute("data-web-developer", JSON.stringify(dataContent));
      headElement.setAttribute("data-web-developer-locale", JSON.stringify(localeContent));
      headElement.dispatchEvent(dispatchEvent);

      tab.removeEventListener("load", handler, true);
    };

    return handler;
  })(data, locale);

  tab.addEventListener("load", load, true);
};

// Opens a toolbar button automatically if another toolbar button is open on the toolbar
WebDeveloper.Overlay.openToolbarButton = function(currentToolbarButton)
{
  // If the toolbar button is set and is not open
  if(currentToolbarButton && !currentToolbarButton.open)
  {
    var toolbarButton  = null;
    var toolbarButtons = currentToolbarButton.parentNode.getElementsByTagName("toolbarbutton");

    // Loop through the toolbar buttons
    for(var i = 0, l = toolbarButtons.length; i < l; i++)
    {
      toolbarButton = toolbarButtons.item(i);

      // If the toolbar button is set, is not the same toolbar button and is open
      if(toolbarButton && toolbarButton != currentToolbarButton && toolbarButton.open)
      {
        toolbarButton.open        = false;
        currentToolbarButton.open = true;

        break;
      }
    }
  }
};

// Handles the page being loaded
WebDeveloper.Overlay.pageLoad = function(event)
{
  var originalTarget = event.originalTarget;

  // If the event came from an HTML document and it is not a frame
  if(originalTarget instanceof HTMLDocument && !originalTarget.defaultView.frameElement)
  {
    var loadBrowser = WebDeveloper.Common.getTabBrowser().getBrowserForDocument(originalTarget);
    var tab         = WebDeveloper.Common.getTabForDocument(originalTarget);

    WebDeveloper.Overlay.updateMetaRedirects(loadBrowser);

    // If pinning features
    if(WebDeveloper.Preferences.getExtensionBooleanPreference("pin.features"))
    {
      WebDeveloper.Overlay.toggleFeatures(tab, false);
    }
    else
    {
      WebDeveloper.Storage.deleteFeatures(tab);
      WebDeveloper.ElementAncestors.removeToolbar();
    }

    // If the selected browser is the one that loaded
    if(WebDeveloper.Common.getSelectedBrowser() == loadBrowser)
    {
      WebDeveloper.Overlay.updateRenderMode();
    }
  }
};

// Handles the page being unloaded
WebDeveloper.Overlay.pageUnload = function(event)
{
  var originalTarget = event.originalTarget;

  // If the event came from an HTML document and it is not a frame
  if(originalTarget instanceof HTMLDocument && !originalTarget.defaultView.frameElement)
  {
    WebDeveloper.Common.clearNotification();
    WebDeveloper.Overlay.updateCSSStatus();
    WebDeveloper.Overlay.updateJavaScriptStatus();
  }
};

// Removes all the generated menu items from the menu
WebDeveloper.Overlay.removeGeneratedMenuItems = function(menu)
{
  var generatedMenuItems = [];
  var menuItem           = null;
  var menuItems          = menu.childNodes;

  // Loop through the menu items
  for(var i = 0, l = menuItems.length; i < l; i++)
  {
    menuItem = menuItems.item(i);

    // If this is a generated menu item
    if(menuItem && menuItem.hasAttribute("class") && menuItem.getAttribute("class") == "web-developer-generated-menu")
    {
      generatedMenuItems.push(menuItem);
    }
  }

  // Loop through the generated menu items
  for(i = 0, l = generatedMenuItems.length; i < l; i++)
  {
    menu.removeChild(generatedMenuItems[i]);
  }
};

// Removes all the keyboard shortcuts for the extension
WebDeveloper.Overlay.removeKeyboardShortcuts = function(keySet)
{
  var extensionKeys = keySet.getElementsByClassName("web-developer-key");

  // While there are extension keys remaining
  while(extensionKeys.length)
  {
    keySet.removeChild(extensionKeys[0]);
  }
};

// Resets the CSS status button
WebDeveloper.Overlay.resetCSSStatus = function()
{
  var cssButton = document.getElementById("web-developer-css-statusbar");

  WebDeveloper.Overlay.javaScriptCurrentTime  = null;
  WebDeveloper.Overlay.javaScriptPreviousTime = null;

  // If the CSS button exists
  if(cssButton)
  {
    // If the CSS button has a class attribute
    if(cssButton.hasAttribute("class"))
    {
      cssButton.removeAttribute("class");
    }

    // If the CSS button has a tooltip text attribute
    if(cssButton.hasAttribute("tooltiptext"))
    {
      cssButton.removeAttribute("tooltiptext");
    }

    // If the toolbar preference is set to text and the CSS button has a label attribute
    if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text" && cssButton.hasAttribute("label"))
    {
      cssButton.removeAttribute("label");
    }
  }
};

// Resets the JavaScript status button
WebDeveloper.Overlay.resetJavaScriptStatus = function()
{
  var javaScriptButton = document.getElementById("web-developer-javascript-statusbar");

  WebDeveloper.Overlay.javaScriptCurrentTime  = null;
  WebDeveloper.Overlay.javaScriptPreviousTime = null;

  // If the JavaScript button exists
  if(javaScriptButton)
  {
    // If JavaScript is enabled
    if(WebDeveloper.Preferences.getBooleanPreference("javascript.enabled"))
    {
      // If the JavaScript button has a class attribute
      if(javaScriptButton.hasAttribute("class"))
      {
        javaScriptButton.removeAttribute("class");
      }

      // If the JavaScript button has a tooltip text attribute
      if(javaScriptButton.hasAttribute("tooltiptext"))
      {
        javaScriptButton.removeAttribute("tooltiptext");
      }

      // If the toolbar preference is set to text and the JavaScript button has a label attribute
      if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text" && javaScriptButton.hasAttribute("label"))
      {
        javaScriptButton.removeAttribute("label");
      }
    }
    else
    {
      // If the JavaScript button does not have a class attribute or it is not set to disabled
      if(!javaScriptButton.hasAttribute("class") || javaScriptButton.getAttribute("class") != "disabled")
      {
        javaScriptButton.setAttribute("class", "disabled");
        javaScriptButton.setAttribute("tooltiptext", WebDeveloper.Locales.getString("javaScriptDisabledTooltip"));

        // If the toolbar preference is set to text
        if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
        {
          javaScriptButton.setAttribute("label", WebDeveloper.Locales.getString("javaScriptDisabledLabel"));
        }
      }
    }
  }
};

// Sets up the feature keyboard shortcuts
WebDeveloper.Overlay.setupFeatureKeyboardShortcuts = function(keySet)
{
  var feature        = null;
  var featureElement = null;
  var key            = null;
  var keyElement     = null;
  var keyId          = null;
  var modifiers      = null;

  // Loop through the tools
  for(var i = 1, l = WebDeveloper.Preferences.getExtensionIntegerPreference("keyboard.count"); i <= l; i++)
  {
    feature   = WebDeveloper.Preferences.getExtensionStringPreference("keyboard." + i + ".feature");
    key       = WebDeveloper.Preferences.getLocalizedPreference("keyboard." + i + ".key");
    modifiers = WebDeveloper.Preferences.getExtensionStringPreference("keyboard." + i + ".modifiers");

    // If the feature, key and modifiers are set
    if(feature && key && modifiers)
    {
      keyElement = document.createElement("key");
      keyId      = "web-developer-" + feature + "-key";

      keyElement.setAttribute("class", "web-developer-key");
      keyElement.setAttribute("command", "web-developer-" + feature + "-command");
      keyElement.setAttribute("id", keyId);
      keyElement.setAttribute("key", key);
      keyElement.setAttribute("modifiers", modifiers);

      keySet.appendChild(keyElement);

      // Loop through the feature suffixes
      for(var j = 0, m = WebDeveloper.Overlay.featureSuffixes.length; j < m; j++)
      {
        featureElement = document.getElementById("web-developer-" + feature + "-" + WebDeveloper.Overlay.featureSuffixes[j]);

        // If the feature element is set
        if(featureElement)
        {
          featureElement.setAttribute("key", keyId);
        }
      }
    }
  }
};

// Sets up the keyboard shortcuts
WebDeveloper.Overlay.setupKeyboardShortcuts = function()
{
  var keySet = document.getElementById("mainKeyset");

  WebDeveloper.Overlay.removeKeyboardShortcuts(keySet);
  WebDeveloper.Overlay.setupFeatureKeyboardShortcuts(keySet);
  WebDeveloper.Overlay.setupResizeKeyboardShortcuts(keySet);
  WebDeveloper.Overlay.setupToolsKeyboardShortcuts(keySet);
  WebDeveloper.Overlay.setupViewSourceWithKeyboardShortcuts(keySet);
};

// Sets up the resize keyboard shortcuts
WebDeveloper.Overlay.setupResizeKeyboardShortcuts = function(keySet)
{
  var description = null;
  var height      = null;
  var key         = null;
  var keyElement  = null;
  var modifiers   = null;
  var viewport    = null;
  var width       = null;

  // Loop through the possible resize options
  for(var i = 1, l = WebDeveloper.Preferences.getExtensionIntegerPreference("resize.count"); i <= l; i++)
  {
    description = WebDeveloper.Preferences.getLocalizedPreference("resize." + i + ".description");
    height      = WebDeveloper.Preferences.getExtensionIntegerPreference("resize." + i + ".height");
    width       = WebDeveloper.Preferences.getExtensionIntegerPreference("resize." + i + ".width");

    // If the description, height and width are set
    if(description && height > 0 && width > 0)
    {
      key       = WebDeveloper.Preferences.getExtensionStringPreference("resize." + i + ".key");
      modifiers = WebDeveloper.Preferences.getExtensionStringPreference("resize." + i + ".modifiers");
      viewport  = WebDeveloper.Preferences.getExtensionBooleanPreference("resize." + i + ".viewport");

      // If a key and modifiers are set
      if(key && modifiers)
      {
        keyElement = document.createElement("key");

        keyElement.setAttribute("class", "web-developer-key");
        keyElement.setAttribute("id", "web-developer-resize-" + i + "-key");
        keyElement.setAttribute("key", key);
        keyElement.setAttribute("modifiers", modifiers);
        keyElement.setAttribute("oncommand", "WebDeveloper.Overlay.Resize.resizeWindow(" + width + ", " + height + ", " + viewport + ")");

        keySet.appendChild(keyElement);
      }
    }
  }
};

// Sets up the tools keyboard shortcuts
WebDeveloper.Overlay.setupToolsKeyboardShortcuts = function(keySet)
{
  var description = null;
  var key         = null;
  var keyElement  = null;
  var modifiers   = null;
  var path        = null;
  var url         = null;

  // Loop through the tools
  for(var i = 1, l = WebDeveloper.Preferences.getExtensionIntegerPreference("tool.count"); i <= l; i++)
  {
    // If this is not a separator
    if(!WebDeveloper.Preferences.getExtensionBooleanPreference("tool." + i + ".separator"))
    {
      description = WebDeveloper.Preferences.getLocalizedPreference("tool." + i + ".description");
      path        = WebDeveloper.Preferences.getExtensionStringPreference("tool." + i + ".path");
      url         = WebDeveloper.Preferences.getExtensionStringPreference("tool." + i + ".url");

      // If the description and either a path or url are set
      if((description && (path || url)))
      {
        key       = WebDeveloper.Preferences.getLocalizedPreference("tool." + i + ".key");
        modifiers = WebDeveloper.Preferences.getExtensionStringPreference("tool." + i + ".modifiers");

        // If a key and modifiers are set
        if(key && modifiers)
        {
          keyElement = document.createElement("key");

          keyElement.setAttribute("class", "web-developer-key");
          keyElement.setAttribute("id", "web-developer-tools-" + i + "-key");
          keyElement.setAttribute("key", key);
          keyElement.setAttribute("modifiers", modifiers);

          // If the path is set
          if(path)
          {
            keyElement.setAttribute("oncommand", "WebDeveloper.Overlay.Tools.loadApplicationWithURL('" + path.replace(/\\/gi, "\\\\") + "', WebDeveloper.Common.getTabBrowser().currentURI.spec)");
          }
          else
          {
            keyElement.setAttribute("oncommand", "WebDeveloper.Common.openURL('" + url + "' + encodeURIComponent(WebDeveloper.Common.getTabBrowser().currentURI.spec))");
          }

          keySet.appendChild(keyElement);
        }
      }
    }
  }
};

// Sets up the view source with keyboard shortcuts
WebDeveloper.Overlay.setupViewSourceWithKeyboardShortcuts = function(keySet)
{
  var description = null;
  var key         = null;
  var keyElement  = null;
  var modifiers   = null;
  var path        = null;

  // Loop through the view source with options
  for(var i = 1; i <= WebDeveloper.Preferences.getExtensionIntegerPreference("view.source.with.count"); i++)
  {
    description = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".description");
    path        = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".path");

    // If the description and path are set
    if(description && path)
    {
      key     = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".key");
      modifiers = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".modifiers");

      // If a key and modifiers are set
      if(key && modifiers)
      {
        keyElement = document.createElement("key");

        keyElement.setAttribute("class", "web-developer-key");
        keyElement.setAttribute("id", "web-developer-view-source-with-" + i + "-key");
        keyElement.setAttribute("key", key);
        keyElement.setAttribute("modifiers", modifiers);
        keyElement.setAttribute("oncommand", "WebDeveloper.Overlay.ViewSource.loadApplicationWithSource('" + path.replace(/\\/gi, "\\\\") + "')");

        keySet.appendChild(keyElement);
      }
    }
  }
};

// Handles a tab being selected
WebDeveloper.Overlay.tabSelect = function()
{
  // If a feature that uses the element information toolbar is active
  if(WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("elementInformation")) || WebDeveloper.Dashboard.isOpenInDashboard(WebDeveloper.Locales.getString("styleInformation")))
  {
    document.getElementById("web-developer-element-information-toolbar").hidden = false;
  }
  else
  {
    document.getElementById("web-developer-element-information-toolbar").hidden = true;
  }

  WebDeveloper.Overlay.resetCSSStatus();
  WebDeveloper.Overlay.resetJavaScriptStatus();
  WebDeveloper.Overlay.updateRenderMode();
};

// Toggles the features
WebDeveloper.Overlay.toggleFeatures = function(tab, reset)
{
  var feature  = null;
  var features = WebDeveloper.Storage.getFeatures(tab);

  // If the features are set
  if(features)
  {
    // Loop through the features
    for(var i = 0, l = features.length; i < l; i++)
    {
      feature = features[i];

      // If not resetting features
      if(!reset)
      {
        WebDeveloper.Storage.toggleFeature(feature, tab);
      }

      document.getElementById(WebDeveloper.Common.getCommandId(feature)).doCommand();
    }
  }
};

// Toggles the toolbar
WebDeveloper.Overlay.toggleToolbar = function(event)
{
  // If there is no event or it came from the button
  if(!event || event.target.getAttribute("id") == "web-developer-button")
  {
    var toolbar = document.getElementById("web-developer-toolbar");

    toolbar.collapsed = !toolbar.collapsed;

    document.persist("web-developer-toolbar", "collapsed");
  }
};

// Uninitializes the extension
WebDeveloper.Overlay.uninitialize = function()
{
  // Try to get the tab browser
  try
  {
    var tabBrowser = WebDeveloper.Common.getTabBrowser();

    // If the tab browser is set
    if(tabBrowser)
    {
      var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService().QueryInterface(Components.interfaces.nsIConsoleService);
      var tabContainer   = tabBrowser.tabContainer;

      tabBrowser.removeEventListener("load", WebDeveloper.Overlay.pageLoad, true);
      tabBrowser.removeEventListener("unload", WebDeveloper.Overlay.pageUnload, true);

      // If the tab container is set
      if(tabContainer)
      {
        tabContainer.removeEventListener("TabSelect", WebDeveloper.Overlay.tabSelect, false);
      }

      // If the console service is set
      if(consoleService)
      {
        consoleService.unregisterListener(WebDeveloper.Overlay.ErrorConsoleListener);
      }

      // If the preference branch is set
      if(WebDeveloper.Overlay.preferenceBranch)
      {
        WebDeveloper.Overlay.preferenceBranch.removeObserver("", WebDeveloper.Overlay.PreferenceObserver);
      }

      window.removeEventListener("close", WebDeveloper.Overlay.uninitialize, false);
    }
  }
  catch(exception)
  {
    // Ignore
  }
};

// Updates the chrome
WebDeveloper.Overlay.updateChrome = function()
{
  var hideContextMenuPreference = WebDeveloper.Preferences.getExtensionBooleanPreference("context.hide");
  var hideMenuPreference        = WebDeveloper.Preferences.getExtensionBooleanPreference("menu.hide");
  var toolbar                   = document.getElementById("web-developer-toolbar");

  // If the toolbar exists
  if(toolbar)
  {
    var toolbarButtons       = toolbar.getElementsByTagName("toolbarbutton");
    var toolbarButtonsLength = toolbarButtons.length;
    var toolbarPreference    = WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons");

    toolbar.setAttribute("mode", toolbarPreference);

    // If the toolbar preference is set to icons
    if(toolbarPreference == "icons")
    {
      toolbarPreference = "pictures";
    }

    toolbar.setAttribute("buttonstyle", toolbarPreference);

    // Loop through the toolbar buttons
    for(var i = 0; i < toolbarButtonsLength; i++)
    {
      toolbarButtons[i].setAttribute("buttonstyle", toolbarPreference);
    }

    // If the toolbar preference is not set to text
    if(toolbarPreference != "text")
    {
      WebDeveloper.Common.removeElementAttribute(document.getElementById("web-developer-css-statusbar"), "label");
      WebDeveloper.Common.removeElementAttribute(document.getElementById("web-developer-javascript-statusbar"), "label");
      WebDeveloper.Common.removeElementAttribute(document.getElementById("web-developer-render-mode-statusbar"), "label");
    }
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-app-menu"), "hidden", hideMenuPreference);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-context"), "hidden", hideContextMenuPreference);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-context-separator1"), "hidden", hideContextMenuPreference);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-menu"), "hidden", hideMenuPreference);
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-seamonkey"), "hidden", hideMenuPreference);

  // If the extension is running on a Mac
  if(WebDeveloper.Common.isMac())
  {
    var color    = WebDeveloper.Preferences.getExtensionBooleanPreference("toolbar.color");
    var toolbars = document.querySelectorAll(".web-developer-toolbar");

    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-app-menu"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-button"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-context"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-menu"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-seamonkey"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-toolbar"), "color", color);

    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-cookies-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-css-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-disable-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-forms-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-images-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-information-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-miscellaneous-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-options-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-outline-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-resize-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-tools-toolbar"), "color", color);
    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-view-source-toolbar"), "color", color);

    WebDeveloper.Common.configureElement(document.getElementById("web-developer-css-statusbar"), "web-developer-color", color);
    WebDeveloper.Common.configureElement(document.getElementById("web-developer-javascript-statusbar"), "web-developer-color", color);
    WebDeveloper.Common.configureElement(document.getElementById("web-developer-render-mode-statusbar"), "web-developer-color", color);

    // Loop through the toolbars
    for(var j = 0, m = toolbars.length; j < m; j++)
    {
      WebDeveloper.Common.toggleClass(toolbars[j], "color", color);
    }

    WebDeveloper.Common.toggleClass(document.getElementById("web-developer-dashboard"), "color", color);
  }
};

// Updates the CSS status button
WebDeveloper.Overlay.updateCSSStatus = function(error)
{
  var cssButton = document.getElementById("web-developer-css-statusbar");

  // If the CSS button is set
  if(cssButton)
  {
    // If the error is set
    if(error)
    {
      var errorMessage = error.errorMessage;

      cssButton.setAttribute("tooltiptext", WebDeveloper.Locales.getFormattedString("cssErrorTooltip", [errorMessage]));

      // If the CSS button does not have a class attribute or it is not set to error
      if(!cssButton.hasAttribute("class") || cssButton.getAttribute("class") != "error")
      {
        cssButton.setAttribute("class", "error");

        // If the toolbar preference is set to text
        if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
        {
          cssButton.setAttribute("label", WebDeveloper.Locales.getString("cssErrorLabel"));
        }
      }
    }
    else if(!cssButton.hasAttribute("class") || cssButton.getAttribute("class") != "valid")
    {
      cssButton.setAttribute("class", "valid");
      cssButton.setAttribute("tooltiptext", WebDeveloper.Locales.getString("cssNoErrorsTooltip"));

      // If the toolbar preference is set to text
      if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
      {
        cssButton.setAttribute("label", WebDeveloper.Locales.getString("cssNoErrorsLabel"));
      }
    }
  }
};

// Updates the JavaScript status button
WebDeveloper.Overlay.updateJavaScriptStatus = function(error)
{
  var javaScriptButton = document.getElementById("web-developer-javascript-statusbar");

  // If the JavaScript button is set
  if(javaScriptButton)
  {
    // If the error is set
    if(error)
    {
      var errorMessage = error.errorMessage;
      var warning      = error.flags & error.warningFlag !== 0;

      // If this is a warning
      if(warning)
      {
        javaScriptButton.setAttribute("tooltiptext", WebDeveloper.Locales.getFormattedString("javaScriptWarningTooltip", [errorMessage]));

        // If the JavaScript button does not have a class attribute or it is not set to warning
        if(!javaScriptButton.hasAttribute("class") || javaScriptButton.getAttribute("class") != "warning")
        {
          javaScriptButton.setAttribute("class", "warning");

          // If the toolbar preference is set to text
          if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
          {
            javaScriptButton.setAttribute("label", WebDeveloper.Locales.getString("javaScriptWarningLabel"));
          }
        }
      }
      else
      {
        javaScriptButton.setAttribute("tooltiptext", WebDeveloper.Locales.getFormattedString("javaScriptErrorTooltip", [errorMessage]));

        // If the JavaScript button does not have a class attribute or it is not set to error
        if(!javaScriptButton.hasAttribute("class") || javaScriptButton.getAttribute("class") != "error")
        {
          javaScriptButton.setAttribute("class", "error");

          // If the toolbar preference is set to text
          if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
          {
            javaScriptButton.setAttribute("label", WebDeveloper.Locales.getString("javaScriptErrorLabel"));
          }
        }
      }
    }
    else if(!javaScriptButton.hasAttribute("class") || (javaScriptButton.getAttribute("class") != "disabled" && javaScriptButton.getAttribute("class") != "valid"))
    {
      javaScriptButton.setAttribute("class", "valid");
      javaScriptButton.setAttribute("tooltiptext", WebDeveloper.Locales.getString("javaScriptNoErrorsTooltip"));

      // If the toolbar preference is set to text
      if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
      {
        javaScriptButton.setAttribute("label", WebDeveloper.Locales.getString("javaScriptNoErrorsLabel"));
      }
    }
  }
};

// Updates meta redirects
WebDeveloper.Overlay.updateMetaRedirects = function(browserElement)
{
  browserElement.docShell.allowMetaRedirects = !WebDeveloper.Preferences.getExtensionBooleanPreference("meta.redirects.disable");
};

// Updates the render mode status button
WebDeveloper.Overlay.updateRenderMode = function()
{
  var renderModeButton = document.getElementById("web-developer-render-mode-statusbar");

  // If the render mode button exists
  if(renderModeButton)
  {
    var renderMode = WebDeveloper.Common.getContentDocument().compatMode;

    // If the render mode is quirks mode
    if(renderMode == "BackCompat")
    {
      renderModeButton.setAttribute("class", "quirks");
      renderModeButton.setAttribute("tooltiptext", WebDeveloper.Locales.getString("quirksModeTooltip"));

      // If the toolbar is in text mode
      if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
      {
          renderModeButton.setAttribute("label", WebDeveloper.Locales.getString("quirksModeLabel"));
      }
    }
    else
    {
      // If the render mode button has a class attribute
      if(renderModeButton.hasAttribute("class"))
      {
        renderModeButton.removeAttribute("class");
      }

      renderModeButton.setAttribute("tooltiptext", WebDeveloper.Locales.getString("standardsComplianceModeTooltip"));

      // If the toolbar is in text mode
      if(WebDeveloper.Preferences.getExtensionStringPreference("toolbar.icons") == "text")
      {
        renderModeButton.setAttribute("label", WebDeveloper.Locales.getString("standardsComplianceModeLabel"));
      }
    }
  }
};

// Error console listener
WebDeveloper.Overlay.ErrorConsoleListener =
{
  // Observes changes in the console
  observe: function(error)
  {
    // If the error is set
    if(error)
    {
      // Try to convert the error to a script error
      try
      {
        var errorCategory = null;

        error         = error.QueryInterface(Components.interfaces.nsIScriptError);
        errorCategory = error.category;

        // If the error category is set and is content javascript
        if(errorCategory && errorCategory == "content javascript")
        {
          WebDeveloper.Overlay.updateJavaScriptStatus(error);
        }
        else if(errorCategory && errorCategory == "CSS Parser")
        {
          WebDeveloper.Overlay.updateCSSStatus(error);
        }
      }
      catch(exception)
      {
        // Ignore
      }
    }

    return false;
  }
};

// Preference observer
WebDeveloper.Overlay.PreferenceObserver =
{
  // Observes changes in the console
  observe: function(subject, topic, data)
  {
    // If a preference was changed
    if(topic == "nsPref:changed")
    {
      // If the toolbar color or icons preference was changed
      if(data == "toolbar.color" || data == "toolbar.icons")
      {
        WebDeveloper.Overlay.updateChrome();
      }
    }
  }
};

window.addEventListener("load", WebDeveloper.Overlay.initialize, false);
window.addEventListener("unload", WebDeveloper.Overlay.uninitialize, false);
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay        = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Resize = WebDeveloper.Overlay.Resize || {};

// Resizes the window to a custom size
WebDeveloper.Overlay.Resize.customResizeWindow = function()
{
  var contentWindow = WebDeveloper.Common.getContentWindow();

  window.openDialog("chrome://web-developer/content/dialogs/resize-window.xul", "web-developer-resize-dialog", "centerscreen,chrome,modal", contentWindow.outerWidth, contentWindow.outerHeight, contentWindow.innerWidth, contentWindow.innerHeight);
};

// Displays the current window size
WebDeveloper.Overlay.Resize.displayWindowSize = function()
{
  var contentWindow = WebDeveloper.Common.getContentWindow();

  WebDeveloper.Common.displayNotification("displayWindowSizeResult", [contentWindow.outerWidth, contentWindow.outerHeight, contentWindow.innerWidth, contentWindow.innerHeight]);
};

// Displays the current window size in the title bar
WebDeveloper.Overlay.Resize.displayWindowSizeInTitle = function(element)
{
  var contentDocument = WebDeveloper.Common.getContentDocument();

  // If adding the window size to the title
  if(!WebDeveloper.Common.convertToBoolean(element.getAttribute("checked")))
  {
    var contentWindow = WebDeveloper.Common.getContentWindow();

    contentDocument.title += " - " + contentWindow.outerWidth + "x" + contentWindow.outerHeight + " [" + contentWindow.innerWidth + "x" + contentWindow.innerHeight + "]";

    window.addEventListener("resize", WebDeveloper.Overlay.Resize.updateWindowSizeInTitle, false);
  }
  else
  {
    var title = contentDocument.title;

    contentDocument.title = title.substring(0, title.lastIndexOf(" - "));

    // Try to remove the event listener
    try
    {
      window.removeEventListener("resize", WebDeveloper.Overlay.Resize.updateWindowSizeInTitle, false);
    }
    catch(exception)
    {
      // Ignore
    }
  }

  WebDeveloper.Storage.toggleFeature(WebDeveloper.Common.getFeatureId(element.getAttribute("id")));
};

// Resizes the window or viewport to the given width and height
WebDeveloper.Overlay.Resize.resizeWindow = function(width, height, viewport)
{
  var windowX = window.screenX;
  var windowY = window.screenY;

  // If resizing the viewport
  if(viewport)
  {
    var contentWindow = WebDeveloper.Common.getContentWindow();

    contentWindow.innerHeight = height;
    contentWindow.innerWidth  = width;
  }
  else
  {
    window.resizeTo(width, height);
  }

  window.screenX = windowX;
  window.screenY = windowY;
};

// Updates the resize menu
WebDeveloper.Overlay.Resize.updateResizeMenu = function(menu, suffix)
{
  var contentWindow   = WebDeveloper.Common.getContentWindow();
  var description     = null;
  var height          = null;
  var key             = null;
  var menuItem        = document.createElement("menuitem");
  var modifiers       = null;
  var resizeSeparator = document.getElementById("web-developer-resize-separator3-" + suffix);
  var viewport        = false;
  var viewportHeight  = contentWindow.innerHeight;
  var viewportWidth   = contentWindow.innerWidth;
  var width           = null;
  var windowHeight    = contentWindow.outerHeight;
  var windowWidth     = contentWindow.outerWidth;

  WebDeveloper.Overlay.configureFeatureElement("web-developer-display-window-size-title-command", "checked");
  WebDeveloper.Overlay.removeGeneratedMenuItems(menu);

  // Loop through the possible resize options
  for(var i = 1, l = WebDeveloper.Preferences.getExtensionIntegerPreference("resize.count"); i <= l; i++)
  {
    description = WebDeveloper.Preferences.getLocalizedPreference("resize." + i + ".description");
    height      = WebDeveloper.Preferences.getExtensionIntegerPreference("resize." + i + ".height");
    width       = WebDeveloper.Preferences.getExtensionIntegerPreference("resize." + i + ".width");

    // If the description, height and width are set
    if(description && height > 0 && width > 0)
    {
      key       = WebDeveloper.Preferences.getExtensionStringPreference("resize." + i + ".key");
      menuItem  = document.createElement("menuitem");
      modifiers = WebDeveloper.Preferences.getExtensionStringPreference("resize." + i + ".modifiers");
      viewport  = WebDeveloper.Preferences.getExtensionBooleanPreference("resize." + i + ".viewport");

      // If the resize attributes match the current size
      if((viewport && viewportWidth == width && viewportHeight == height) || (!viewport && windowWidth == width && windowHeight == height))
      {
        menuItem.setAttribute("checked", true);
      }

      menuItem.setAttribute("class", "web-developer-generated-menu");
      menuItem.setAttribute("label", description);
      menuItem.setAttribute("oncommand", "WebDeveloper.Overlay.Resize.resizeWindow(" + width + ", " + height + ", " + viewport + ")");
      menuItem.setAttribute("type", "radio");

      // If a key and modifiers are set
      if(key && modifiers)
      {
        menuItem.setAttribute("key", "web-developer-resize-" + i + "-key");
      }

      menu.insertBefore(menuItem, resizeSeparator);
    }
  }
};

// Updates the window size in the title bar
WebDeveloper.Overlay.Resize.updateWindowSizeInTitle = function()
{
  var contentDocument = WebDeveloper.Common.getContentDocument();
  var contentWindow   = WebDeveloper.Common.getContentWindow();
  var title           = contentDocument.title;

  contentDocument.title = title.substring(0, title.lastIndexOf(" - ")) + " - " + contentWindow.outerWidth + "x" + contentWindow.outerHeight + " [" + contentWindow.innerWidth + "x" + contentWindow.innerHeight + "]";
};

// Displays the responsive layouts for the page
WebDeveloper.Overlay.Resize.viewResponsiveLayouts = function()
{
  var data        = {};
  var description = null;
  var height      = null;
  var layout      = null;
  var width       = null;

  data.layouts = [];
  data.pageURL = WebDeveloper.Common.getTabBrowser().currentURI.spec;

  // Loop through the possible responsive options
  for(var i = 1, l = WebDeveloper.Preferences.getExtensionIntegerPreference("responsive.layout.count"); i <= l; i++)
  {
    description = WebDeveloper.Preferences.getLocalizedPreference("responsive.layout." + i + ".description");
    height      = WebDeveloper.Preferences.getExtensionIntegerPreference("responsive.layout." + i + ".height");
    width       = WebDeveloper.Preferences.getExtensionIntegerPreference("responsive.layout." + i + ".width");

    // If the description, height and width are set
    if(description && height > 0 && width > 0)
    {
      layout             = {};
      layout.description = description;
      layout.height      = height;
      layout.width       = width;

      data.layouts.push(layout);
    }
  }

  WebDeveloper.Overlay.openGeneratedTab(WebDeveloper.Common.getChromeURL("generated/view-responsive-layouts.html"), data, WebDeveloper.Overlay.Resize.getViewResponsiveLayoutsLocale());
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay       = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.Tools = WebDeveloper.Overlay.Tools || {};

// Displays a page validation toolbar
WebDeveloper.Overlay.Tools.displayPageValidation = function(element)
{
  var featureId = WebDeveloper.Common.getFeatureId(element.getAttribute("id"));

  WebDeveloper.PageValidation.displayPageValidation(!WebDeveloper.Storage.isFeatureActive(featureId));
  WebDeveloper.Storage.toggleFeature(featureId);
};

// Returns true if the DOM Inspector chrome is available
WebDeveloper.Overlay.Tools.isDOMInspectorChromeAvailable = function()
{
  // If the inspectDOMDocument method is available
  if(typeof inspectDOMDocument == "function")
  {
    return true;
  }

  return false;
};

// Loads the given application with the given URL
WebDeveloper.Overlay.Tools.loadApplicationWithURL = function(application, url)
{
  // If the application and URL are set
  if(application && url)
  {
    application = new WebDeveloperApplication(application);

    application.launchWithURL(url);
  }
};

// Opens the DOM Inspector
WebDeveloper.Overlay.Tools.openDOMInspector = function()
{
  // If the DOM Inspector and chrome is available
  if(WebDeveloper.Overlay.isDOMInspectorAvailable() && WebDeveloper.Overlay.Tools.isDOMInspectorChromeAvailable())
  {
    inspectDOMDocument(WebDeveloper.Common.getContentDocument());
  }
  else
  {
    WebDeveloper.Common.displayURLMessage(WebDeveloper.Locales.getString("domInspectorRequired"), "http://chrispederick.com/work/web-developer/firefox/faq/#dom-inspector");
  }
};

// Updates the tools menu
WebDeveloper.Overlay.Tools.updateToolsMenu = function(menu, suffix)
{
  var description    = null;
  var key            = null;
  var menuItem       = null;
  var modifiers      = null;
  var path           = null;
  var toolsSeparator = menu.getElementsByAttribute("id", "web-developer-tools-separator1-" + suffix)[0];
  var url            = null;

  WebDeveloper.Overlay.removeGeneratedMenuItems(menu);

  // Loop through the possible tools
  for(var i = 1, l = WebDeveloper.Preferences.getExtensionIntegerPreference("tool.count"); i <= l; i++)
  {
    // If this is a separator
    if(WebDeveloper.Preferences.getExtensionBooleanPreference("tool." + i + ".separator"))
    {
      menuItem = document.createElement("menuseparator");

      menuItem.setAttribute("class", "web-developer-generated-menu");
      menu.insertBefore(menuItem, toolsSeparator);
    }
    else
    {
      description = WebDeveloper.Preferences.getLocalizedPreference("tool." + i + ".description");
      path        = WebDeveloper.Preferences.getExtensionStringPreference("tool." + i + ".path");
      url         = WebDeveloper.Preferences.getExtensionStringPreference("tool." + i + ".url");

      // If the description and either a path or url are set
      if((description && (path || url)))
      {
        key       = WebDeveloper.Preferences.getExtensionStringPreference("tool." + i + ".key");
        menuItem  = document.createElement("menuitem");
        modifiers = WebDeveloper.Preferences.getExtensionStringPreference("tool." + i + ".modifiers");

        menuItem.setAttribute("class", "web-developer-generated-menu");
        menuItem.setAttribute("label", description);

        // If the path is set
        if(path)
        {
          menuItem.setAttribute("oncommand", "WebDeveloper.Overlay.Tools.loadApplicationWithURL('" + path.replace(/\\/gi, "\\\\") + "', WebDeveloper.Common.getTabBrowser().currentURI.spec)");
        }
        else
        {
          menuItem.setAttribute("oncommand", "WebDeveloper.Common.openURL('" + url + "' + encodeURIComponent(WebDeveloper.Common.getTabBrowser().currentURI.spec))");
        }

        // If a key and modifiers are set
        if(key && modifiers)
        {
          menuItem.setAttribute("key", "web-developer-tools-" + i + "-key");
        }

        menu.insertBefore(menuItem, toolsSeparator);
      }
    }
  }

  menuItem = document.getElementById("web-developer-dom-inspector-" + suffix);

  // If the menu exists
  if(menuItem)
  {
    // If the DOM Inspector or chrome is not available
    if(!WebDeveloper.Overlay.isDOMInspectorAvailable() || !WebDeveloper.Overlay.Tools.isDOMInspectorChromeAvailable())
    {
      menuItem.setAttribute("class", "menuitem-iconic");
    }
    else if(menuItem.hasAttribute("class"))
    {
      menuItem.removeAttribute("class");
    }
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-display-page-validation-command"), "checked", !document.getElementById("web-developer-page-validation-toolbar").hidden);
};

// Validates local CSS
WebDeveloper.Overlay.Tools.validateLocalCSS = function()
{
  new WebDeveloperValidateCSS().validateCSS(WebDeveloper.Common.getTabBrowser().currentURI, WebDeveloper.Content.getCSS());
};

// Validates a local HTML file
WebDeveloper.Overlay.Tools.validateLocalHTML = function()
{
  new WebDeveloperValidateHTML().validateHTML(WebDeveloper.Common.getTabBrowser().currentURI, WebDeveloper.Common.getContentWindow());
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Overlay                                                   = WebDeveloper.Overlay || {};
WebDeveloper.Overlay.ViewSource                                        = WebDeveloper.Overlay.ViewSource || {};
WebDeveloper.Overlay.ViewSource.clearViewGeneratedSourceSelectionDelay = 1500;

// Clears the view generated source selection
WebDeveloper.Overlay.ViewSource.clearViewGeneratedSourceSelection = function(selection, generatedSourceWindow)
{
  selection.removeAllRanges();
  generatedSourceWindow.gBrowser.contentWindow.getSelection().removeAllRanges();
};

// Updates the view frame source menu
WebDeveloper.Overlay.ViewSource.updateViewFrameSourceMenu = function(menu)
{
  var contentDocument = null;
  var documents       = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());
  var menuItem        = null;

  WebDeveloper.Overlay.removeGeneratedMenuItems(menu);

  // Loop through the documents
  for(var i = 1, l = documents.length; i < l; i++)
  {
    menuItem                 = document.createElement("menuitem");
    contentDocument          = documents[i];
    menuItem.contentDocument = contentDocument;

    menuItem.setAttribute("class", "web-developer-generated-menu");
    menuItem.setAttribute("label", contentDocument.documentURI);
    menuItem.setAttribute("oncommand", "WebDeveloper.Overlay.ViewSource.viewSource(this.contentDocument)");
    menu.appendChild(menuItem);
  }
};

// Loads the given application with the source of the current page
WebDeveloper.Overlay.ViewSource.loadApplicationWithSource = function(application)
{
  // If the application is set
  if(application)
  {
    application = new WebDeveloperApplication(application);

    application.launchWithSource(WebDeveloper.Common.getTabBrowser().currentURI, WebDeveloper.Common.getContentWindow());
  }
};

// Updates the view source menu
WebDeveloper.Overlay.ViewSource.updateViewSourceMenu = function(menu, suffix)
{
  var description             = null;
  var frameCount              = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow()).length;
  var key                     = null;
  var menuItem                = document.createElement("menuitem");
  var modifiers               = null;
  var path                    = null;
  var viewSourceWithCount     = WebDeveloper.Preferences.getExtensionIntegerPreference("view.source.with.count");
  var viewSourceWithSeparator = document.getElementById("web-developer-view-source-separator3-" + suffix);

  WebDeveloper.Overlay.removeGeneratedMenuItems(menu);

  // If there are no view source with applications
  if(viewSourceWithCount === 0)
  {
    viewSourceWithSeparator.setAttribute("hidden", true);
  }
  else
  {
    viewSourceWithSeparator.setAttribute("hidden", false);

    // Loop through the view source with options
    for(var i = 1; i <= viewSourceWithCount; i++)
    {
      description = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".description");
      path        = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".path");

      // If the description and path are set
      if(description && path)
      {
        key       = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".key");
        menuItem  = document.createElement("menuitem");
        modifiers = WebDeveloper.Preferences.getExtensionStringPreference("view.source.with." + i + ".modifiers");

        menuItem.setAttribute("class", "web-developer-generated-menu");
        menuItem.setAttribute("label", description);
        menuItem.setAttribute("oncommand", "WebDeveloper.Overlay.ViewSource.loadApplicationWithSource('" + path.replace(/\\/gi, "\\\\") + "')");

        // If a key and modifiers are set
        if(key && modifiers)
        {
          menuItem.setAttribute("key", "web-developer-view-source-with-" + i + "-key");
        }

        menu.insertBefore(menuItem, viewSourceWithSeparator);
      }
    }
  }

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-view-frame-source-" + suffix), "disabled", frameCount === 1);
};

// View the generated source
WebDeveloper.Overlay.ViewSource.viewGeneratedSource = function()
{
  var currentDocument     = WebDeveloper.Common.getContentDocument();
  var currentWindow       = WebDeveloper.Common.getContentWindow();
  var generatedSourceWindow = null;
  var selection           = currentWindow.getSelection();

  selection.selectAllChildren(currentDocument.documentElement);

  generatedSourceWindow = window.openDialog("chrome://global/content/viewPartialSource.xul", "_blank", "chrome,dialog=no,resizable,scrollbars", WebDeveloper.Common.getTabBrowser().currentURI.spec, "charset=" + currentDocument.characterSet, currentWindow.getSelection(), "selection");

  window.setTimeout(WebDeveloper.Overlay.ViewSource.clearViewGeneratedSourceSelection, WebDeveloper.Overlay.ViewSource.clearViewGeneratedSourceSelectionDelay, selection, generatedSourceWindow);
};

// View source
WebDeveloper.Overlay.ViewSource.viewSource = function(frameDocument)
{
  // If the view source in tab preference is set to true
  if(WebDeveloper.Preferences.getExtensionBooleanPreference("view.source.tab"))
  {
    var tabBrowser = WebDeveloper.Common.getTabBrowser();
    var newTab     = tabBrowser.addTab("view-source:" + frameDocument.documentURI);

    tabBrowser.selectedTab = newTab;
  }
  else
  {
    BrowserViewSourceOfDocument(frameDocument);
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.ElementAncestors = WebDeveloper.ElementAncestors || {};

// Creates the element information toolbar
WebDeveloper.ElementAncestors.createToolbar = function()
{
  WebDeveloper.Common.configureElement(WebDeveloper.Common.getMainWindow().document.getElementById("web-developer-element-ancestors-toolbar"), "hidden", false);
};

// Displays the ancestors of an element
WebDeveloper.ElementAncestors.displayElementAncestors = function(element)
{
  var contentDocument = WebDeveloper.Common.getMainWindow().document.getElementById("web-developer-element-ancestors-browser").contentDocument;

  contentDocument.defaultView.WebDeveloper.Generated.populateAncestors(WebDeveloper.ElementAncestors.getAncestorInformation(element, contentDocument));
};

// Generates ancestor information for an element
WebDeveloper.ElementAncestors.generateAncestorInformation = function(element, contentDocument)
{
  var ancestorInformation = contentDocument.createElement("div");
  var buttonElement       = contentDocument.createElement("button");

  buttonElement.appendChild(contentDocument.createTextNode(WebDeveloper.Locales.getString("copyAncestorPath")));
  buttonElement.setAttribute("class", "btn btn-primary");
  buttonElement.setAttribute("id", "web-developer-copy-ancestor-path");
  ancestorInformation.appendChild(buttonElement);
  ancestorInformation.appendChild(WebDeveloper.ElementAncestors.getAncestorInformation(element, contentDocument));
  ancestorInformation.setAttribute("id", "web-developer-ancestors");

  return ancestorInformation;
};

// Removes the element information toolbar
WebDeveloper.ElementAncestors.removeToolbar = function()
{
  WebDeveloper.Common.configureElement(WebDeveloper.Common.getMainWindow().document.getElementById("web-developer-element-ancestors-toolbar"), "hidden", true);
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.LineGuides = WebDeveloper.LineGuides || {};

// Creates the line guides events
WebDeveloper.LineGuides.createEvents = function(contentDocument)
{
  contentDocument.addEventListener("mousemove", WebDeveloper.LineGuides.mouseMove, false);
  contentDocument.addEventListener("resize", WebDeveloper.LineGuides.resize, false);
};

// Creates the line guides toolbar
WebDeveloper.LineGuides.createToolbar = function()
{
  document.getElementById("web-developer-line-guides-color").color = WebDeveloper.Preferences.getExtensionStringPreference("line.guides.color");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-line-guides-toolbar"), "hidden", false);
};

// Returns the line guides color
WebDeveloper.LineGuides.getColor = function()
{
  return WebDeveloper.Preferences.getExtensionStringPreference("line.guides.color");
};

// Hides the line guide information
WebDeveloper.LineGuides.hideInformation = function()
{
  document.getElementById("web-developer-line-guides-information").hidden = true;
};

// Removes the line guides events
WebDeveloper.LineGuides.removeEvents = function(contentDocument)
{
  contentDocument.removeEventListener("mousemove", WebDeveloper.LineGuides.moveLineGuide, false);
  contentDocument.removeEventListener("resize", WebDeveloper.LineGuides.resizeLineGuides, false);
};

// Removes the line guides toolbar
WebDeveloper.LineGuides.removeToolbar = function()
{
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-line-guides-toolbar"), "hidden", true);
};

// Updates the line guides color
WebDeveloper.LineGuides.updateColor = function()
{
  var color      = document.getElementById("web-developer-line-guides-color").color;
  var lineGuides = WebDeveloper.Common.getContentDocument().querySelectorAll(".web-developer-line-guide div");

  // Loop through the line guides
  for(var i = 0, l = lineGuides.length; i < l; i++)
  {
    lineGuides[i].style.backgroundColor = color;
  }

  WebDeveloper.Preferences.setExtensionStringPreference("line.guides.color", color);
};

// Updates the line guide information
WebDeveloper.LineGuides.updateInformation = function(position, previousPosition, nextPosition)
{
  document.getElementById("web-developer-line-guide-position").value          = position + "px";
  document.getElementById("web-developer-next-line-guide-position").value     = nextPosition + "px";
  document.getElementById("web-developer-previous-line-guide-position").value = previousPosition + "px";
  document.getElementById("web-developer-line-guides-information").hidden     = false;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.PageMagnifier = WebDeveloper.PageMagnifier || {};

// Creates the page magnifier
WebDeveloper.PageMagnifier.createPageMagnifier = function()
{
  var browserBoxObject = WebDeveloper.Common.getSelectedBrowser().boxObject;
  var container        = document.getElementById("web-developer-page-magnifier-container");

  WebDeveloper.PageMagnifier.update(0, 0);

  container.addEventListener("DOMMouseScroll", WebDeveloper.PageMagnifier.mouseScroll, true);
  window.addEventListener("mousemove", WebDeveloper.PageMagnifier.mouseMove, false);

  container.style.left = (browserBoxObject.x + 50) + "px";
  container.style.top  = (browserBoxObject.y + 50) + "px";
  container.hidden     = false;
};

// Creates the page magnifier toolbar
WebDeveloper.PageMagnifier.createToolbar = function()
{
  document.getElementById("web-developer-magnification-level").value = WebDeveloper.Preferences.getExtensionStringPreference("magnification.level");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-page-magnifier-toolbar"), "hidden", false);
};

// Displays a page magnifier
WebDeveloper.PageMagnifier.displayPageMagnifier = function(display)
{
  // If displaying a page magnifier
  if(display)
  {
    WebDeveloper.PageMagnifier.createPageMagnifier();
    WebDeveloper.PageMagnifier.createToolbar();
  }
  else
  {
    WebDeveloper.PageMagnifier.removePageMagnifier();
    WebDeveloper.PageMagnifier.removeToolbar();
  }
};

// Handles the mouse move event
WebDeveloper.PageMagnifier.mouseMove = function(event)
{
  var canvas      = document.getElementById("web-developer-page-magnifier");
  var eventTarget = event.target;

  // If the canvas and event target are set and the canvas is the event target
  if(canvas && eventTarget && canvas == eventTarget)
  {
    var container = document.getElementById("web-developer-page-magnifier-container");

    // If the container is set
    if(container)
    {
      var browserBoxObject   = WebDeveloper.Common.getSelectedBrowser().boxObject;
      var browserXPosition   = browserBoxObject.x;
      var browserYPosition   = browserBoxObject.y;
      var canvasHalfHeight   = canvas.height / 2;
      var canvasHalfWidth    = canvas.width / 2;
      var containerXPosition = event.clientX - canvasHalfWidth;
      var containerYPosition = event.clientY - canvasHalfHeight;
      var documentElement    = WebDeveloper.Common.getContentDocument().documentElement;
      var magnificationLevel = parseFloat(WebDeveloper.Preferences.getExtensionStringPreference("magnification.level"));
      var magnifierXPosition = event.clientX - browserXPosition - (canvasHalfWidth / magnificationLevel) + documentElement.scrollLeft;
      var magnifierYPosition = event.clientY - browserYPosition - (canvasHalfHeight / magnificationLevel) + documentElement.scrollTop;

      // If the container X position is less than the browser X position
      if(containerXPosition < browserXPosition)
      {
        containerXPosition = browserXPosition;
      }

      // If the container Y position is less than the browser Y position
      if(containerYPosition < browserYPosition)
      {
        containerYPosition = browserYPosition;
      }

      // If the magnifier X position is less than 0
      if(magnifierXPosition < 0)
      {
        magnifierXPosition = 0;
      }

      // If the magnifier Y position is less than 0
      if(magnifierYPosition < 0)
      {
        magnifierYPosition = 0;
      }

      container.style.left = containerXPosition + "px";
      container.style.top  = containerYPosition + "px";

      WebDeveloper.PageMagnifier.update(magnifierXPosition, magnifierYPosition);
    }
  }
};

// Handles the mouse scroll event
WebDeveloper.PageMagnifier.mouseScroll = function(event)
{
  var eventDetail = event.detail;

  // If the event detail is set
  if(eventDetail)
  {
    var magnificationLevel = parseFloat(WebDeveloper.Preferences.getExtensionStringPreference("magnification.level"));

    // If the event detail is greater than zero (scroll down)
    if(eventDetail > 0)
    {
      // If the magnification level is greater than one
      if(magnificationLevel > 1)
      {
        magnificationLevel -= 1;
      }
    }
    else
    {
      magnificationLevel += 1;
    }

    document.getElementById("web-developer-magnification-level").value = magnificationLevel;

    WebDeveloper.Preferences.setExtensionStringPreference("magnification.level", magnificationLevel);
    WebDeveloper.PageMagnifier.update(0, 0);

    event.stopPropagation();
    event.preventDefault();
  }
};

// Removes the page magnifier
WebDeveloper.PageMagnifier.removePageMagnifier = function()
{
  var container = document.getElementById("web-developer-page-magnifier-container");

  container.removeEventListener("DOMMouseScroll", WebDeveloper.PageMagnifier.mouseScroll, true);
  window.removeEventListener("mousemove", WebDeveloper.PageMagnifier.mouseMove, false);

  container.hidden = true;
};

// Removes the page magnifier toolbar
WebDeveloper.PageMagnifier.removeToolbar = function()
{
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-page-magnifier-toolbar"), "hidden", true);
};

// Updates the magnification level
WebDeveloper.PageMagnifier.updateMagnificationLevel = function(element)
{
  var magnificationLevel = element.value;

  // If the magnification level is empty or not a number or less than zero
  if(!magnificationLevel || parseFloat(magnificationLevel) != magnificationLevel || magnificationLevel <= 0)
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("displayPageMagnifier"), WebDeveloper.Locales.getString("invalidMagnificationLevel"));
  }
  else
  {
    WebDeveloper.Preferences.setExtensionStringPreference("magnification.level", magnificationLevel);
    WebDeveloper.PageMagnifier.update(0, 0);
  }
};

// Updates the page magnifier
WebDeveloper.PageMagnifier.update = function(xPosition, yPosition)
{
  var canvas = document.getElementById("web-developer-page-magnifier");

  // If the canvas was found
  if(canvas)
  {
    var context            = canvas.getContext("2d");
    var height             = canvas.height;
    var magnificationLevel = parseFloat(WebDeveloper.Preferences.getExtensionStringPreference("magnification.level"));
    var width              = canvas.width;

    // If the magnification level is not valid
    if(typeof magnificationLevel == "number" && isNaN(magnificationLevel))
    {
      magnificationLevel = 2;
    }

    context.save();
    context.scale(magnificationLevel, magnificationLevel);
    context.drawWindow(WebDeveloper.Common.getContentWindow(), xPosition, yPosition, (xPosition + width) / magnificationLevel, (yPosition + height) / magnificationLevel, "rgb(255, 255, 255)");
    context.restore();
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.PageValidation               = WebDeveloper.PageValidation || {};
WebDeveloper.PageValidation.cssValidator  = null;
WebDeveloper.PageValidation.htmlValidator = null;
WebDeveloper.PageValidation.selectedTab   = 0;

// Clears the CSS validation details for the page
WebDeveloper.PageValidation.clearCSSValidation = function()
{
  var validationButton = document.getElementById("web-developer-css-validation");

  // If the validation button is set
  if(validationButton)
  {
    validationButton.label = "";

    // If the validation button has a class attribute
    if(validationButton.hasAttribute("class"))
    {
      validationButton.removeAttribute("class");
    }
  }

  // If the CSS validator is set
  if(WebDeveloper.PageValidation.cssValidator)
  {
    WebDeveloper.PageValidation.cssValidator.cleanUp();
  }
};

// Clears the HTML validation details for the page
WebDeveloper.PageValidation.clearHTMLValidation = function()
{
  var validationButton = document.getElementById("web-developer-html-validation");

  // If the validation button is set
  if(validationButton)
  {
    validationButton.label = "";

    // If the validation button has a class attribute
    if(validationButton.hasAttribute("class"))
    {
      validationButton.removeAttribute("class");
    }
  }

  // If the HTML validator is set
  if(WebDeveloper.PageValidation.htmlValidator)
  {
    WebDeveloper.PageValidation.htmlValidator.cleanUp();
  }
};

// Creates the page validation toolbar
WebDeveloper.PageValidation.createToolbar = function()
{
  var contentDocument = WebDeveloper.Common.getContentDocument();

  WebDeveloper.PageValidation.cssValidator  = new WebDeveloperValidateCSS();
  WebDeveloper.PageValidation.htmlValidator = new WebDeveloperValidateHTML();

  WebDeveloper.PageValidation.updateCSSValidation(contentDocument);
  WebDeveloper.PageValidation.updateHTMLValidation(contentDocument, WebDeveloper.Common.getContentWindow());

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-page-validation-toolbar"), "hidden", false);

  // Try to get the tab browser
  try
  {
    var tabBrowser = WebDeveloper.Common.getTabBrowser();

    // If the tab browser is set
    if(tabBrowser)
    {
      var tabContainer = tabBrowser.tabContainer;

      tabBrowser.addEventListener("load", WebDeveloper.PageValidation.pageLoad, true);
      tabBrowser.addEventListener("unload", WebDeveloper.PageValidation.pageUnload, true);

      // If the tab container is set
      if(tabContainer)
      {
        tabContainer.addEventListener("TabSelect", WebDeveloper.PageValidation.tabSelect, false);
      }
    }
  }
  catch(exception)
  {
    // Ignore
  }
};

// Displays a page validation toolbar
WebDeveloper.PageValidation.displayPageValidation = function(display)
{
  WebDeveloper.PageValidation.clearCSSValidation();
  WebDeveloper.PageValidation.clearHTMLValidation();

  // If displaying a page magnifier
  if(display)
  {
    WebDeveloper.PageValidation.createToolbar();
  }
  else
  {
    WebDeveloper.PageValidation.removeToolbar();
  }
};

// Checks if the page is validatable
WebDeveloper.PageValidation.isValidatablePage = function(uri)
{
  // If the URI is set and is validatable
  if(uri && uri != "about:blank" && uri != "http://www.hermish.com/check_this.cfm" && uri != "http://jigsaw.w3.org/css-validator/validator" && uri != "http://validator.w3.org/check")
  {
    return true;
  }

  return false;
};

// Handles the page being loaded
WebDeveloper.PageValidation.pageLoad = function(event)
{
  var originalTarget = event.originalTarget;

  // If the event came from an HTML document and it is not a frame
  if(originalTarget instanceof HTMLDocument && !originalTarget.defaultView.frameElement)
  {
    var contentDocument = WebDeveloper.Common.getContentDocument();

    WebDeveloper.PageValidation.clearCSSValidation();
    WebDeveloper.PageValidation.clearHTMLValidation();

    // If the page is validatable
    if(WebDeveloper.PageValidation.isValidatablePage(contentDocument.documentURI))
    {
      WebDeveloper.PageValidation.updateCSSValidation(contentDocument);
      WebDeveloper.PageValidation.updateHTMLValidation(contentDocument, WebDeveloper.Common.getContentWindow());
    }
  }
};

// Handles the page being unloaded
WebDeveloper.PageValidation.pageUnload = function(event)
{
  var originalTarget = event.originalTarget;

  // If the event came from an HTML document and it is not a frame
  if(originalTarget instanceof HTMLDocument && !originalTarget.defaultView.frameElement)
  {
    WebDeveloper.PageValidation.clearCSSValidation();
    WebDeveloper.PageValidation.clearHTMLValidation();
  }
};

// Handles a tab being selected
WebDeveloper.PageValidation.tabSelect = function()
{
  var tabBrowser  = WebDeveloper.Common.getTabBrowser();
  var selectedTab = tabBrowser.mTabBox.selectedIndex;

  // If the selected tab is different
  if(selectedTab != WebDeveloper.PageValidation.selectedTab)
  {
    var contentDocument = WebDeveloper.Common.getContentDocument();

    WebDeveloper.PageValidation.selectedTab = selectedTab;

    WebDeveloper.PageValidation.clearCSSValidation();
    WebDeveloper.PageValidation.clearHTMLValidation();

    // If the page is validatable
    if(WebDeveloper.PageValidation.isValidatablePage(contentDocument.documentURI))
    {
      WebDeveloper.PageValidation.updateCSSValidation(contentDocument);
      WebDeveloper.PageValidation.updateHTMLValidation(contentDocument, WebDeveloper.Common.getContentWindow());
    }
  }
};

// Removes the page validation toolbar
WebDeveloper.PageValidation.removeToolbar = function()
{
  WebDeveloper.PageValidation.cssValidator  = null;
  WebDeveloper.PageValidation.htmlValidator = null;

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-page-validation-toolbar"), "hidden", true);

  // Try to get the tab browser
  try
  {
    var tabBrowser = WebDeveloper.Common.getTabBrowser();

    // If the tab browser is set
    if(tabBrowser)
    {
      var tabContainer = tabBrowser.tabContainer;

      tabBrowser.removeEventListener("load", WebDeveloper.PageValidation.pageLoad, true);
      tabBrowser.removeEventListener("unload", WebDeveloper.PageValidation.pageUnload, true);

      // If the tab container is set
      if(tabContainer)
      {
        tabContainer.removeEventListener("TabSelect", WebDeveloper.PageValidation.tabSelect, false);
      }
    }
  }
  catch(exception)
  {
    // Ignore
  }
};

// Updates the CSS validation for the page
WebDeveloper.PageValidation.updateCSSValidation = function(contentDocument)
{
  WebDeveloper.PageValidation.updateValidation(document.getElementById("web-developer-css-validation"));
  WebDeveloper.PageValidation.cssValidator.cleanUp();
  WebDeveloper.PageValidation.cssValidator.validateBackgroundCSS(Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(contentDocument.documentURI, null, null), WebDeveloper.Content.getCSS());
};

// Updates the CSS validation details for the page
WebDeveloper.PageValidation.updateCSSValidationDetails = function()
{
  // If the CSS validation request is set and is ready
  if(WebDeveloper.PageValidation.cssValidator.validationRequest && WebDeveloper.PageValidation.cssValidator.validationRequest.readyState == 4)
  {
    WebDeveloper.PageValidation.updateValidationDetails(WebDeveloper.PageValidation.cssValidator.validationRequest, document.getElementById("web-developer-css-validation"));
    WebDeveloper.PageValidation.cssValidator.cleanUp();
  }
};

// Updates the HTML validation for the page
WebDeveloper.PageValidation.updateHTMLValidation = function(contentDocument, contentWindow)
{
  WebDeveloper.PageValidation.updateValidation(document.getElementById("web-developer-html-validation"));
  WebDeveloper.PageValidation.htmlValidator.cleanUp();
  WebDeveloper.PageValidation.htmlValidator.validateBackgroundHTML(Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(contentDocument.documentURI, null, null), contentWindow);
};

// Updates the HTML validation details for the page
WebDeveloper.PageValidation.updateHTMLValidationDetails = function()
{
  // If the HTML validation request is set and is ready
  if(WebDeveloper.PageValidation.htmlValidator.validationRequest && WebDeveloper.PageValidation.htmlValidator.validationRequest.readyState == 4)
  {
    WebDeveloper.PageValidation.updateValidationDetails(WebDeveloper.PageValidation.htmlValidator.validationRequest, document.getElementById("web-developer-html-validation"));
    WebDeveloper.PageValidation.htmlValidator.cleanUp();
  }
};

// Updates the validation for the page
WebDeveloper.PageValidation.updateValidation = function(validationButton)
{
  // If the validation button is set
  if(validationButton)
  {
    validationButton.label = WebDeveloper.Locales.getString("validating");

    validationButton.setAttribute("class", "loading");
  }
};

// Updates the validation details for the page
WebDeveloper.PageValidation.updateValidationDetails = function(validationRequest, validationButton)
{
  // Try to check the validation status
  try
  {
    // If the validation status is set to success
    if(validationRequest.status == 200)
    {
      var validationStatus = validationRequest.getResponseHeader("X-W3C-Validator-Status");

      // If the validation button and validation status are set
      if(validationButton && validationStatus)
      {
        // If the validation status is valid
        if(validationStatus == "Valid")
        {
          validationButton.label = WebDeveloper.Locales.getString("valid");

          validationButton.setAttribute("class", "valid");
        }
        else if(validationStatus == "Abort")
        {
          validationButton.label = "";

          // If the validation button has a class
          if(validationButton.hasAttribute("class"))
          {
            validationButton.removeAttribute("class");
          }
        }
        else
        {
          validationButton.label = WebDeveloper.Locales.getString("invalid") + ": " + validationRequest.getResponseHeader("X-W3C-Validator-Errors") + " " + WebDeveloper.Locales.getString("errors").toLowerCase();

          validationButton.setAttribute("class", "invalid");
        }
      }
    }
    else
    {
      // If the validation button is set
      if(validationButton)
      {
        validationButton.label = "";

        // If the validation button has a class
        if(validationButton.hasAttribute("class"))
        {
          validationButton.removeAttribute("class");
        }
      }
    }
  }
  catch(exception)
  {
    // Ignore
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Ruler = WebDeveloper.Ruler || {};

// Converts a hex color to RGB
WebDeveloper.Ruler.convertHexColorToRGB = function(hexColor, opacity)
{
  return "rgba(" + parseInt(hexColor.substring(1, 3), 16) + "," + parseInt(hexColor.substring(3, 5), 16) + "," + parseInt(hexColor.substring(5, 7), 16) + "," + opacity + ")";
};

// Creates the ruler events
WebDeveloper.Ruler.createEvents = function(contentDocument)
{
  contentDocument.addEventListener("mousedown", WebDeveloper.Ruler.mouseDown, true);
  contentDocument.addEventListener("mousemove", WebDeveloper.Ruler.mouseMove, false);
  contentDocument.addEventListener("mouseup", WebDeveloper.Ruler.mouseUp, true);
  contentDocument.addEventListener("resize", WebDeveloper.Ruler.resizeDocument, false);
};

// Creates the ruler toolbar
WebDeveloper.Ruler.createToolbar = function()
{
  document.getElementById("web-developer-ruler-color").color = WebDeveloper.Preferences.getExtensionStringPreference("ruler.color");

  WebDeveloper.Common.configureElement(document.getElementById("web-developer-ruler-toolbar"), "hidden", false);
  WebDeveloper.Ruler.updateColor();
};

// Removes the ruler events
WebDeveloper.Ruler.removeEvents = function(contentDocument)
{
  contentDocument.removeEventListener("mousedown", WebDeveloper.Ruler.mouseDown, true);
  contentDocument.removeEventListener("mousemove", WebDeveloper.Ruler.mouseMove, false);
  contentDocument.removeEventListener("mouseup", WebDeveloper.Ruler.mouseUp, true);
  contentDocument.removeEventListener("resize", WebDeveloper.Ruler.resizeDocument, false);
};

// Removes the ruler toolbar
WebDeveloper.Ruler.removeToolbar = function()
{
  WebDeveloper.Common.configureElement(document.getElementById("web-developer-ruler-toolbar"), "hidden", true);
};

// Updates the ruler color
WebDeveloper.Ruler.updateColor = function()
{
  var color           = document.getElementById("web-developer-ruler-color").color;
  var backgroundColor = WebDeveloper.Ruler.convertHexColorToRGB(color, "0.25");
  var contentDocument = WebDeveloper.Common.getContentDocument();
  var rulerElements   = contentDocument.querySelectorAll("#web-developer-ruler, #web-developer-ruler div");

  // Loop through the ruler elements
  for(var i = 0, l = rulerElements.length; i < l; i++)
  {
    rulerElements[i].style.borderColor = color;
  }

  rulerElements = contentDocument.querySelectorAll("#web-developer-ruler div");

  // Loop through the ruler elements
  for(i = 0, l = rulerElements.length; i < l; i++)
  {
    rulerElements[i].style.backgroundColor = backgroundColor;
  }

  WebDeveloper.Preferences.setExtensionStringPreference("ruler.color", color);
};

// Updates the ruler height
WebDeveloper.Ruler.updateHeight = function(element)
{
  var height = element.value.replace(/px/gi, "");

  // If the height is empty or not a number or less than zero
  if(!height || parseInt(height, 10) != height || height <= 0)
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("displayRuler"), WebDeveloper.Locales.getString("invalidHeight"));
  }
  else
  {
    var contentDocument = WebDeveloper.Common.getContentDocument();

    height                                = parseInt(height, 10);
    WebDeveloper.Ruler.ruler.style.height = (height - 2) + "px";
    WebDeveloper.Ruler.endY               = WebDeveloper.Ruler.startY + height;

    WebDeveloper.Ruler.resizeBackgrounds();
    WebDeveloper.Ruler.updateInformation(contentDocument);
  }
};

// Updates the ruler information
WebDeveloper.Ruler.updateInformation = function()
{
  // If the ruler is set
  if(WebDeveloper.Ruler.ruler)
  {
    document.getElementById("web-developer-ruler-height").value = WebDeveloper.Ruler.ruler.offsetHeight + "px";
    document.getElementById("web-developer-ruler-width").value  = WebDeveloper.Ruler.ruler.offsetWidth + "px";

    // If the end x position is greater than the start x position
    if(WebDeveloper.Ruler.endX > WebDeveloper.Ruler.startX)
    {
      document.getElementById("web-developer-ruler-end-x").value   = (WebDeveloper.Ruler.endX + 2) + "px";
      document.getElementById("web-developer-ruler-start-x").value = WebDeveloper.Ruler.startX + "px";
    }
    else
    {
      document.getElementById("web-developer-ruler-end-x").value   = WebDeveloper.Ruler.endX + "px";
      document.getElementById("web-developer-ruler-start-x").value = (WebDeveloper.Ruler.startX + 2) + "px";
    }

    // If the end y position is greater than the start y position
    if(WebDeveloper.Ruler.endY > WebDeveloper.Ruler.startY)
    {
      document.getElementById("web-developer-ruler-end-y").value   = (WebDeveloper.Ruler.endY + 2) + "px";
      document.getElementById("web-developer-ruler-start-y").value = WebDeveloper.Ruler.startY + "px";
    }
    else
    {
      document.getElementById("web-developer-ruler-end-y").value   = WebDeveloper.Ruler.endY + "px";
      document.getElementById("web-developer-ruler-start-y").value = (WebDeveloper.Ruler.startY + 2) + "px";
    }
  }
};

// Updates the ruler width
WebDeveloper.Ruler.updateWidth = function(element)
{
  var width = element.value.replace(/px/gi, "");

  // If the width is empty or not a number or less than zero
  if(!width || parseInt(width, 10) != width || width <= 0)
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("displayRuler"), WebDeveloper.Locales.getString("invalidWidth"));
  }
  else
  {
    var contentDocument = WebDeveloper.Common.getContentDocument();

    width                                = parseInt(width, 10);
    WebDeveloper.Ruler.ruler.style.width = (width - 2) + "px";
    WebDeveloper.Ruler.endX              = WebDeveloper.Ruler.startX + width;

    WebDeveloper.Ruler.resizeBackgrounds();
    WebDeveloper.Ruler.updateInformation(contentDocument);
  }
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Upgrade = WebDeveloper.Upgrade || {};

// Returns the legacy extension preferences branch
WebDeveloper.Upgrade.getLegacyExtensionBranch = function()
{
  return WebDeveloper.Preferences.getBranch("webdeveloper.");
};

// Migrate to version 1.2
WebDeveloper.Upgrade.migrate12 = function()
{
  WebDeveloper.Upgrade.migrateLegacyBooleanPreference("confirmation.dialogs.hide");
  WebDeveloper.Upgrade.migrateLegacyBooleanPreference("context.hide");
  WebDeveloper.Upgrade.migrateLegacyStringPreference("dashboard.position");
  WebDeveloper.Upgrade.migrateLegacyBooleanPreference("edit.stick", "edit.css.pin");
  WebDeveloper.Upgrade.migrateLegacyIntegerPreference("font.minimum.size");
  WebDeveloper.Upgrade.migrateLegacyStringPreference("magnification.level");
  WebDeveloper.Upgrade.migrateLegacyBooleanPreference("menu.hide");
  WebDeveloper.Upgrade.migrateLegacyBooleanPreference("persist.features", "pin.features");
  WebDeveloper.Upgrade.migrateLegacyStringPreference("populate.form.fields.email", "populate.email.address");
  WebDeveloper.Upgrade.migrateLegacyBooleanPreference("resize.viewport");
  WebDeveloper.Upgrade.migrateLegacyStringPreference("toolbar.icons");

  WebDeveloper.Upgrade.migrateLegacyResizePreferences();
  WebDeveloper.Upgrade.migrateLegacyToolPreferences();

  WebDeveloper.Preferences.deletePreferenceBranch(WebDeveloper.Upgrade.getLegacyExtensionBranch());
};

// Migrates a legacy boolean preference
WebDeveloper.Upgrade.migrateLegacyBooleanPreference = function(legacyPreference, preference)
{
  var value = null;

  // If the preference is not set
  if(!preference)
  {
    preference = legacyPreference;
  }

  value = WebDeveloper.Preferences.getBooleanPreference(legacyPreference, WebDeveloper.Upgrade.getLegacyExtensionBranch());

  // If the value is set
  if(value)
  {
    WebDeveloper.Preferences.setExtensionBooleanPreference(preference, value);
  }
};

// Migrates a legacy integer preference
WebDeveloper.Upgrade.migrateLegacyIntegerPreference = function(legacyPreference, preference)
{
  var legacyBranch = WebDeveloper.Upgrade.getLegacyExtensionBranch();

  // If the preference is not set
  if(!preference)
  {
    preference = legacyPreference;
  }

  // If the legacy preference is set
  if(WebDeveloper.Preferences.isPreferenceSet(legacyPreference, legacyBranch))
  {
    var value = WebDeveloper.Preferences.getIntegerPreference(legacyPreference, legacyBranch);

    // If the value does not equal the new preference
    if(value !== WebDeveloper.Preferences.getExtensionIntegerPreference(preference))
    {
      WebDeveloper.Preferences.setExtensionIntegerPreference(preference, value);
    }
  }
};

// Migrates the legacy resize preferences
WebDeveloper.Upgrade.migrateLegacyResizePreferences = function()
{
  var legacyBranch = WebDeveloper.Upgrade.getLegacyExtensionBranch();
  var preference   = "resize.count";
  var resizeCount  = WebDeveloper.Preferences.getIntegerPreference(preference, legacyBranch);
  var value        = null;

  // If the resize count is greater than the new preference
  if(resizeCount > WebDeveloper.Preferences.getExtensionIntegerPreference(preference))
  {
    WebDeveloper.Preferences.setExtensionIntegerPreference(preference, resizeCount);
  }

  // Loop through the possible resize options
  for(var i = 1; i <= resizeCount; i++)
  {
    preference = "resize." + i + ".description";
    value      = WebDeveloper.Preferences.getStringPreference(preference, legacyBranch);

    // If the legacy description is set and does not equal the new preference
    if(value && value !== WebDeveloper.Preferences.getLocalizedPreference(preference))
    {
      WebDeveloper.Preferences.setExtensionStringPreference(preference, value);
    }

    preference = "resize." + i + ".height";
    value      = WebDeveloper.Preferences.getIntegerPreference(preference, legacyBranch);

    // If the legacy height is set and does not equal the new preference
    if(value > 0 && value !== WebDeveloper.Preferences.getExtensionIntegerPreference(preference))
    {
      WebDeveloper.Preferences.setExtensionIntegerPreference(preference, value);
    }

    preference = "resize." + i + ".width";
    value    = WebDeveloper.Preferences.getIntegerPreference(preference, legacyBranch);

    // If the legacy width is set and does not equal the new preference
    if(value > 0 && value !== WebDeveloper.Preferences.getExtensionIntegerPreference(preference))
    {
      WebDeveloper.Preferences.setExtensionIntegerPreference(preference, value);
    }

    preference = "resize." + i + ".viewport";
    value      = WebDeveloper.Preferences.getBooleanPreference(preference, legacyBranch);

    // If the legacy viewport is set
    if(value)
    {
      WebDeveloper.Preferences.setExtensionBooleanPreference(preference, value);
    }
  }
};

// Migrates a legacy string preference
WebDeveloper.Upgrade.migrateLegacyStringPreference = function(legacyPreference, preference)
{
  var legacyBranch = WebDeveloper.Upgrade.getLegacyExtensionBranch();

  // If the preference is not set
  if(!preference)
  {
    preference = legacyPreference;
  }

  // If the legacy preference is set
  if(WebDeveloper.Preferences.isPreferenceSet(legacyPreference, legacyBranch))
  {
    var value = WebDeveloper.Preferences.getStringPreference(legacyPreference, legacyBranch);

    // If the value does not equal the new preference
    if(value !== WebDeveloper.Preferences.getExtensionStringPreference(preference))
    {
      WebDeveloper.Preferences.setExtensionStringPreference(preference, value);
    }
  }
};

// Migrates the legacy tool preferences
WebDeveloper.Upgrade.migrateLegacyToolPreferences = function()
{
  var legacyBranch = WebDeveloper.Upgrade.getLegacyExtensionBranch();
  var preference   = "tool.count";
  var toolCount    = WebDeveloper.Preferences.getIntegerPreference(preference, legacyBranch);
  var value        = null;

  // If the tool count is greater than the new preference
  if(toolCount > WebDeveloper.Preferences.getExtensionIntegerPreference(preference))
  {
    WebDeveloper.Preferences.setExtensionIntegerPreference(preference, toolCount);
  }

  // Loop through the possible tools
  for(var i = 1; i <= toolCount; i++)
  {
    preference = "tool." + i + ".separator";
    value      = WebDeveloper.Preferences.getBooleanPreference(preference, legacyBranch);

    // If the legacy separator is set and does not equal the new preference
    if(value && value !== WebDeveloper.Preferences.getExtensionBooleanPreference(preference))
    {
      WebDeveloper.Preferences.setExtensionBooleanPreference(preference, value);
    }
    else
    {
      preference = "tool." + i + ".description";
      value      = WebDeveloper.Preferences.getStringPreference(preference, legacyBranch);

      // If the legacy description is set and does not equal the new preference
      if(value && value !== WebDeveloper.Preferences.getLocalizedPreference(preference))
      {
        WebDeveloper.Preferences.setExtensionStringPreference(preference, value);
      }

      preference = "tool." + i + ".path";
      value      = WebDeveloper.Preferences.getStringPreference(preference, legacyBranch);

      // If the legacy path is set and does not equal the new preference
      if(value && value !== WebDeveloper.Preferences.getExtensionStringPreference(preference))
      {
        WebDeveloper.Preferences.setExtensionStringPreference(preference, value);
      }

      preference = "tool." + i + ".url";
      value      = WebDeveloper.Preferences.getStringPreference(preference, legacyBranch);

      // If the legacy url is set and does not equal the new preference
      if(value && value !== WebDeveloper.Preferences.getExtensionStringPreference(preference))
      {
        WebDeveloper.Preferences.setExtensionStringPreference(preference, value);
      }
    }
  }
};

// Opens the upgrade URL
WebDeveloper.Upgrade.openUpgradeURL = function(version)
{
  // Set a timeout to make sure the window has finished loading
  window.setTimeout(function()
  {
    var tabBrowser = WebDeveloper.Common.getTabBrowser();
    var newTab     = tabBrowser.addTab("http://chrispederick.com/work/web-developer/firefox/installed/" + version.replace(".", "") + "/");

    tabBrowser.selectedTab = newTab;
  }, 0);
};

// Upgrades the extension
WebDeveloper.Upgrade.upgrade = function()
{
  var beta            = "1.2.5".indexOf("b") != -1;
  var previousVersion = WebDeveloper.Preferences.getExtensionStringPreference("version");
  var version         = WebDeveloper.Upgrade.formatVersionNumber("1.2.5");

  // If the versions do not match
  if(previousVersion != version)
  {
    // If this is a beta version
    if(beta)
    {
      WebDeveloper.Preferences.setExtensionBooleanPreference("beta", true);
    }

    WebDeveloper.Upgrade.migrate12();
    WebDeveloper.Preferences.setExtensionStringPreference("version", version);
    WebDeveloper.Upgrade.openUpgradeURL(version);
  }
  else if(WebDeveloper.Preferences.getExtensionBooleanPreference("beta") && !beta)
  {
    WebDeveloper.Preferences.deleteExtensionPreference("beta");
    WebDeveloper.Upgrade.openUpgradeURL(version);
  }
};
// Constructs a validate CSS object
function WebDeveloperValidateCSS()
{
  this.file              = null;
  this.validationRequest = null;
}

// Cleans up
WebDeveloperValidateCSS.prototype.cleanUp = function()
{
  // If the file is set
  if(this.file)
  {
    // Try to delete the file
    try
    {
      this.file.remove(false);
    }
    catch(exception)
    {
      // Ignore
    }

    this.file = null;
  }

  // If the validation request is set
  if(this.validationRequest)
  {
    this.validationRequest.abort();
  }
};

// Creates a source file
WebDeveloperValidateCSS.prototype.createSourceFile = function(uri)
{
  var temporaryDirectory = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);

  // If the temporary directory exists, is a directory and is writable
  if(temporaryDirectory.exists() && temporaryDirectory.isDirectory() && temporaryDirectory.isWritable())
  {
    var fileName   = "";
    var sourceFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

    // Try to get the host
    try
    {
      fileName = uri.host;
    }
    catch(exception)
    {
      // Ignore
    }

    temporaryDirectory.append("web-developer-" + fileName + "-" + new Date().getTime() + ".css");
    sourceFile.initWithPath(temporaryDirectory.path);

    return sourceFile;
  }
  else
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("validateCSS"), WebDeveloper.Locales.getFormattedString("temporaryDirectoryFailed", [temporaryDirectory.path]));

    return null;
  }
};

// Returns the CSS as text
WebDeveloperValidateCSS.prototype.getCSS = function(css, callback)
{
  var contentDocument    = null;
  var cssText            = "";
  var documents          = css.documents;
  var styleSheets        = null;
  var urlContentRequests = [];

  // Loop through the documents
  for(var i = 0, l = documents.length; i < l; i++)
  {
    contentDocument = documents[i];
    styleSheets     = contentDocument.styleSheets;

    // If there are embedded styles
    if(contentDocument.embedded)
    {
      cssText += contentDocument.embedded;
    }

    // Loop through the style sheets
    for(var j = 0, m = styleSheets.length; j < m; j++)
    {
      urlContentRequests.push({ "url": styleSheets[j] });
    }
  }

  // If there are external style sheets to get the CSS from
  if(urlContentRequests.length)
  {
    WebDeveloper.Common.getURLContents(urlContentRequests, "", function()
    {
      // Loop through the URL content requests
      for(var k = 0, n = urlContentRequests.length; k < n; k++)
      {
        cssText += urlContentRequests[k].content;
      }

      callback(cssText);
    });
  }
  else
  {
    callback(cssText);
  }
};

// Parses the validation results by type
WebDeveloperValidateCSS.prototype.parseValidationResultsByType = function(type)
{
  var count         = 0;
  var resultsHTML   = this.validationRequest.responseText;
  var startPosition = resultsHTML.indexOf('<div id="' + type + '">');

  // If the start position is greater than 0
  if(startPosition > 0)
  {
    var endPosition = resultsHTML.indexOf("</div>", startPosition);

    // If the end position is greater than 0
    if(endPosition > 0)
    {
      count = resultsHTML.slice(startPosition, endPosition).split("<li>").length;
    }
  }

  // If the count is greater than 0
  if(count > 0)
  {
    return count - 1;
  }

  return 0;
};

// Validate the CSS from the given URI and document list in the background
WebDeveloperValidateCSS.prototype.validateBackgroundCSS = function(uri, css)
{
  var boundaryString = new Date().getTime();
  var boundary       = "--" + boundaryString;
  var fileName       = "css";
  var validator      = this;

  // Try to get the host
  try
  {
    fileName = uri.host;
  }
  catch(exception)
  {
    // Ignore
  }

  // If the validation request is not set
  if(!this.validationRequest)
  {
    this.validationRequest = new XMLHttpRequest();
  }

  this.validationRequest.onreadystatechange = WebDeveloper.PageValidation.updateCSSValidationDetails;

  this.validationRequest.open("post", "http://jigsaw.w3.org/css-validator/validator");
  this.validationRequest.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundaryString);

  this.getCSS(css, function(cssText)
  {
    var requestBody = boundary + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\"" + fileName + ".css\"\r\n";

    requestBody += "Content-Type: text/css\r\n\r\n";
    requestBody += cssText + "\r\n";
    requestBody += boundary + "\r\n";
    requestBody += "Content-Disposition: form-data; name=\"profile\"\r\n\r\ncss3\r\n";
    requestBody += boundary + "\r\n";
    requestBody += "Content-Disposition: form-data; name=\"usermedium\"\r\n\r\nall\r\n";
    requestBody += boundary + "\r\n";
    requestBody += "Content-Disposition: form-data; name=\"warning\"\r\n\r\n0\r\n";
    requestBody += boundary + "--";

    // Try to send the request
    try
    {
      validator.validationRequest.sendAsBinary(requestBody);
    }
    catch(exception2)
    {
      // Reset the validation request
      validator.validationRequest = new XMLHttpRequest();
    }
  });
};

// Validate the CSS from the given URI and document list
WebDeveloperValidateCSS.prototype.validateCSS = function(uri, css)
{
  var tab  = WebDeveloper.Common.getTabBrowser().getBrowserForTab(WebDeveloper.Common.openURL(WebDeveloper.Common.getChromeURL("validation/css.html")));
  var load = (function(validator, url)
  {
    var handler = function()
    {
      validator.getCSS(css, function(cssText)
      {
        var contentDocument = tab.contentDocument;
        var outputStream    = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);

        validator.file = validator.createSourceFile(url);

        validator.file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, parseInt(644, 8));
        outputStream.init(validator.file, parseInt(4, 16) | parseInt(8, 16) | parseInt(20, 16), parseInt(644, 8), null);

        outputStream.write(cssText, cssText.length);
        outputStream.close();

        contentDocument.getElementById("file").value = validator.file.path;

        contentDocument.getElementById("form").submit();
        window.setTimeout(function() { validator.cleanUp(); }, 1000);
      });

      tab.removeEventListener("load", handler, true);
    };

    return handler;
  })(this, uri);

  tab.addEventListener("load", load, true);
};
// Constructs a validate HTML object
function WebDeveloperValidateHTML()
{
  this.file              = null;
  this.fileElement       = null;
  this.formElement       = null;
  this.validationRequest = null;
}

// Cleans up
WebDeveloperValidateHTML.prototype.cleanUp = function()
{
  // If the file is set
  if(this.file)
  {
    // Try to delete the file
    try
    {
      this.file.remove(false);
    }
    catch(exception)
    {
      // Ignore
    }

    this.file = null;
  }

  // If the validation request is set
  if(this.validationRequest)
  {
    this.validationRequest.abort();
  }
};

// Creates a source file
WebDeveloperValidateHTML.prototype.createSourceFile = function(uri)
{
  var temporaryDirectory = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);

  // If the temporary directory exists, is a directory and is writable
  if(temporaryDirectory.exists() && temporaryDirectory.isDirectory() && temporaryDirectory.isWritable())
  {
    var fileName   = "";
    var sourceFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

    // Try to get the host
    try
    {
      fileName = uri.host;
    }
    catch(exception)
    {
      // Ignore
    }

    temporaryDirectory.append("web-developer-" + fileName + "-" + new Date().getTime() + ".html");
    sourceFile.initWithPath(temporaryDirectory.path);

    return sourceFile;
  }
  else
  {
    WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("validateHTML"), WebDeveloper.Locales.getFormattedString("temporaryDirectoryFailed", [temporaryDirectory.path]));

    return null;
  }
};

// Returns the post data
WebDeveloperValidateHTML.prototype.getPostData = function()
{
  // Try to get the post data
  try
  {
    var sessionHistory = getWebNavigation().sessionHistory;
    var entry          = sessionHistory.getEntryAtIndex(sessionHistory.index, false).QueryInterface(Components.interfaces.nsISHEntry);

    return entry.postData;
  }
  catch(exception)
  {
    return null;
  }
};

// Saves the HTML
WebDeveloperValidateHTML.prototype.saveHTML = function(uri, contentWindow)
{
  var webBrowserPersistInterface = Components.interfaces.nsIWebBrowserPersist;
  var webBrowserPersist          = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(webBrowserPersistInterface);

  webBrowserPersist.persistFlags     = webBrowserPersistInterface.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION | webBrowserPersistInterface.PERSIST_FLAGS_FROM_CACHE | webBrowserPersistInterface.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
  webBrowserPersist.progressListener = this;

  webBrowserPersist.saveURI(uri, null, uri, this.getPostData(), null, this.file, contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsILoadContext));
};

// Submits the background request to validate the HTML
WebDeveloperValidateHTML.prototype.submitBackgroundRequest = function()
{
  var boundaryString   = new Date().getTime();
  var boundary         = "--" + boundaryString;
  var converter        = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
  var inputStream      = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
  var scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
  var requestBody      = boundary + "\r\nContent-Disposition: form-data; name=\"uploaded_file\"; filename=\"" + this.file.leafName + "\"\r\n";

  converter.charset                         = WebDeveloper.Common.getContentDocument().characterSet;
  this.validationRequest.onreadystatechange = WebDeveloper.PageValidation.updateHTMLValidationDetails;

  inputStream.init(this.file, parseInt(1, 16), parseInt(444, 8), null);
  scriptableStream.init(inputStream);

  requestBody += "Content-Type: text/html\r\n\r\n";
  requestBody += converter.ConvertToUnicode(scriptableStream.read(scriptableStream.available())) + "\r\n";
  requestBody += boundary + "--";

  scriptableStream.close();
  inputStream.close();

  this.validationRequest.open("post", "http://validator.w3.org/check");

  // Try to set the request header
  try
  {
    this.validationRequest.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundaryString);
    this.validationRequest.sendAsBinary(requestBody);
  }
  catch(exception)
  {
    // Reset the validation request
    this.validationRequest = new XMLHttpRequest();
  }
};

// Submits the form to validate the HTML
WebDeveloperValidateHTML.prototype.submitForm = function()
{
  var that = this;

  this.fileElement.value = this.file.path;

  this.formElement.submit();

  window.setTimeout(function() { that.cleanUp(); }, 1000);
};

// Validate the HTML from the given URI in the background
WebDeveloperValidateHTML.prototype.validateBackgroundHTML = function(uri, contentWindow)
{
  this.file = this.createSourceFile(uri);

  // If the validation request is not set
  if(!this.validationRequest)
  {
    this.validationRequest = new XMLHttpRequest();
  }

  this.saveHTML(uri, contentWindow);
};

// Validate the HTML from the given URI
WebDeveloperValidateHTML.prototype.validateHTML = function(uri, contentWindow)
{
  var tab  = WebDeveloper.Common.getTabBrowser().getBrowserForTab(WebDeveloper.Common.openURL(WebDeveloper.Common.getChromeURL("validation/html.html")));
  var load = (function(validator, url)
  {
    var handler = function()
    {
      var contentDocument = tab.contentDocument;

      validator.file        = validator.createSourceFile(url);
      validator.fileElement = contentDocument.getElementById("file");
      validator.formElement = contentDocument.getElementById("form");

      validator.saveHTML(url, contentWindow);

      tab.removeEventListener("load", handler, true);
    };

    return handler;
  })(this, uri);

  tab.addEventListener("load", load, true);
};

// Called when the progress state changes
WebDeveloperValidateHTML.prototype.onStateChange = function(webProgress, request, stateFlags)
{
  // If the progress has stopped
  if(stateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP)
  {
    // If the file is set and exists
    if(this.file && this.file.exists())
    {
      // If the validation request is set
      if(this.validationRequest)
      {
        this.submitBackgroundRequest();
      }
      else
      {
        this.submitForm();
      }
    }
  }
};

// Indicates the interfaces this object supports
WebDeveloperValidateHTML.prototype.QueryInterface = function(id)
{
  // If the query is for a supported interface
  if(id.equals(Components.interfaces.nsISupports) || id.equals(Components.interfaces.nsIWebProgressListener))
  {
    return this;
  }

  throw Components.results.NS_NOINTERFACE;
};

// Dummy methods requiring implementations
WebDeveloperValidateHTML.prototype.onLocationChange = function() {};
WebDeveloperValidateHTML.prototype.onProgressChange = function() {};
WebDeveloperValidateHTML.prototype.onSecurityChange = function() {};
WebDeveloperValidateHTML.prototype.onStatusChange   = function() {};
