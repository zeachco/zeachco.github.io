/* eslint-disable */
(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  (i[r] =
    i[r] ||
    function() {
      if (process.env.NODE_ENV === 'production') (i[r].q = i[r].q || []).push(arguments);
      else if (console && console.debug) console.debug(`[${r}]`, arguments);
    }), (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

window.ga('create', 'UA-77556102-1', 'auto');
window.ga('send', 'pageview');

export default window.ga;
