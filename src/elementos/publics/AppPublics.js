import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import '../../App.css';

import Consulta from './Consulta';
class AppPublics extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor() {
        super();
        this.state = {
            email: '',
            name: '',
            perfil: ''
        }

        this.handlerSharepMas = this.handlerSharepMas.bind(this);
        this.handlerCambioOpcion2 = this.handlerCambioOpcion2.bind(this);
        this.handlerPostselect = this.handlerPostselect.bind(this);
        this.handlerPostPublicos = this.handlerPostPublicos.bind(this);
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

    handlerPostPublicos(e, i){
        this.props.onAddPostPublicos(e, i);
    }

    render() {
        const { match: {params} } = this.props;
        const { cookies } = this.props;
        if(cookies.get('estado') && cookies.get('estado') !== ''){ 
            return (
                <Consulta onAddUserId={params.userId} onAddSharep={this.props.onAddSharep} 
                    onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} 
                    onAddSharepMas={this.handlerSharepMas} onAddContador={this.props.onAddContador} 
                    onAddNuevs={this.handlerCambioOpcion2} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect}
                    onAddSession={this.props.onAddSession} onAddPostPublicos={this.handlerPostPublicos} onAddXYyz={cookies.get('xyz')} />
            );
        }else{
            return (
                <Consulta onAddUserId={params.userId} onAddSharep={this.props.onAddSharep} 
                    onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} 
                    onAddSharepMas={this.handlerSharepMas} onAddContador={this.props.onAddContador} 
                    onAddNuevs={this.handlerCambioOpcion2} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect}
                    onAddSession={this.props.onAddSession} onAddPostPublicos={this.handlerPostPublicos} onAddXYyz={''} />
            );
        }
    }
}

export default withCookies(AppPublics);