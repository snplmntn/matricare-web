import React, { useState } from 'react';
import '../../style/library/firsttriAssistant.css';
import { FaPen, FaSave } from "react-icons/fa";

const FirstTriAssistant = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({
    title: "Second Trimester",
    intro: "Embrace the beginnings: Navigating the nuanced path of pregnancy's early stages, one trimester at a time.",
    section1: `
      The first trimester of pregnancy is a crucial period that spans from week 1 to week 12 of your pregnancy. It begins on the first day of your last menstrual period and lasts until the end of week 12.
      During these initial weeks, your body undergoes significant changes as it prepares to support the developing embryo. The first trimester is characterized by rapid fetal development, including the formation of major organs and body systems. By the end of the first trimester, the fetus will have grown from a single cell to a recognizable human form, with visible limbs, facial features, and internal organs.
      Along with fetal development, the first trimester is also a time of profound changes for the mother. Hormonal fluctuations can lead to various symptoms, such as morning sickness, fatigue, and mood swings. Additionally, the first trimester is when many women experience the initial signs of pregnancy, including missed periods and positive pregnancy tests.
      It's essential to take good care of yourself during the first trimester to support a healthy pregnancy. This includes maintaining a balanced diet, staying hydrated, getting plenty of rest, and attending regular prenatal checkups with your healthcare provider. By prioritizing your health and well-being during this critical period, you can help ensure the best possible outcomes for both you and your baby.
    `,
    symptomsTitle: "Symptoms of First Trimester",
    symptomsIntro: "During the first trimester, your body undergoes significant changes as it adjusts to the growing fetus. Some common symptoms experienced during this period include:",
    symptoms: `
      <ul>
        <li>Morning Sickness: Nausea and vomiting, often occurring in the morning but can happen at any time of the day.</li>
        <li>Fatigue: Feeling extremely tired, which is a common symptom due to hormonal changes and increased metabolic demands.</li>
        <li>Increased Urination: The uterus pressing on the bladder leads to frequent urination.</li>
        <li>Tender Breasts: Hormonal changes cause breast tenderness and swelling.</li>
        <li>Food Aversions and Cravings: Changes in hormone levels can alter your sense of taste and smell, leading to food aversions.</li>
        <li>Mood Swings: Fluctuating hormone levels can impact mood and emotional well-being.</li>
        <li>Constipation: Slower digestion and increased progesterone levels can lead to constipation.</li>
      </ul>
    `,
    exerciseTagline: "Sculpting Motherhood: Exercise Your Way to a Balanced Pregnancy.",
    exerciseIntro: `
      Regular exercise during pregnancy can help improve mood, reduce discomfort, and prepare your body for childbirth. However, it's essential to consult with your healthcare provider before starting any exercise routine. Some safe and beneficial exercises during the first trimester include:
    `,
    exerciseList: `
      <ul>
        <li>Walking: A low-impact exercise that helps improve circulation, strengthen the heart, and maintain a healthy weight.</li>
        <li>Swimming: Provides a full-body workout while being gentle on the joints and supporting the weight of the belly.</li>
        <li>Prenatal Yoga: Helps improve flexibility, strength, and relaxation through gentle stretching and breathing exercises.</li>
        <li>Low-Impact Aerobics: Cardiovascular exercises or using an elliptical machine can boost energy and improve endurance.</li>
      </ul>
    `,
    exerciseNote: `
      It's essential to listen to your body and avoid activities that cause discomfort or strain. Remember to stay hydrated, wear comfortable clothing, and avoid overheating during exercise.
    `,
    checklistTitle: "First Trimester Checklist",
    checklist: `
      <ul className="firsttriAssistant-checklist">
        <li>Schedule your first prenatal appointment with your healthcare provider.</li>
        <li>Start taking prenatal vitamins containing folic acid.</li>
        <li>Eat a healthy and balanced diet rich in fruits, vegetables, whole grains, and lean proteins.</li>
        <li>Avoid alcohol, smoking, and recreational drugs.</li>
        <li>Stay hydrated by drinking plenty of water throughout the day.</li>
        <li>Get plenty of rest and prioritize sleep.</li>
        <li>Avoid strenuous physical activities and contact sports.</li>
        <li>Practice stress-reducing techniques such as deep breathing, meditation, or prenatal yoga.</li>
      </ul>
    `,
    relatedArticlesTitle: "Related Articles",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
        // Save the edited content
        setEditedContent({ ...editedContent });
      };
    
      const handleChange = (key, value) => {
        setEditedContent(prevState => ({
          ...prevState,
          [key]: value
        }));
      };
    
      return (
        <div>
          <div className="firsttriAssistant-header">
          <h1 className="firsttriAssistant-title">{editedContent.title}</h1>
            <button className="firsttriAssistant-edit-button" onClick={isEditing ? handleSave : handleEdit}>
              {isEditing ? <FaSave /> : <FaPen />}
              {isEditing ? '' : ''}
            </button>
          </div>
          <div className="firsttriAssistant-image-container">
            <img src="img/bg2.jpg" alt="First Trimester" className="firsttriAssistant-firsttri-image" />
          </div>
          <div className="firsttriAssistant-first-trimester-container">
            <div className="firsttriAssistant-section">
            <h2>{editedContent.intro}</h2>
              <hr />
              <p>{isEditing ?
                <textarea
                  value={editedContent.section1}
                  onChange={(e) => handleChange('section1', e.target.value)}
                  rows={10}
                  cols={80}
                  className="custom-textarea"
                /> : editedContent.section1}</p>
            </div>
    
            <div className="firsttriAssistant-section">
              <div className="firsttriAssistant-tagline-container">
                <div className="firsttriAssistant-tagline-content">
                <h2>{editedContent.exerciseTagline}</h2>
                </div>
              </div>
              <p>{isEditing ?
                <textarea
                  value={editedContent.exerciseIntro}
                  onChange={(e) => handleChange('exerciseIntro', e.target.value)}
                  rows={4}
                  cols={50}
                  className="custom-textarea"
                /> : editedContent.exerciseIntro}</p>
              {isEditing ? 
    <textarea
        value={editedContent.exerciseList}
        onChange={(e) => handleChange('exerciseList', e.target.value)}
        rows={7}
        cols={50}
        className="custom-textarea"
    /> :
    <div dangerouslySetInnerHTML={{ __html: editedContent.exerciseList }}></div>
}
              <p>{isEditing ?
                <textarea
                  value={editedContent.exerciseNote}
                  onChange={(e) => handleChange('exerciseNote', e.target.value)}
                  rows={4}
                  cols={50}
                  className="custom-textarea"
                /> : editedContent.exerciseNote}</p>
            </div>
    
            <div className="firsttriAssistant-section">
              <img src="img/bg2.jpg" alt="Description of the image" />
            </div>
    
            <div className="firsttriAssistant-section">
            <h2>{editedContent.symptomsTitle}</h2>
  <p>{isEditing ?
    <textarea
      value={editedContent.symptomsIntro}
      onChange={(e) => handleChange('symptomsIntro', e.target.value)}
      rows={4}
      cols={50}
      className="custom-textarea"
    /> : editedContent.symptomsIntro}</p>
  {isEditing ? 
    <textarea
      value={editedContent.symptoms}
      onChange={(e) => handleChange('symptoms', e.target.value)}
      rows={7}
      cols={50}
      className="custom-textarea"
    /> :
    <div dangerouslySetInnerHTML={{ __html: editedContent.symptoms }} />
  }
</div>

    
            <div className="firsttriAssistant-section">
            <h2>{editedContent.relatedArticlesTitle}</h2>
              <div className="firsttriAssistant-article-boxes">
                <div className="firsttriAssistant-article-box">
                  <img src="img/bg2.jpg" alt="Article Image" />
                  <h3>Article Title</h3>
                  <p>Article summary or excerpt goes here...</p>
                  <a href="#">Read more</a>
                </div>
                <div className="firsttriAssistant-article-box">
                  <img src="img/bg2.jpg" alt="Article Image" />
                  <h3>Article Title</h3>
                  <p>Article summary or excerpt goes here...</p>
                  <a href="#">Read more</a>
                </div>
                <div className="firsttriAssistant-article-box">
                  <img src="img/bg2.jpg" alt="Article Image" />
                  <h3>Article Title</h3>
                  <p>Article summary or excerpt goes here...</p>
                  <a href="#">Read more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default FirstTriAssistant;
    
