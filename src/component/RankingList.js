import React from 'react';

const RankingList = ({ rankings }) => {
  if (!Array.isArray(rankings) || rankings.length === 0) {
    return <div>No rankings available.</div>;
  }

  return (
    <div className="row d-flex flex-column mb-3 ranking-list">
      <h2>Top Players</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
            <th>Game Record</th>
            <th>Play Time</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.user_name}</td>
              <td>{player.final_points}</td>
              <td>W:{player.wins} L:{player.losses} T:{player.ties}</td>
              <td>{player.formatted_play_time || player.play_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingList;