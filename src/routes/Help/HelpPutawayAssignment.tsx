import WelcomeScreen from "../../Components/Help/WelcomeScreen";
import TourPutawayAssignment from "../../Components/Help/PutawayAssignment/TourPutawayAssignment";
import { HelpScreens, Screen } from "../../types/helpTypes";
import useHelp from "../../hooks/useHelp";

const HelpPutawayAssignment = () => {
  const { showScreen, handleChangeScreen } = useHelp();

  return (
    <>
      {showScreen === Screen.WELCOME ? (
        <WelcomeScreen
          handleChangeScreen={handleChangeScreen}
          screenType={HelpScreens.PutawayAssignment}
          pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        />
      ) : (
        <TourPutawayAssignment />
      )}
    </>
  );
};

export default HelpPutawayAssignment;
