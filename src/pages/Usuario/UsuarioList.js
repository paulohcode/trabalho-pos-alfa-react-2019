import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Table, Badge } from "reactstrap";

import api from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default class UsuarioList extends Component {
    state = {
        usuarios: [],
    }

    constructor(props) {
        super(props);

        this.refDetalhes = React.createRef();
    }

    componentDidMount() {
        document.body.classList.add('carregando...');
        api.get('usuarios')
            .then(response => {
                console.log('response data', response.data);
                this.setState({ usuarios: response.data })
                document.body.classList.remove('carregando...');
            })
            .catch(err => {
                window.alert('erro');
                console.warn(err);
                document.body.classList.remove('carregando...');
            })
    }

    renderUsuarios = () => {
        return this.state.usuarios.map(usuario => (
            <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.cpf}</td>
                <td>{usuario.nascimento}</td>
                <td>{usuario.status
                    ? <Badge href="#" color="success">Ativo</Badge>
                    : <Badge href="#" color="secondary">Inativo</Badge>}</td>
            </tr>
        ));
    }

    render() {
        return (
            <>
                <Header />
                <Container>
                <h1 className="mb-5 text-center">
                        Todas os Usuarios Cadastrados
                        <div className="float-right">
                            <Link to={`/cadastro`} className="btn btn-secondary" color="success">Novo Usuário</Link>
                        </div>
                    </h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome Completo

                                </th>
                                <th>E-mail</th>
                                <th>CPF</th>
                                <th>Data de nascimento</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderUsuarios()}
                        </tbody>
                    </Table>

                    <br />
                </Container>
                <Footer />
            </>
        );
    }
}