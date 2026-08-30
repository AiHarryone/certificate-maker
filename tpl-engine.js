// tpl-engine.js — shared template selector for Certificate Maker tools.
// Each tool page defines `window.TOOL_TEMPLATES` (array of {id,name,style,c1,c2,accent,dark})
// and includes this file before its main script. The tool calls `tpl()` in render()
// to get the current template and branches on `tpl().style`.
window.TPL = { selected: 0 };
(function () {
  function build() {
    var grid = document.getElementById('tplGrid');
    if (!grid || !window.TOOL_TEMPLATES) return;
    window.TOOL_TEMPLATES.forEach(function (t, i) {
      var d = document.createElement('div');
      d.className = 'tpl' + (i === 0 ? ' active' : '');
      d.title = t.name;
      d.innerHTML = '<span class="swatch" style="background:linear-gradient(135deg,' + t.c1 + ',' + t.c2 + ');"></span><span>' + t.name + '</span>';
      d.onclick = function () {
        window.TPL.selected = i;
        var els = document.querySelectorAll('#tplGrid .tpl');
        for (var k = 0; k < els.length; k++) els[k].className = 'tpl' + (k === i ? ' active' : '');
        if (window.onTplChange) window.onTplChange(i);
      };
      grid.appendChild(d);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
function tpl() { return (window.TOOL_TEMPLATES || [])[window.TPL.selected] || {}; }
