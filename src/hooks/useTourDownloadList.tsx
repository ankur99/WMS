import { useRef, useState } from "react";
import { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from "react-joyride";

import { useNavigate } from "react-router-dom";
import styles from "../Components/Help/help.module.css";

const useTourBulkDownload = () => {
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
      content: "This is the table where you will get the data to download all the items right now",
      placement: "auto",
      target: ".bulk-download-table table",
      hideCloseButton: true
    },
    {
      content: "Each row shows one ID and a button to Download",
      placement: "bottom",
      target: `.bulk-download-table-row1`,
      hideCloseButton: true
    },
    {
      content: "as you can see the button, try clicking here to download the file",
      placement: "bottom",
      target: ".bulk-download-button",
      hideCloseButton: true,
      hideFooter: true
    },
    {
      title: "Congrats!!",
      content: (
        <>
          <div style={{ padding: "20px 10px" }}>
            You have completed the tour and assigned your first task you can try the tour again if
            you didnt get it or do it by yourself without the help of tour once
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.button}
              onClick={() => {
                navigate("/home/help/download?tour=true");
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
        </>
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

export default useTourBulkDownload;
