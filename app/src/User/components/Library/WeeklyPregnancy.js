import React, { useState } from 'react';
import '../../styles/library/weeklypregnancy.css';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoArrowBackSharp} from 'react-icons/io5';

function PregnancyWeekByWeek() {
  const [trimester, setTrimester] = useState(null);
  const [trimesterLabel, setTrimesterLabel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTrimesterChange = (selectedTrimester, label) => {
    setTrimester(selectedTrimester);
    setTrimesterLabel(label);
    setSearchTerm(''); // Clear search term when changing trimesters
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderWeeks = () => {
    const weeks = [];
  
    if (searchTerm) {
      // Render all weeks when searching
      for (let i = 1; i <= 42; i++) {
        const weekStr = String(i).padStart(2, '0');
        const weekLower = weekStr.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
  
        if (weekLower.includes(searchTermLower)) {
          const imageSrc = `/img/WEEKS/week ${i}.png`;
  
          weeks.push(
            <div key={`week-${i}`} className="week" onClick={() => handleClickWeek(i)}>
              <div className="week-content">
                <div onClick={() => handleClickWeek(i)}>
                  <img src={imageSrc} alt={`Week ${i}`} />
                </div>
                <div className="week-label">Week {i}</div>
                <div className="week-info">
                  {getWeekInfo(i)}
                </div>
              </div>
            </div>
          );
        }
      }
    } else {
      // Render weeks within current trimester when not searching
      const startWeek = trimester === 'first' ? 1 : trimester === 'second' ? 14 : 28;
      const endWeek = trimester === 'first' ? 13 : trimester === 'second' ? 27 : 42;
  
      for (let i = startWeek; i <= endWeek; i++) {
        const weekStr = String(i).padStart(2, '0');
        const imageSrc = `/img/WEEKS/week ${i}.png`;
  
        weeks.push(
          <div key={`week-${i}`} className="week" onClick={() => handleClickWeek(i)}>
            <div className="week-content">
              <div onClick={() => handleClickWeek(i)}>
                <img src={imageSrc} alt={`Week ${i}`} />
              </div>
              <div className="week-label">Week {i}</div>
              <div className="week-info">
                {getWeekInfo(i)}
              </div>
            </div>
          </div>
        );
      }
    }
  
    return weeks.length > 0 ? weeks : <div>No results found</div>;
  };



  const handleClickWeek = (weekNumber) => {
    // Handle click action for each week
    console.log(`Clicked week ${weekNumber}`);
  };

  const getWeekInfo = (weekNumber) => {
    const weekInfo = {
      1: "Primarily focused on conception and early pregnancy preparations...",
      2: "Primarily focused on the early stages of pregnancy development...",
      3: "Marks the early stages of pregnancy, with most physical symptoms...",
      4: "Marks the early stages of embryonic development...",
      5: "Marks a crucial stage in fetal development...",
      6: "A critical time in fetal development...",
      7: "The embryo is about the size of a blueberry...",
      8: "The embryo has developed distinct facial features...",
      9: "The embryo is now about the size of a grape...",
      10: "The embryo is about the size of a strawberry...",
      11: "At this stage, the embryo is about the size of a lime...",
      12: "The embryo is about the size of a plum...",
      13: "At this stage, the embryo is about the size of a peach...",
      14: "The fetus is now the size of a lemon, and its organs are beginning to function...",
      15: "The fetus is now about the size of an apple, and its movements may be felt by the mother...",
      16: "The fetus is now about the size of an avocado, and its bones are hardening...",
      17: "The fetus is now about the size of a turnip, and its fingerprints are forming...",
      18: "The fetus is now about the size of a sweet potato, and its ears are developing...",
      19: "The fetus is now about the size of a mango, and its senses are becoming more refined...",
      20: "The fetus is now about the size of a banana, and its hair is starting to grow...",
      21: "The fetus is now about the size of a carrot, and its eyelids are beginning to open...",
      22: "The fetus is now about the size of a papaya, and it may start to recognize sounds...",
      23: "The fetus is now about the size of a grapefruit, and its movements are more coordinated...",
      24: "The fetus is now about the size of a cantaloupe, and its lungs are developing...",
      25: "The fetus is now about the size of a cauliflower, and it may respond to light...",
      26: "The fetus is now about the size of an eggplant, and its eyes are fully formed...",
      27: "The fetus is now about the size of a head of lettuce, and its brain is developing rapidly...",
      28: "The fetus is now about the size of a coconut, and its lungs are maturing...",
      29: "The fetus is now about the size of a butternut squash, and it may hiccup...",
      30: "The fetus is now about the size of a cabbage, and its skin is becoming smoother...",
      31: "The fetus is now about the size of a pineapple, and it may have a regular sleep pattern...",
      32: "The fetus is now about the size of a jicama, and it may respond to touch...",
      33: "The fetus is now about the size of a durian, and its bones are hardening...",
      34: "The fetus is now about the size of a cantaloupe, and it may have its eyes open...",
      35: "The fetus is now about the size of a honeydew melon, and its movements may be stronger...",
      36: "The fetus is now about the size of a romaine lettuce, and it may gain weight rapidly...",
      37: "The fetus is now about the size of a Swiss chard, and its lungs are almost fully developed...",
      38: "The fetus is now about the size of a leek, and it may engage in practice breathing...",
      39: "The fetus is now about the size of a watermelon, and it may start to descend into the pelvis...",
      40: "The fetus is now considered full-term, and labor may begin at any time...",
      41: "The fetus is now past its due date, and labor induction may be considered...",
      42: "The fetus is now overdue, and labor induction may be necessary...",
    };
    return weekInfo[weekNumber] || "definition";
  };

  return (
    <div className="pregnancy-week-by-week">
      <Link to="/library" className="back-button-library4"><IoArrowBackSharp /></Link>
      <div className="trimester-buttons">
        <button className={trimester === 'first' ? 'active' : ''} onClick={() => handleTrimesterChange('first', 'First Trimester Weeks')}>1st Trimester</button>
        <button className={trimester === 'second' ? 'active' : ''} onClick={() => handleTrimesterChange('second', 'Second Trimester Weeks')}>2nd Trimester</button>
        <button className={trimester === 'third' ? 'active' : ''} onClick={() => handleTrimesterChange('third', 'Third Trimester Weeks')}>3rd Trimester</button>
     <div className="search-input-container">
  <input
    type="text"
    className="search-input"
    placeholder="Search Week"
    value={searchTerm}
    onChange={handleSearchChange}
  />
  <FaSearch className="search-icon1" />
</div>
      </div>
      <hr className="trimester-line" />
      <div className="trimester-label">{trimesterLabel}</div>
      <div className="weeks-container">{renderWeeks()}</div>
    </div>
  );
}

export default PregnancyWeekByWeek;
