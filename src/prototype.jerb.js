// // import all embeded templates
document.observe("dom:loaded", function(){
  console.log('loaded')
  $$('script[type="text/jerb"][name], link[type="text/jerb"][name][href]').each(function(element){
    var name = element.readAttribute('name');
    if (!name) return;
    if (element.match('script[src]') || element.match('link[href]')){
      new Ajax.Request(element.readAttribute('src') || element.readAttribute('href'), {
        onSuccess:function(response){
          new JERB(response.responseText).save(name);
        }
      });
    }else{
      new JERB(element.innerHTML).save(name);
    }
  });
});