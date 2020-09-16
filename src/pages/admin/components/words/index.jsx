import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { getCategories } from '../categories/actions';
import { removeWord, addWord, getWords } from './actions';

export default function Words() {
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('-1');
  const [name, setName] = useState('');

  useEffect(() => {
    loadCategories();
    loadWords();
  }, [])

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function loadWords() {
    const data = await getWords();
    setWords(data);
    setName('');
  }

  async function save() {
    if (name?.trim() === '') {
      alert('Palavra inválida!');
      return;
    }

    if (categoryId === '-1') {
      alert('Categoria inválida!');
      return;
    }

    await addWord(name, categoryId, loadWords);
  }

  async function remove(id) {
    await removeWord(id, loadWords);
  }

  function onCategoryChange(value) {
    setCategoryId(value);
  }

  return (
    <>
      <Form className='mt-3 mb-3'>
        <Row>
          <Col xl='4' xs='8' lg='8' md='8' sm='10'>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Palavra" />
          </Col>
          <Col xl='4' xs='8' lg='8' md='8' sm='10'>
            <Form.Control as="select" onChange={(e) => onCategoryChange(e.target.value)}>
              <option value="-1">Selecione a categoria</option>
              {
                categories.map((category, index) => (
                  <option key={index} value={category.id}>{category.name}</option>
                ))
              }
            </Form.Control>
          </Col>
          <Col xs='1' lg='1' sm='1'>
            <Button onClick={save}>Gravar</Button>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Palavra</th>
            <th>Categoria</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
            words.map((word, index) => (
              <tr key={index}>
                <td style={{ width: '20%' }}>{word.id}</td>
                <td>{word.name}</td>
                <td>{word.category.name}</td>
                <td style={{ width: '20%' }}><Button variant="danger" size='sm' onClick={() => remove(word.id)}>Remover</Button></td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </>
  )
}