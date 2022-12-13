import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "0fe3380fae146320aca5dbd34738c882";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "clody-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const month = new Date().getMonth();
const date = new Date().getDate();

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const [night, setIsNight] = useState(false);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      return "";
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    const time = new Date().getHours();
    if (time >= 18 || time <= 6) {
      setIsNight(true);
    }
    getWeather();
  }, []);
  if (!ok) {
    return (
      <View style={styles.grantedError}>I can't bring your location.</View>
    );
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={
          night
            ? require("./assets/nightTime.jpg")
            : require("./assets/dayTime.jpg")
        }
        style={styles.image}
      >
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weather}
        >
          {days.length === 0 ? (
            <View style={{ ...styles.day, alignItems: "center" }}>
              <ActivityIndicator
                color="white"
                style={{ marginTop: 10 }}
                size="large"
              />
            </View>
          ) : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text style={styles.date}>{`${month + 1} / ${
                    date + index
                  }`}</Text>
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Fontisto
                    style={styles.icon}
                    name={icons[day.weather[0].main]}
                    size={68}
                    color="black"
                  />
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>
                  {day.weather[0].description}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "tomato",
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },

  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  cityName: {
    fontSize: 50,
    fontWeight: "200",
    color: "white",
  },
  date: {
    fontSize: 30,
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 128,
    marginTop: 50,
    color: "white",
  },
  description: {
    fontSize: 60,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  },
  icon: {
    color: "white",
  },
  grantedError: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
});
