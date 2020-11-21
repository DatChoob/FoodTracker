import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
} from "@material-ui/core";
import { User } from "firebase";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useFirestore, useUser, firestore, useStorage } from "reactfire";
import Carousel from "react-material-ui-carousel";

const addDay = function (date: Date) {
  date.setDate(date.getDate() + 1);
  return date;
};

export default function FoodDateContainer() {
  const location = useLocation<any>();

  const [data, setData] = useState<any>([]);
  const user: User = useUser();
  const history = useHistory();
  const foodCollection = useFirestore()
    .collection("users")
    .doc(user.uid)
    .collection("food-calendar")
    .orderBy("date", "desc")
    .where("date", ">", firestore.Timestamp.fromDate(location.state.date))
    .where(
      "date",
      "<",
      firestore.Timestamp.fromDate(addDay(new Date(location.state.date)))
    );

  const bucket = useStorage();
  useEffect(() => {
    async function getit() {
      let collection = await foodCollection.get();
      let mappedData = await Promise.all(
        collection.docs.map(async (doc) => {
          let data = doc.data();
          let uploadedFoodImages = await doc.ref.collection("images").get();
          data.imageRefUrls = await Promise.all(
            uploadedFoodImages.docs.map(
              async (doc) =>
                await bucket.ref(doc.data().refUrl).getDownloadURL()
            )
          );
          return data;
        })
      );
      setData(mappedData);
    }
    getit();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <div>
        <Button variant="contained" onClick={() => history.push("/history")}>
          Go Back to History
        </Button>
      </div>
      <div>
        <h2>{location.state.date.toLocaleDateString()}</h2>
      </div>
      <br />

      {data.map((entry: any) => (
        <Card key={entry.docId} style={{ marginBottom: "10px" }}>
          <CardHeader
            title={entry.title}
            subheader={entry.lastUpdateTime.toDate().toLocaleString()}
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
          />
          <CardContent>
            <div>
              <div>{entry.description}</div>
              {entry.imageRefUrls.length ? (
                <Carousel navButtonsAlwaysVisible>
                  {entry.imageRefUrls.map((refUrl: any, i: number) => (
                    <div
                      style={{ textAlign: "center", height: "200px" }}
                      key={i}
                    >
                      <img
                        src={refUrl}
                        alt={`foodimage${i}`}
                        style={{ maxHeight: "200px", maxWidth: "200px" }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div>No Images</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
