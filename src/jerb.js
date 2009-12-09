/*
 * JERB Templates - a port of ERB to JavaScript
 *
 * Copyright (c) 2009 Jared Grippe
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function(global) {


  var compile = (function() {

    var REGEX_ESCAPE = /([.*+?^=!:${}()|[\]\/\\])/g;
    var NEWLINES = /\n|\r/g;
    var SINGLE_QUOTES = /'/g;

    function concat(string){
      return "__buffer__ += '"+string.replace(NEWLINES,'\\n').replace(SINGLE_QUOTES,"\\'")+"'; ";
    }
    function exec_and_concat(code){
      return "__buffer__ += "+code+"; ";
    }
    function exec(code){
      return code+"; ";
    }

    return function compile(source, tag){
      var code = ""+
        "scope.__buffer__ = '';"+
        "with(scope){";

      var t = String(tag).replace(REGEX_ESCAPE, '\\$1');
      var matcher = new RegExp("<"+t+"(=?)\s*(.*?)\s*"+t+">");

      while (source.length > 0) {
        if (match = source.match(matcher) ) {
          code += concat(source.slice(0, match.index));
          code += (match[1] == '=') ? exec_and_concat(match[2]) : exec(match[2]);
          source = source.slice(match.index + match[0].length);
        }else{
          code += concat(source);
          source = '';
        }
      }

      code += ""+
        "return __buffer__;"+
      "}";

      return code;
    };

  })();

  function JERB(source, tag){
    this.source = String(source);
    this.scope = {};
    if (tag) this.tag = tag;
    this.compile();
  };

  JERB.prototype.toString = function(){ return this.source; };
  JERB.prototype.tag = '%';

  JERB.prototype.compile = function(){
    var code = compile(this.source, this.tag);
    try{
      this.evaluate = new Function("scope", code);
    }catch(e){
      var error = new SyntaxError('JERB compile failed');
      error.line = code;
      error.lineNumber = null;
      throw error;
    }
  }

  JERB.prototype.save = function(name){
    JERB.store[name] = this;
    return this;
  };

  JERB.prototype.render = function(){
    var scope = {};
    for (var property in this.methods)
      scope[property] = this.methods[property];

    for (var property in this.scope)
      scope[property] = this.scope[property];

    for (var i=0; i < arguments.length; i++)
      for (var property in arguments[i])
        scope[property] = arguments[i][property];

    return this.evaluate.call(scope, scope);
  };

  JERB.prototype.methods = {
    print: function(text){
      for (var i=0; i < arguments.length; i++)
        this.__buffer__ += arguments[i] || '';
    },
    render: function(name_or_jerb /* required */, scope /* optional */){
      var scopes = Array.prototype.slice.call(arguments,1);
      scopes.unshift(this);
      scopes.unshift(name_or_jerb);
      return JERB.render.apply(JERB, scopes);
    }
  };

  JERB.store = {};
  JERB.render = function(name_or_jerb /* required */){
    var scopes = Array.prototype.slice.call(arguments,1), jerb = name_or_jerb;

    if (!(jerb instanceof JERB))
      jerb = JERB.store[jerb];

    if (!(jerb instanceof JERB))
      return undefined;

    return jerb.render.apply(jerb, scopes);
  };

  global.JERB = JERB;

})(this);