import styles from "@/styles/Home.module.css";
import { log } from "console";
import { symlink } from "fs";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const axios = require('axios');
  const cheerio = require('cheerio');

  const mainTempRef = useRef(null);
  const conditionsRef = useRef(null);
  const maxTempRef = useRef(null);
  const minTempRef = useRef(null);
  const humidityRef = useRef(null);
  const thermalRef = useRef(null);
  const mainIcon = useRef(null);
  const changeNews = useRef(null);
  const activeNews = useRef(0);
  const delay = useRef(1000);

  const changeBackground = useRef(true);

  let news = [
    {ref: useRef(null), iconRef: useRef(null), tittleRef: useRef(null), arrowRef: useRef(null), id:"Ethereum", oldValue: 0, url: "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT", icon: "Ethereum.svg"},
    {ref: useRef(null), iconRef: useRef(null), tittleRef: useRef(null), arrowRef: useRef(null), id:"Litecoin", oldValue: 0, url: "https://api.binance.com/api/v3/ticker/price?symbol=LTCUSDT", icon: "Litecoin.svg"},
    {ref: useRef(null), iconRef: useRef(null), tittleRef: useRef(null), arrowRef: useRef(null), id:"INTC", oldValue: 0, url: "/api/hello", icon: "Intel.svg"},
  ]
  
  let forecastList = [
    {time: useRef(null), temp: 0, condition: null},
    {time: useRef(null), temp: 0, condition: null},
    {time: useRef(null), temp: 0, condition: null}
  ]

  let conditions = [
    "Garoa fraca", 
    "Chuva fraca",
    "Pancadas de chuva",
    "Pancadas de chuva na região", 
    "Trovoada na região",
    "Tempestade",
    "Chuva"
  ]

  let weeks = [
    "dom.",
    "seg.",
    "ter.",
    "qua.",
    "qui",
    "sex.",
    "sáb"
  ]

  let months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho", 
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ]

  const hoursDiv = useRef(null);
  const minutesDiv = useRef(null);
  const dayRef = useRef(null);

  let sunrise = null;
  let sunset = null;

  const morningImg = useRef(null);
  const dayImg = useRef(null);
  const sunsetImg = useRef(null);
  const nightImg = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let audio = document.querySelector("audio");
      if (audio) {
        audio.style.opacity = "0.01"; 
        console.log(audio)
        clearInterval(interval);
      }
    }, 10000)
  }, [])

  const newsUpdate = useEffect(() => {
    for (let x = 0; x < news.length; x++) {
      const interval = setInterval( async () => {
        let value;
        const response = await fetch(news[x].url)
        const data = await response.json();
        value = (Math.round(data.price * 100) / 100).toFixed(2);

        news[x].tittleRef.current.textContent = news[x].id
        news[x].ref.current.textContent =  value;
        news[x].iconRef.current.src = news[x].icon

        if (value < news[x].oldValue) {
          news[x].ref.current.style.color = "rgb(255, 0, 0)"
          news[x].arrowRef.current.src = "Down.svg";
          news[x].arrowRef.current.style.top = "1.6rem";

        } else {
          news[x].ref.current.style.color = "rgb(0, 255, 0)"
          news[x].arrowRef.current.src = "Up.svg";
          news[x].arrowRef.current.style.top = "1.4rem";
        }
        news[x].oldValue = value;
      }, 1500 );
    } 
  }, [])

  const newsSwap = useEffect(() => {
    const interval = setInterval(() => {
      changeNews.current.style.right = `${activeNews.current * 16.4}rem`

      console.log(changeNews.current.style.right)

      activeNews.current++;

      if (activeNews.current > (news.length - 1)) {
        activeNews.current = 0
      }
    }, 4000)
  });


  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await axios.get('https://weather.com/pt-BR/clima/hoje/l/8aba151d4d4c4def3207394a113181d59312d242ad3c12c88bdf347d2c4580f4'); 
      
      const $ = cheerio.load(data);

      const mainTempDiv = $('.CurrentConditions--tempValue--zUBSz').text();
      const conditionsDiv = $(".CurrentConditions--phraseValue---VS-k").text();
      const maxMinTempDiv = $(`div [data-testid="SegmentHighTemp"]`).eq(9).text().trim();
      const humidityDiv = $(`div [data-testid="wxData"]`).eq(2).text().trim();
      const thermalDiv = $(`.TodayDetailsCard--feelsLikeTempValue--8WgHV`).text();
      const sunTimeDiv = $(`.TwcSunChart--dateValue--TzXBr`).text();

      const [high, low] = maxMinTempDiv.split("/");

      const timeSplit = sunTimeDiv.split(/(?<=\d{1,2}:\d{2})/);

      sunrise = timeSplit[0];
      sunset = timeSplit[1];

      mainTempRef.current.textContent = mainTempDiv;
      conditionsRef.current.textContent = conditionsDiv;
      maxTempRef.current.textContent = high;
      minTempRef.current.textContent = low;
      humidityRef.current.textContent = humidityDiv;
      thermalRef.current.textContent = `Sensação térmica de ${thermalDiv}`;

    }, 15000)

    delay.current = 60000;
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const day = now.getDate();
      const dayOfWeek = now.getDay();
      const monthNum = now.getMonth();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const hoursInt = parseInt(hours);
      const minutesInt = parseInt(minutes);

      dayRef.current.textContent = `${weeks[dayOfWeek]}, ${day} de ${months[monthNum]}`;

      for (let offset = 0; offset <= 2; offset++) {
        if ((hoursInt + (offset + 1)) <= 23) {
          forecastList[offset].time.current.textContent = `${hoursInt + (offset + 1)}:00`;
        } else {
          forecastList[offset].time.current.textContent = `${(hoursInt + (offset + 1)) - 24}:00`;
        }
      }

      if (sunrise != null && sunset != null) { 
        const [sunriseHours, sunriseMinutes] = sunrise.split(":");
        const [sunsetHours, sunsetMinutes] = sunset.split(":");
        const conditionsReported = conditionsRef.current.textContent;
        changeBackground.current = true;

        if (hoursInt >= parseInt(sunriseHours) && hoursInt < sunsetHours) {
          console.log(conditionsReported)
          for (let x = 0; x < conditions.length; x++) { 
            if (conditionsReported == conditions[x]) {
              dayImg.current.style.backgroundImage  = `url("Chuva.jpg")`;
              changeBackground.current = false;
            }
          }

          if (changeBackground.current == true) {
            dayImg.current.style.backgroundImage  = `url("${conditionsReported}.jpg")`;
          } 
          
          if (conditionsReported == "Nublado") {
            dayImg.current.style.backgroundImage  = `url("Encoberto.jpg")`;
          } else if (conditionsReported == "Limpo com vento") {
            dayImg.current.style.backgroundImage  = `url("Parcial. nublado.jpg")`;
          }

          nightImg.current.style.opacity = 0;
          dayImg.current.style.opacity = 1;
          
          mainIcon.current.src = "Sun.svg";
        } else {
          nightImg.current.style.opacity = 1;
          dayImg.current.style.opacity = 0;
          
          mainIcon.current.src = "Moon.svg";
        }
      }

      hoursDiv.current.textContent = hours;
      minutesDiv.current.textContent = minutes;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <body>
        <div ref={morningImg} className={styles.morning}/>
        <div ref= {dayImg} className={styles.day}/>
        <div ref={sunsetImg} className={styles.sunset}/>
        <div ref={nightImg} className={styles.night}/>
        
        <div className={styles.main}>
          <div className={styles.container}>
            <div className={styles.tempContainer}>

              <div ref={mainTempRef} className={styles.mainTemp}></div>

              <img ref={mainIcon} style={{width: "60px", height: "60px"}} src="Sun.svg"></img>
            </div>
              <div className={styles.gap}></div>

              <div ref={conditionsRef} className={styles.skyStatus}></div>

              <div className={styles.tempInfo}>
                  <div className={styles.maxMin}>
                      <img style={{width: "20px", height: "20px"}} src="ArrowUp.svg"></img>

                      <div ref={maxTempRef} className={styles.textFont}></div>

                      <div className={styles.textFont}>
                          /
                      </div>

                      <img style={{width: "20px", height: "20px"}} src="ArrowDown.svg"></img>

                      <div ref={minTempRef} className={styles.textFont}></div>
                  </div>
                  <div className={styles.humidityStatus}>
                      <img style={{width: "20px", height: "20px"}} src="Water.svg"></img>

                      <div ref={humidityRef} className={styles.textFont}></div>
                  </div>
              </div>

              <div ref={thermalRef} className={styles.textFont}>
                  Sensação térmica de 12°
              </div>

              <div style={{height: "1rem"}}></div>

              <div className={styles.forecastContainer}>
                  <div className={styles.hoursContainer}>
                      <div ref={forecastList[0].time} className={styles.hoursFont}>
                          15:00
                      </div>
                      <div ref={forecastList[1].time} className={styles.hoursFont}>
                          16:00
                      </div>
                      <div ref={forecastList[2].time} className={styles.hoursFont}>
                          17:00
                      </div>
                  </div>

                  <div className={styles.lineSeparate}></div>

                  <div className={styles.forecastIcons}>
                      <img style={{width: "26px", height: "26px"}} src="Sun.svg"></img>
                      <img style={{width: "26px", height: "26px"}} src="Cloud.svg"></img>
                      <img style={{width: "32px", height: "32px"}} src="Rain.svg"></img>
                  </div>
                  <div className={styles.forecastTemps}>
                      <div className={styles.forecastFont}>
                          15°
                      </div>
                      <div className={styles.forecastFont}>
                          17°
                      </div>
                      <div className={styles.forecastFont}>
                          18°
                      </div>
                  </div>
              </div>
          </div>

          <div className={styles.timeContainer}>
            <div className={styles.timeNow}>
              <div ref={hoursDiv} className={styles.hours}></div>
              <div ref={minutesDiv} className={styles.minutes}></div>
              <div ref={dayRef} className={styles.dayInfo}>TEST</div>
            </div>
          </div>
          <div className={styles.infoCotainer}>
            <div className={styles.newsCotainer}>
              <div ref={changeNews} className={styles.newsList}>
                <div className={styles.newsGap}>
                  <img style={{width: "3rem", height: "3rem"}} ref={news[0].iconRef} ></img>
                  <div className={styles.valueQuotesContainer}>
                    <span>
                      <div ref={news[0].tittleRef} className={styles.newsTittle}></div>
                      <div ref={news[0].ref} className={styles.newsFont}></div>
                    </span>
                    <img ref={news[0].arrowRef} style={{width: "1.2rem", height: "1.2rem", position: "relative", top: "1.4rem"}} ></img>
                  </div>
                </div>
                <div className={styles.newsGap}>
                  <img style={{width: "3rem", height: "3rem"}} ref={news[1].iconRef} ></img>
                  <div className={styles.valueQuotesContainer}>
                    <span>
                      <div ref={news[1].tittleRef} className={styles.newsTittle}></div>
                      <div ref={news[1].ref} className={styles.newsFont}></div>
                    </span>
                    <img ref={news[1].arrowRef} style={{width: "1.2rem", height: "1.2rem", position: "relative", top: "1.4rem"}} ></img>
                  </div>
                </div>
                <div className={styles.newsGap}>
                  <img style={{width: "3rem", height: "3rem"}} ref={news[2].iconRef} ></img>
                  <div className={styles.valueQuotesContainer}>
                    <span>
                      <div ref={news[2].tittleRef} className={styles.newsTittle}></div>
                      <div ref={news[2].ref} className={styles.newsFont}></div>
                    </span>
                    <img ref={news[2].arrowRef} style={{width: "1.2rem", height: "1.2rem", position: "relative", top: "1.4rem"}} ></img>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.moonContainer}>
              <div className={styles.moonPhase}>

              </div>
              <div className={styles.moonFont}>

              </div>
            </div>
          </div>
        </div>
        <audio controls loop src="Ambient Sound.mp3"/>
      </body>
    </>
  );
}
