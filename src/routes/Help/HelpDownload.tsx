import WelcomeScreen from "../../Components/Help/WelcomeScreen";
import TourDownload from "../../Components/Help/DownloadList/TourDownload";
import { HelpScreens, Screen } from "../../types/helpTypes";
import useHelp from "../../hooks/useHelp";

const HelpDownload = () => {
  const { showScreen, handleChangeScreen } = useHelp();

  return (
    <>
      {showScreen === Screen.WELCOME ? (
        <WelcomeScreen
          handleChangeScreen={handleChangeScreen}
          screenType={HelpScreens.BulkDownload}
          pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        />
      ) : (
        <TourDownload />
      )}
    </>
  );
};

export default HelpDownload;
