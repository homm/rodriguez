(function() {
  function normalizeText(text) {
    // removes spaces from all lines
    text = text.replace(/^\n|\n\s*$/g, '');
    var firstSpaces = text.match(/^\s*/)[0];
    text = $.map(text.split('\n'), function(s) {
      if (s.substr(0, firstSpaces.length) == firstSpaces) {
        s = s.substr(firstSpaces.length);
      }
      return s;
    });
    return text.join('\n');
  }

  var plugin = 'rodriguez';
  var currentClass = plugin + '-current';


  $.fn[plugin] = function() {
    this.each(function() {
      var $container = $(this);
      var $tabs = $('<div/>', {'class': plugin + '__tabs'});
      var $panels = $('<div/>', {'class': plugin + '__panels'});
      var tabs = [];
      var current;

      function switchTab(index) {
        current = index;
        for (tab in tabs) {
          tabs[tab].$tab.removeClass(currentClass);
          tabs[tab].$panel.removeClass(currentClass);
        }
        tabs[index].$tab.addClass(currentClass);
        tabs[index].$panel.addClass(currentClass);
      }

      function insertTab($panel, caption) {
        var index = tabs.length;
        var $tab = $('<div/>', {
            'class': plugin + '__tab',
            'text': caption
          })
          .on('click', function() {
            switchTab(index);
          })
          .appendTo($tabs);

        $panel.addClass(plugin + '__panel')
          .appendTo($panels);

        tabs.push({$tab: $tab, $panel: $panel});
        return index;
      }

      $container.find('> *').each(function() {
        var $panel = $(this);
        var caption;
        if ($panel.data('skip')) {
          return;
        }

        if ($panel.is('script') || $panel.is('style')) {
          caption = $panel.attr('type').split('/').pop();
          $panel = $('<pre/>', {
              'class': 'language-' + caption,
              'text': normalizeText($panel.text())
            });
          if (window.hljs) {
            hljs.highlightBlock($panel[0]);
          }
        } else {
          caption = 'result';
          var $source = $('<pre/>', {
              'class': 'language-html',
              'text': normalizeText($panel.html())
            });
          if (window.hljs) {
            hljs.highlightBlock($source[0]);
          }
          insertTab($source, 'html');

          if (current == null) {
            current = tabs.length;
          }
        }

        insertTab($panel, caption);
      });

      $container.prepend([$tabs, $panels]);
      switchTab(current || 0);
    });
  };

  $(function() {
    $('.' + plugin)[plugin]();
  });

})();
