var WebDeveloper = WebDeveloper || {};

WebDeveloper.Generated                    = WebDeveloper.Generated || {};
WebDeveloper.Generated.animationSpeed     = 200;
WebDeveloper.Generated.maximumURLLength   = 100;
WebDeveloper.Generated.syntaxHighlighters = [];

// Adds a document
WebDeveloper.Generated.addDocument = function(documentURL, documentCount, itemDescription, itemCount)
{
  var childElement = document.createElement("a");
  var element      = document.createElement("h2");
  var fragment     = document.createDocumentFragment();

  childElement.appendChild(document.createTextNode(documentURL));

  childElement.setAttribute("href", documentURL);
  element.setAttribute("id", "document-" + (documentCount + 1));
  element.appendChild(childElement);
  fragment.appendChild(element);

  element      = document.createElement("li");
  childElement = document.createElement("a");

  childElement.appendChild(document.createTextNode(WebDeveloper.Generated.formatURL(documentURL)));
  childElement.setAttribute("href", "#document-" + (documentCount + 1));
  element.appendChild(childElement);
  $(".dropdown-menu", $("#documents-dropdown")).get(0).appendChild(element);

  // If the item description is set
  if(itemDescription)
  {
    element = document.createElement("h3");

    // If there are items
    if(itemCount !== 0)
    {
      childElement = document.createElement("i");

      childElement.setAttribute("class", "icon-caret-down");
      element.appendChild(childElement);
    }

    element.appendChild(document.createTextNode(itemCount + " " + itemDescription));
    fragment.appendChild(element);
  }

  document.getElementById("content").appendChild(fragment);
};

// Adds a separator
WebDeveloper.Generated.addSeparator = function()
{
  var separator = document.createElement("div");

  separator.setAttribute("class", "web-developer-separator");
  document.getElementById("content").appendChild(separator);
};

// Changes the syntax highlight theme
WebDeveloper.Generated.changeSyntaxHighlightTheme = function(event)
{
  var themeMenu = $(this);
  var themeIcon = $("i", themeMenu);

  // If this is not the current theme
  if(themeIcon.hasClass("icon-empty"))
  {
    var theme = themeMenu.attr("id").replace("web-developer-syntax-highlighting-", "");

    // If there is no theme
    if(theme == "none")
    {
      $(".CodeMirror").hide();
      $(".web-developer-syntax-highlight").show();
    }
    else if(WebDeveloper.Generated.syntaxHighlighters.length)
    {
      $(".CodeMirror").show();
      $(".web-developer-syntax-highlight").hide();

      // Loop through the syntax highlighters
      for(var i = 0, l = WebDeveloper.Generated.syntaxHighlighters.length; i < l; i++)
      {
        WebDeveloper.Generated.syntaxHighlighters[i].setOption("theme", theme);
      }
    }
    else
    {
      WebDeveloper.Generated.initializeSyntaxHighlight(theme);
    }

    $(".dropdown-menu .icon-ok", $("#web-developer-syntax-highlighting-dropdown")).removeClass("icon-ok").addClass("icon-empty");
    themeIcon.removeClass("icon-empty").addClass("icon-ok");
  }

  event.preventDefault();
};

// Collapses all the output
WebDeveloper.Generated.collapseAllOutput = function(event)
{
  // Loop through the output headers
  $("h3").each(function()
  {
    var header = $(this);

    $("i", header).removeClass("icon-caret-down").addClass("icon-caret-right");
    header.next().slideUp(WebDeveloper.Generated.animationSpeed);
  });

  event.preventDefault();
};

// Empties the content
WebDeveloper.Generated.emptyContent = function()
{
  $(".progress", $("#content")).remove();
};

// Expands all the output
WebDeveloper.Generated.expandAllOutput = function(event)
{
  // Loop through the output headers
  $("h3").each(function()
  {
    var header = $(this);

    $("i", header).removeClass("icon-caret-right").addClass("icon-caret-down");
    header.next().slideDown(WebDeveloper.Generated.animationSpeed);
  });

  // If the event is set
  if(event)
  {
    event.preventDefault();
  }
};

