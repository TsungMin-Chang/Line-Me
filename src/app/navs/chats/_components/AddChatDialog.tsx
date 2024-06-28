"use client";

import { useState } from "react";

import AuthInput from "../../../_components/AuthInput";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import useChatroom from "@/hooks/useChatroom";

type AddChatDialogProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
};

export default function AddChatDialog({
  open,
  onClose,
  userId,
}: AddChatDialogProps) {
  const { postChatroom } = useChatroom();

  const steps = ["", ""];
  const [activeStep, setActiveStep] = useState(0);
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState("");

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (!type) {
      alert("What type of chat are you creating?");
      return;
    }
    if (type === "group") {
      alert("Sorry, I'm too lazy! Please choose 'Indiviual Chat'!");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("Missing user ID!");
      return;
    }
    if (!email) {
      alert("Please insert the email of your chat buddy!");
      return;
    }
    if (!provider) {
      alert("Please insert the provider of your chat buddy!");
      return;
    }

    try {
      const data = {
        userId,
        type: type === "individual",
        email,
        provider,
      };
      await postChatroom(data);
    } catch (error) {
      console.log(error);
      alert("Error: Fail to create a new chatroom!");
    } finally {
      handleClose();
    }
  };
  const handleClose = () => {
    setActiveStep(0);
    setType("");
    setEmail("");
    setProvider("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 22 }}>
        New Chat
      </DialogTitle>

      <DialogContent className="flex w-[300px] flex-col gap-y-2">
        {activeStep === 0 && (
          <FormControl className="mt-2 flex-1">
            <InputLabel id="list-type">Type</InputLabel>
            <Select
              labelId="list-type"
              label="list-type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <MenuItem value={"individual"}>Individual Chat</MenuItem>
              <MenuItem value={"group"}>Group Chat</MenuItem>
            </Select>
          </FormControl>
        )}
        {activeStep === steps.length - 1 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AuthInput
              label="Email"
              type="email"
              value={email}
              setValue={setEmail}
            />

            <FormControl className="mt-2 flex-1">
              <InputLabel id="list-type">Provider</InputLabel>
              <Select
                labelId="list-type"
                label="list-type"
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value);
                }}
              >
                <MenuItem value={"google"}>Google</MenuItem>
                <MenuItem value={"github"}>GitHub</MenuItem>
                <MenuItem value={"credentials"}>Credential</MenuItem>
              </Select>
            </FormControl>

            <div className="mt-2 flex flex-col gap-y-0.5">
              <button
                type="submit"
                className="my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70"
              >
                Submit
              </button>
              <button
                onClick={handleBack}
                className="my-2 rounded-full bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-brand/70"
              >
                Back
              </button>
              <button
                onClick={handleClose}
                className="my-2 rounded-full bg-zinc-400 px-4 py-2 text-white transition-colors hover:bg-brand/70"
              >
                Close
              </button>
            </div>
          </form>
        )}
      </DialogContent>

      {activeStep < steps.length - 1 && (
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <div className="grow" />

          <Button onClick={handleNext}>Next</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
