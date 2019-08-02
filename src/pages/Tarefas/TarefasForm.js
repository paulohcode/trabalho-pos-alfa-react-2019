import React, { Component } from 'react';

import { Container, Row, Form, FormGroup, Label, Input, Button, Alert, } from "reactstrap";
import api from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default class TarefasForm extends Component {
    state = {
        titulo: '',
        descricao: '',
        concluida: false
    }

    constructor(props) {
        super(props);
        this.idtarefa = props.match.params.taskId;
    }

    componentDidMount() {
        const idtarefa = this.idtarefa;
        if (!idtarefa) {
            return;
        }

        document.body.classList.add('carregando...');
        api.get(`tarefas/${idtarefa}`)
            .then(response => {
                document.body.classList.remove('carregando...');
                console.log('response data', response.data);

                const { titulo, descricao, concluida } = response.data[0] || {};

                console.log(titulo, descricao, concluida);;

                this.setState({ titulo, descricao, concluida })
            })
            .catch(err => {
                if (err.response && err.response.status !== 404) {
                    window.alert('erro');
                    console.warn(err);
                }
                document.body.classList.remove('carregando...');
            })
    }

    handleGravarTarefa = async e => {
        e.preventDefault();

        const { titulo, descricao, concluida } = this.state;

        let validarCampos = [titulo, descricao]
        for (let i in validarCampos) {
            if (!validarCampos[i]) {
                this.setState({ error: 'Preencha todos os campos do formulario!' });
                return;
            }
        }

        document.body.classList.add('carregando...');
        try {
            if (this.idtarefa) {
                await api.put(`tarefas/${this.idtarefa}`, { titulo, descricao, concluida });
            } else {
                await api.post('tarefas', { titulo, descricao, concluida });
            }
            this.props.history.push('/tarefas');
            document.body.classList.remove('carregando...');
        } catch (err) {
            let errorMsg = 'Erro ao salvar tarefa, verifique os campos';
            
            this.setState({
                error: errorMsg
            });

            console.error(err);
            document.body.classList.remove('carregando...');
        }
    }

    render() {
        return (
            <>
                <Header />
                <Container className="mb-5">
                    <h1 className="mt-5 mb-5 text-center">Cadastrar/Editar uma tarefa</h1>

                    {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                    <Form onSubmit={this.handleGravarTarefa}>
                        <Row>
                            {this.idtarefa ? <Input type="hidden" value={this.idtarefa} /> : ''}
                            <FormGroup className="col-6 col-sm-6">
                                <Label for="titulo">Título</Label>
                                <Input
                                    type="text"
                                    name="titulo"
                                    id="titulo"
                                    value={this.state.titulo}
                                    onChange={e => this.setState({ titulo: e.target.value })}
                                />
                                  <Label for="descricao">Descrição</Label>
                                <Input
                                    type="textarea"
                                    name="descricao"
                                    id="descricao"
                                    value={this.state.descricao}
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                />
                                <Label check>
                                    <p><br/></p> 
                                    <Input type="hidden" name="concluida" value="false" />
                                    <Input 
                                        type="checkbox" 
                                        name="concluida" 
                                        value="true"
                                        checked={this.state.concluida}
                                        onChange={e => this.setState({ concluida: e.target.checked })}
                                    />{' '}
                                    Concluída
                                </Label>
                            </FormGroup>
                           
                        </Row>
                        <Button className="btn-success">Enviar </Button>
                    </Form>
                </Container>
                <Footer/>
                
            </>
        );
    }
}
