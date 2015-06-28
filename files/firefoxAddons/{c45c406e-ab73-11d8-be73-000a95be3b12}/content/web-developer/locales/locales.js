var WebDeveloper = WebDeveloper || {};

WebDeveloper.Locales = WebDeveloper.Locales || {};

// Sets up the generated locale
WebDeveloper.Locales.setupGeneratedLocale = function()
{
  var locale = {};

  locale.collapseAll   = WebDeveloper.Locales.getString("collapseAll");
  locale.documents     = WebDeveloper.Locales.getString("documents");
  locale.expandAll     = WebDeveloper.Locales.getString("expandAll");
  locale.extensionName = WebDeveloper.Locales.getString("extensionName");
  locale.from          = WebDeveloper.Locales.getString("from");

  return locale;
};
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Locales = WebDeveloper.Locales || {};

// Returns a formatted string from the locale
WebDeveloper.Locales.getFormattedString = function(name, parameters, bundleId)
{
  var localeString = null;

  // Try to get the string from the localization
  try
  {
    // If the bundle id is not set
    if(!bundleId)
    {
      bundleId = "web-developer-string-bundle";
    }

    localeString = document.getElementById(bundleId).getFormattedString(name, parameters);
  }
  catch(exception)
  {
    localeString = "";
  }

  return localeString;
};

// Returns a string from the locale
WebDeveloper.Locales.getString = function(name, bundleId)
{
  var localeString = null;

  // Try to get the string from the localization
  try
  {
    // If the bundle id is not set
    if(!bundleId)
    {
      bundleId = "web-developer-string-bundle";
    }

    localeString = document.getElementById(bundleId).getString(name);
  }
  catch(exception)
  {
    localeString = "";
  }

  return localeString;
};
