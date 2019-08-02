import React, { Component } from 'react';

import { Container, Row, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import InputMask from "react-input-mask";
import api from '../../services/api';

export default class UsuarioForm extends Component {
    state = {
        nome: '',
        email: '',
        nascimento: '',
        cpf: '',
        senha: '',
        error: ''
    }

    handleGravarUsuario = async e => {
        e.preventDefault();

        const { nome, email, nascimento, cpf, senha } = this.state;

        let validarCampos = [nome, email, nascimento, cpf, senha]
        for (let i in validarCampos) {
            if (!validarCampos[i]) {
                this.setState({ error: 'Por favor preencha todos os campos do Formulario!' });
                return;
            }
        }

        document.body.classList.add('loading');
        try {
            await api.post('usuarios', { nome, email, nascimento, cpf, senha });
            this.props.history.push('/usuarios');
            document.body.classList.remove('loading');
        } catch (err) {
            let errorMsg = 'Houve um problema ao gravar o usuário';
            
            if (err.response.status && err.response.status === 409) {
                errorMsg = 'Já existe um usuário cadastrado com este e-mail ou CPF';
            }
            
            this.setState({
                error: errorMsg
            });

            console.error(err);
            document.body.classList.remove('loading');
        }
    }

    render() {
        return (
            <Container>
                <h1 className="mt-5 mb-3">Formulario para Cadastro de Usuário</h1>

                {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                <Form onSubmit={this.handleGravarUsuario}>
                    <Row>
                        <FormGroup className="col-12 col-sm-4">
                            <Label for="nome">Nome Completo</Label>
                            <Input
                                type="text"
                                name="nome"
                                id="nome"
                                placeholder="Digite seu Nome Completo" 
                                onChange={e => this.setState({ nome: e.target.value })}
                            />
                            <Label for="email">E-mail</Label>
                            <Input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Digite seu E-mail"
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                            <Label for="nascimento">Data de nascimento</Label>
                            <Input 
                                type="date" 
                                name="nascimento" 
                                id="nascimento"                               
                                onChange={e => this.setState({ nascimento: e.target.value })}
                            />
                            <Label for="cpf">CPF</Label>
                            <Input
                                type="text"
                                name="cpf"
                                id="cpf"
                                mask="999.999.999-99"
                                maskChar={null}
                                tag={InputMask}
                                placeholder="999.999.999-99"
                                onChange={e => this.setState({ cpf: e.target.value })}
                            />
                             <Label for="senha">Senha</Label>
                            <Input
                                type="password"
                                name="senha"
                                id="senha"
                                placeholder="*******************"
                                onChange={e => this.setState({ senha: e.target.value })}
                            />
                                                   
                        </FormGroup>
                    </Row>
                    <Button className="btn-success">Enviar</Button>
                </Form>
            </Container>
        );
    }
}
