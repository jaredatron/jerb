describe('JERB', function () {
  beforeEach(function(){
    for (p in JERB.store) delete JERB.store[p];
  });

  describe('#toString',function(){
    it('should return the original source', function(){
      expect(new JERB('monkey boy').toString()).toEqual('monkey boy');
    });
  })

  describe('#render', function () {

    it('should handle quotes correctly', function(){
      expect( new JERB("''<%= '\\'' %>'").render() ).toEqual("''''");
    });

    it('should be able to print directly to the buffer', function(){
      expect( new JERB('hello <% print("there") %>').render() ).toEqual("hello there");
    });

    it('should be able to access and modify the buffer', function(){
      expect( new JERB('hidden <% __buffer__ = ""; %>hello <%= __buffer__ %>').render() ).toEqual("hello hello ");
    });

    it('should buffer text preceeding a code block before executing the following block', function(){
      expect( new JERB('hello <% print("there") %> friend').render() ).toEqual("hello there friend");
    });

    it('should work with tabs and new lines', function(){
      expect( new JERB('\t\n\t\r\thello\t\n').render() ).toEqual('\t\n\t\n\thello\t\n');
    });

    var TAGS = ['$','*','#', 'Peter Gabrial', ' ', '(', ')'];
    for (var i=0; i < TAGS.length; i++) (function(tag) {
      it('should work with the tag set to "'+tag+'"', function(){
        var jerb = new JERB('hello <'+tag+'= name '+tag+'>,'+"\n"+' how <'+tag+' print("are") '+tag+'> you?', tag);
        expect(jerb.tag).toEqual(tag);
        expect(jerb.render({name: 'Jared'})).toEqual("hello Jared,\n how are you?");
      });
    })(TAGS[i]);

    it('should be able to render saved templates', function(){
      new JERB('<%= name %>').save('recipient.name');
      new JERB('hello <%= render("recipient.name", {name: \'Jared\'}) %>').save('recipient.greeting');
      expect( JERB.render('recipient.greeting') ).toEqual("hello Jared");
    });

    it('should pass scope to internal JERB rederings', function(){
      new JERB('<%= first_name %> <%= last_name %>').save('recipient.name');
      new JERB('hello <%= render("recipient.name", {last_name:"Grippe"}) %>').save('recipient.greeting');
      expect( JERB.render('recipient.greeting', {first_name:'Jared'}) ).toEqual("hello Jared Grippe");
    });


  });

  describe('#scope',function(){
    it('should be added to the scope of the template',function(){
      var jerb = new JERB('<%= stored_in_the_jerb %> is fun');
      jerb.scope.stored_in_the_jerb = 'currying';
      expect(jerb.render()).toEqual('currying is fun');
    });
  });

  describe('#save',function(){
    it('should add the JERB to the JERB.store hash',function(){
      var jerb = new JERB('you smell like <%= sent %>');
      jerb.save('you smell');
      expect(JERB.store['you smell']).toEqual(jerb);
    });
  });

  describe('.render',function(){
    it('should be able to render a given template',function(){
      var jerb = new JERB('hello <%= name %>');
      expect( JERB.render(jerb, {}, {name:'steve'}) ).toEqual('hello steve');
    });

    it('should be able to render stored template by name',function(){
      var jerb = new JERB('yo <%= name %>').save('yo');
      expect( JERB.render('yo', {}, {name:'steve'}) ).toEqual('yo steve');
    });
  });

  describe('.store',function(){
    it('should be a hash of saved templates',function(){
      new JERB('hey there').save('hey_there');
      expect(JERB.store.hey_there.render() ).toEqual('hey there');
    });
  });

});