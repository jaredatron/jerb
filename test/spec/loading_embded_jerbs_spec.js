describe('embded text/jerb templates',function(){

  describe('without a src attribute',function(){
    it('should be auto imported',function(){
      waits(500); // waiting for initial rtemplate XHR requests to complete
      runs(function(){
        var data = {user:{name:'bob'}};
        expect( JERB.render('user.name', data) ).toEqual('\n    <span class="user name">bob</span>\n  ');
      });
    });
  });

  describe('with a src attribute',function(){
    it('should be auto imported via an XHR',function(){
      waits(500); // waiting for initial rtemplate XHR requests to complete
      runs(function(){
        var data = {user:{
          name:'bob',
          avatar_url:'/images/bob.jpg'
        }};
        expect(JERB.render('user.avatar', data)).toEqual('<div class="avatar"><img src="/images/bob.jpg" title="bob"/></div>');
      });
    });
  });

});