import React from 'react';
import { Tab, Tabs, Container, Button } from 'react-bootstrap';
import { clearRanking } from '../../actions/player';
import Categories from './components/categories';
import Words from './components/words';

function Admin() {

  const resetRanking = async () => {
    await clearRanking();
    alert("Ranking resetado");
  }

  return (
    <div className="ml-5 mr-5 mt-5">
      <Tabs defaultActiveKey="categories">
        <Tab eventKey="categories" title="Categorias" unmountOnExit>
          <Container>
            <Categories />
          </Container>
        </Tab>
        <Tab eventKey="words" title="Palavras" unmountOnExit>
          <Container>
            <Words />
          </Container>
        </Tab>
        <Tab eventKey="ranking" title="Ranking" unmountOnExit>
          <Container>
            <h6>Resetar pontuação no ranking</h6>
            <Button onClick={() => resetRanking()}>
              Resetar
            </Button>
          </Container>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Admin;