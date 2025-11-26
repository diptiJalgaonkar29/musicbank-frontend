import WPPButton from "../branding/wpp/components/Button/WPPButton";
import { WppButton, WppIconDownload } from "@wppopen/components-library-react";
//import "@wppopen/components-library/dist/platform-ui-kit/wpp-theme.css";
import WPPChip from "../branding/wpp/components/Chip/WPPChip";
import WPPToggle from "../branding/wpp/components/Toggle/WPPToggle";
import WPPModal from "../branding/wpp/components/Modal/WPPModal";
import { useState } from "react";
import "./WPPComponents.css";
import WPPIconButton from "../branding/wpp/components/IconButton/WPPIconButton";
import { ReactComponent as SearchIcon } from "../static/search2.0.svg";
import WPPCheckbox from "../branding/wpp/components/Checkbox/WPPCheckbox";
import WPPRadio from "../branding/wpp/components/Radio/WPPRadio";
import { WPPSelect } from "../branding/wpp/components/Select/WPPSelect";
import { WPPInput } from "../branding/wpp/components/Input/WPPInput";
const WPPComponents = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="wpp-container">
      <h1>WPP Components Demo</h1>

      {/*  <div className="wpp-section">
        <h3>WPP Raw Button</h3>
        <WppButton>WPPButton</WppButton>
      </div> */}

      <div className="wpp-section WPPButton-theme">
        <h3>WPP Themed Button (shadow CSS)</h3>
        <WPPButton>WPPButton</WPPButton>
      </div>

      <div className="wpp-section WPPButton-Normal">
        <h3>WPP Updated CSS Button (no shadow css)</h3>
        <WPPButton>WPPButton</WPPButton>
      </div>

      <div className="wpp-section">
        <h3>WPP Chip</h3>
        <WPPChip>WPPChip</WPPChip>
      </div>

      <div className="wpp-section">
        <h3>WPP Toggle</h3>
        <WPPToggle label="Select all" onClick={() => {}} checked={false} />
      </div>

      <div className="wpp-section">
        <h3>WPP Modal</h3>
        <WPPButton onClick={() => setModalOpen(true)}>Open Modal</WPPButton>
      </div>
      <div className="wpp-section">
        <h3>WPP Icon Button</h3>
        {/* <WPPIconButton onClick={() => alert("Icon Button Clicked!")}>
          <SearchIcon />
        </WPPIconButton> */}
        <WPPIconButton onClick={() => alert("Icon Button Clicked!")}>
          <WppIconDownload />
        </WPPIconButton>
      </div>
      <div className="wpp-section">
        <h3>WPP CheckBox</h3>
        <WPPCheckbox type="checkbox" checked={false} />
      </div>
      <div className="wpp-section">
        <h3>WPP Radio</h3>
        <WPPRadio
          name="mediaPlanAvai"
          id="mediaPlanAvaiYes"
          type="radio"
          value="accept1"
        />
      </div>
      <div className="wpp-section">
        <h3>WPP Select</h3>
        <div className="wpp-select-wrapper">
          <WPPSelect
            id="audioType"
            name="audioType"
            label="Select Type"
            options={[
              { label: "Yes", value: "1" },
              { label: "No", value: "2" },
              { label: "Maybe", value: "3" },
            ]}
            placeholder="Select an option"
            onChange={(e) => console.log("Selected:", e.detail?.value)}
          />
        </div>
      </div>

      <div className="wpp-section">
        <h3>WPP Input</h3>
        <WPPInput
          id="contactName"
          name="contactName"
          type="text"
          placeholder="type text"
        />
      </div>
      {/* ✅ Render modal outside main layout so it overlays the entire screen */}
      <WPPModal
        isOpen={modalOpen}
        title="Test Modal"
        onClose={() => setModalOpen(false)}
      >
        <p>This is a test modal content area.</p>
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <WPPButton onClick={() => setModalOpen(false)}>Close</WPPButton>
        </div>
      </WPPModal>
    </div>
  );
};

export default WPPComponents;
