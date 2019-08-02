import React, { Component } from 'react';
import { Link, Route } from "react-router-dom";
import { Container, Table, Modal, ModalHeader, ModalBody, Button } from "reactstrap";

import api from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
export default class TarefasList extends Component {
    state = {
        tasks: [],
        modal: false
    }

    constructor(props) {
        super(props);

        this.refDetalhes = React.createRef();
    }

    componentDidMount() {
        document.body.classList.add('carregando...');
        api.get('tarefas')
            .then(response => {
                console.log('response data', response.data);
                this.setState({ tasks: response.data });
               document.body.classList.remove('carregando...');
            })
            .catch(err => {
                if (err.response && err.response.status !== 404) {
                    window.alert('erro');
                    console.warn(err);
                }
                document.body.classList.remove('carregando...');
            })
    }

    handleExcluirTarefa = async tarefa => {
        const excluir = window.confirm('Deseja excluir esta tarefa?');

        if (!excluir) {
            return;
        }

        document.body.classList.add('carregando...');
        api.delete(`tarefas/${tarefa.id}`)
        .then(response => {
            console.log('response data', response.data);
            let tasks = this.state.tasks;
            tasks.splice(tasks.indexOf(tarefa), 1)
                console.log(tasks);
                this.setState({ tasks })
                document.body.classList.remove('carregando...');
            })
            .catch(err => {
                window.alert('erro');
                console.warn(err);
                document.body.classList.remove('carregando...');
            })
    }

    handleConcluirTarefa = async tarefa => {
        document.body.classList.add('carregando...');

        api.put(`tarefas/${tarefa.id}/concluida`)
            .then(response => {

                console.log('response data', response.data);

                let tasks = this.state.tasks;
                const idxTarefa = tasks.indexOf(tarefa);
                tasks[idxTarefa].concluida = true;

                this.setState({ tasks });
                document.body.classList.remove('carregando...');
            })
            .catch(err => {
                window.alert('erro');
                console.warn(err);
                document.body.classList.remove('carregando...');
            })
    }

    renderTasks = () => {
        return this.state.tasks.map(task => (
            <tr key={task.id}>
                <td>{task.id}</td>
                <td>
                    <Link to={`/tarefas/${task.id}`} onClick={this.toggleModal}>
                        {task.titulo}
                    </Link>
                </td>
                <td>{task.usuario.nome}</td>
                <td>{task.concluida
                    ? <span className="btn btn-success" role="img" aria-label="Sim">✅</span>
                    : <Button color="warning" onClick={() => this.handleConcluirTarefa(task)}>
                        <span role="img" aria-label="Não">❌</span>
                      </Button>}
                    </td>
                <td>
                    <Button color="danger" onClick={() => this.handleExcluirTarefa(task)}>Excluir</Button>{' '}
                    <Link to={`/tarefas/form/${task.id}`} className="btn btn-primary" color="primary">Editar</Link>
                </td>
            </tr>
        ));
    }

    renderTaskDescription = (routeProps) => {
        const taskId = parseInt(routeProps.match.params.taskId, 10);
        const task = this.state.tasks.find(task => (task.id === taskId));

        if (!task) {
            return (<h3 className="text-danger">Não foi possivel encontrar a Tarefa</h3>)
        }

        return (
            <div>
                <h3 className="font-weight-bold">{task.titulo}</h3>
                <p>Descrição: {task.descricao}</p>
                <p>Usuário: {task.usuario.nome}</p>
                <p>Concluída: {task.concluida ? 'Sim' : 'Não'}</p>
            </div>
        )
    }

    toggleModal = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <>
                <Header />
                <Container>
                    <h1 className="mb-5 text-center">
                        Todas as Tarefas Cadastradas
                        <div className="float-right">
                            <Link to={`/tarefas/form`} className="btn btn-secondary" color="success">Nova tarefa</Link>
                        </div>
                    </h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Título</th>
                                <th>Usuário</th>
                                <th>Concluída</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTasks()}
                        </tbody>
                    </Table>

                    <br />

                    <Modal isOpen={this.state.modal} toggle={this.toggleModal} modalTransition={{
                        timeout: 150
                    }} backdropTransition={{ timeout: 1 }}>
                        <ModalHeader toggle={this.toggleModal}>Detalhes da tarefa</ModalHeader>
                        <ModalBody>
                            <Route path="/tarefas/:taskId" render={this.renderTaskDescription} />
                        </ModalBody>
                    </Modal>
                </Container>
                <Footer />
            </>
        );
    }
}