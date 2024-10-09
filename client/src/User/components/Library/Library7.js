import React, { useState, useEffect } from "react";
import "../../styles/library/library7.css";
import { IoBookmark, IoShareSocial } from "react-icons/io5";

const Library7 = () => {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedArticles")) || [];
    setSavedArticles(saved);
  }, []);

  const handleToggleSave = (article) => {
    const updatedArticles = savedArticles.filter(
      (a) => a.title !== article.title
    );

    if (updatedArticles.length === savedArticles.length) {
      // Add more properties when saving the article (date, reviewer)
      const articleToSave = {
        title: article.title,
        image: article.image || "/img/bg6.jpg",
        date: article.date || "11/30/2019",
        reviewer: article.reviewer || "Dra. Donna Jill A. Tungol",
      };

      updatedArticles.push(articleToSave);
    }

    // Update state and local storage
    setSavedArticles(updatedArticles);
    localStorage.setItem("savedArticles", JSON.stringify(updatedArticles));
  };

  const isArticleSaved = (articleTitle) => {
    return savedArticles.some((article) => article.title === articleTitle);
  };

  return (
    <div className="library-content-container">
      <div className="library-content-main-news">
        <div className="library-content-news-title-actions">
          <h1 className="library-content-news-title">
            Deciding on Your Labor and Delivery Method: An In-Depth Guide to
            Your Choices
          </h1>
          <div className="library-content-news-actions">
            <button
              className="library-content-save-btn"
              onClick={() =>
                handleToggleSave({
                  title:
                    "Deciding on Your Labor and Delivery Method: An In-Depth Guide to Your Choices",
                  image: "/img/bg6.jpg",
                  date: "11/30/2019",
                  reviewer: "Dra. Donna Jill A. Tungol",
                })
              }
            >
              <IoBookmark />
              {isArticleSaved(
                "Deciding on Your Labor and Delivery Method: An In-Depth Guide to Your Choices"
              )
                ? "Saved"
                : "Save to Library"}
            </button>
            <button className="library-content-share-btn">
              <IoShareSocial /> Share on media
            </button>
          </div>
        </div>
        <p className="library-content-news-details">
          Medically Reviewed by: Dra. Donna Jill A. Tungol{" "}
        </p>
        <p className="library-content-news-date">11/30/2019</p>
        <div className="library-content-news-description">
          <h2>Labor and Delivery Options</h2>
          <p>
            Choosing the right labor and delivery options is a crucial part of
            preparing for childbirth. Each woman’s experience can be unique, and
            understanding various options can help in making informed decisions
            to ensure a positive birthing experience. Below are common labor and
            delivery options along with explanations to provide a comprehensive
            overview:
          </p>

          <h3>1. Vaginal Delivery</h3>
          <p>
            <strong>Vaginal delivery</strong> is the most common method of
            childbirth, where the baby is born through the birth canal. This
            method allows for immediate skin-to-skin contact with the baby and
            promotes early breastfeeding. It is generally associated with a
            shorter recovery time compared to cesarean sections. However, the
            labor process can vary in duration and intensity, and some women may
            require pain relief or medical interventions during labor.
          </p>

          <h3>2. Cesarean Section (C-Section)</h3>
          <p>
            <strong>Cesarean section (C-section)</strong> is a surgical
            procedure used to deliver the baby through an incision in the
            abdomen and uterus. It is often performed when a vaginal delivery is
            not possible or poses risks to the mother or baby. C-sections may be
            planned ahead of time for specific medical reasons or may be
            performed as an emergency procedure. Recovery from a C-section
            generally involves a longer hospital stay and a more extended
            recovery period compared to vaginal delivery.
          </p>

          <h3>3. Natural Childbirth</h3>
          <p>
            <strong>Natural childbirth</strong> refers to delivering a baby
            without the use of pain relief medications or interventions. This
            approach emphasizes the body's natural ability to give birth and
            often involves techniques such as breathing exercises, relaxation,
            and labor support from a partner or doula. Natural childbirth can be
            achieved through both vaginal delivery and home births. It requires
            preparation and may involve managing pain through non-medical
            methods.
          </p>

          <h3>4. Epidural Anesthesia</h3>
          <p>
            <strong>Epidural anesthesia</strong> is a common form of pain relief
            during labor. An epidural involves the administration of local
            anesthetics through a catheter placed in the lower back, which numbs
            the lower half of the body while allowing the mother to remain awake
            and alert. This method provides effective pain relief and allows the
            mother to participate in the birth process. However, it may cause
            side effects such as lowered blood pressure or a longer labor
            duration.
          </p>

          <h3>5. Water Birth</h3>
          <p>
            <strong>Water birth</strong> involves laboring and/or delivering in
            a tub of warm water. The buoyancy of the water can help alleviate
            pain and discomfort, promote relaxation, and provide a soothing
            environment. Water birth can be done at home, in a birthing center,
            or in a hospital with specialized facilities. It is essential to
            ensure that the water temperature is carefully monitored and that
            the birth environment is hygienic.
          </p>

          <h3>6. Home Birth</h3>
          <p>
            <strong>Home birth</strong> is when a woman chooses to give birth in
            the comfort of her own home rather than a hospital or birthing
            center. It often involves the assistance of a midwife or a trained
            birth professional. Home births offer a personalized and intimate
            setting and can be suitable for low-risk pregnancies. It is crucial
            to have a clear plan for emergencies and ensure that appropriate
            medical support is available if needed.
          </p>

          <h3>7. Birthing Center</h3>
          <p>
            <strong>Birthing centers</strong> are facilities designed
            specifically for childbirth and offer a more home-like environment
            compared to hospitals. They provide midwifery care and support for
            natural childbirth, with the option for medical interventions if
            necessary. Birthing centers can be a good option for women seeking a
            balance between a hospital and home birth experience.
          </p>

          <h3>8. Induction of Labor</h3>
          <p>
            <strong>Induction of labor</strong> is a medical procedure used to
            stimulate contractions and start labor artificially. It may be
            recommended for various reasons, such as overdue pregnancy, health
            concerns for the mother or baby, or specific medical conditions.
            Induction methods can include medications, artificial rupture of
            membranes, or mechanical methods to promote labor.
          </p>

          <h3>9. Forceps and Vacuum Extraction</h3>
          <p>
            <strong>Forceps and vacuum extraction</strong> are assisted delivery
            methods used when the baby needs help to be delivered through the
            birth canal. Forceps are metal instruments placed around the baby's
            head to guide it out, while a vacuum extractor uses suction to help
            with the delivery. These methods may be used if there are concerns
            about the baby's or mother's health and can be performed during
            vaginal delivery.
          </p>

          <p>
            Choosing the right labor and delivery option involves considering
            personal preferences, medical advice, and the health and safety of
            both mother and baby. It is essential to discuss options with
            healthcare providers and create a birth plan that aligns with
            individual needs and circumstances.
          </p>
        </div>
      </div>

      {/* Related News Section */}
      <div className="library-content-related-news">
        <div className="library-content-related-header">
          <h2>Related News</h2>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg2.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">
              Labor and Delivery Options
            </div>
            <h3>
              Emergency Situations During Labor: What They Mean and How to
              Prepare
            </h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">
              Labor and Delivery Options
            </div>
            <h3>
              Pain Management in Labor: Epidural, Spinal Block, and Natural
              Alternatives
            </h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">
              Labor and Delivery Options
            </div>
            <h3>Home Birth vs. Hospital Birth: What You Need to Know</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library7;
