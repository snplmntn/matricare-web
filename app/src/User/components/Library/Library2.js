import React from 'react';
import '../../styles/library/library2.css'
import { IoBookmark, IoShareSocial } from 'react-icons/io5'; 

const Library2 = () => {
  return (
    <div className="library-content-container">
    <div className="library-content-main-news">
      <div className="library-content-news-title-actions">
        <h1 className="library-content-news-title">Embracing Maternity Style: Fashion Tips for Every Stage of Pregnancy</h1>
        <div className="library-content-news-actions">  
          <button className="library-content-save-btn"><IoBookmark /> Save to Library </button>
          <button className="library-content-share-btn"><IoShareSocial /> Share on media</button>
        </div>
      </div>
      <p className="library-content-news-details">Medically Reviewed by: Dra. Donna Jill A. Tungol </p>
      <p className="library-content-news-date">11/30/2019 08:33 PM EST</p>
      <div className="library-content-news-description">
      <h2> Comfort</h2>
            <p>Comfort is the primary consideration in maternity fashion. As a woman’s body changes, particularly in the belly, bust, and hips, maternity clothes are designed with features like stretchy fabrics, adjustable waistbands, and looser fits. These features allow clothes to grow with the body throughout the different stages of pregnancy.</p>
            <ul>
              <li><strong>Stretchy Fabrics: </strong> Materials like jersey, cotton, and spandex are commonly used because they can stretch to fit the growing belly while still providing support.</li>
              <li><strong>Adjustable Waistbands:</strong> Many maternity pants and skirts have elastic or drawstring waistbands, ensuring comfort as the body expands.</li>
              <li><strong>Belly Bands:</strong> Some clothing includes built-in belly bands for extra support or to cover the belly when regular clothing becomes too tight.</li>
            </ul>

             <h3>Functionality</h3>
            <p>Maternity clothes are designed to be functional, making them suitable for various activities while pregnant, such as working, exercising, or attending special events. Maternity fashion covers a wide range of styles and functions:</p>
            <ul>
              <li><strong>Office Wear:</strong> Maternity office wear includes tailored dresses, blazers with extra room for the belly, and comfortable yet professional-looking pants.</li>
              <li><strong>Casual Wear:</strong> Focuses on stretchy leggings, maternity jeans, flowy tops, and soft fabrics for daily comfort.</li>
              <li><strong>Activewear:</strong> Designed with extra support for the belly, maternity activewear allows women to stay fit during pregnancy while maintaining comfort and flexibility.</li>
            </ul>

            <h3>Adaptability</h3>
            <p>Some maternity clothing is adaptable, meaning it can be worn both during and after pregnancy. Many maternity styles now include nursing-friendly features, allowing women to transition smoothly into postpartum without needing to overhaul their wardrobe.</p>
            <ul>
              <li><strong>Wrap Dresses and Tops:</strong> These styles not only accommodate a growing belly but also offer easy access for breastfeeding after delivery.</li>
              <li><strong>Layering:</strong> Maternity pieces that are easy to layer, like cardigans or shawls, provide versatility and allow for changes in body temperature during pregnancy.</li>
            </ul>

            <h3>Fashion Trends</h3>
            <p>Maternity style doesn’t sacrifice fashion. Many brands now offer trendy, stylish maternity wear that allows pregnant women to feel fashionable and confident.</p>
            <ul>
              <li><strong>Celebrity Influence:</strong> Celebrities have helped redefine maternity style by embracing bold fashion choices during pregnancy, from form-fitting dresses to glamorous red carpet looks.</li>
              <li><strong>Sustainable Choices:</strong> Many pregnant women choose eco-friendly, ethically made maternity wear, designed to last beyond pregnancy or to be reused.</li>
            </ul>

            <h3>Seasonal Styles</h3>
            <p>Maternity style is also influenced by seasons. Just like non-maternity fashion, it adapts to the weather and the needs of pregnant women throughout the year.</p>
            <ul>
              <li><strong>Summer Maternity Wear:</strong> Lightweight dresses, flowy tunics, and breathable fabrics are popular in the warmer months to keep pregnant women cool.</li>
              <li><strong>Winter Maternity Wear:</strong> In colder months, layering is key. Maternity coats with adjustable belts, cozy sweaters, and warm leggings help provide comfort and warmth.</li>
            </ul>

            <h3> Inclusivity and Body Positivity</h3>
            <p>Modern maternity fashion emphasizes inclusivity, offering a wide range of sizes and styles to suit different body types. The focus is on body positivity, encouraging women to embrace their changing bodies rather than hide them.</p>

            <h3>Key Wardrobe Staples</h3>
            <p>There are a few essential pieces that are considered staples in a maternity wardrobe, designed to provide versatility and ease during pregnancy:</p>
            <ul>
              <li><strong>Maternity Jeans:</strong> Designed with stretchy panels to support the belly while providing the look and fit of regular jeans.</li>
              <li><strong>Maxi Dresses:</strong> Flowing dresses that can be dressed up or down and accommodate a growing belly.</li>
              <li><strong>Leggings:</strong> A comfortable, stretchy option for casual wear that pairs well with tunics or dresses.</li>
              <li><strong>Maternity Bras:</strong> Bras designed to offer additional support, often with nursing capabilities for postpartum use.</li>
            </ul>

            <h3>Post-Pregnancy Use</h3>
            <p>Many maternity pieces are designed to transition into postpartum wear, offering practical solutions for the post-pregnancy body, which may still need extra support and comfort as it heals and recovers.</p>
            <ul>
              <li><strong>Nursing-Friendly Designs:</strong> Maternity tops with buttons, zippers, or wrap designs make it easier for new mothers to breastfeed.</li>
              <li><strong>Shape-Wear:</strong> Postpartum shape-wear is often included in the maternity wardrobe to provide comfort and support after giving birth.</li>
            </ul>
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
            <div className="library-content-news-tag">Maternity Style</div>
            <h3>Celebrity-Inspired Maternity Fashion Trends</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Maternity Style</div>
            <h3>Comfort Meets Style: How to Dress During Pregnancy</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Maternity Style</div>
            <h3>Essential Maternity Wardrobe Staples for Every Season</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Library2;
