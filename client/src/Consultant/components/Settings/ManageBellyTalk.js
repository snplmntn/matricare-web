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
        <Typography>Posts: {categoryData.Posts}</Typography>
        <Typography>Engagement: {categoryData.Engagement}</Typography>
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

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set the title and add content
    doc.setFontSize(22);
    doc.text(`Data for ${selectedCategory}`, 20, 20);

    doc.setFontSize(12);
    // Use splitTextToSize to wrap the summary text
    const summaryLines = doc.splitTextToSize(`\n\nSummary: \n${summary}`, 180); // 180 is the max width in mm
    doc.text(summaryLines, 20, 80); // Adjust vertical position as needed

    // Save the PDF
    doc.save(`${selectedCategory}_data.pdf`);
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
          Posts: 0,
          Engagement: 0,
          Discussions: 0,
          PostContent: [],
          PostComments: [],
        };
      });

      // Check if posts data exists
      if (response.data && response.data.post) {
        // Process each post in the response
        response.data.post.forEach((post) => {
          const categories = Array.isArray(post.category)
            ? post.category
            : [post.category];

          categories.forEach((category) => {
            // If the category exists in formattedData, update its values
            if (formattedData[category]) {
              // Increment counts for the category
              formattedData[category].Posts += 1;
              formattedData[category].Engagement += post.likes
                ? post.likes.length
                : 0;
              formattedData[category].Discussions += post.comments
                ? post.comments.length
                : 0;

              // Append the content of the post to the array
              formattedData[category].PostContent.push(post.content);

              // Append the comments if any, otherwise push an empty array
              if (post.comments && Array.isArray(post.comments)) {
                formattedData[category].PostComments.push(
                  post.comments.map((comment) => comment.content)
                );
              } else {
                formattedData[category].PostComments.push([]);
              }
            }
          });
        });
      }

      // Convert the object back to an array for Recharts
      console.log("Formatted Data:", Object.values(formattedData));
      setData(Object.values(formattedData)); // Set the accumulated data for Recharts
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
