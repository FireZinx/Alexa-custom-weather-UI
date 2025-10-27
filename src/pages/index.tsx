import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useRef } from "react";
import { checkPrimeSync } from "crypto";

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
  const forecast1 = useRef(null);
  const forecast2 = useRef(null);
  const forecast3 = useRef(null);

  const hoursDiv = useRef(null);
  const minutesDiv = useRef(null);

  let sunrise = null;
  let sunset = null;
  let audio;

  const morningImg = useRef(null);
  const dayImg = useRef(null);
  const sunsetImg = useRef(null);
  const nightImg = useRef(null);

  useEffect(() => {
    const delay = setInterval(() => {
      audio = document.querySelector("audio");
      if (audio) {
        audio.style.opacity = "0.01"; 
        console.log(audio)
        clearInterval(delay);
      }
    }, 10000)
    return () => {clearInterval(delay);}
  }, [])

  useEffect(() => {
    const delay = setInterval(async () => {
      const { data } = await axios.get('https://weather.com/pt-BR/clima/hoje/l/8aba151d4d4c4def3207394a113181d59312d242ad3c12c88bdf347d2c4580f4');
      
      const $ = cheerio.load(data);

      const mainTempDiv = $('.CurrentConditions--tempValue--zUBSz').text();
      const conditionsDiv = $(".CurrentConditions--phraseValue---VS-k").text();
      const maxMinTempDiv = $(`div [data-testid="SegmentHighTemp"]`).eq(9).text().trim();
      const humidityDiv = $(`div [data-testid="wxData"]`).eq(2).text().trim();
      const thermalDiv = $(`.TodayDetailsCard--feelsLikeTempValue--8WgHV`).text();

      const sunTimeDiv = $(`.TwcSunChart--dateValue--TzXBr`).text();
      
      const timeSplit = sunTimeDiv.split(/(?<=\d{1,2}:\d{2})/);

      sunrise = timeSplit[0];
      sunset = timeSplit[1];

      const [high, low] = maxMinTempDiv.split("/");

      mainTempRef.current.textContent = mainTempDiv;
      conditionsRef.current.textContent = conditionsDiv;
      maxTempRef.current.textContent = high;
      minTempRef.current.textContent = low;
      humidityRef.current.textContent = humidityDiv;
      thermalRef.current.textContent = `Sensação térmica de ${thermalDiv}`;

    }, (1000))

    return () => clearInterval(delay);
  }, []);

  useEffect(() => {
    const delay = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      
      if (parseInt(hours) >= 22) {
        forecast3.current.textContent = `${(parseInt(hours) - 23) + 3}:00 `
      } else {
        forecast3.current.textContent = `${parseInt(hours) + 3}:00`;
      }

      if (parseInt(hours) >= 21) {
        forecast2.current.textContent = `${(parseInt(hours) - 23) + 2}:00 `
      }else {
        forecast2.current.textContent = `${parseInt(hours) + 2}:00`;
      }

      if (parseInt(hours) >= 20) {
        forecast1.current.textContent = `${(parseInt(hours) - 23) + 1}:00 `
      }else {
        forecast1.current.textContent = `${parseInt(hours) + 1}:00`;
      }

      if (sunrise != null && sunset != null) { 
        const [sunriseHours, sunriseMinutes] = sunrise.split(":")
        const [sunsetHours, sunsetMinutes] = sunset.split(":")

        if (parseInt(hours) >= parseInt(sunriseHours) && parseInt(hours) < sunsetHours) {
          if (parseInt(minutes) >= parseInt(sunriseHours) && parseInt(minutes) < (Math.min(parseInt(sunriseMinutes) + 10, 60)) && parseInt(hours) == parseInt(sunriseHours)) {
            morningImg.current.style.opacity = 1
            nightImg.current.style.opacity = 0
          } else if (parseInt(minutes) >= Math.min(parseInt(sunriseMinutes) + 10, 59) || parseInt(hours) >= parseInt(sunriseHours)  ) {
            dayImg.current.style.opacity = 1
            morningImg.current.style.opacity = 0
          }

          mainIcon
        }

        if (parseInt(hours) >= parseInt(sunsetHours) || parseInt(hours) < parseInt(sunriseHours)) {
          if (parseInt(minutes) >= parseInt(sunsetHours) && parseInt(minutes) < (Math.min(parseInt(sunsetMinutes) + 10, 60)) && parseInt(hours) == parseInt(sunsetHours)) {
            sunsetImg.current.style.opacity = 1
            dayImg.current.style.opacity = 0
          } else if (parseInt(minutes) >= Math.min(parseInt(sunsetMinutes) + 10, 59) || parseInt(hours) >= parseInt(sunsetHours)  ) {
            nightImg.current.style.opacity = 1
            sunsetImg.current.style.opacity = 0
          }

          mainIcon.current.src = "Moon.svg"
        }
      }

      hoursDiv.current.textContent = hours;
      minutesDiv.current.textContent = minutes;
    }, 500);

    return () => clearInterval(delay);
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
                      <div ref={forecast1} className={styles.hoursFont}>
                          15:00
                      </div>
                      <div ref={forecast2} className={styles.hoursFont}>
                          16:00
                      </div>
                      <div ref={forecast3} className={styles.hoursFont}>
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
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
