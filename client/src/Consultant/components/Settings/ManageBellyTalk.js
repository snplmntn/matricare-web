import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/settings/managebellytalk.css";
import { jsPDF } from "jspdf";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

const ManageBellyTalk = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const OPENAI_URL = process.env.REACT_APP_OPENAI_URL;
  const token = getCookie("token");

  // State for the fetched data
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handleCardClick = (category) => {
    setSelectedCategory(category);
    setOpen(true); // Open the modal when a card is clicked
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
    setSelectedCategory(null); // Reset selected category
  };

  const renderDetails = () => {
    if (!selectedCategory) return null;

    const categoryData = data.find((item) => item.name === selectedCategory);

    if (!categoryData) return null;

    return (
      <>
        <Typography>Engagement: {categoryData.Engagement}</Typography>
        <Typography>Posts: {categoryData.Posts}</Typography>
        <Typography>Discussions: {categoryData.Discussions}</Typography>
      </>
    );
  };

  const handleDownload = async () => {
    const categoryData = data.find((item) => item.name === selectedCategory);
    if (!categoryData) return;

    let summary = "";
    if (categoryData.PostContent.length !== 0) {
      // Start the `toSummarize` structure
      const toSummarize = {
        category: selectedCategory, // Selected category (e.g., Health & Wellness)
        posts: categoryData.PostContent.map((content, index) => {
          return {
            content, // Post content
            comments: categoryData.PostComments[index], // Associated comments
          };
        }),
      };

      const response = await axios.post(
        `${OPENAI_URL}/summarize`,
        toSummarize,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      summary = response.data.summary;
    }

    const doc = new jsPDF();

    const logoUrl = "img/logo3.png";
    const logoImage = new Image();
    logoImage.src = logoUrl;

    logoImage.onload = () => {
      const logoWidth = 10;
      const logoHeight = (logoWidth * logoImage.height) / logoImage.width;

      const logoX = 10;
      const logoY = 17;
      doc.addImage(logoImage, "PNG", logoX, logoY, logoWidth, logoHeight);

      doc.setFont("Times ", "bold");
      doc.setFontSize(14);
      const matriCareText = "MatriCare";
      const matriCareX = logoX + logoWidth + 2;
      const matriCareY = logoY + logoHeight / 5 + 4;
      doc.text(matriCareText, matriCareX, matriCareY);

      doc.setFont("Times ", "normal");
      doc.setFontSize(12);
      doc.setTextColor(128, 128, 128);
      const categoryText = `Category: ${selectedCategory}`;
      const categoryX = matriCareX + doc.getTextWidth(matriCareText) + 10;
      const categoryY = matriCareY;
      doc.text(categoryText, categoryX, categoryY);

      doc.setTextColor(0, 0, 0);

      const lineY = categoryY + 5;
      const lineStartX = categoryX;
      const lineEndX = 200;
      doc.setDrawColor(0);
      doc.line(lineStartX, lineY, lineEndX, lineY);

      // Header
      doc.setFontSize(20);
      doc.setFont("Times ", "bold");
      const headerX = categoryX;
      doc.text(selectedCategory, headerX, 40);

      // Date
      doc.setFontSize(12);
      doc.setFont("Times ", "normal");
      const dateText = `Date: ${new Date().toLocaleDateString()}`;
      const dateY = 50;
      doc.text(dateText, headerX, dateY);

      // Date Line
      const dateLineY = dateY + 10;
      doc.line(headerX, dateLineY, 200, dateLineY);

      // Engagement Overview
      doc.setFontSize(12);
      doc.setFont("Times ", "bold");
      const overviewTitle = "Engagement Overview";
      const overviewY = dateLineY + 10;
      doc.text(overviewTitle, headerX, overviewY);

      doc.setFont("Times ", "normal");

      const baseY = overviewY + 15;
      const countY = baseY;
      const labelY = baseY + 10;

      const engagementData = [
        { count: categoryData.Posts, label: "Total Posts" },
        { count: categoryData.Engagement, label: "Total Engagement" },
        { count: categoryData.Discussions, label: "Total Discussions" },
      ];

      const pageWidth = doc.internal.pageSize.getWidth();
      const countLabelWidth = pageWidth - 1.5 * headerX;
      const countXOffset = countLabelWidth / engagementData.length;

      engagementData.forEach((item, index) => {
        const currentX = headerX + index * countXOffset;

        doc.setTextColor(154, 108, 180);
        doc.setFontSize(18);
        doc.setFont("Times ", "bold");

        // Get the count text
        const countText = item.count.toString();
        const countWidth = doc.getTextWidth(countText);
        const centeredCountX = currentX + (countXOffset - countWidth) / 2;

        // Draw count
        doc.text(countText, centeredCountX, countY);

        // Reset color for label
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12); // Set back to the default size for labels
        doc.setFont("Times ", "normal");

        const labelText = item.label;
        const labelWidth = doc.getTextWidth(labelText);
        const centeredLabelX = currentX + (countXOffset - labelWidth) / 2;

        // Draw label
        doc.text(labelText, centeredLabelX, labelY);
      });

      const engagementLineY = labelY + 10;
      console.log(`Line Y Position: ${engagementLineY}`);
      doc.setDrawColor(0);
      doc.line(headerX, engagementLineY, 200, engagementLineY);

      // Position for the summary
      const summaryYStart = engagementLineY + 10;
      const summaryX = headerX;
      doc.setFont("Times ", "bold");
      doc.text("Summary:", summaryX, summaryYStart);

      doc.setFont("Times ", "normal");
      doc.setTextColor(51, 51, 51);

      doc.setFont("Times ", "normal");
      const summaryContentY = summaryYStart + 7;
      const summaryLines = doc.splitTextToSize(`\n${summary}`, countLabelWidth);
      doc.text(summaryLines, summaryX, summaryContentY);

      // Add footer with a horizontal line above the page number
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        const footerY = 290; // Y position for the footer
        doc.line(10, footerY - 5, 200, footerY - 5); // Draw line above the page number
        doc.text(
          `Page ${i} of ${pageCount}`,
          190,
          footerY,
          null,
          null,
          "right"
        );
      }

      // Save the PDF
      doc.save(`${selectedCategory}_data.pdf`);
    };
  };

  async function fetchPosts() {
    try {
      const response = await axios.get(`${API_URL}/analytics`, {
        headers: {
          Authorization: token,
        },
      });

      const formattedData = {};

      // Define the categories you want to initialize
      const categoriesList = [
        "Health & Wellness",
        "Finance & Budgeting",
        "Parenting & Family",
        "Baby’s Essentials",
        "Exercise & Fitness",
        "Labor & Delivery",
      ];

      // Initialize all categories to zero counts
      categoriesList.forEach((category) => {
        formattedData[category] = {
          name: category,
          Engagement: 0,
          Posts: 0,
          Discussions: 0,
          PostContent: [],
          PostComments: [],
        };
      });

      // Check if posts data exists
      if (response.data && response.data.category) {
        // Process each post in the response
        response.data.category.forEach((list) => {
          const categories = Array.isArray(list.category)
            ? list.category
            : [list.category];

          categories.forEach((category) => {
            // If the category exists in formattedData, update its values
            if (formattedData[category]) {
              // Increment counts for the category

              formattedData[category].Engagement +=
                list.posts.length + list.comments.length;

              formattedData[category].Posts += list.posts
                ? list.posts.length
                : 0;
              formattedData[category].Discussions += list.comments
                ? list.comments.length
                : 0;

              // Append the content of the post to the array
              if (list.posts && Array.isArray(list.posts)) {
                // Append the content of each post to the array
                formattedData[category].PostContent.push(
                  list.posts.map((posts) => posts.content)
                );
              } else {
                formattedData[category].PostContent.push([]);
              }

              // Append the comments if any, otherwise push an empty array
              if (list.comments && Array.isArray(list.comments)) {
                formattedData[category].PostComments.push(
                  list.comments.map((comment) => comment.content)
                );
              } else {
                formattedData[category].PostComments.push([]);
              }
            }
          });
        });
      }
      setData(Object.values(formattedData)); // Set the accumulated data for Recharts
      console.log(Object.values(formattedData));
    } catch (error) {
      console.error("Error fetching posts data: ", error);
    }
  }

  useEffect(() => {
    fetchPosts(); // Fetch data on component mount
  }, []);

  return (
    <Box className="manage-bellytalk-container">
      <Box className="manage-bellytalk-main-container">
        <h2>BellyTalk Dashboard</h2>

        <div className="manage-bellytalk-category-cards">
          <div
            className="manage-bellytalk-category-card health"
            onClick={() => handleCardClick("Health & Wellness")}
          >
            Health & Wellness
          </div>
          <div
            className="manage-bellytalk-category-card finance"
            onClick={() => handleCardClick("Finance & Budgeting")}
          >
            Finance & Budgeting
          </div>
          <div
            className="manage-bellytalk-category-card parenting"
            onClick={() => handleCardClick("Parenting & Family")}
          >
            Parenting & Family
          </div>
          <div
            className="manage-bellytalk-category-card essentials"
            onClick={() => handleCardClick("Baby’s Essentials")}
          >
            Baby's Essentials
          </div>
          <div
            className="manage-bellytalk-category-card exercise"
            onClick={() => handleCardClick("Exercise & Fitness")}
          >
            Exercise & Fitness
          </div>
          <div
            className="manage-bellytalk-category-card labor"
            onClick={() => handleCardClick("Labor & Delivery")}
          >
            Labor & Delivery
          </div>
        </div>

        {/* Recharts Bar Graph */}
        <Box className="manage-bellytalk-chart">
          <Typography variant="h5">Category Engagement Overview</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Posts" fill="#9DC3E2" />
              <Bar dataKey="Engagement" fill="#e39fa9" />
              <Bar dataKey="Discussions" fill="#9a6cb4af" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogActions></DialogActions>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography className="dialog-title-text">
              {selectedCategory}
            </Typography>
            <IconButton onClick={handleClose} className="dialog-close-button">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>{renderDetails()}</DialogContent>
        <Button
          onClick={handleDownload}
          className="dialog-download-button"
          startIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </Dialog>
    </Box>
  );
};

export default ManageBellyTalk;
