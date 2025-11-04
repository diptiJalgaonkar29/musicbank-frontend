import "./TrackInfoAccordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

const TrackInfoAccordion = ({
  trackId,
  registrationTitle,
  artist_name,
  publisherGEMANumber,
  trackGEMANumber,
  album_Name,
  catlog_name,
  label,
  publisher,
  writer,
  publisherData,
  writerData
}) => {
  console.log("TrackInfoAccordion props:", {
    trackId,
    registrationTitle,
    artist_name,
    publisherGEMANumber,
    trackGEMANumber,
    album_Name,
    catlog_name,
    label,
    publisher,
    writer,
    publisherData,
    writerData,
  });
  console.log("TrackInfoAccordion publisherData--", publisherData);

  /* const registrationData = [
    [
      { title: "Publisher:", value: publisher || "-" },
      { title: "Role", value: publisherData?.[0].roles?.code || "-" },
      { title: "PRO", value: publisherData?.[0].roles?.name || "-" },
      { title: "IPI", value: publisherData?.[0].ipi || "-" },
      { title: "Ownership Share", value: publisherData?.[0].ownershipShare || "-" },
      { title: "Collection Share", value: publisherData?.[0].collectionShare || "-" },
    ],
    [
      { title: "Writers:", value: writer || "-" },
      { title: "Role", value: writerData?.[0].role?.code || "-" },
      { title: "PRO", value: writerData?.[0].role?.name || "-" },
      { title: "IPI", value: writerData?.[0].ipi || "-" },
      { title: "Share", value: writerData?.[0].ownershipShare || "-" },
    ],
  ];  */

  const registrationData = [
  ...(Array.isArray(publisherData) && publisherData.length > 0
    ? publisherData.map((pub, idx) => [
        { title: "Publisher:", value: pub.name || "-" },
        { title: "Role", value: pub.roles?.code || "-" },
        { title: "PRO", value: pub.roles?.name || "-" },
        { title: "IPI", value: pub.ipi || "-" },
        { title: "Ownership Share", value: pub.ownershipShare || "-" },
        { title: "Collection Share", value: pub.collectionShare || "-" },
      ])
    : [
        [
          { title: "Publisher:", value: publisher || "-" },
          { title: "Role", value: "-" },
          { title: "PRO", value: "-" },
          { title: "IPI", value: "-" },
          { title: "Ownership Share", value: "-" },
          { title: "Collection Share", value: "-" },
        ],
      ]
  ),
  ...(Array.isArray(writerData) && writerData.length > 0
    ? writerData.map((writerObj, idx) => [
        { title: "Writers:", value: writerObj.name || "-" },
        { title: "Role", value: writerObj.role?.code || "-" },
        { title: "PRO", value: writerObj.role?.name || "-" },
        { title: "IPI", value: writerObj.ipi || "-" },
        { title: "Share", value: writerObj.ownershipShare || "-" },
      ])
    : [
        [
          { title: "Writers:", value: writer || "-" },
          { title: "Role", value: "-" },
          { title: "PRO", value: "-" },
          { title: "IPI", value: "-" },
          { title: "Share", value: "-" },
        ],
      ]
  ),
];

  return (
    <div className="TrackInfoAccordion">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Track Legal Info
        </AccordionSummary>
        <AccordionDetails>
          <p className="trackDetailSectionTitle">Registration Details:</p>
          <div className="TrackInfoAccordion_registration_Details_container">
            {/* <div className="TrackInfoAccordion_container"> */}
            <div className="TrackInfoAccordion_registration_Details_left_container">
              <p className="trackDetailHighlightedTitle">Title:</p>
              <p className="trackDetailValue">{registrationTitle || "-"}</p>
              <p className="trackDetailHighlightedTitle">Album:</p>
              <p className="trackDetailValue">{album_Name}</p>
              <p className="trackDetailHighlightedTitle">Label:</p>
              <p className="trackDetailValue">{label}</p>
            </div>
            <div className="TrackInfoAccordion_registration_Details_right_container">
              <p className="trackDetailHighlightedTitle">Artist:</p>
              <p className="trackDetailValue">{artist_name || "-"}</p>
              <p className="trackDetailHighlightedTitle">Catalog:</p>
              <p className="trackDetailValue">{catlog_name}</p>
              <p className="trackDetailHighlightedTitle">Track ID:</p>
              <p className="trackDetailValue">{trackId}</p>
            </div>
          </div>
          <TrackInfoFooter registrationData={registrationData} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TrackInfoAccordion;

// TrackInfoCell.jsx
const TrackInfoCell = ({ title, value, rowindex, idx }) => (
  <div className="TrackInfoAccordion_registration_Details_footer_cell" data-rowindex={rowindex} data-idx={idx}>
    <p className="trackDetailHighlightedTitle">{title}</p>
    <p className="trackDetailValue">{value}</p>
  </div>
);

const TrackInfoRow = ({ row, rowindex }) => (
  <div className="TrackInfoAccordion_registration_Details_footer_row" data-rowindex={rowindex}>
    {row.map((item, idx) => (
      <TrackInfoCell key={idx} title={item.title} value={item.value} rowindex={rowindex} idx={idx} />
    ))}
  </div>
);

const TrackInfoFooter = ({ registrationData }) => (
  <div className="TrackInfoAccordion_registration_Details_footer_container">
    {registrationData.map((row, index) => (
      <TrackInfoRow key={index} row={row} rowindex={index} />
    ))}
  </div>
);
