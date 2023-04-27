import React, { useRef, useState } from "react";
import { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from "react-joyride";

import { useNavigate } from "react-router-dom";
import styles from "../Components/Help/help.module.css";

const useTourPutawayAssignment = () => {
  const navigate = useNavigate();
  //React joyride state
  const [run, setRun] = useState<boolean | undefined>(true);

  const [stepIndex, setStepIndex] = useState(0);

  const refRun = useRef<number | string>(0);
  const lastRef = useRef<HTMLDivElement>(null);

  const [steps] = useState<Step[]>([
    {
      title: "Welcome to the tour",
      content: "Start the tour by clicking the button below",
      placement: "center",
      target: "body",
      hideCloseButton: true
    },
    {
      content:
        "This is the table where you will get the data to assign all the putaway items right now",
      placement: "auto",
      target: ".putaway-assignment-table table",
      hideCloseButton: true
    },
    {
      content: "Each row shows one PID and its quantity in the putaway",
      placement: "bottom",
      target: `.putaway-assignment-table-row1`,
      hideCloseButton: true
    },
    {
      content:
        "as you can see this task is not assigned to anyone try clicking here and select the executive you want to assign this task to",
      placement: "bottom",
      target: ".putaway-assignment-table-row1-not-assigned",
      hideCloseButton: true,
      hideFooter: true
    },
    {
      content:
        "as you can see this task is now assigned and the task section is updated click on assign and assign your first task",
      placement: "bottom",
      target: ".putaway-assignment-table-row1-task-assigned",
      hideCloseButton: true,
      hideFooter: true
    },
    {
      title: "Congrats!!",
      content: (
        <React.Fragment>
          <div style={{ padding: "20px 10px" }}>
            You have completed the tour and assigned your first task you can try the tour again if
            you didnt get it or do it by yourself without the help of tour once
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.button}
              onClick={() => {
                navigate("/home/help/putaway-assignment?tour=true");
                location.reload();
              }}>
              Retry Tour
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setRun(false);
                const element = lastRef.current;
                if (element) {
                  element.className = "";
                }
                refRun.current = "stop";
              }}>
              Do it once without tour
            </button>
          </div>
        </React.Fragment>
      ),
      placement: "center",
      target: ".mock-last-step",
      hideCloseButton: true,
      // hideBackButton: true
      hideFooter: true
    }
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    // console.log({ data, type, action, index, status });

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
    }
  };

  const handleStepIndexChange = (index: number) => {
    setStepIndex(index);
  };

  const handleRun = (value: boolean) => {
    setRun(value);
  };

  return {
    lastRef,
    run,
    steps,
    stepIndex,
    refRun,
    handleJoyrideCallback,
    handleStepIndexChange,
    handleRun
  };
};

export default useTourPutawayAssignment;
