<script>
  let open;

  function initDisqus(e) {
    if (!open) { return; }
    console.log('initDisqus');

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
      });
      return;
    }
    (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://rplus-youbike-map.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }

  function onToggle(e) {
    console.log(1111111111, e);
    open = e.target.open;
    initDisqus();
  }
</script>

<details on:toggle={onToggle}>
  <summary>開啟留言</summary>
  <div>
    <div id="disqus_thread"></div>
  </div>
</details>


<style>
  details {
    padding: 1em;
  }
</style>
