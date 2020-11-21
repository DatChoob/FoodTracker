import React, { useState } from "react";

import {
  Button,
  Container,
  LinearProgress,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import { User } from "firebase";
import { useUser, useFirestore, useStorage } from "reactfire";

import FastfoodIcon from "@material-ui/icons/Fastfood";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { SnackbarProvider, useSnackbar } from "notistack";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
});

export default function HomeContainer() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>
          {value === 0
            ? "What did you eat today?"
            : "What did you drink today?"}
        </h1>
      </div>
      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Paper square className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="icon label tabs example"
          >
            <Tab icon={<FastfoodIcon />} label="FOOD" />
            <Tab icon={<LocalDrinkIcon />} label="WATER" />
          </Tabs>
          <SnackbarProvider maxSnack={3}>
            {value === 0 && <FoodContainer />}
            {value === 1 && <WaterContainer />}
          </SnackbarProvider>
        </Paper>
      </Container>
    </>
  );
}

function FoodContainer() {
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const user: User = useUser();
  const fieldValue = useFirestore.FieldValue;
  const userFoodRef = useFirestore().collection("users");
  const { enqueueSnackbar } = useSnackbar();

  const foodImageStorage = useStorage();
  const handleUserUploadedImages = (event: any) => {
    console.log(event.target.files);
    setFiles(Array.from(event.target.files));
  };
  const handleSubmitFood = () => {
    setIsSaving(true);
    const newDoc = userFoodRef.doc(user.uid).collection("food-calendar").doc();
    newDoc
      .set(
        {
          docId: newDoc.id,
          title,
          date,
          description,
          creationTime: fieldValue.serverTimestamp(),
          lastUpdateTime: fieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .then(async () => {
        let resolvedFileUploads = await Promise.all(
          files.map((file: File) => {
            return foodImageStorage
              .ref(`images/${user.uid}/${newDoc.id}/${file.name}`)
              .put(file, { contentType: file.type })
              .then((finishedUpload) => {
                return { refUrl: finishedUpload.ref.fullPath };
              });
          })
        );

        // console.log(resolvedFileUploads);
        // newDoc.set({ imageUrls: resolvedFileUploads }, { merge: true });
        resolvedFileUploads.forEach((uploadedFile) => {
          //create document in images collection
          newDoc.collection("images").add({ refUrl: uploadedFile.refUrl });
        });
      })
      .finally(() => {
        setIsSaving(false);
        setFiles([]);
        setDate(new Date());
        setTitle("");
        setDescription("");
        enqueueSnackbar("We've digested your food order! 😁", {
          variant: "success",
        });
      });
  };

  const deleteFile = (deleteIndex: number) => {
    setFiles((files) => files.filter((file, index) => deleteIndex !== index));
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", padding: "10px 20px" }}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <TextField
          label="What did you eat?"
          required
          focused
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <KeyboardDateTimePicker
          variant="inline"
          format="MM/dd/yyyy hh:mm a"
          label="When Did you eat?"
          onChange={(d: any) => setDate(d)}
          disableFuture
          value={date}
        />
        <TextField
          label="Any other info?"
          multiline
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </MuiPickersUtilsProvider>
      {files.length === 0 && (
        <div
          style={{
            height: "200px",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            style={{ width: "100%", height: "100%", marginTop: "10px" }}
            component="label"
          >
            Click To Upload Pictures
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleUserUploadedImages}
            />
          </Button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {files &&
          files.map((file, index) => (
            <div key={index} style={{ display: "flex", padding: "10px 0px" }}>
              <Button variant="contained" onClick={() => deleteFile(index)}>
                Delete
              </Button>
              <img
                alt="uploaded-file"
                style={{ width: "200px", height: "200px" }}
                src={URL.createObjectURL(file)}
              />
            </div>
          ))}
      </div>
      <Button
        variant="contained"
        onClick={handleSubmitFood}
        style={{ marginTop: "10px" }}
        disabled={isSaving}
      >
        Submit your eating
      </Button>

      {isSaving && <LinearProgress />}
    </div>
  );
}
function WaterContainer() {
  return <div>Coming Soon...</div>;
}
