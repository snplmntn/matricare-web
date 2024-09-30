import React from 'react';
import '../../style/library/librarydropdownAssistant.css';

export default function LibraryDropdown() {
  return (
    <div className="dropdown-menu library-menu">
      <div className="library-row">
        <div className="box">
          <div className="title">Title 1</div>
          <button className="button">Button 1</button>
        </div>
        <div className="box">
          <div className="title">Title 2</div>
          <button className="button">Button 2</button>
        </div>
        <div className="box">
          <div className="title">Title 3</div>
          <button className="button">Button 3</button>
        </div>
      </div>
      <div className="library-row">
        <div className="box">
          <div className="title">Title 4</div>
          <button className="button">Button 4</button>
        </div>
        <div className="box">
          <div className="title">Title 5</div>
          <button className="button">Button 5</button>
        </div>
        <div className="box">
          <div className="title">Title 6</div>
          <button className="button">Button 6</button>
        </div>
      </div>
    </div>
  );
}
