import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
/* import { scaleSequential } from 'd3-scale'; */
/* import { interpolateGreens } from 'd3-scale-chromatic'; */

const today = new Date();
const startDate = new Date(today.getFullYear(), today.getMonth() - 4, today.getDate() - 5);
const sinceDate = startDate.toISOString().substring(0, 10);

interface GitHubGraphProps {
  username: string;
  year: number;
}

interface ContributionData {
  date: string;
  count: number;
}

const GitHubGraph: React.FC<GitHubGraphProps> = ({ username, year }) => {
  const [contributions, setContributions] = useState<ContributionData[]>([]);

  useEffect(() => {
    axios.get(`https://api.github.com/users/${username}/events?per_page=100&since=${sinceDate}`)
      .then(response => {
        const contributions = response.data.filter((event: any) => {
          return event.type === 'PushEvent' && new Date(event.created_at).getFullYear() === year;
        }).map((event: any) => {
          const utcDate = new Date(event.created_at);
          const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
          /* let count = 0; */
          /* event.payload.commits.forEach((commit: any) => { */
          /*   if (commit.author.email === `${username}@users.noreply.github.com`) { */
          /*     count++; */
          /*   } */
          /* }); */
          return {
            date: new Date(event.created_at).toISOString().substring(0, 10),
            /* date: localDate.toISOString().substring(0, 10), */
            count: event.payload.commits.length
          };
        });
        setContributions(contributions);
      })
      .catch(error => {
        console.error(error);
      });
  }, [username, year]);

  return (
    <div className="item" id="github-heatmap">
      {/* <h2>{username}'s GitHub Contributions for {year}</h2> */}
      <CalendarHeatmap
        /* startDate={new Date(`${year}-01-01`)} */
        startDate={startDate}
        endDate={today}
        values={contributions}
        showWeekdayLabels={false}
        showMonthLabels={false}
        /* showWeekdayLabels={true} */
        /* showMonthLabels={true} */
        gutterSize={2}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          else if (value.count > 4) {
            return `color-scale-4`;
          }
          return `color-scale-${value.count}`;
        }}
        />
    </div>
  );
};

export default GitHubGraph;
