import styles from "@/styles/Home.module.css";
import { log, time } from "console";
import { symlink } from "fs";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";
import React from "react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const axios = require('axios');
  const cheerio = require('cheerio');

  const mainTempRef = useRef<HTMLInputElement | null>(null);
  const conditionsRef = useRef<HTMLInputElement | null>(null);
  const maxTempRef = useRef<HTMLInputElement | null>(null);
  const minTempRef = useRef<HTMLInputElement | null>(null);
  const humidityRef = useRef<HTMLInputElement | null>(null);
  const thermalRef = useRef<HTMLInputElement | null>(null);
  const mainIcon = useRef<HTMLImageElement | null>(null);
  const infoContainer = useRef<HTMLImageElement | null>(null);
  const newsContainer = useRef<HTMLImageElement | null>(null);
  const exitButton = useRef<HTMLImageElement | null>(null);
  const changeNews = useRef<HTMLInputElement | null>(null);
  const moonImgRef = useRef<HTMLImageElement | null>(null);
  const moonPhaseFontRef = useRef<HTMLInputElement | null>(null);
  const activeNews = useRef<number>(0);
  const delay = useRef<number>(0);

  const changeBackground = useRef(true);
  const isChagingNews = useRef(true);

  let news = [
    {newsGap: React.createRef<HTMLDivElement>() ,parentRef: React.createRef<HTMLDivElement>(), ref: React.createRef<HTMLDivElement>(), iconRef: useRef<HTMLImageElement | null>(null), tittleRef: useRef<HTMLInputElement | null>(null), arrowRef: useRef<HTMLImageElement | null>(null), id:"Ethereum", oldValue: useRef<number>(0), url: "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT", icon: "Ethereum.svg"},
    {newsGap: React.createRef<HTMLDivElement>() ,parentRef: React.createRef<HTMLDivElement>(), ref: React.createRef<HTMLDivElement>(), iconRef: useRef<HTMLImageElement | null>(null), tittleRef: useRef<HTMLInputElement | null>(null), arrowRef: useRef<HTMLImageElement | null>(null), id:"Litecoin", oldValue: useRef<number>(0), url: "https://api.binance.com/api/v3/ticker/price?symbol=LTCUSDT", icon: "Litecoin.svg"},
    {newsGap: React.createRef<HTMLDivElement>() ,parentRef: React.createRef<HTMLDivElement>(), ref: React.createRef<HTMLDivElement>(), iconRef: useRef<HTMLImageElement | null>(null), tittleRef: useRef<HTMLInputElement | null>(null), arrowRef: useRef<HTMLImageElement | null>(null), id:"INTC", oldValue: useRef<number>(0), url: "/api/hello", icon: "Intel.svg"},
    {newsGap: React.createRef<HTMLDivElement>() ,parentRef: React.createRef<HTMLDivElement>(), ref: React.createRef<HTMLDivElement>(), iconRef: useRef<HTMLImageElement | null>(null), tittleRef: useRef<HTMLInputElement | null>(null), arrowRef: useRef<HTMLImageElement | null>(null), id:"AMD", oldValue: useRef<number>(0), url: "/api/hello", icon: "AMD.svg"},
  ]
  
  let forecastList = [
    {time: useRef<HTMLInputElement | null>(null), temp: 0, condition: 0},
    {time: useRef<HTMLInputElement | null>(null), temp: 0, condition: 0},
    {time: useRef<HTMLInputElement | null>(null), temp: 0, condition: 0}
  ]

  let conditions = [
    "Garoa fraca", 
    "Chuva fraca",
    "Pancadas de chuva",
    "Pancadas de chuva na região", 
    "Trovoada na região",
    "Tempestade",
    "Trovoada à noite",
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

  const hoursDiv = useRef<HTMLInputElement | null>(null);
  const minutesDiv = useRef<HTMLInputElement | null>(null);
  const dayRef = useRef<HTMLInputElement | null>(null);

  const sunrise = useRef<HTMLInputElement | null>(null);
  const sunset = useRef<HTMLInputElement | null>(null);

  const morningImg = useRef<HTMLInputElement | null>(null);
  const dayImg = useRef<HTMLInputElement | null>(null);
  const sunsetImg = useRef<HTMLInputElement | null>(null);
  const nightImg = useRef<HTMLInputElement | null>(null);

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
    let data;
    for (let x = 0; x < news.length; x++) {
      const interval = setInterval( async () => {
        if (news[x].url == "/api/hello") {
          const response = await fetch(news[x].url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: news[x].id})
          })

          data = await response.json();
        } else {
          const response = await fetch(news[x].url);
          data = await response.json();
        }

        const value = parseFloat((Math.round(data.price * 100) / 100).toFixed(2));
        
        news[x].tittleRef.current!.textContent = news[x].id
        console.log(news[x].ref.current!)
        news[x].ref.current!.textContent = String(value);
        news[x].iconRef.current!.src = news[x].icon

        if (value < news[x].oldValue.current) {
          news[x].ref.current!.style.color = "rgb(255, 0, 0)"
          news[x].arrowRef.current!.src = "Down.svg";
          news[x].arrowRef.current!.style.top = "1.6rem";

        } else {
          news[x].ref.current!.style.color = "rgb(0, 255, 0)"
          news[x].arrowRef.current!.src = "Up.svg";
          news[x].arrowRef.current!.style.top = "1.4rem";
        }

        if (value < 43.64 && x == 2) {
          hoursDiv.current!.style.backgroundColor = "rgba(255, 0, 0, 0.15)"
        } else if (value > 43.64 && x == 2){
          hoursDiv.current!.style.backgroundColor = "rgba(255, 255, 255, 0)"
        }

        news[x].oldValue.current = value;
      }, 1500 );
    } 
  }, [])

  const newsSwap = useEffect(() => {
    const interval = setInterval(() => {
      if (isChagingNews.current) {
        changeNews.current!.style.right = `${activeNews.current * 16.4}rem`

        console.log(changeNews.current!.style.right)

        activeNews.current += 1;

        if (activeNews.current > (news.length - 1)) {
          activeNews.current = 0
        }
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
      const moonStateDiv = $(`div [data-testid="wxData"]`).eq(7).text().trim();

      const [high, low] = maxMinTempDiv.split("/");

      const timeSplit = sunTimeDiv.split(/(?<=\d{1,2}:\d{2})/);

      if (timeSplit && sunrise.current && sunset.current) {
        sunrise.current.value = timeSplit[0];
        sunset.current.value = timeSplit[1];
      }

      mainTempRef.current!.textContent = mainTempDiv;
      conditionsRef.current!.textContent = conditionsDiv;
      maxTempRef.current!.textContent = high;
      minTempRef.current!.textContent = low;
      humidityRef.current!.textContent = humidityDiv;
      thermalRef.current!.textContent = `Sensação térmica de ${thermalDiv}`;
      moonPhaseFontRef.current!.textContent = moonStateDiv;
      moonImgRef.current!.src = `${moonStateDiv}.svg`;
    }, 20000)

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

      dayRef.current!.textContent = `${weeks[dayOfWeek]}, ${day} de ${months[monthNum]}`;

      if (sunrise.current?.value != null && sunrise.current?.value != null) {   
        const [sunriseHours, sunriseMinutes] = sunrise.current!.value.split(":");
        const [sunsetHours, sunsetMinutes] = sunrise.current!.value.split(":");
        const conditionsReported = conditionsRef.current!.textContent;
        changeBackground.current = true;

        if (hoursInt >= 6 && hoursInt < 17) {
          console.log(conditionsReported)
          for (let x = 0; x < conditions.length; x++) { 
            if (conditionsReported == conditions[x]) {
              dayImg.current!.style.backgroundImage  = `url("Chuva.jpg")`;
              changeBackground.current = false;
            }
          }

          if (changeBackground.current == true) {
            dayImg.current!.style.backgroundImage  = `url("${conditionsReported}.jpg")`;
          } 
          
          if (conditionsReported == "Nublado") {
            dayImg.current!.style.backgroundImage  = `url("Encoberto.jpg")`;
          } else if (conditionsReported == "Limpo com vento") {
            dayImg.current!.style.backgroundImage  = `url("Parcial. nublado.jpg")`;
          }

          nightImg.current!.style.opacity = "0";
          dayImg.current!.style.opacity = "1";
          
          mainIcon.current!.src = "Sun.svg";
        } else {
          nightImg.current!.style.opacity = "1";
          dayImg.current!.style.opacity = "0";
          
          mainIcon.current!.src = "Moon.svg";
        }
      }

      hoursDiv.current!.textContent = hours;
      minutesDiv.current!.textContent = minutes;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const expandFinances = () =>{
    if (isChagingNews.current) { 
      isChagingNews.current = false

      newsContainer.current!.style.transition = "1s, top 0s"

      newsContainer.current!.style.position = "absolute"
      newsContainer.current!.style.top = "2rem"
      newsContainer.current!.style.right = "7.2rem"
      newsContainer.current!.style.width = "45rem"
      newsContainer.current!.style.height = "26rem"
      newsContainer.current!.style.padding = "2rem"
      newsContainer.current!.style.alignItems = "start"

      changeNews.current!.style.right = "0rem"
      changeNews.current!.style.flexDirection = "column"
      changeNews.current!.style.gap = "2rem"

      infoContainer.current!.style.paddingTop = "7.5rem"


      for (let x = 0; x < news.length; x++) {
        news[x].tittleRef.current!.style.fontSize = "1.5rem"

        news[x].parentRef.current!.style.gap = "2rem"
        news[x].parentRef.current!.style.flexDirection = "row"
      }

      setTimeout(() => {
        exitButton.current!.style.opacity = "1"
      }, 1500)

    } else {
      isChagingNews.current = true

      newsContainer.current!.style.width = "15rem"
      newsContainer.current!.style.height = "4rem"
      newsContainer.current!.style.right = "1rem"

      for (let x = 0; x < news.length; x++) {
        news[x].newsGap.current!.style.opacity = "0"
      }

      setTimeout(() => {
        newsContainer.current!.style.transition = "0s"
        newsContainer.current!.style.position = "relative"
        newsContainer.current!.style.right = "0rem"
        newsContainer.current!.style.top = "0rem"
        newsContainer.current!.style.padding = "0rem"
        newsContainer.current!.style.alignItems = "center"

        infoContainer.current!.style.paddingTop = "2rem"

        changeNews.current!.style.flexDirection = "row"
        changeNews.current!.style.gap = "5rem"

        for (let x = 0; x < news.length; x++) {
          news[x].tittleRef.current!.style.fontSize = "1rem"

          news[x].parentRef.current!.style.gap = "0rem"
          news[x].parentRef.current!.style.flexDirection = "column"

          news[x].newsGap.current!.style.opacity = "1"
        }

      }, 1600)

      exitButton.current!.style.opacity = "0"
    }
    console.log(isChagingNews.current)
  }

  return (
    <>
      <body>
        <div ref={morningImg} className={styles.morning}/>
        <div ref= {dayImg} className={styles.day}/>
        <div ref={sunsetImg} className={styles.sunset}/>
        <div ref={nightImg} className={styles.night}/>
        
        <div className={styles.main}>
          <img ref={exitButton} src={"ArrowUp.svg"} className={styles.exitButton}
          onClick={() => {
            expandFinances();
          }}
          />
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
          </div>

          <div className={styles.timeContainer}>
            <div className={styles.timeNow}>
              <div ref={hoursDiv} className={styles.hours}></div>
              <div ref={minutesDiv} className={styles.minutes}></div>
              <div ref={dayRef} className={styles.dayInfo}>TEST</div>
            </div>
          </div>
          <div ref={infoContainer}className={styles.infoCotainer}>
            <div ref={newsContainer} className={styles.newsCotainer}>
              <div ref={changeNews} className={styles.newsList}
              onClick={() => {
                expandFinances();
              }}
              >
                {news.map((item, index) => (
                  <div key={index} ref={item.newsGap} className={styles.newsGap}>
                    <img
                      style={{ width: "3rem", height: "3rem" }}
                      ref={item.iconRef}
                    />

                    <div className={styles.valueQuotesContainer}>
                      <div ref={item.parentRef} className={styles.test}>
                        <div ref={item.tittleRef} className={styles.newsTittle}></div>
                        <div ref={item.ref} className={styles.newsFont}></div>
                      </div>

                      <img
                        ref={item.arrowRef}
                        style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          position: "relative",
                          top: "1.4rem",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.moonContainer}>
              <div className={styles.moonPhase}>
                <img style={{height:"5.7rem", width:"5.7rem"}} ref={moonImgRef}/>
              </div>
              <div ref={moonPhaseFontRef} className={styles.moonFont}/>
            </div>
          </div>
        </div>
        <input type="hidden" ref={sunrise} />
        <input type="hidden" ref={sunset} />
      </body>
    </>
  );
}
