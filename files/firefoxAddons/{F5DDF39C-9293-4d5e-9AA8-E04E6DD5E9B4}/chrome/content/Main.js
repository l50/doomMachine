HackBar.Main = function ( myWindow )
{
  this.construct( myWindow );
}

HackBar.Main.prototype = {

  field             : null,
  postDataField     : null,
  referrerDataField : null,
  currentFocusField : null,
  toolbar           : null,
  myWindow          : null,
  BrowserWindow     : null,
  TabBrowser        : null,
  tabManager        : null,
  anonFocusFunct    : null,

  hackBarUsefullStrings : {
    pi: "3,14159265",
    phi: "1.618033988749895",
    piBig: "3,14159265358979323846264338327950288419716939937510",
    lorem: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    fibonacci: "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, ...",
    alert: "alert(String.fromCharCode(88, 83, 83))"
  },

  construct: function ( myWindow )
  {
    this.myWindow = myWindow;

    const kWindowMediatorContractID = "@mozilla.org/appshell/window-mediator;1";
    const kWindowMediatorIID        = Components.interfaces.nsIWindowMediator;
    const kWindowMediator           = Components.classes[kWindowMediatorContractID].getService(kWindowMediatorIID);

    this.BrowserWindow = kWindowMediator.getMostRecentWindow("navigator:browser");
    this.TabBrowser    = this.BrowserWindow.getBrowser();

    this.myWindow.addEventListener( "load",   this, false );
    this.myWindow.addEventListener( "unload", this, false );
  },

  handleEvent: function( event )
  {
    if( !this.myWindow || !this.myWindow.document ) return;
    switch( event.type )
    {
      case "load":        if( event.currentTarget == this.myWindow ) this.init( event ); break;
      case "unload":      this.destruct( event ); break;
      case "click":       break;
      case "dblclick":    break;
      case "select":      break;
      case "command":     break;
      case "popuphidden": break;
      case "blur":        break;
      case "change":      break;
      case "dragover":    break;
      case "dragdrop":    break;
    }
  },

  init: function ( event )
  {
    this.urlField      = document.getElementById("hackBarTargetUrl");
    this.postDataField = document.getElementById("hackBarTargetUrlPostField");
    this.referrerField = document.getElementById("hackBarTargetUrlReferrerField");
    this.toolbar       = document.getElementById("hackBarToolbar");

    var me = this;
    var anonFocusFunct = function ( event ) { me.onFieldFocus( event ); }
    this.urlField.addEventListener(      'focus', anonFocusFunct, false );
    this.postDataField.addEventListener( 'focus', anonFocusFunct, false );
    this.referrerField.addEventListener( 'focus', anonFocusFunct, false );
    this.urlField.addEventListener(      'click', this.onFieldClick, false );
    this.postDataField.addEventListener( 'click', this.onFieldClick, false );
    this.referrerField.addEventListener( 'click', this.onFieldClick, false );

    this.currentFocusField = this.urlField;

    this.initTabManager();
  },

  initTabManager: function ()
  {
    this.tabManager = new HackBar.TabManagement();
  },

  destruct: function ()
  {
    var me = this;
    anonFocusFunct = function ( event ) { me.onFieldFocus( event ); }
    this.urlField.removeEventListener(      'focus', anonFocusFunct, false );
    this.postDataField.removeEventListener( 'focus', anonFocusFunct, false );
    this.referrerField.removeEventListener( 'focus', anonFocusFunct, false );
    this.urlField.removeEventListener(      'click', this.onFieldClick, false );
    this.postDataField.removeEventListener( 'click', this.onFieldClick, false );
    this.referrerField.removeEventListener( 'click', this.onFieldClick, false );
    this.myWindow.removeEventListener( "load",   this, false );
    this.myWindow.removeEventListener( "unload", this, false );
  },

  onFieldFocus: function ( event )
  {
    this.currentFocusField = event.currentTarget;
  },

  onFieldClick: function ( event )
  {
    event.currentTarget.focus();
  },

  toggleBar: function ()
  {
    var newState = !this.toolbar.hidden;
    this.toolbar.hidden = newState;
    if ( !newState ) {
      if ( this.urlField.value.length < 1 ) {
        this.useCurrentUrl();
        this.splitUrl();
      }
      var me = this; // Ugly fix, but it works :)
      setTimeout ( function () { me.currentFocusField.focus(); }, 100 );
    }
  },

  loadUrl: function ()
  {
    var uri = this.urlField.value;
    uri = uri.replace( new RegExp(/\n|\r/g), '' );
    if (uri.indexOf("http://") == -1 && uri.indexOf("https://") == -1) uri = 'http://' + uri;

    var postData = this.getPostDataFromField();
    var referrer = this.getReferrerFromField();
    loadURI( uri, referrer, postData, true );
    this.currentFocusField.focus();
    return true;
  },

  getReferrerFromField: function ()
  {
    if ( !document.getElementById('hackBar_referrerCheckBox').checked || !this.referrerField.value ) return null;
    var referrerStr = this.referrerField.value.replace( new RegExp(/\n|\r/g), '' );
    if ( !referrerStr || referrerStr.length <= 0 ) return null;
    const ref_uri = Components.Constructor("@mozilla.org/network/standard-url;1", "nsIURI");
    var ref = new ref_uri;
    ref.spec = referrerStr;
    return ref;
  },

  getPostDataFromField: function ()
  {
    var dataString = this.postDataField.value;
    if ( !document.getElementById('hackBar_postDataCheckBox').checked || !dataString ) return null;
    dataString = dataString.replace( new RegExp(/\n|\r/g), '' );
	dataString = dataString.replace( new RegExp(/\+/g), "%2B" );

    const Cc = Components.classes;
    const Ci = Components.interfaces;
    var stringStream = Cc["@mozilla.org/io/string-input-stream;1"].
                       createInstance(Ci.nsIStringInputStream);
    if ("data" in stringStream) // Gecko 1.9 or newer
      stringStream.data = dataString;
    else // 1.8 or older
      stringStream.setData(dataString, dataString.length);

    var postData = Cc["@mozilla.org/network/mime-input-stream;1"].
                   createInstance(Ci.nsIMIMEInputStream);

    postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
    postData.addContentLength = true;
    postData.setData( stringStream );
    return postData;
  },

  useCurrentUrl: function ()
  {
    var sessionHistory = this.TabBrowser.selectedBrowser.webNavigation.sessionHistory;
    if( sessionHistory.index == -1 ) return;

    var entry = sessionHistory.getEntryAtIndex(sessionHistory.index, 0);
    entry = entry.QueryInterface(Components.interfaces.nsISHEntry);

    var postString = '';
    if ( entry.postData ) {
      try {
          var postDataStream = entry.postData;
          postDataStream.QueryInterface(Components.interfaces.nsISeekableStream).seek(0, 0);

          //create an input stream for reading the post data from
          var inputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
          inputStream.init( entry.postData );
          var postData = inputStream.read( 0xFFFFFFFF );
          var postArray = postData.split("\r\n\r\n");
          postArray.shift();
          postString = postArray.join( '\n' );
      } catch( e ) {
        // do nothing
      }
    }

    var referringUri = entry.referrerURI;
    if ( referringUri ) {
      referringUri = referringUri.QueryInterface(Components.interfaces.nsIURI);
      referringUri = referringUri.spec;
    } else {
      referringUri = "";
    }

    this.urlField.value = unescape(entry.URI.spec);
    this.postDataField.value = postString;
    this.referrerField.value = referringUri;
    this.urlField.focus();
  },

  splitUrl: function ()
  {
    var uri = this.currentFocusField.value;
    uri = uri.replace(new RegExp(/&/g), "\n&");
    uri = uri.replace(new RegExp(/\?/g), "\n?");
    this.currentFocusField.value = uri;
    return true;
  },

  getSelectedText: function ()
  {
    var selectionStart = this.currentFocusField.selectionStart;
    var selectionEnd = this.currentFocusField.selectionEnd;
    if ( selectionEnd - selectionStart < 1 ) {
      return prompt( "No text was selected for the requested action", "String to use" );
    } else {
      return this.currentFocusField.value.substr( selectionStart, selectionEnd - selectionStart );
    }
  },

  setSelectedText: function ( str )
  {
    var selectionStart = this.currentFocusField.selectionStart;
    var selectionEnd = this.currentFocusField.selectionEnd;
    var pre = this.currentFocusField.value.substr( 0, selectionStart );
    var post = this.currentFocusField.value.substr( selectionEnd, this.currentFocusField.value.length );
    this.currentFocusField.value = pre + str + post;
    this.currentFocusField.selectionStart = selectionStart;
    this.currentFocusField.selectionEnd = selectionStart + str.length;
  },

  /** Field toggle functions **/
  togglePostField: function ()
  {
    var box = document.getElementById("hackBar_postDataCheckBox");
    var field = document.getElementById("hackBarTargetUrlPost");
    field.hidden = !box.checked;
  },

  toggleReferrerField: function ()
  {
    var box = document.getElementById("hackBar_referrerCheckBox");
    var field = document.getElementById("hackBarTargetUrlReferrer");
    field.hidden = !box.checked;
  },

  /** Section functions **/
  selectionToChar: function ( dbEngine )
  {
    var charStringArray = new Array;
    var txt = this.getSelectedText();
    var decimal;
    for ( var c = 0 ; c < txt.length ; c++ ) {
      decimal = txt.charCodeAt( c );
      charStringArray.push( decimal );
    }

    var charString = '';

    switch ( dbEngine )
    {
      case "stringFromCharCode":
        charString = 'String.fromCharCode(' + charStringArray.join(', ') + ')';
        break;
      case "htmlChar":
        charString = '&#' + charStringArray.join(';&#') + ';';
        break;
    }
    this.setSelectedText( charString );
  },

  selectionNumberChange: function ( add )
  {
    var comboBox = document.getElementById("hackBarPlusMinusSelection");
    var selection = comboBox.selectedItem.label.toString();
    var txt = this.getSelectedText();
    var originalLength = txt.length;
    var result;

    switch ( selection ) {
      case "INT":
        var integer = parseInt(txt, 10);
        result = integer + add;
        break;
      case "HEX":
        var integer = parseInt(txt, 16);
        result = HackBar.Toolbox.dec2hex( HackBar.Toolbox.hex2dec( txt )  + add );
        break;
      case "OCT":
        var integer = parseInt(txt, 8);
        result = HackBar.Toolbox.dec2oct( HackBar.Toolbox.oct2dec( txt )  + add );
        break;
      case "Alphabet":
        var integer = parseInt(txt);
        result = HackBar.Toolbox.dec2alphabet( (HackBar.Toolbox.alphabet2dec( txt ) + add) % 26 );
        break;
      case "AlNum":
        var integer = parseInt(txt);
        result = HackBar.Toolbox.dec2alphanum( (HackBar.Toolbox.alphanum2dec( txt ) + add) % 36 );
        break;
    }

    result = result.toString();
    var padding = (originalLength - result.length);
    
    if ( result == "NaN" ) return;

    // Ensure the prepending 0s when increasing/decreasing numbers
    for(var i = 0; i < padding; i++)
    {
      result = "0".concat(result);
    }

    this.setSelectedText( result );
    this.loadUrl();
  },

  selectionToMD5: function ()
  {
    var txt = this.getSelectedText();
    var md5_str = HackBar.Encrypt.md5(txt);
    this.setSelectedText( md5_str );
  },

  addslashes: function ()
  {
    var txt = this.getSelectedText();
    txt = txt.replace(/\\/g,'\\\\');
    txt = txt.replace(/\'/g,"\\'");
    txt = txt.replace(/\"/g,'\\"');
    this.setSelectedText( txt );
  },

  stripslashes: function ()
  {
    var txt = this.getSelectedText();
    txt = txt.replace(/\\'/g,'\'');
    txt = txt.replace(/\\"/g,'"');
    txt = txt.replace(/\\\\/g,'\\');
    this.setSelectedText( txt );
  },

  stripspaces: function ()
  {
    var txt = this.getSelectedText();
    txt = txt.replace(/ /g,'');
    this.setSelectedText( txt );
  },

  selectionToSHA: function ( sha_type )
  {
    var txt = this.getSelectedText();
    var sha_str = (sha_type == 1) ? HackBar.Encrypt.sha1(txt) : HackBar.Encrypt.sha2(txt);;
    this.setSelectedText( sha_str );
  },

  selectionToURL: function ( encodeOrDecode )
  {
    var txt = this.getSelectedText();
    var newString = ( encodeOrDecode == 'encode' ) ? escape(txt) : unescape(txt);
    if ( encodeOrDecode == 'encode' ) {
      newString = newString.replace(/\*/g,'%2a');
      newString = newString.replace(/\//g,'%2f');
      newString = newString.replace(/\+/g,'%2b');
    }
    this.setSelectedText( newString );
  },

  selectionToBase64: function ( encodeOrDecode )
  {
    var txt = this.getSelectedText();
    var newString = ( encodeOrDecode == 'encode' ) ? HackBar.Encrypt.base64Encode(txt) : HackBar.Encrypt.base64Decode(txt);
    this.setSelectedText( newString );
  },

  selectionToRot13: function ()
  {
    var txt = this.getSelectedText();
    this.setSelectedText( HackBar.Encrypt.rot13( txt ) );
  },

  hexEncoding: function ( separator )
  {
    var txt = this.getSelectedText();
    var charStringArray = new Array;
    var decimal;
    for ( var c = 0 ; c < txt.length ; c++ ) {
      decimal = txt.charCodeAt( c );
      charStringArray.push( HackBar.Toolbox.dec2hex( decimal ) );
    }
    this.setSelectedText( charStringArray.join( separator ) );
  },

  hexDecoding: function ()
  {
    var txt = this.getSelectedText().toLowerCase();
    txt = txt.replace( /[^0-9abcdefg]/g, '' );

    var charStringArray = new Array();
    var buffer = '';
    var result = '';
    for ( var c = 0 ; c < txt.length ; c++ ) {
      buffer += txt.charAt( c ).toString();
      if ( buffer.length >= 2 ) {
        result += String.fromCharCode( HackBar.Toolbox.hex2dec( buffer ) );
        buffer = '';
      }
    }
    this.setSelectedText( result );
  },

  NumberToHex: function ()
  {
    var number = parseInt(this.getSelectedText());
    this.setSelectedText( HackBar.Toolbox.dec2hex( number ) );
  },

  HexToNumber: function ()
  {
    var hex = this.getSelectedText();
    this.setSelectedText( HackBar.Toolbox.hex2dec( hex ) );
  },

  adjustFieldSize: function ( add, fieldId )
  {
    var field = document.getElementById(fieldId);
    var rows = parseInt(field.getAttribute( "rows" ));
    var newrows = ((rows + add) <= 1) ? 1 : rows + add;
    if ( newrows < 3 ) newrows = 3;
    field.setAttribute( "rows", newrows );
  },

  getUsefullString: function ( key )
  {
    this.setSelectedText( this.hackBarUsefullStrings[key] );
  },
  
  // Used by Overflow menu option.
  // Returns a 'A's string to test overflows and application limits
  generateOverflowString: function ( stringLength )
  {
    var result = "";
    
    while(stringLength < 1)
    {
      stringLength = prompt("Length of the string to use in the overflow:","1337");
      stringLength = Math.min(4096, parseInt( stringLength ));
    }
    
    for (var i=0; i < stringLength; i++)
    {
      result += "A";
    }
    this.setSelectedText( result );
  },
  
  // Reverse a string 
  reverseString: function ( )
  {
    var originalString = this.getSelectedText();
    var splitext = originalString.split("");
    var revertext = splitext.reverse();
    var reversed = revertext.join("");
    this.setSelectedText( reversed );
  }
};
