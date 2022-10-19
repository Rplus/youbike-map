<script>
  import Comment from './Comment.svelte';

  let range = 1000;
  let location = null;
  let points = [];
  $: recentPoints = getRecentPoints(points, range, location);
  const KEY = 'AIzaSyCjDnDGv67nvhzBsLRYAwTbiF1HrZBQDUM';

  $: currentPosMarker = location ? `&markers=${location.lat},${location.lng}` : undefined;
  $: errMsg = '';
  $: updateTime = '';
  let dataVersion = 'v1';
  let dotCount = 5;
  let loading = false;
  const DATA_SOURCE = {
    'v1': 'https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json',
    'v2': 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json',
  };

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
    loading = true;
    setLocate();

    console.log('fetchData');
    try {
      const res = await fetch(DATA_SOURCE[dataVersion]);
      const data = await res.json();
      // data.retVal: v1
      points = data.retVal ? Object.values(data.retVal) : data;
      loading = false;
    }
    catch (err) {
      errMsg = err;
      console.error({err});
      loading = false;
    }
    updateTime = new Intl.DateTimeFormat('zh-TW', { timeStyle: 'medium', hour12: false }).format(new Date());
  };

  function getRecentPoints(points, range, location) {
    // console.log('getRecentPoints');
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
        let dx = p.lng - location.lng;
        let dy = p.lat - location.lat;
        p._d = p.distance / range;
        p._a = 180 * (Math.atan2( dy, dx ) / Math.PI);
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

  function getImgSrc(target, size = 300) {
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
      + (p1 ? `&markers=color:black|label:T|${p1.lat},${p1.lng}` : '')
      + `&key=${KEY}`
    );
  }

  $: {
    dataVersion;
    fetchData();
  }
</script>



<!--  -->



<nav class="ctrl">
  <button id="locate" on:click={setLocate}>定位</button>
  <button id="refetch" on:click={fetchData} data-updatetime={updateTime}>更新</button>
  <div class="d-f">
    版本:
    <div>
      <label>
        <input type="radio" name="version" value="v1" bind:group={dataVersion}>
        v1
      </label>
      <label>
        <input type="radio" name="version" value="v2" bind:group={dataVersion}>
        v2
      </label>
    </div>
  </div>
</nav>


<div class="workspace" class:loading={loading}>
  <details>
    <summary>資料點調整</summary>
    <div class="d-f jc-se">
      <div>
        <span>距: {range} m</span>
        <br>
        <input type="range" id="range" bind:value={range} max="5000" min="10" step="50" />
      </div>
      <label>
        資料點數量:
        <br>
        <input type="number" bind:value={dotCount} min="5" max="15">
      </label>
    </div>
  </details>

  <div class="error-message">
    {errMsg}
  </div>

  {#if location}
    <div class="map">
      {#each recentPoints.slice(0, +dotCount) as point (point.sno)}
        <div class="map-point"
          data-name={point.sna}
          data-bike={point.sbi}
          style="--d: {point._d}; --a: {point._a}; "
        />
      {/each}
    </div>
  {/if}

  <ol class="list">
    {#each recentPoints as point (point.sno)}
      <li class="item" value={point.sno}>

        <div class="d-f jc-sb ai-c">
          <div>
            <div>{point.sna}</div>
          </div>

          <div class="numbers d-f ai-c fs-0">
            <span class="sum">{point.tot}</span>
            <hr>
            <div>
              <div class="bike">車 {point.sbi}</div>
              <div class="empty">空 {point.bemp}</div>
            </div>
          </div>
        </div>

        <details class="details">
          <summary class="summary">
            {point.distance} m
          </summary>
          <a href="http://maps.google.com?q={point.lat},{point.lng}" target="_blank" title="google map link">{point.lat}, {point.lng}
          </a>
          <a class="img" style="--url: url({point.img})" href={point.img} target="_blank">_</a>
        </details>
      </li>
    {/each}
  </ol>
</div>


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
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    width: 400px;
    max-width: 100%;
    background-color: #ffe;
  }

  #refetch {
    position: relative;
  }
  #refetch::before {
    content: attr(data-updatetime);
    position: absolute;
    top: 100%;
    left: -.5em;
    font-family: monospace;
    color: #aaa;
  }

  .workspace {
    padding-top: 3em;
  }

  .error-message {
    font-family: monospace;
    color: #900;
  }

  .map {
    margin-top: 1em;
    position: relative;
    padding-bottom: calc(100% - 2em);
    text-align: right;
    overflow: hidden;
    margin-left: 1em;
    margin-right: 1em;
    box-shadow: inset 0 0 5px 2px #0003;
    background-color: #0991;
  }

  .loading .map::before {
    content: 'loading';
    position: absolute;
    inset: 0;
    z-index: 100;
    padding: 0.5em;
    font-size: 2rem;
    color: #000c;
    font-weight: 900;
    font-family: monospace;
    text-transform: capitalize;
    text-shadow: 2px 2px 4px #fff;
    background: #0001;
    backdrop-filter: blur(3px);
  }

  .map-point {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(70% * var(--d));
    height: 0;
    box-shadow: 0 0 0 1px #0003;
    background-color: #f00;
    transform-origin: 0% 50%;
    transform: rotate(calc(var(--a) * -1deg));
  }

  .map-point:hover {
    --o: .4;
  }

  .map-point::after {
    content: attr(data-name);
    position: absolute;
    top: 0;
    left: 100%;
    width: max-content;
    transform-origin: 50% 50%;
    transform: translate(-50%, 50%) rotate(calc(var(--a) * 1deg));
    color: rgba(0, 0, 0, var(--o, 0));
    pointer-events: none;
    font-size: small;
    white-space: nowrap;
  }

  .map-point::before {
    content: attr(data-bike);
    position: relative;
    display: inline-flex;
    width: 1.75em;
    height: 1.75em;
    align-items: center;
    justify-content: center;
    transform: translate(100%, -50%) rotate(calc(var(--a) * 1deg));
    border-radius: 1em;
    box-shadow: 0 0 0 1px #0002;
  }

  .list {
    padding: 0 .5em;
  }

  .item {
    margin-bottom: 1em;
    display: block;
    padding-bottom: 1em;
    border-bottom: 1px dotted #ccc;
  }

  .sum { color: #999; }
  .bike { padding-bottom: .25em; }
  .empty { color: #999; }

  .details {
    margin-top: 1em;
    margin-left: 2em;
    max-width: 100%;
  }

  .summary {
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

  .info {
    align-self: center;
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
  .jc-se { justify-content: space-evenly; }
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