// Formats a URL
WebDeveloper.Generated.formatURL = function(url)
{
  // If the URL is set
  if(url && url.length > WebDeveloper.Generated.maximumURLLength)
  {
    var halfLength = WebDeveloper.Generated.maximumURLLength / 2;

    return url.substring(0, halfLength) + "..." + url.substr(-halfLength);
  }

  return url;
};

// Generates a document container
WebDeveloper.Generated.generateDocumentContainer = function()
{
  var documentContainer = document.createElement("div");

  documentContainer.setAttribute("class", "web-developer-document");

  return documentContainer;
};

// Initializes the common page elements
WebDeveloper.Generated.initializeCommonElements = function()
{
  $("i", $("h3")).on("click", WebDeveloper.Generated.toggleOutput);
  $("#web-developer-collapse-all").on("click", WebDeveloper.Generated.collapseAllOutput);
  $("#web-developer-expand-all").on("click", WebDeveloper.Generated.expandAllOutput);

  // If there is a nav bar
  if($(".navbar").length)
  {
    $(".dropdown-toggle").dropdown();
  }
};

// Initializes the syntax highlight functionality
WebDeveloper.Generated.initializeSyntaxHighlight = function(color, locale)
{
  // If the locale is set
  if(locale)
  {
    $(".dropdown-toggle", $("#web-developer-syntax-highlighting-dropdown")).prepend(locale.syntaxHighlighting);
    $("#web-developer-syntax-highlighting-dark").append(locale.dark);
    $("#web-developer-syntax-highlighting-light").append(locale.light);
    $("#web-developer-syntax-highlighting-none").append(locale.none);

    $(".dropdown-menu a", $("#web-developer-syntax-highlighting-dropdown")).on("click", WebDeveloper.Generated.changeSyntaxHighlightTheme);
    $("i", $("#web-developer-syntax-highlighting-" + color)).removeClass("icon-empty").addClass("icon-ok");
  }

  // If a color is set
  if(color != "none")
  {
    // Loop through the syntax highlight elements
    $(".web-developer-syntax-highlight").each(function()
    {
      var pre = $(this);

      window.setTimeout(function()
      {
        WebDeveloper.Generated.syntaxHighlighters.push(CodeMirror(function(element)
        {
          pre.after(element);
          pre.hide();
        },
        {
          lineNumbers: pre.data("line-numbers"),
          mode: pre.data("type"),
          readOnly: true,
          tabSize: 2,
          theme: color,
          value: pre.text()
        }));
      }, 0);
    });
  }
};

// Initializes the page with JSON data
WebDeveloper.Generated.initializeWithJSON = function(event)
{
  var eventTarget = event.target;

  WebDeveloper.Generated.initialize(JSON.parse(eventTarget.getAttribute("data-web-developer")), JSON.parse(eventTarget.getAttribute("data-web-developer-locale")));

  eventTarget.removeAttribute("data-web-developer");
  eventTarget.removeAttribute("data-web-developer-locale");

  window.removeEventListener("web-developer-generated-event", WebDeveloper.Generated.initializeWithJSON, false);
};

// Localizes the header
WebDeveloper.Generated.localizeHeader = function(locale)
{
  $("#web-developer-collapse-all").text(locale.collapseAll);
  $("#web-developer-expand-all").text(locale.expandAll);
  $(".dropdown-toggle", $("#documents-dropdown")).prepend(locale.documents);
  $("span.brand").text(locale.webDeveloper);
};

