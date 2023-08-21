import React from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect, useMemo } from 'react';
import { getMoment, findLocation } from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/WeatherSetting';
 
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const AUTHORIZATION_KEY = "CWB-34532412-D010-4E22-A574-8613313B19B7";

function App() {
  console.log("Invoke function component");
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentCity, setCurrentCity] = useState(() => localStorage.getItem("cityName") || "臺北市"); // lazy initialization
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  
  const handleCurrentPageChange = (currentPage) => { setCurrentPage(currentPage); };
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };
  
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );

  const { cityName, locationName, sunriseCityName } = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY 
  });
  
  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log("render")}
        {
          currentPage === "WeatherCard" && (
            <WeatherCard
              cityName={cityName}
              weatherElement={weatherElement}
              moment={moment}
              fetchData={fetchData}
              handleCurrentPageChange={handleCurrentPageChange}
            />
          )
        }
        {currentPage === "WeatherSetting" && 
        <WeatherSetting
            cityName={cityName} 
            handleCurrentCityChange={handleCurrentCityChange} 
            handleCurrentPageChange={handleCurrentPageChange}
        />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
