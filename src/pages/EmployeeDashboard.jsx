import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityLog from '../components/dashboard/ActivityLog';

import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  Megaphone,
  Moon,
  Sun
} from 'lucide-react';

const EmployeeDashboard = () => {

  const { user } = useAuth();

  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');


  const [darkMode, setDarkMode] =
    useState(false);

 
  const [currentTime, setCurrentTime] =
    useState(new Date());


  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);


  useEffect(() => {

    if (darkMode) {

      document.body.classList.add('dark');

    } else {

      document.body.classList.remove('dark');

    }

  }, [darkMode]);

  const memberSince = new Date(
    user.createdAt
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

 
  const announcements =
    JSON.parse(
      localStorage.getItem('announcements')
    ) || [
      {
        id: 1,
        title: 'Annual Team Meeting',
        message:
          'Meeting scheduled on Friday at 3 PM in the conference hall.',
        date: '2026-05-14'
      },
      {
        id: 2,
        title: 'Holiday Notice',
        message:
          'Office will remain closed on Monday.',
        date: '2026-05-15'
      },
      {
        id: 3,
        title: 'HR Policy Update',
        message:
          'Employees are requested to review the updated HR guidelines.',
        date: '2026-05-16'
      }
    ];

  const handleLeaveSubmit = (e) => {

    e.preventDefault();

    const existingLeaves =
      JSON.parse(
        localStorage.getItem('leaveRequests')
      ) || [];

    const newLeave = {
      id: Date.now(),
      employee: user.name,
      date: leaveDate,
      reason: leaveReason,
      status: 'Pending'
    };

    localStorage.setItem(
      'leaveRequests',
      JSON.stringify([
        ...existingLeaves,
        newLeave
      ])
    );

    alert('Leave Applied Successfully');

    setLeaveDate('');
    setLeaveReason('');
  };

  return (
    <>
      <Navbar />

      <main className="dashboard">

      
        <header className="dashboard-header">

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >

            <div>

              <h1 className="dashboard-title">
                Welcome back,
                {user.name.split(' ')[0]}!
              </h1>

              <p className="dashboard-subtitle">
                Here's your employee dashboard overview
              </p>

            </div>
           <div
  style={{
    marginTop: '1rem',
    padding: '1rem',
    background: 'var(--background)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}
>
  <span
    style={{
      fontWeight: '600',
      color: 'var(--text-secondary)'
    }}
  >
    Employee ID:
  </span>

  <span
    style={{
      color: 'var(--text-primary)',
      fontWeight: '500',
      letterSpacing: '0.5px'
    }}
  >
    {user.employeeId}
  </span>
</div>
        
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDarkMode(!darkMode)
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >

              {darkMode ? (
                <>
                  <Sun size={18} />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} />
                  Dark Mode
                </>
              )}

            </button>

          </div>

        </header>

        
        <div className="stats-grid">

          <StatsCard
            icon={Briefcase}
            value={user.department}
            label="Department"
            variant="primary"
          />

          <StatsCard
            icon={Calendar}
            value={memberSince}
            label="Member since"
            variant="success"
          />

          <StatsCard
            icon={Clock}
            value="Active"
            label="Account status"
            variant="success"
          />

          <StatsCard
            icon={CheckCircle}
            value="Employee"
            label="Access level"
            variant="warning"
          />

       
          <StatsCard
            icon={Clock}
            value={currentTime.toLocaleTimeString()}
            label="Current Time"
            variant="primary"
          />

        </div>

    
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem'
          }}
        >

   
          <div className="card">

            <div className="card-header">
              <h2 className="card-title">
                Profile Information
              </h2>
            </div>

            <div className="card-body">

              <div
                style={{
                  display: 'grid',
                  gap: '1rem'
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    Full Name
                  </div>

                  <div style={{ fontWeight: 500 }}>
                    {user.name}
                  </div>

                </div>

                <div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    Email Address
                  </div>

                  <div style={{ fontWeight: 500 }}>
                    {user.email}
                  </div>

                </div>
                
               
                <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    Employee ID
                  </div>
                <div>
                 
                
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    Department
                  </div>

                  <div style={{ fontWeight: 500 }}>
                    {user.department}
                  </div>

                </div>

                <div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    Role
                  </div>

                  <div>

                    <span
                      className={`badge badge-${user.role}`}
                    >
                      {user.role}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

  
          <div className="card">

            <div className="card-header">
              <h2 className="card-title">
                Your Recent Activity
              </h2>
            </div>

            <div
              className="card-body"
              style={{ padding: '0.5rem 1rem' }}
            >

              <ActivityLog
                userId={user.id}
                limit={5}
              />

            </div>

          </div>

        </div>
        

    
        <div className="card">

          <div className="card-header">
            <h2 className="card-title">
              Apply Leave
            </h2>
          </div>

          <div className="card-body">

            <form
              onSubmit={handleLeaveSubmit}
              style={{
                display: 'grid',
                gap: '1rem'
              }}
            >

              <div>

                <label
                  style={{
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Leave Date
                </label>

                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) =>
                    setLeaveDate(e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px'
                  }}
                  required
                />

              </div>

              <div>

                <label
                  style={{
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  Reason
                </label>

                <textarea
                  rows="4"
                  placeholder="Enter reason..."
                  value={leaveReason}
                  onChange={(e) =>
                    setLeaveReason(e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    resize: 'none'
                  }}
                  required
                />

              </div>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Apply Leave
              </button>

            </form>

          </div>

        </div>


        <div className="card">

          <div className="card-header">

            <h2
              className="card-title"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Megaphone size={22} />
              Company Announcements
            </h2>

          </div>

          <div
            className="card-body"
            style={{
              display: 'grid',
              gap: '1rem'
            }}
          >

            {announcements.map((item) => (

              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  background: 'var(--surface)'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}
                >

                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    {item.title}
                  </h3>

                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {item.date}
                  </span>

                </div>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                  }}
                >
                  {item.message}
                </p>

              </div>

            ))}

          </div>

        </div>

      </main>
    </>
  );
};

export default EmployeeDashboard;