// Outputs content
WebDeveloper.Generated.output = function(title, url, anchor, type, outputOriginal)
{
  var childElement      = document.createElement("i");
  var container         = document.createElement("pre");
  var content           = document.getElementById("content");
  var documentContainer = WebDeveloper.Generated.generateDocumentContainer();
  var element           = document.createElement("h3");
  var outputContainers  = [];
  var outputTitle       = title;

  childElement.setAttribute("class", "icon-caret-down");
  element.appendChild(childElement);
  element.setAttribute("id", anchor);

  // If the URL is set
  if(url)
  {
    childElement = document.createElement("a");
    outputTitle  = WebDeveloper.Generated.formatURL(url);

    childElement.appendChild(document.createTextNode(outputTitle));
    childElement.setAttribute("href", url);
    element.appendChild(childElement);
  }
  else
  {
    element.appendChild(document.createTextNode(outputTitle));
  }

  content.appendChild(element);

  childElement = document.createElement("a");
  element      = document.createElement("li");

  childElement.appendChild(document.createTextNode(outputTitle));
  childElement.setAttribute("href", "#" + anchor);
  element.appendChild(childElement);
  $(".dropdown-menu", $("#files-dropdown")).get(0).appendChild(element);

  container.setAttribute("class", "web-developer-syntax-highlight");
  container.setAttribute("data-line-numbers", "true");
  container.setAttribute("data-type", type);
  documentContainer.appendChild(container);
  outputContainers.push($(container));

  // If the original should be output
  if(outputOriginal)
  {
    var originalContainer = document.createElement("pre");

    originalContainer.setAttribute("class", "web-developer-original");
    documentContainer.appendChild(originalContainer);
    outputContainers.push($(originalContainer));
  }

  content.appendChild(documentContainer);
  WebDeveloper.Generated.addSeparator();

  return outputContainers;
};

// Sets the page title
WebDeveloper.Generated.setPageTitle = function(type, data, locale)
{
  document.title = type + " " + locale.from.toLowerCase() + " " + WebDeveloper.Generated.formatURL(data.pageURL);

  $("a.brand", $(".navbar")).text(type);
};

// Toggles the collapsed state of an output
WebDeveloper.Generated.toggleOutput = function()
{
  $(this).toggleClass("icon-caret-down").toggleClass("icon-caret-right").parent().next().slideToggle(WebDeveloper.Generated.animationSpeed);
};

window.addEventListener("web-developer-generated-event", WebDeveloper.Generated.initializeWithJSON, false);
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Generated                          = WebDeveloper.Generated || {};
WebDeveloper.Generated.ancestorSingleLineHeight = 20;
WebDeveloper.Generated.ancestorContainer        = null;
WebDeveloper.Generated.ancestors                = null;

// Adjusts the ancestors
WebDeveloper.Generated.adjustAncestors = function(adjustor)
{
  // Loop through the ancestors
  WebDeveloper.Generated.ancestors.each(function()
  {
    adjustor($(this));
  });
};

// Hides ancestors from the middle of the path
WebDeveloper.Generated.hideAncestors = function()
{
  var middleAncestor = $(".web-developer-middle-ancestor");

  middleAncestor.prevAll(":visible").first().add(middleAncestor.nextAll(":visible").eq(0)).hide();
};

// Hides ancestors from the middle of the path
WebDeveloper.Generated.populateAncestors = function(ancestors)
{
  $("#content").empty().get(0).appendChild(ancestors);
  WebDeveloper.Generated.resizeAncestors(true);
};

