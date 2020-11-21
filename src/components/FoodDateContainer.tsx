import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { User } from "firebase";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useFirestore, useUser, firestore, useStorage } from "reactfire";
import Carousel from "react-material-ui-carousel";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
const addDay = function (date: Date) {
  date.setDate(date.getDate() + 1);
  return date;
};

export default function FoodDateContainer() {
  const location = useLocation<any>();

  const [data, setData] = useState<any[]>([]);
  const user: User = useUser();
  const history = useHistory();
  const foodCollection = useFirestore()
    .collection("users")
    .doc(user.uid)
    .collection("food-calendar");
  const foodCollectionToday = foodCollection
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
      let collection = await foodCollectionToday.get();

      let mappedData = await Promise.all(
        collection.docs.map(async (doc) => {
          let data = doc.data();
          let uploadedFoodImages = await doc.ref.collection("images").get();
          data.images = await Promise.all(
            uploadedFoodImages.docs.map(async (doc) => {
              let refUrl = doc.data().refUrl;
              let downloadUrl = await bucket.ref(refUrl).getDownloadURL();
              return { refUrl, downloadUrl };
            })
          );
          return data;
        })
      );
      setData(mappedData);
    }
    getit();
    // eslint-disable-next-line
  }, []);

  const [foodToDelete, setFoodToDelete] = useState(null);

  const deleteFood = useCallback(async () => {
    if (foodToDelete.images.length > 0) {
      let foodImages = await foodCollection
        .doc(foodToDelete.docId)
        .collection("images")
        .get();
      foodImages.docs.forEach(async (doc) => {
        console.log(doc.id);
        await doc.ref.delete();
      });
    }
    await foodCollection.doc(foodToDelete.docId).delete();

    setData((prevData: any) =>
      prevData.filter((prev: any) => prev.docId !== foodToDelete.docId)
    );
    setFoodToDelete(null);
  }, [foodToDelete, data]);
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
              {entry.images.length ? (
                <Carousel navButtonsAlwaysVisible>
                  {entry.images.map((image: any, i: number) => (
                    <div
                      style={{ textAlign: "center", height: "200px" }}
                      key={i}
                    >
                      <img
                        src={image.downloadUrl}
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
          <CardActions disableSpacing>
            {/* <IconButton aria-label="edit">
              <EditIcon />
            </IconButton> */}
            <IconButton
              aria-label="delete"
              onClick={() => setFoodToDelete(entry)}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
      {foodToDelete && (
        <DeleteFoodDialog
          handleClose={() => setFoodToDelete(null)}
          handleSubmit={deleteFood}
        />
      )}
    </Container>
  );
}

function DeleteFoodDialog({
  handleClose,
  handleSubmit,
}: {
  handleClose: any;
  handleSubmit: any;
}) {
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Food Meal</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this meal?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          No
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
