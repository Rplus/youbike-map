<script>
  import Comment from './Comment.svelte';

	let name = 'world';
  let range = 1000;
  let location = null;
  let points = [];
  $: recentPoints = getRecentPoints(points, range, location);
  const KEY = 'AIzaSyCjDnDGv67nvhzBsLRYAwTbiF1HrZBQDUM';

  $: currentPosMarker = location ? `&markers=${location.lat},${location.lng}` : undefined;

  const locateOption = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function getLocation () {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, locateOption);
    });
  };

  async function setLocate() {
    let position = await getLocation();
    location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      acc: position.coords.accuracy,
    };
    console.log('setLocate', location);
  }

  async function fetchData() {
    setLocate();

    console.log('fetchData');
    const res = await fetch('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json').then(d => d.json())
    console.log('fetchData done', res);
    points = Object.values(res.retVal);
  };

  function getRecentPoints(points, range, location) {
    console.log('getRecentPoints');
    points = points.map(p => {
      p.img = getImgSrc(p);
      return p;
    });

    if (location) {
      points = points.filter(p => {
        const distance = GreatCircleDistance([
          location.lng,
          location.lat,
          p.lng,
          p.lat
        ]);
        p.distance = distance.toFixed();
        return distance < range;
      })
    }

    return points.sort((a, b) => a.distance - b.distance);
  }

  // https://en.wikipedia.org/wiki/Great-circle_distance
  // https://gist.github.com/thesadabc/f84adeea5644149539dae968ccdb3f2c
  function GreatCircleDistance(points) {
    let [lng1, lat1, lng2, lat2] = points;
    if (!lng1 || !lat1 || !lng2 || !lat2) return null;
    [lng1, lat1, lng2, lat2] = points.map(n => n * Math.PI / 180)
    const R = 6371000; // average earth radius(m)
    const C = Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lng1 - lng2) * Math.cos(lat1) * Math.cos(lat2);
    return R * Math.acos(C);
  }

  function getImgSrc(
    target,
    size = 300,
  ) {
    let p0 = target;
    let p1;

    if (location) {
      p0 = location;
      p1 = target;
    }

    return (
      'https://maps.googleapis.com/maps/api/staticmap'
      + `?size=${size}x${size}`
      + `&center=${p0.lat},${p0.lng}`
      + `&markers=size:mid|${p0.lat},${p0.lng}`
      + (p1 ? `&markers=color:yellow|label:T|${p1.lat},${p1.lng}` : '')
      + `&key=${KEY}`
    );
  }

  fetchData();
</script>



<!--  -->



<nav class="ctrl">
  <button id="locate" on:click={setLocate}>定位</button>
  <button id="refetch" on:click={fetchData}>更新</button>
  <div>
    <span>距: {range} m</span>
    <br>
    <input type="range" id="range" bind:value={range} max="5000" min="10" step="50" />
  </div>
</nav>

<ol class="list">
  {#each recentPoints as point (point.sno)}
    <li class="item" value={point.sno}>

      <div class="d-f jc-sb ai-c">
        <div>
          <div>{point.sna}</div>
        </div>

        <div class="numbers d-f ai-c fs-0">
          {point.tot}
          <hr>
          <div>
            <div class="bike">車 {point.sbi}</div>
            <div class="empty">空 {point.bemp}</div>
          </div>
        </div>
      </div>

      <details class="details">
        <summary>
          {point.distance} m
        </summary>
        <a href="http://maps.google.com?q={point.lat},{point.lng}" target="_blank" title="google map link">{point.lat}, {point.lng}
        </a>
        <a class="img" style="--url: url({point.img})" href={point.img} target="_blank">{point.img}</a>
      </details>
    </li>
  {/each}
</ol>


<footer class="footer d-f">
  <header>
    <h1>YouBike Map</h1>
  </header>
  <Comment />

  <ul class="info">
    <li>
      GitHub: <a href="https://github.com/rplus/youbike-map">Rplus / Youbike-Map</a>
    </li>
    <li>
      Relesed with: <a href="https://github.com/Rplus/youbike-map/blob/master/LICENSE">MIT license</a>
    </li>
    <li>
      資料來源:
      <br>
      <a href="https://taipeicity.github.io/traffic_realtime/">臺北市政府 交通即時資料 開放資料專區</a>
    </li>
  </ul>
</footer>



<!--  -->



<style>
  .ctrl {
    position: fixed;
    top: 0;
    z-index: 1;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 400px;
    max-width: 100%;
    background-color: #ffe;
  }

  .list {
    padding: 3em .5em;
  }

  .item {
    margin-bottom: 1em;
    display: block;
    padding-bottom: 1em;
    border-bottom: 1px dotted #ccc;
  }

  .bike { padding-bottom: .25em; }
  .empty { color: #999; }

  .details {
    margin-top: 1em;
    margin-left: 2em;
    max-width: 100%;
  }

  .details summary {
    opacity: .4;
  }

  .img {
    display: block;
    width: 300px;
    height: 300px;
    max-width: 100%;
    word-break: break-all;
    color: transparent;
  }

  :global(details[open]) .img {
    background-color: #cfc;
    background-image: var(--url);
  }

  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  .info {
    font-family: monospace;
  }

  .footer {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    background-color: #eef;
    flex-direction: column;
  }

  header {
    text-align: center;
    border-bottom: 1px dashed #aaa;
  }

  .d-f {
    display: flex;
  }

  .ai-c { align-items: center; }
  .jc-sb { justify-content: space-between; }
  .fs-0 { flex-shrink: 0; }

  .d-f hr {
    align-self: stretch;
    margin: 0 .5em;
  }

  :global(body) {
    max-width: 400px;
    margin: 0 auto;
    overflow-y: scroll;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>
