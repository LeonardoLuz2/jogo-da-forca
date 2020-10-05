import React, { useState } from 'react';
import { useEffect } from 'react';
import { Row, Table } from 'react-bootstrap';
import { getRanking } from '../../actions/player';

export default function Ranking() {

  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    loadRanking();
  }, [])

  async function loadRanking() {
    const ranking = await getRanking();
    setRanking(ranking);
  }

  return (
    <>
      <h1 className="mb-3">Ranking</h1>
      <Row className="justify-content-md-center">
        <Table style={{ width: '50%' }} striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {
              ranking.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                  <td>{player.score}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Row>
    </>
  )
}