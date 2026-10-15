import AppLayout from "../../components/layout/AppLayout";
import { scrollToId } from "../../utils/scroll";
import { useEmiCalculator } from "./useEmiCalculator";
import Hero from "./sections/Hero";
import LoanProducts from "./sections/LoanProducts";
import EmiCalculator from "./sections/EmiCalculator";
import DocumentChecklist from "./sections/DocumentChecklist";
import ProcessSteps from "./sections/ProcessSteps";
import Faq from "./sections/Faq";
import ClosingCta from "./sections/ClosingCta";
import "./home.css";

function HomePage() {
  const calculator = useEmiCalculator();

  const checkEmi = (index) => {
    calculator.chooseType(index);
    scrollToId("emi");
  };

  return (
    <AppLayout className="home-page" withFooter>
      <Hero />
      <LoanProducts onCheckEmi={checkEmi} />
      <EmiCalculator calculator={calculator} />
      <DocumentChecklist applyState={calculator.applyState} />
      <ProcessSteps />
      <Faq />
      <ClosingCta applyState={calculator.applyState} />
    </AppLayout>
  );
}

export default HomePage;
