import type { LandingContent } from "@/data/landing";
import LocaleDocument from "@/components/locale/LocaleDocument";
import AdditionalServicesSection from "./AdditionalServicesSection";
import BespokeDesignSection from "./BespokeDesignSection";
import ExperienceSection from "./ExperienceSection";
import FAQSection from "./FAQSection";
import FinalCTA from "./FinalCTA";
import HeroSection from "./HeroSection";
import InvitationShowcase from "./InvitationShowcase";
import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";
import OccasionsSection from "./OccasionsSection";
import PrivacySection from "./PrivacySection";
import ProcessSection from "./ProcessSection";
import RsvpModesSection from "./RsvpModesSection";
import ServicesSection from "./ServicesSection";
import StatementSection from "./StatementSection";

type Props = {
  content: LandingContent;
};

export default function LandingPage({ content }: Props) {
  return (
    <>
      <LocaleDocument locale={content.locale} dir={content.dir} />
      <LandingHeader content={content} />
      <main className="landing-page overflow-x-hidden scroll-smooth">
        <HeroSection content={content} />
        <StatementSection content={content} />
        <InvitationShowcase content={content} />
        <RsvpModesSection content={content} />
        <ExperienceSection content={content} />
        <ServicesSection content={content} />
        <BespokeDesignSection content={content} />
        <ProcessSection content={content} />
        <OccasionsSection content={content} />
        <AdditionalServicesSection content={content} />
        <PrivacySection content={content} />
        <FAQSection content={content} />
        <FinalCTA content={content} />
      </main>
      <LandingFooter content={content} />
    </>
  );
}
