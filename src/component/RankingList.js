import React from 'react';

const RankingList = ({ rankings }) => {
  return (
    <div className="ranking-list">
      <h2>Top 20 Players</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.userName}</td>
              <td>{player.finalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingList;