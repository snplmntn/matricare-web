import React from 'react';
import { IoHome, IoCalendar, IoChatbubbles, IoLibrary, IoPerson, IoNotificationsSharp  } from 'react-icons/io5';
import '../../style/pages/landingpageassistant.css';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';

// Register chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const LandingPageAssistant = () => {
  const lineData = {
    labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()), // Labels from 1 to 30
    datasets: [
      {
        label: 'Patients Signed Up',
        data: [2, 1, 4, 1, 0, 0, 4, 10],
        fill: false,
        backgroundColor: '#9a6cb4',
        borderColor: '#9a6cb4',
        tension: 0.1
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Patients: ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Appointments'
        },
        beginAtZero: true
      }
    }
  };

  // Sample data for the pie chart
  const pieData = {
    labels: ['Manila', 'Bulacan 1', 'Bulacan 2'],
    datasets: [
      {
        label: 'Patients by Location',
        data: [3, 3, 3], // Example data
        backgroundColor: ['#7c459c', '#9a6cb4', '#cc65fe'],
        borderColor: ['transparent'],
        borderWidth: 2,
        cutout: '80%' // Makes the pie chart into a ring
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: () => '' // Hide the tooltip
        }
      },
      datalabels: {
        display: false // Disable data labels
      }
    }
  };

  // Total number of patients
  const totalPatients = 13;


// Sample Appointments 
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const patients = [
    {
      id: 1,
      name: 'Jane Doe',
      branch: 'Manila',
      appointmentDate: 'September 12, 2024',
      profilePic: 'img/LOGO.png'
    },
    {
      id: 2,
      name: 'Bella Smith',
      branch: 'Bulacan 1',
      appointmentDate: 'September 12, 2024',
      profilePic: 'img/LOGO.png'
    },
    {
      id: 3,
      name: 'Ella Cruz',
      branch: 'Bulacan 2',
      appointmentDate: 'September 22, 2024',
      profilePic: 'img/LOGO.png'
    },
    {
      id: 4,
      name: 'Ella Cruz',
      branch: 'Bulacan 2',
      appointmentDate: 'September 28, 2024',
      profilePic: 'img/LOGO.png'
    },
    // Add more patients as needed
  ];

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  // Format date for labels
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };
  

  // Group patients by their appointment date
  const groupedPatients = patients.reduce((acc, patient) => {
    const formattedDate = formatDate(patient.appointmentDate);

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(patient);
    return acc;
  }, {});
  
  // Sample library items
  const libraryItems = [
    { id: 1, title: 'Trimesters', image: 'img/topic1.jpg' },
    { id: 2, title: 'Weekly Pregnancy', image: 'img/topic2.jpg' },
    { id: 3, title: 'Pregnancy Discharge', image: 'img/topic3.jpg' },
    { id: 4, title: 'Pregnancy Symptoms', image: 'img/topic4.jpg' },
    { id: 5, title: 'Dietary Planning', image: 'img/topic5.jpg' }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="landingpage-assistant-container">
      <aside className="landingpage-assistant-sidebar">
        <div className="landingpage-assistant-sidebar-logo">
          <img src="img/logo_consultant.png" alt="Logo" />
        </div>
        <div className="landingpage-assistant-sidebar-menu">
        <Link to="/assistant-landing" className="landingpage-assistant-sidebar-item" title="Home">
            <IoHome className="landingpage-assistant-icon" />
          </Link>
        <Link to="/admin-profile" className="landingpage-assistant-sidebar-item">
            <IoPerson  className="landingpage-assistant-icon" />
          </Link>
          <Link to="/appointment-assistant" className="landingpage-assistant-sidebar-item" title="Appointment">
            <IoCalendar className="landingpage-assistant-icon" />
          </Link>
          <Link to="/library" className="landingpage-assistant-sidebar-item" title="Library">
            <IoLibrary className="landingpage-assistant-icon" />
          </Link>
          <Link to="/belly-talk" className="landingpage-assistant-sidebar-item" title="BellyTalk">
            <IoChatbubbles className="landingpage-assistant-icon" />
          </Link>
        </div>
      </aside>

      <main className="landingpage-assistant-main-content">
        <header className="landingpage-assistant-header">
          <h1>Dashboard</h1>
          <a href="/assistant-notification" className="assistant-notification-button" title="Notifications">
        <IoNotificationsSharp />
      </a>
          <div className="landingpage-assistant-user-profile">
            <h1>Mary Anne B. Santos</h1>
            <p>Assistant</p>
            <img src="img/LOGO.png" alt="Profile" />
          </div>
        </header>

        <section className="landingpage-assistant-dashboard">
          <div className="landingpage-assistant-dashboard-item landingpage-assistant-patients">
            <h2>Patients</h2>
            <div className="landingpage-assistant-pie-chart">
              <Pie data={pieData} options={pieOptions} />
              <div className="landingpage-assistant-pie-chart-label">
                {totalPatients}
              </div>
            </div>
          </div>

          <div className="landingpage-assistant-dashboard-item landingpage-assistant-library">
            <h2>Resource Library</h2>
            <div className="landingpage-assistant-library-slider">
              <Slider {...sliderSettings}>
                {libraryItems.map(item => (
                  <div key={item.id} className="landingpage-assistant-library-box">
                    <img src={item.image} alt={item.title} className="landingpage-assistant-library-box-image" />
                    <h3>{item.title}</h3>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div className="landingpage-assistant-dashboard-item landingpage-assistant-total-appointment">
            <h2>Total Appointments</h2>
           <div className="landingpage-assistant-chart">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          <div className="landingpage-assistant-dashboard-item landingpage-assistant-recent-appointments">
            <h2>Recent Appointments</h2>
            <div className="landingpage-assistant-month-selector">
              <select id="month-select" name="month">
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="landingpage-assistant-patients-list">
              {Object.keys(groupedPatients).map(date => (
                <div key={date} className="landingpage-assistant-patient-date-group">
                  <h3 className="appointment-date-label">
                    {date === todayStr ? 'Today' : date}
                  </h3>
                  {groupedPatients[date].map(patient => (
                    <div key={patient.id} className="landingpage-assistant-patient-item">
                      <div className="patient-picture">
                        <img src={patient.profilePic} alt={patient.name} />
                      </div>
                      <div className="patient-details">
                        <div className="patient-name">{patient.name}</div>
                        <div className="branch-location">{patient.branch}</div>
                      </div>
                      <div className="appointment-date">{patient.appointmentDate}</div>
                    </div>
         ))}
         </div>
       ))}
     </div>
   </div>
 </section>
</main>
</div>
);
};

export default LandingPageAssistant;
