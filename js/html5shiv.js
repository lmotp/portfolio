/* HTML5 Shiv v3.6.2pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */ (function (l, f) {
  function w(a, b) {
    var c = a.createElement('p'),
      m = a.getElementsByTagName('head')[0] || a.documentElement;
    c.innerHTML = 'x<style>' + b + '</style>';
    return m.insertBefore(c.lastChild, m.firstChild);
  }
  function p() {
    var a = e.elements;
    return 'string' == typeof a ? a.split(' ') : a;
  }
  function n(a) {
    var b = x[a[y]];
    b || ((b = {}), r++, (a[y] = r), (x[r] = b));
    return b;
  }
  function z(a, b, c) {
    b || (b = f);
    if (g) return b.createElement(a);
    c || (c = n(b));
    b = c.cache[a] ? c.cache[a].cloneNode() : C.test(a) ? (c.cache[a] = c.createElem(a)).cloneNode() : c.createElem(a);
    return b.canHaveChildren && !D.test(a) ? c.frag.appendChild(b) : b;
  }
  function A(a) {
    a || (a = f);
    var b = n(a);
    e.shivCSS &&
      !s &&
      !b.hasCSS &&
      (b.hasCSS = !!w(
        a,
        'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}',
      ));
    if (!g) {
      var c = a;
      b.cache ||
        ((b.cache = {}),
        (b.createElem = c.createElement),
        (b.createFrag = c.createDocumentFragment),
        (b.frag = b.createFrag()));
      c.createElement = function (a) {
        return !e.shivMethods ? b.createElem(a) : z(a, c, b);
      };
      c.createDocumentFragment = Function(
        'h,f',
        'return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(' +
          p()
            .join()
            .replace(/\w+/g, function (a) {
              b.createElem(a);
              b.frag.createElement(a);
              return 'c("' + a + '")';
            }) +
          ');return n}',
      )(e, b.frag);
    }
    return a;
  }
  function E(a) {
    for (var b, c = a.attributes, m = c.length, f = a.ownerDocument.createElement(q + ':' + a.nodeName); m--; )
      (b = c[m]), b.specified && f.setAttribute(b.nodeName, b.nodeValue);
    f.style.cssText = a.style.cssText;
    return f;
  }
  function B(a) {
    function b() {
      clearTimeout(d._removeSheetTimer);
      c && c.removeNode(!0);
      c = null;
    }
    var c,
      f,
      d = n(a),
      e = a.namespaces,
      g = a.parentWindow;
    if (!F || a.printShived) return a;
    'undefined' == typeof e[q] && e.add(q);
    g.attachEvent('onbeforeprint', function () {
      b();
      var h, k, d;
      d = a.styleSheets;
      for (var e = [], j = d.length, g = Array(j); j--; ) g[j] = d[j];
      for (; (d = g.pop()); )
        if (!d.disabled && G.test(d.media)) {
          try {
            (h = d.imports), (k = h.length);
          } catch (n) {
            k = 0;
          }
          for (j = 0; j < k; j++) g.push(h[j]);
          try {
            e.push(d.cssText);
          } catch (l) {}
        }
      h = e.reverse().join('').split('{');
      k = h.length;
      j = RegExp('(^|[\\s,>+~])(' + p().join('|') + ')(?=[[\\s,>+~#.:]|$)', 'gi');
      for (g = '$1' + q + '\\:$2'; k--; )
        (e = h[k] = h[k].split('}')), (e[e.length - 1] = e[e.length - 1].replace(j, g)), (h[k] = e.join('}'));
      e = h.join('{');
      k = a.getElementsByTagName('*');
      j = k.length;
      g = RegExp('^(?:' + p().join('|') + ')$', 'i');
      for (d = []; j--; ) (h = k[j]), g.test(h.nodeName) && d.push(h.applyElement(E(h)));
      f = d;
      c = w(a, e);
    });
    g.attachEvent('onafterprint', function () {
      for (var a = f, c = a.length; c--; ) a[c].removeNode();
      clearTimeout(d._removeSheetTimer);
      d._removeSheetTimer = setTimeout(b, 500);
    });
    a.printShived = !0;
    return a;
  }
  var d = l.html5 || {},
    D = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
    C = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
    s,
    y = '_html5shiv',
    r = 0,
    x = {},
    g;
  try {
    var t = f.createElement('a');
    t.innerHTML = '<xyz></xyz>';
    s = 'hidden' in t;
    var u;
    if (!(u = 1 == t.childNodes.length)) {
      f.createElement('a');
      var v = f.createDocumentFragment();
      u =
        'undefined' == typeof v.cloneNode ||
        'undefined' == typeof v.createDocumentFragment ||
        'undefined' == typeof v.createElement;
    }
    g = u;
  } catch (H) {
    g = s = !0;
  }
  var e = {
    elements:
      d.elements ||
      'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video',
    version: '3.6.2pre',
    shivCSS: !1 !== d.shivCSS,
    supportsUnknownElements: g,
    shivMethods: !1 !== d.shivMethods,
    type: 'default',
    shivDocument: A,
    createElement: z,
    createDocumentFragment: function (a, b) {
      a || (a = f);
      if (g) return a.createDocumentFragment();
      b = b || n(a);
      for (var c = b.frag.cloneNode(), d = 0, e = p(), l = e.length; d < l; d++) c.createElement(e[d]);
      return c;
    },
  };
  l.html5 = e;
  A(f);
  var G = /^$|\b(?:all|print)\b/,
    q = 'html5shiv';
  if ((d = !g))
    (d = f.documentElement),
      (d = !(
        'undefined' == typeof f.namespaces ||
        'undefined' == typeof f.parentWindow ||
        'undefined' == typeof d.applyElement ||
        'undefined' == typeof d.removeNode ||
        'undefined' == typeof l.attachEvent
      ));
  var F = d;
  e.type += ' print';
  e.shivPrint = B;
  B(f);
})(this, document);