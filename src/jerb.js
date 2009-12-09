/*
 * John Resig Templates - jQuery plugin for templates
 *
 * Copyright (c) 2009 Jared Grippe (but mostly by John Resig)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * straight stolen from http://ejohn.org/blog/javascript-micro-templating
 *
 */

 /**
  * see straight stolen from
  */
(function() {

  function JERB(source, tag){
    var tag = tag 
    if (tag) this.tag = tag;
    this.scope = {};
    var t = String(this.tag).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

    var code = ""+
      "scope.__buffer__ = '';"+
      "with(scope){"+
        (function() {
          var code = "";

          function concat(string){
            code += "__buffer__ += '"+string.replace(/\n|\r/g,'\\n').replace(/'/g,"\\'")+"'; ";
          }
          function exec_and_concat(_code){
            code += "__buffer__ += "+_code+"; ";
          }
          function exec(_code){
            code += _code+"; ";
          }

          var matcher = new RegExp("<"+t+"(=?)\s*(.*?)\s*"+t+">");

          while (source.length > 0) {
            if (match = source.match(matcher) ) {
              concat(source.slice(0, match.index));
              (match[1] == '=') ? exec_and_concat(match[2]) : exec(match[2]);
              source = source.slice(match.index + match[0].length);
            }else{
              concat(source);
              source = '';
            }
          }

          return code;
        })()+
        "return __buffer__;"+
      "}";

    try{
      this.evaluate = new Function("scope", code);
    }catch(e){
      console.info(code);
      console.error(e);
      throw e;
    }
  };
  JERB.prototype.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
  JERB.prototype.tag = '%';

  JERB.prototype.save = function(name){
    JERB.templates[name] = this;
    return this;
  }

  JERB.prototype.render = function(){
    var scope = {};
    for (var property in this.methods)
      scope[property] = this.methods[property];

    for (var property in this.scope)
      scope[property] = this.scope[property];

    for (var i=0; i < arguments.length; i++)
      for (var property in arguments[i])
        scope[property] = arguments[i][property];

    return this.evaluate(scope);
  };

  JERB.prototype.methods = {
    print: function(text){
      for (var i=0; i < arguments.length; i++)
        this.__buffer__ += arguments[i] || '';
    },
    render: function(name_or_jerb /* required */, scope /* optional */){
      var scopes = Array.prototype.slice.call(arguments,1);
      scopes.unshift(this)
      scopes.unshift(name_or_jerb);
      return JERB.render.apply(JERB, scopes);
    }
  };

  JERB.templates = {};
  JERB.render = function(name_or_jerb /* required */){
    var scopes = Array.prototype.slice.call(arguments,1), jerb = name_or_jerb;

    if (!(jerb instanceof JERB))
      jerb = JERB.templates[jerb];

    if (!(jerb instanceof JERB))
      return undefined;

    return jerb.render.apply(jerb, scopes);
  };

  window.JERB = JERB;

})();