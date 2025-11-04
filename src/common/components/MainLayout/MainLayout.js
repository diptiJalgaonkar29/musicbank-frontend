import React, { useContext } from "react";
import "./MainLayout.css";
import NavBar from "../Navbar/NavBar";
import Footer from "../Footer/Footer";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import ReportBugModal from "../ReportBugModal/ReportBugModal";

const MainLayout = ({ children, isUnregistered }) => {
  const { config } = useContext(BrandingContext);
  return (
    <>
      <div className="main_layout_wrapper">
        <nav className="main_layout_navigation">
          <NavBar isUnregistered={isUnregistered} />
        </nav>
        <div className="main_layout_container">
          <main
            className={`main_layout_content ${
              config?.modules?.showPageFooter ? "show_footer" : "hide_footer"
            } ${
              config?.modules?.showDisclaimerText
                ? "show_disclaimer_text"
                : "hide_disclaimer_text"
            }`}
          >
            {children}
          </main>
          {config?.modules?.showPageFooter && (
            <footer className="main_layout_FooterSection">
              <Footer config={config} />
            </footer>
          )}
        </div>
      </div>
      <ReportBugModal />
    </>
  );
};
export default MainLayout;
