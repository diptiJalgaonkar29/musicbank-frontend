import './ReactPagination.css';
import React, { useState } from 'react';

import TrackCard from '../../components/Trackcard/Trackcard';
import { LazyLoadComponent } from '../../../common/components/LazyLoadComponent/LazyLoadComponent';

const renderData = (data, config) => {
  return (
    <>
      {data.map((track) => (
        <div
          key={track.objectID}
          style={{ marginTop: '1.5rem', position: 'relative' }}
        >
          <LazyLoadComponent ref={React.createRef()} defaultHeight={300}>
            <div className="lload">
              <TrackCard
                id={track.created_at_timestamp}
                key={track.created_at_timestamp}
                indexProp={track.objectID}
                cyanite_id={track.cyanite_id}
                track_length={track.duration_in_sec}
                allTags={track.tag_all}
                track_name={track.track_name}
                preview_image_url={track.preview_image_url}
                preview_track_url={track.preview_track_url}
                tempo={track.tempo}
                tag_tempo={track.tag_tempo}
                cyaniteProfile={config.modules.CyaniteProfile}
                UpdateUItoV2={config.modules.UpdateUItoV2}
              />
            </div>
          </LazyLoadComponent>
        </div>
      ))}
    </>
  );
};

const ReactPagination = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [pageNumberLimit, setPageNumberLimit] = useState(8);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(8);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const pages = [];
  for (
    let i = 1;
    i <= Math.ceil(props.allTracksData.length / itemsPerPage);
    i++
  ) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = props.allTracksData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <div className="pageNumbers">
          <li
            key={number}
            id={number}
            onClick={handleClick}
            className={currentPage === number ? 'active' : null}
          >
            {number}
          </li>
        </div>
      );
    }
    return null;
  });

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  return (
    <div>
      {renderData(currentItems, props.config)}
      <ul className="pageNumbers">
        <li>
          <button
            onClick={handlePrevbtn}
            disabled={currentPage === pages[0] ? true : false}
          >
            {' '}
            Prev{' '}
          </button>
        </li>

        {renderPageNumbers}

        <li>
          <button
            onClick={handleNextbtn}
            disabled={currentPage === pages[pages.length - 1] ? true : false}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};
export default ReactPagination;
