import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { User } from "firebase";
import { useUser, useFirestore } from "reactfire";
import { useHistory } from "react-router-dom";

export default function HomeContainer() {
  const history = useHistory();
  const [foodEvents, setFoodEvents] = useState<any>([]);
  const user: User = useUser();
  const foodCollection = useFirestore()
    .collection("users")
    .doc(user.uid)
    .collection("food-calendar");

  useEffect(() => {
    foodCollection.get().then((documents) => {
      let data = documents.docs.map((doc) => doc.data());
      // console.log(data);
      setFoodEvents(data);
    });
    // eslint-disable-next-line
  }, []);

  const getMonthTileContent = (props: any) => {
    let eventsThisYearAndMonth = foodEvents.filter((event: any) => {
      return (
        event.date.toDate().getFullYear() ===
          props.activeStartDate.getFullYear() &&
        event.date.toDate().getMonth() === props.date.getMonth()
      );
    }).length;
    if (eventsThisYearAndMonth > 0)
      return <p>{eventsThisYearAndMonth} Entry(s)</p>;
    else return null;
  };

  const getDayTileContent = (props: any) => {
    let eventsThisYearAndMonth = foodEvents.filter((event: any) => {
      return (
        event.date.toDate().getFullYear() === props.date.getFullYear() &&
        event.date.toDate().getMonth() === props.date.getMonth() &&
        event.date.toDate().getDate() === props.date.getDate()
      );
    }).length;
    if (eventsThisYearAndMonth > 0)
      return (
        <p>
          {eventsThisYearAndMonth}{" "}
          <span role="img" aria-label="potato">
            🥔
          </span>
        </p>
      );
    else return null;
  };
  const routeToDayPage = (value: any) => {
    history.push("/foodDate", { date: value });
  };

  return (
    <Grid container justify="center">
      Your Eating Calendar
      <Calendar
        calendarType="US"
        minDetail="year"
        // onViewChange={(props) => console.log(props)}
        defaultView="month"
        // value={value}
        tileContent={(props) => {
          if (props.view === "year") {
            return getMonthTileContent(props);
          } else {
            return getDayTileContent(props);
          }
        }}
        onClickDay={(value) => routeToDayPage(value)}
      />
    </Grid>
  );
}
