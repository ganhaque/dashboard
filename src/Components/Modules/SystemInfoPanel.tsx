import React, { useEffect, useState } from 'react';
import { formatSecond } from './Helpers/formatter';

const OSInfoComponent: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState<number | null>(null);
  const [ramUsage, setRamUsage] = useState<string | null>(null);
  const [uptime, setUptime] = useState<string | null>(null);

  const updateSystemInfo = async () => {
    /* console.log(window.electronAPI); */
    if (window.electronAPI?.getUptime) {
      window.electronAPI.getUptime()
        .then((output) => {
          /* console.log('up', output); */
          setUptime(formatSecond(output));
        })
        .catch((error) => {
          console.error('Error retrieving OS info:', error);
        });
    }
    if (window.electronAPI?.getOsInfo) {
      window.electronAPI.getOsInfo()
        .then((osInfo) => {
          /* console.log('os', osInfo); */
          setCpuUsage(osInfo.cpuUsage);
          setRamUsage(osInfo.ramUsage);
        })
        .catch((error) => {
          console.error('Error retrieving OS info:', error);
        });
    }
  }

  useEffect(() => {
    // Fetch OS info from Electron API
    updateSystemInfo();

    // Set up interval to update OS info every 5 seconds
    const interval = setInterval(updateSystemInfo, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>OS Information</h2>
      <div>
        <strong>CPU Usage:</strong> {cpuUsage !== null ? `${cpuUsage}%` : 'Loading...'}
      </div>
      <div>
        <strong>RAM Usage:</strong> {ramUsage !== null ? ramUsage : 'Loading...'}
      </div>
      <div>
        <strong>Uptime:</strong> {uptime !== null ? uptime : 'Loading...'}
      </div>
    </div>
  );
};

export default OSInfoComponent;

