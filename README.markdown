# JERB

## DEY TUKK UR JERB
![DEY TUKK UR JERB](http://0.gvt0.com/vi/NzV9_lQsnpA/default.jpg)
[watch](http://www.youtube.com/watch?v=NzV9_lQsnpA "DEY TUKK UR JERB (video)")

# Usage

      new JERB('hello <% name %>').render({name:'Steve'});
      //-> 'hello Steve'

      new JERB('hello <% name %>').save('greeting');
      JERB.render('greeting', {name:'Jared'});
      //-> 'hello Jared'

      new JERB('<%= render('greeting') %>,\n Welcome to <%= service_name %>!').save('welcome letter');
      JERB.render('welcome letter', {name:'Paul', service_name:'HitGub'})
      //-> 'hello Paul, Welcome to HitGub!

# Examples

see [example.html](http://github.com/deadlyicon/jerb/blob/master/example.html)