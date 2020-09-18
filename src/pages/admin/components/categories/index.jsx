import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { getCategories, addCategory, removeCategory, error } from './actions';


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [alertType] = useState(['danger'])
  const [name, setName] = useState('');
  const [textAlert, setTextAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [])

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
    setName('');
  }

  async function setAlert(text) {
    setTextAlert(text)
    setShowAlert(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function save() {
    if (name.trim() === '') {
      setAlert('Categoria inválida!')
      return;
    }
    await addCategory(name, loadCategories);
  }

  async function remove(id) {
    let hasRemovedCategory = await removeCategory(id, loadCategories)
    if (!hasRemovedCategory) {
      setAlert('Não foi possivel remover a categoria pois ela esta vinculada a uma palavra')
    }
  }

  return (
    <>
      <Form className='mt-3 mb-3'>
        <Row>
          <Col xl='4' xs='8' lg='8' md='8' sm='10'>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Categoria" />
          </Col>
          <Col xs='1' lg='1' sm='1'>
            <Button onClick={save}>Gravar</Button>
          </Col>
        </Row>
      </Form>
      {

        alertType.map((variant, idx) => (
          <Alert key={idx} variant={variant} onClose={() => setShowAlert(false)} dismissible show={showAlert}>
            {textAlert}
          </Alert>
        ))
      }
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
            categories.map((categorie, index) => (
              <tr key={index}>
                <td style={{ width: '20%' }}>{categorie.id}</td>
                <td>{categorie.name}</td>
                <td style={{ width: '20%' }}><Button variant="danger" size='sm' onClick={() => remove(categorie.id)}>Remover</Button></td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </>
  )
}