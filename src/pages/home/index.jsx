import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Button, Form, Alert, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { addPlayer, getPlayer } from '../../actions/player';
import { getCategories } from '../admin/components/categories/actions';

const animatedComponents = makeAnimated();

export default function Home() {

  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [textAlert, setTextAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const categories = await getCategories();
      setCategories(categories.map(x => {
        return {
          value: x.id,
          label: x.name
        }
      }));
    }

    loadCategories();
    loadPlayer();
  }, []);

  async function loadPlayer() {
    const playerId = localStorage.getItem('player');
    if (playerId) {
      const player = await getPlayer(playerId);
      if (player) {
        setIsFirstTime(false);
        setPlayerName(player.name);
      }
    }
    setLoading(false);
  }

  async function newGame() {
    if (playerName.trim() === '') {
      setTextAlert('Informe o nome do jogador!');
      setShowAlert(true);
      return;
    }

    if (!selected || selected?.length === 0) {
      setTextAlert('Escolha pelo menos uma categoria!');
      setShowAlert(true);
      return;
    }

    setShowAlert(false);

    if (isFirstTime) {
      const player = await addPlayer(playerName);
      localStorage.setItem('player', player.id);
    }

    window.location.reload();
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <h1>Jogo da Forca</h1>
        </Col>
      </Row>
      {
        !loading &&
        <>
          <Row className="justify-content-md-center mt-3 mb-1">
            <Col xs lg="6">
              <Form className='mt-3 mb-3'>
                {
                  isFirstTime ?
                  <Form.Control value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nome do jogador" />
                  :
                <h4>Bem vindo de volta, {playerName}</h4>
                }
              </Form>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col xs lg="6">
              <Select
                placeholder="Selecione a(s) categoria(s)"
                closeMenuOnSelect={false}
                components={animatedComponents}
                closeMenuOnSelect={false}
                isMulti
                options={categories}
                value={selected}
                onChange={selectedOptions => setSelected(selectedOptions)}
              />
            </Col>
          </Row>
        </>
      }
      <Row className="justify-content-md-center mt-3">
        <Col xs lg="6">
          {
            showAlert &&
            <Alert className="mt-2 mb-3" variant="danger" onClose={() => setShowAlert(false)} dismissible>
              {textAlert}
            </Alert>
          }
          {
            loading ?
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              :
              <Button onClick={newGame}>Jogar</Button>
          }
        </Col>
      </Row>
    </Container>
  )
}