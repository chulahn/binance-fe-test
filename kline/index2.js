(async function () {
    const seriesData = await fetchSeriesData()
      console.log('seriesData: ', seriesData);
      var a = seriesData[0];
      var smallSet = seriesData.slice(0,10);
      console.log(smallSet)
      var c = document.getElementById("kline");
      var ctx = c.getContext("2d");
      var WIDTH = c.clientWidth;
      var HEIGHT = c.clientHeight / 2;
      var HEIGHT2 = 150;
  
      var DATAMIN = 26000;
      var DATAMAX = 28000;
  
      var SCALE = HEIGHT2 / (DATAMAX - DATAMIN);
      seriesData.forEach( (e,i) => {
        var COLOR = "";
        if (e[1] > e[4]) {
          COLOR = "#FF0000";
        }
        else {
          COLOR = "#00FF00"
        }
  
        // ctx.beginPath();
        // ctx.moveTo(i*10,(e[1] - DATAMIN) * SCALE);
        // ctx.lineTo(i*10,(e[4] - DATAMIN) * SCALE);
        // ctx.strokeStyle=COLOR;
        // ctx.lineWidth = 5;
        // ctx.stroke();
        // ctx.closePath();
  
        // ctx.beginPath();
        // ctx.moveTo(i*10+2,(e[2] - DATAMIN) * SCALE);
        // ctx.lineTo(i*10+2,(e[3] - DATAMIN) * SCALE);
        // ctx.lineWidth = .5;
        // ctx.strokeStyle=COLOR;
        // ctx.stroke();
        // ctx.closePath();
      });
      
      for (var j=0; j<10; j++) {
        ctx.font = "10px Arial"; 
        ctx.fillText(28000-(200*j), 270, j*15);
      
      }
      
      ctx.beginPath();
      ctx.moveTo(300,0);
      ctx.lineTo(300,150);
      ctx.strokeStyle="#000000"
      ctx.stroke();
      // console.log((a[2] - DATAMIN) * SCALE)
      var k=0;
      subcribe(data => { // data: [time, open, high, low, close]
        console.log('suncribe: ', data)
        var COLOR = "";
        if (data[1] > data[4]) {
          COLOR = "#FF0000";
        }
        else {
          COLOR = "#00FF00"
        }
        ctx.beginPath();
        ctx.moveTo(k*10,(data[1] - DATAMIN) * SCALE);
        ctx.lineTo(k*10,(data[4] - DATAMIN) * SCALE);
        ctx.strokeStyle=COLOR;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
  
        ctx.beginPath();
        ctx.moveTo(k*10+2,(data[2] - DATAMIN) * SCALE);
        ctx.lineTo(k*10+2,(data[3] - DATAMIN) * SCALE);
        ctx.lineWidth = .5;
        ctx.strokeStyle=COLOR;
        ctx.stroke();
        ctx.closePath();
        k++;
      })
  
    // [time, open, high, low, close][]
    function fetchSeriesData() {
      return new Promise((resolve, reject) => {
        fetch('https://www.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1m')
          .then(async res => {
            const data = await res.json()
            const result = data.map(([time, open, high, low, close]) => [time, open, high, low, close])
            resolve(result)
          })
          .catch(e => reject(e))
      })
    }
    function subcribe(success) {
      try {
        const socket = new WebSocket('wss://stream.binance.com/stream?streams=btcusdt@kline_1m')
        socket.onmessage = e => {
          const res = JSON.parse(e.data)
          const { t, o, h, l, c } = res.data.k
          success([t, o, h, l, c]);
        }
      } catch(e) {
        console.error(e.message)
      }
    }
  })()