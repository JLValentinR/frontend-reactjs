import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../App.css';

import Validar from './Validar';
import FormularioUser from './FormularioUser';
class AppPrivates extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            perfil: ''
        }

        this.handleAddIncremento = this.handleAddIncremento.bind(this);
        this.handlerSharepMas = this.handlerSharepMas.bind(this);
        this.handlerCambioOpcion2 = this.handlerCambioOpcion2.bind(this);
        this.handlerPostselect = this.handlerPostselect.bind(this);
        this.handlerSession = this.handlerSession.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
    }

    handleAddIncremento(count) {
        this.setState({
            email: count.email,
            name: count.name,
            perfil: count.perfil
        });
    }

    handlerSharepMas(count){
        this.props.onAddSharepMas({count: count.count, contador: count.contador, ultimateid: count.ultimateid });
    }

    handlerCambioOpcion2(e){
        this.props.onAddNuevs(e);
    }

    handlerPostselect(e){
        this.props.onAddPostNews(e);
    }

    handlerSession(e){
        this.props.onAddSessionFunction(e);
    }

    removeTodo(index) {
        this.props.onAddQuitar(index);
    }

    render() {
        const { cookies } = this.props;
        if(cookies.get('estado') && cookies.get('estado') !== ''){
            return (
                <Validar onAddCookie={this.state.secret} onAddSharep={this.props.onAddSharep} 
                    onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} 
                    onAddSharepMas={this.handlerSharepMas} onAddContador={this.props.onAddContador} 
                    onAddNuevs={this.handlerCambioOpcion2} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect}
                    onAddSession={this.props.onAddSession} onAddSessionFunction={this.handlerSession} onAddXYyz={cookies.get('xyz')} onAddQuitar={this.removeTodo} />
            );
        }else{
            return (
                <div className="container-fluid sinpadding App">
                    <FormularioUser onAddActivar={this.handleAddIncremento} onAddSessionFunction={this.handlerSession} />
                </div>
            );
        }
    }
}

export default withCookies(AppPrivates);