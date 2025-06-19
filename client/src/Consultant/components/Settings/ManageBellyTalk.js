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
import ReportIcon from "@mui/icons-material/Description";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CloseIcon from "@mui/icons-material/Close";
import { jsPDF } from "jspdf";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkHtml from "remark-html";
import { remark } from "remark";

const ManageBellyTalk = () => {
  const [user, setUser] = useState({});
  const userID = getCookie("userID");
  const API_URL = process.env.REACT_APP_API_URL;
  const OPENAI_URL = process.env.REACT_APP_OPENAI_URL;
  const token = getCookie("token");

  // State for the fetched data
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const [reportData, setReportData] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);

  const handleCloseModal = () => setShowLibrary(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageToUpload(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageToUpload(null);
  };

  const handleCardClick = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setReportData("");
    setReportTitle("");
  };

  const handleViewReports = async () => {
    if (!selectedCategory) return null;
    const categoryData = data.find((item) => item.name === selectedCategory);
    if (!categoryData) return null;
    if (categoryData.Engagement < 2)
      return alert("Engagement requirements not reached for this action.");

    setShowReport(!showReport);

    if (!reportData) {
      setIsFetchingReport(true);
      const summaryResponse = await axios.get(
        `${API_URL}/analytics/article?category=${encodeURIComponent(
          selectedCategory
        )}`,
        { headers: { Authorization: token } }
      );

      if (summaryResponse.data) {
        if (
          summaryResponse.data.article &&
          summaryResponse.data.article.engagement === categoryData.Engagement
        ) {
          setReportData(
            `${summaryResponse.data.article.title}\n${summaryResponse.data.article.content}`
          );
          setReportTitle(
            summaryResponse.data.article.title.replace(/^#+\s*/, "")
          );
          setIsFetchingReport(false);
        } else {
          const toSummarize = {
            category: selectedCategory,
            posts: categoryData.PostContent.map((content, index) => ({
              content,
              comments: categoryData.PostComments[index],
            })),
          };

          const response = await axios.post(
            `${OPENAI_URL}/article`,
            toSummarize,
            { headers: { Authorization: token } }
          );

          let summary = response.data.summary;
          const title = summary.split("\n")[0];
          summary = summary.split("\n").slice(1).join("\n");

          const generatedArticleToSave = {
            engagement: categoryData.Engagement,
            title: title,
            fullTitle: title,
            content: summary,
            category: selectedCategory,
          };

          if (summaryResponse.data.article) {
            await axios.put(
              `${API_URL}/analytics/article?category=${encodeURIComponent(
                selectedCategory
              )}`,
              generatedArticleToSave,
              { headers: { Authorization: token } }
            );
          } else {
            await axios.post(
              `${API_URL}/analytics/article`,
              generatedArticleToSave,
              { headers: { Authorization: token } }
            );
          }
          setReportData(response.data.summary);
          setReportTitle(title);
          setIsFetchingReport(false);
        }
      }
    }
  };

  async function uploadBookCover() {
    if (imageToUpload) {
      const formData = new FormData();
      formData.append("picture", imageToUpload);

      try {
        const response = await axios.post(
          `${API_URL}/upload/a?userId=${userID}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.pictureLink;
      } catch (err) {
        console.error(err);
      }
    }
  }

  const handleShowAddToLibrary = async () => {
    if (!selectedCategory) return null;
    const categoryData = data.find((item) => item.name === selectedCategory);
    if (!categoryData) return null;
    if (categoryData.Engagement < 2)
      return alert("Engagement requirements not reached for this action.");

    setShowLibrary(!showLibrary);

    if (!reportData) {
      setIsFetchingReport(true);
      const summaryResponse = await axios.get(
        `${API_URL}/analytics/article?category=${encodeURIComponent(
          selectedCategory
        )}`,
        { headers: { Authorization: token } }
      );

      if (summaryResponse.data) {
        if (
          summaryResponse.data.article &&
          summaryResponse.data.article.engagement === categoryData.Engagement
        ) {
          setReportData(
            `${summaryResponse.data.article.title}\n${summaryResponse.data.article.content}`
          );
          setReportTitle(
            summaryResponse.data.article.title.replace(/^#+\s*/, "")
          );
          setIsFetchingReport(false);
        } else {
          const toSummarize = {
            category: selectedCategory,
            posts: categoryData.PostContent.map((content, index) => ({
              content,
              comments: categoryData.PostComments[index],
            })),
          };

          const response = await axios.post(
            `${OPENAI_URL}/article`,
            toSummarize,
            { headers: { Authorization: token } }
          );

          let summary = response.data.summary;
          const title = summary.split("\n")[0];
          summary = summary.split("\n").slice(1).join("\n");

          const generatedArticleToSave = {
            engagement: categoryData.Engagement,
            title: title,
            fullTitle: title,
            content: summary,
            category: selectedCategory,
          };

          if (summaryResponse.data.article) {
            await axios.put(
              `${API_URL}/analytics/article?category=${encodeURIComponent(
                selectedCategory
              )}`,
              generatedArticleToSave,
              { headers: { Authorization: token } }
            );
          } else {
            await axios.post(
              `${API_URL}/analytics/article`,
              generatedArticleToSave,
              { headers: { Authorization: token } }
            );
          }
          setReportData(response.data.summary);
          setReportTitle(title.replace(/^#+\s*/, ""));
          setIsFetchingReport(false);
        }
      }
    }
  };

  const convertMarkdownToHTML = async (markdown) => {
    const html = await remark().use(remarkHtml).process(markdown);
    return html.toString();
  };

  const handleAddToLibrary = async () => {
    const confirmAdd = window.confirm(
      "Are you sure you want to add this report to the library?"
    );
    if (!confirmAdd) return;

    if (reportData.trim() === "") return alert("No available report");
    if (!imageToUpload) return alert("Please select a cover image");
    const bookCover = await uploadBookCover();

    const convertedReportContent = await convertMarkdownToHTML(reportData);
    const reportContent = convertedReportContent
      .split("\n")
      .slice(1)
      .join("\n");

    const newBook = {
      userId: userID,
      reviewedBy: user.name,
      author: "System Generated",
      title: reportTitle,
      fullTitle: reportTitle,
      content: JSON.stringify(reportContent),
      category: selectedCategory,
      status: "Approved",
      picture: bookCover,
    };

    try {
      await axios.post(`${API_URL}/article`, newBook, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json ",
        },
      });
    } catch (err) {
      console.error(err);
    }

    setSelectedImage(null);
    setImageToUpload(null);
    alert("Book added to library successfully");
    setShowLibrary(!showLibrary);
    handleClose();
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

    if (categoryData.Engagement < 2)
      return alert("Engagement requirements not reached for this action.");

    let summary = "";
    if (categoryData.PostContent.length !== 0) {
      const summaryResponse = await axios.get(
        `${API_URL}/analytics/article?category=${encodeURIComponent(
          selectedCategory
        )}`,
        { headers: { Authorization: token } }
      );

      if (summaryResponse.data) {
        if (
          summaryResponse.data.article &&
          summaryResponse.data.article.engagement === categoryData.Engagement
        ) {
          summary = `${summaryResponse.data.article.title}\n${summaryResponse.data.article.content}`;
        } else {
          const toSummarize = {
            category: selectedCategory,
            posts: categoryData.PostContent.map((content, index) => ({
              content,
              comments: categoryData.PostComments[index],
            })),
          };

          const response = await axios.post(
            `${OPENAI_URL}/article`,
            toSummarize,
            { headers: { Authorization: token } }
          );

          summary = response.data.summary;
          const title = summary.split("\n")[0];
          summary = summary.split("\n").slice(1).join("\n");

          const generatedArticleToSave = {
            engagement: categoryData.Engagement,
            title: title,
            fullTitle: title,
            content: summary,
            category: selectedCategory,
          };

          if (summaryResponse.data.article) {
            await axios.put(
              `${API_URL}/analytics/article?category=${encodeURIComponent(
                selectedCategory
              )}`,
              generatedArticleToSave,
              { headers: { Authorization: token } }
            );
          } else {
            await axios.post(
              `${API_URL}/analytics/article`,
              generatedArticleToSave,
              { headers: { Authorization: token } }
            );
          }
          summary = response.data.summary;
        }
      }
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

      doc.setFont("Times", "bold");
      doc.setFontSize(14);
      const matriCareText = "MatriCare";
      const matriCareX = logoX + logoWidth + 2;
      const matriCareY = logoY + logoHeight / 5 + 4;
      doc.text(matriCareText, matriCareX, matriCareY);

      doc.setFont("Times", "normal");
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

      doc.setFontSize(20);
      doc.setFont("Times", "bold");
      const headerX = categoryX;
      doc.text(selectedCategory, headerX, 40);

      doc.setFontSize(12);
      doc.setFont("Times", "normal");
      const dateText = `Date: ${new Date().toLocaleDateString()}`;
      const dateY = 50;
      doc.text(dateText, headerX, dateY);

      const dateLineY = dateY + 10;
      doc.line(headerX, dateLineY, 200, dateLineY);

      doc.setFontSize(12);
      doc.setFont("Times", "bold");
      const overviewTitle = "Engagement Overview";
      const overviewY = dateLineY + 10;
      doc.text(overviewTitle, headerX, overviewY);

      doc.setFont("Times", "normal");

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
        doc.setFont("Times", "bold");

        const countText = item.count.toString();
        const countWidth = doc.getTextWidth(countText);
        const centeredCountX = currentX + (countXOffset - countWidth) / 2;

        doc.text(countText, centeredCountX, countY);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("Times", "normal");

        const labelText = item.label;
        const labelWidth = doc.getTextWidth(labelText);
        const centeredLabelX = currentX + (countXOffset - labelWidth) / 2;

        doc.text(labelText, centeredLabelX, labelY);
      });

      const engagementLineY = labelY + 10;
      doc.setDrawColor(0);
      doc.line(headerX, engagementLineY, 200, engagementLineY);

      const summaryYStart = engagementLineY + 10;
      const summaryX = headerX;
      doc.setFont("Times", "bold");
      doc.text("Summary:", summaryX, summaryYStart);

      doc.setFont("Times", "normal");
      doc.setTextColor(51, 51, 51);

      const summaryContentY = summaryYStart + 7;
      const summaryLines = doc.splitTextToSize(`\n${summary}`, countLabelWidth);

      let currentY = summaryContentY;
      summaryLines.forEach((line, index) => {
        if (currentY > 280) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(line, summaryX, currentY);
        currentY += 7;
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        const footerY = 290;
        doc.line(10, footerY - 5, 200, footerY - 5);
        doc.text(
          `Page ${i} of ${pageCount}`,
          190,
          footerY,
          null,
          null,
          "right"
        );
      }

      doc.save(`${selectedCategory}_data.pdf`);
    };
  };

  async function fetchPosts() {
    try {
      const response = await axios.get(`${API_URL}/analytics`, {
        headers: { Authorization: token },
      });

      const formattedData = {};
      const categoriesList = [
        "Health & Wellness",
        "Finance & Budgeting",
        "Parenting & Family",
        "Baby’s Essentials",
        "Exercise & Fitness",
        "Labor & Delivery",
      ];

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

      if (response.data && response.data.category) {
        response.data.category.forEach((list) => {
          const categories = Array.isArray(list.category)
            ? list.category
            : [list.category];

          categories.forEach((category) => {
            if (formattedData[category]) {
              formattedData[category].Engagement +=
                list.posts.length + list.comments.length;
              formattedData[category].Posts += list.posts
                ? list.posts.length
                : 0;
              formattedData[category].Discussions += list.comments
                ? list.comments.length
                : 0;
              if (list.posts && Array.isArray(list.posts)) {
                formattedData[category].PostContent.push(
                  list.posts.map((posts) => posts.content)
                );
              } else {
                formattedData[category].PostContent.push([]);
              }
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
      setData(Object.values(formattedData));
    } catch (error) {
      console.error("Error fetching posts data: ", error);
    }
  }
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
    fetchPosts();
  }, []);

  return (
    <div
      className="flex h-screen w-[89%] ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]
      max-[1100px]:flex-col max-[1100px]:ml-0 max-[1100px]:w-full max-[1100px]:h-auto "
    >
      <main
        className="flex-grow p-5 bg-white/90 rounded-l-[50px]
        max-[1100px]:rounded-none max-[1100px]:w-full max-[1100px]:pt-16"
      >
        <h2 className="text-[28px] font-bold mb-[50px] text-center text-[#333] mt-5 max-[600px]:text-[20px] max-[600px]:mb-6">
          BellyTalk Dashboard
        </h2>

        <div className="grid grid-cols-3 gap-5 mb-10 max-[900px]:grid-cols-2">
          <div
            className="p-8 rounded-[15px] text-[#333] flex justify-center items-center text-center text-[20px] max-[900px]:text-[16px] max-[600px]:text-[12px] font-bold shadow-md transition-transform duration-300 cursor-pointer bg-[#9DC3E2] hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleCardClick("Health & Wellness")}
          >
            Health & Wellness
          </div>
          <div
            className="p-8 rounded-[15px] text-[#333] flex justify-center items-center text-center text-[20px] max-[900px]:text-[16px] max-[600px]:text-[12px] font-bold shadow-md transition-transform duration-300 cursor-pointer bg-[#e39fa9] hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleCardClick("Finance & Budgeting")}
          >
            Finance & Budgeting
          </div>
          <div
            className="p-8 rounded-[15px] text-[#333] flex justify-center items-center text-center text-[20px] max-[900px]:text-[16px] max-[600px]:text-[12px] font-bold shadow-md transition-transform duration-300 cursor-pointer bg-[#9a6cb4af] hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleCardClick("Parenting & Family")}
          >
            Parenting & Family
          </div>
          <div
            className="p-8 rounded-[15px] text-[#333] flex justify-center items-center text-center text-[20px] max-[900px]:text-[16px] max-[600px]:text-[12px] font-bold shadow-md transition-transform duration-300 cursor-pointer bg-[#e39fa9] hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleCardClick("Baby's Essentials")}
          >
            Baby's Essentials
          </div>
          <div
            className="p-8 rounded-[15px] text-[#333] flex justify-center items-center text-center text-[20px] max-[900px]:text-[16px] max-[600px]:text-[12px] font-bold shadow-md transition-transform duration-300 cursor-pointer bg-[#9a6cb4af] hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleCardClick("Exercise & Fitness")}
          >
            Exercise & Fitness
          </div>
          <div
            className="p-8 rounded-[15px] text-[#333] flex justify-center items-center text-center text-[20px] max-[900px]:text-[16px] max-[600px]:text-[12px] font-bold shadow-md transition-transform duration-300 cursor-pointer bg-[#9DC3E2] hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleCardClick("Labor & Delivery")}
          >
            Labor & Delivery
          </div>
        </div>

        {/* Recharts Bar Graph */}
        <div className="mt-12 bg-white p-6 rounded-[12px] shadow-md max-[600px]:mt-6">
          <h3 className="text-[22px] font-bold mb-5 text-[#333] text-center max-[900px]:text-[18px] max-[600px]:text-[14px]">
            Category Engagement Overview
          </h3>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </div>
      </main>

      {/* Category Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogActions></DialogActions>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <span className="text-[20px] text-[#7c459c] border-l-4 border-[#7c459c] pl-2">
              {selectedCategory}
            </span>
            <IconButton
              onClick={handleClose}
              className="!absolute !right-[-25px] !top-[-40px] text-[#7c459c]"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="text-left mt-5 ml-4 leading-6">{renderDetails()}</div>
        </DialogContent>
        <div className="flex gap-6 items-center px-6 pb-6">
          <Button
            onClick={handleDownload}
            className="!text-[#7c459c] whitespace-nowrap"
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
          <Button
            onClick={handleViewReports}
            className="!text-[#7c459c] whitespace-nowrap"
            startIcon={<ReportIcon />}
          >
            {showReport ? "Hide Reports" : "View Reports"}
          </Button>
          <Button
            className="!text-[#7c459c] whitespace-nowrap"
            onClick={handleShowAddToLibrary}
            startIcon={<LibraryAddIcon />}
          >
            Add to Library
          </Button>
        </div>
      </Dialog>

      {/* Report Modal */}
      {showReport && (
        <Dialog
          open={showReport}
          onClose={handleViewReports}
          sx={{
            "& .MuiDialog-paper": {
              width: "80%",
              maxHeight: "80%",
              height: "800px",
            },
            "& .MuiDialogContent-root": {
              maxHeight: "60vh",
              overflowY: "auto",
            },
          }}
        >
          <DialogTitle>
            <span className="text-lg font-bold">Reports</span>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleViewReports}
              aria-label="close"
              sx={{
                position: "absolute",
                top: 8,
                right: 20,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className="text-base">
              {reportData && !isFetchingReport ? (
                <ReactMarkdown>{reportData.toString()}</ReactMarkdown>
              ) : isFetchingReport ? (
                "Fetching Report..."
              ) : (
                "No report available"
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add to Library Modal */}
      {showLibrary && (
        <Dialog
          open={showLibrary}
          onClose={handleCloseModal}
          sx={{
            "& .MuiDialog-paper": {
              width: "80%",
              maxHeight: "80%",
              height: "800px",
            },
            "& .MuiDialogContent-root": {
              maxHeight: "60vh",
              overflowY: "auto",
            },
          }}
        >
          <DialogTitle>
            <span className="text-lg font-bold">Add to Library</span>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseModal}
              aria-label="close"
              sx={{
                position: "absolute",
                top: 8,
                right: 20,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <label
              htmlFor="cover-image-input"
              className="block font-bold text-[16px] mb-2"
            >
              Choose a Cover image
            </label>
            <input
              type="file"
              id="cover-image-input"
              accept="image/*"
              onChange={handleFileChange}
              className="block mt-2"
            />
            {selectedImage && (
              <div className="relative mt-5 flex justify-center">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-[30%] h-auto mx-auto"
                />
                <Button
                  onClick={handleRemoveImage}
                  className="!absolute !top-2 !right-2 !bg-black/50 !text-white !rounded-full !p-1 !min-w-0 !h-[25px] !w-[25px] flex items-center justify-center text-[16px]"
                >
                  ×
                </Button>
              </div>
            )}
            <div className="mt-4 text-base">
              {reportData && !isFetchingReport ? (
                <ReactMarkdown>{reportData.toString()}</ReactMarkdown>
              ) : isFetchingReport ? (
                "Fetching Report..."
              ) : (
                "No report available"
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddToLibrary} color="primary">
              Add to Library
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ManageBellyTalk;
