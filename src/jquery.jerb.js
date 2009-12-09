// import all embeded templates
$(document).ready(function() {
  $('script[type="text/jerb"][name], link[type="text/jerb"][name][href]').each(function() {
    var element = $(this), name = element.attr('name');
    console.log('I',element,name);
    if (!name) return;
    if (element.is('script[src], link[href]')){
      $.get(element.attr('src') || element.attr('href'), function(source){
        new JERB(source).save(name);
      });
    }else{
      new JERB(element.html()).save(name);
    }
  });
});
