import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./SonicAccordion.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';

const SonicAccordion = ({ title, children }) => {
  return (
    <div className="SonicAccordion_container">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'var(--color-white)', fontSize: "24px" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="SonicAccordion_title"
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};
export default SonicAccordion;
