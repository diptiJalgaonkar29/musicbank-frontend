import "./SonicLogoAssetAnalysisAccordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { useState, useMemo } from "react";
import { ReactComponent as SortingAsc } from "../../../bucketlist/common/sortAsc.svg";
import { ReactComponent as SortingDesc } from "../../../bucketlist/common/sortDesc.svg";

const SonicLogoAssetAnalysisAccordion = () => {
  return (
    <div className="SonicLogoAssetAnalysisAccordion">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Asset Analysis
        </AccordionSummary>
        <AccordionDetails>
          <Table />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SonicLogoAssetAnalysisAccordion;

const sampleData = [
  {
    id: 1,
    asset: "ACME Sonic Logo",
    badge: "Sonic Logo",
    uniqueness: 43,
    memorability: 54,
    authenticity: 21,
  },
  {
    id: 2,
    asset: "Benchmark",
    uniqueness: 35,
    memorability: 43,
    authenticity: 63,
  },
];

function Table() {
  const [data, setData] = useState(sampleData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <TableHeader sortConfig={sortConfig} onSort={handleSort} />
        <tbody>
          {sortedData.map((row) => (
            <TableRow key={row.id} data={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ sortConfig, onSort }) {
  const columns = [
    { key: "asset", label: "Asset" },
    { key: "uniqueness", label: "Uniqueness" },
    { key: "memorability", label: "Memorability" },
    { key: "authenticity", label: "Authenticity" },
  ];

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <TableHeaderCell
            key={column.key}
            column={column}
            sortConfig={sortConfig}
            onSort={onSort}
          />
        ))}
      </tr>
    </thead>
  );
}

function TableHeaderCell({ column, sortConfig, onSort }) {
  const isActive = sortConfig.key === column.key;
  const direction = isActive ? sortConfig.direction : null;

  return (
    <th
      className={`table-header ${
        column.key === "asset" ? "text-left" : "text-center"
      }`}
      onClick={() => onSort(column.key)}
    >
      <div className="header-content">
        <span>{column.label}</span>
        <div className="arrow_container sort_icon">
          <SortingAsc
            width="24"
            height="20"
            className={`${
              isActive && direction === "asc" ? "activeSort" : "disableSort"
            }`}
          />
          <SortingDesc
            width="24"
            height="20"
            className={`${
              isActive && direction === "desc" ? "activeSort" : "disableSort"
            }`}
            style={{
              marginLeft: "-8px",
            }}
          />
        </div>
      </div>
    </th>
  );
}

function TableRow({ data }) {
  return (
    <tr className="table-row">
      <TableCell className="text-left">
        <div className="asset-cell">
          <span className="asset-name">{data.asset}</span>
          {data.badge && <Badge text={data.badge} />}
        </div>
      </TableCell>
      <TableCell className="text-center">{data.uniqueness}</TableCell>
      <TableCell className="text-center">{data.memorability}</TableCell>
      <TableCell className="text-center">{data.authenticity}</TableCell>
    </tr>
  );
}

function TableCell({ children, className = "" }) {
  return <td className={`table-cell ${className}`}>{children}</td>;
}

function Badge({ text }) {
  return <span className="badge">{text}</span>;
}
