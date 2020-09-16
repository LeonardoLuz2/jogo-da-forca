import React from 'react';
import { Tab, Tabs, Container } from 'react-bootstrap';

import Categories from './components/categories';
import Words from './components/words';

function Admin() {
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
      </Tabs>
    </div>
  )
}

export default Admin;