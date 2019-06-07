import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import InfoUser from './InfoUser';

class Validar extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor(props){
		super(props);

		this.state = {
			email: '',
			name: '',
			perfil: '',
			code: ''
		};

		this.handlerConsultaUser = this.handlerConsultaUser.bind(this);
		this.handlerSharepMas = this.handlerSharepMas.bind(this);
		this.handlerCambioOpcion2 = this.handlerCambioOpcion2.bind(this);
		this.handlerPostselect = this.handlerPostselect.bind(this);
		this.removeTodo = this.removeTodo.bind(this);
		this.handlerSession = this.handlerSession.bind(this);
	}

	componentDidMount() {
		const input = { token: this.props.onAddXYyz };
		fetch("/select", {
			method: 'POST',
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerConsultaUser(response.email, response.name, response.perfil, response.code))
		.catch(error => console.error('Error:', error));

		if(this.props.onAddSession === 'true'){
			this.props.onAddSessionFunction('false');
		}else{
			this.props.onAddSessionFunction('terminar');
		}
  	}

  	handlerConsultaUser(a, b, x, y){
  		if(y === ""){
  			this.handlerCerrarSesiones();
  		}else{
  			this.setState({ email: a, name: b, perfil: x, code: y });
  		}
  	}

  	handlerCerrarSesiones(){
		var cookies = document.cookie.split(";");

	    for (var i = 0; i < cookies.length; i++) {
	        var cookie = cookies[i];
	        var eqPos = cookie.indexOf("=");
	        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
	        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	    }

	    window.location =  "/";
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

    removeTodo(index) {
        this.props.onAddQuitar(index);
    }

    handlerSession(e){
        this.props.onAddSessionFunction(e);
    }

	render (){
		if(this.state.email !== ''){
			return (
				<div className="container-fluid sinpadding">
		          	<InfoUser onAddEmail={this.state.email} onAddPerfil={this.state.perfil} 
		          		onAddName={this.state.name} onAddCode={this.state.code} onAddSharep={this.props.onAddSharep} 
		          		onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} 
		          		onAddSharepMas={this.handlerSharepMas} onAddContador={this.props.onAddContador} 
		          		onAddNuevs={this.handlerCambioOpcion2} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect} 
		          		onAddQuitar={this.removeTodo} onAddSession={this.props.onAddSession} onAddSessionFunction={this.handlerSession} />
		        </div>
			);
		}else{
			return (
				<div className="container-fluid sinpadding">
		        </div>
			);
		}
	}
}

export default withCookies(Validar);