// Resizes the ancestors
WebDeveloper.Generated.resizeAncestors = function(reset)
{
  var currentHeight  = 0;
  var previousHeight = 0;

  // If resetting or the ancestor container and ancestors are not set
  if(reset || (!WebDeveloper.Generated.ancestorContainer && !WebDeveloper.Generated.ancestors))
  {
    WebDeveloper.Generated.ancestorContainer = $(".breadcrumb");
    WebDeveloper.Generated.ancestors         = $("li", WebDeveloper.Generated.ancestorContainer);
  }

  WebDeveloper.Generated.toggleMiddleAncestor(true);

  WebDeveloper.Generated.adjustAncestors(function(ancestor) { WebDeveloper.Generated.setAncestorDescription(ancestor, true, true, 0); });

  // If the ancestors are wrapping
  if(WebDeveloper.Generated.ancestorContainer.height() > WebDeveloper.Generated.ancestorSingleLineHeight)
  {
    WebDeveloper.Generated.adjustAncestors(function(ancestor) { WebDeveloper.Generated.setAncestorDescription(ancestor, true, true, 30); });
  }

  // If the ancestors are wrapping
  if(WebDeveloper.Generated.ancestorContainer.height() > WebDeveloper.Generated.ancestorSingleLineHeight)
  {
    WebDeveloper.Generated.adjustAncestors(function(ancestor) { WebDeveloper.Generated.setAncestorDescription(ancestor, true, false, 0); });
  }

  // If the ancestors are wrapping
  if(WebDeveloper.Generated.ancestorContainer.height() > WebDeveloper.Generated.ancestorSingleLineHeight)
  {
    WebDeveloper.Generated.adjustAncestors(function(ancestor) { WebDeveloper.Generated.setAncestorDescription(ancestor, true, false, 16); });
  }

  // If the ancestors are wrapping
  if(WebDeveloper.Generated.ancestorContainer.height() > WebDeveloper.Generated.ancestorSingleLineHeight)
  {
    WebDeveloper.Generated.adjustAncestors(function(ancestor) { WebDeveloper.Generated.setAncestorDescription(ancestor, false, false, 0); });
  }

  // If the ancestors are wrapping
  if(WebDeveloper.Generated.ancestorContainer.height() > WebDeveloper.Generated.ancestorSingleLineHeight)
  {
    WebDeveloper.Generated.toggleMiddleAncestor(false);
  }

  currentHeight = WebDeveloper.Generated.ancestorContainer.height();

  // While the ancestors are wrapping
  while(currentHeight > WebDeveloper.Generated.ancestorSingleLineHeight && currentHeight != previousHeight)
  {
    previousHeight = WebDeveloper.Generated.ancestorContainer.height();

    WebDeveloper.Generated.hideAncestors();

    currentHeight = WebDeveloper.Generated.ancestorContainer.height();
  }
};

// Sets the ancestor description
WebDeveloper.Generated.setAncestorDescription = function(ancestor, includeId, includeClasses, truncateLength)
{
  var ancestorData        = ancestor.data("web-developer-element-id");
  var ancestorDescription = ancestor.data("web-developer-element-tag");

  // If including the id and it is set
  if(includeId && ancestorData)
  {
    ancestorDescription += ancestorData;
  }

  ancestorData = ancestor.data("web-developer-element-classes");

  // If including the classes and they are set
  if(includeClasses && ancestorData)
  {
    ancestorDescription += ancestorData;
  }

  // If truncating the length and the description is longer than the truncate length
  if(truncateLength && ancestorDescription.length > truncateLength)
  {
    var halfLength = truncateLength / 2;

    ancestorDescription = ancestorDescription.substring(0, halfLength) + "..." + ancestorDescription.substr(-halfLength);
  }

  // If this is the active ancestor
  if(ancestor.hasClass("active"))
  {
    ancestor.text(ancestorDescription);
  }
  else
  {
    $("a", ancestor).text(ancestorDescription);
  }
};

// Toggles the middle ancestor
WebDeveloper.Generated.toggleMiddleAncestor = function(display)
{
  // If displaying the middle ancestor
  if(display)
  {
    WebDeveloper.Generated.ancestors.show();
    $(".web-developer-middle-ancestor").removeClass("web-developer-middle-ancestor");
  }
  else
  {
    var middleAncestor = WebDeveloper.Generated.ancestors.eq(Math.floor(WebDeveloper.Generated.ancestors.length / 2)).addClass("web-developer-middle-ancestor");

    $("a", middleAncestor).text("...");
  }
};

$(function()
{
  $(window).on("resize", WebDeveloper.Generated.resizeAncestors);
});
