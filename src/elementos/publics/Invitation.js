import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Link } from 'react-router-dom';

import Invalid from './Invalid';

import atrasimg from '../../atras.png';
import '../../App.css';
import '../../css/formulario.css';

import favorito from '../../ficono.png';
import favoritos2 from '../../ficono2.png';
import publicoiconos from '../../publico.png';
import privadoiconos from '../../privado.png';

let textform = '', textformsimple = '';

class Invitation extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor(props){
		super(props);

		this.state = {
			invitaciones: 'false',
			validar: '',
			email: '',
			name: '',
			password: ''
		}

		this.handlerPost = this.handlerPost.bind(this);
		this.handleInputChangeName = this.handleInputChangeName.bind(this);
		this.handleInputChangeEmail = this.handleInputChangeEmail.bind(this);
		this.handleInputChangePassword = this.handleInputChangePassword.bind(this);
		this.handlerRegistrarUser = this.handlerRegistrarUser.bind(this);
		this.handlerCodes = this.handlerCodes.bind(this);
	}

	controller = new AbortController();

	componentDidMount() {
		const { match: {params} } = this.props;
		const input = { unicopost: params.emailId };
		fetch("/invitation", {
			signal: this.controller.signal,
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify(input), 
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerPost(response.resultado, response.validarse))
		.catch(error => console.error('Error:', error));
  	}

  	componentWillUnmount(){
	    this.controller.abort();
	}

	handlerPost(codigo, validarses){
  		this.setState({
  			invitaciones: codigo,
  			validar: validarses
  		});
  	}

  	handleInputChangeName(e) {
		const {value, name} = e.target;
		textform = value;
		textformsimple = textform.replace(/(<([^>]+)>)/ig, '');

		this.setState({
		    [name]: textformsimple
		});
	}

	handleInputChangeEmail(e) {
		const {value, name} = e.target;
		textform = value;
		textformsimple = textform.replace(/(<([^>]+)>)/ig, '');

		this.setState({
		    [name]: textformsimple
		});
	}

	handleInputChangePassword(e) {
		const {value, name} = e.target;
		textform = value;
		textformsimple = textform.replace(/(<([^>]+)>)/ig, '');

		this.setState({
			[name]: textformsimple
		});
	}

  	handlerRegistrarUser(e){
		e.preventDefault();
		var nameform = this.state.name;
		var nameformsimple = nameform.replace(/(<([^>]+)>)/ig, '');
		var emailform = this.state.email;
		var emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
		var passwordform = this.state.password;
		var passwordformsimple = passwordform.replace(/(<([^>]+)>)/ig, '');
		var expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		const { match: {params} } = this.props;

		if(nameformsimple !== ' ' && nameformsimple !== ''){
			if(emailformsimple !== ' ' && emailformsimple !== ''){
				if(passwordformsimple !== ' ' && passwordformsimple !== ''){
					if(expresion_correo.test(emailformsimple)){
						const valores = {name: nameformsimple, email: emailformsimple, password: passwordformsimple, unicopost: params.emailId }
					 	fetch("/registered", {
							method: 'POST',
							body: JSON.stringify(valores),  
							headers:{
							  'Content-Type': 'application/json'
						 	}
						}).then(res => res.json())
					  	.then(response => this.handlerCodes(response.code, response.unique, response.mensajess, response.tokens))
					  	.catch(error => console.error('Error:', error));
				  	}else{
				  		this.setState({ mensaje: '[ ingresa un correo valido ]'});
				  	}
				}else{
					this.setState({ mensaje: '[ ingresa un contraseña ]' });
				}
			}else{
				this.setState({ mensaje: '[ ingresa un correo ]' });
			}
		}else{
			this.setState({ mensaje: '[ ingresa un nombre ]' });
		}
	}

	handlerCodes(e, i, c, z){
		if(e !== 'false'){
			var expiresdate = new Date(2020, 1, 2, 11, 20);
			expiresdate.toUTCString();

			const { cookies } = this.props;
			cookies.set('xyz', i + "_" + z, { path: '/', expires: expiresdate });
			cookies.set('estado', 'yes', { path: '/', expires: expiresdate });
			window.location = "/";
		}else{
			this.setState({ mensaje: c });
		}
	}

	render (){

		if(this.state.invitaciones != 'false'){
			return (
				<div className="container-fluid sinpadding App">
					<div className="container containersweaghe">
						<div className="row justify-content-center rowsweaghe p-4">
							<form onSubmit={this.handlerRegistrarUser} className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-6 p-2 align-self-center formsweaghe">
								<div className="form-group">
						            <input
						              type="name"
						              name="name"
						              className="form-control"
						              value={this.state.name}
						              onChange={this.handleInputChangeName}
						              placeholder="Ingresa un nombre"
						              required
						              />
					          	</div>
					          	<div className="form-group">
						            <input
						              type="email"
						              name="email"
						              className="form-control"
						              value={this.state.email}
						              onChange={this.handleInputChangeEmail}
						              placeholder="Ingresa un correo"
						              required
						              />
					          	</div>
					          	<div className="form-group">
						            <input
						              type="password"
						              name="password"
						              className="form-control"
						              value={this.state.password}
						              onChange={this.handleInputChangePassword}
						              placeholder="Ingresa una contraseña"
						              required
						              />
					          	</div>
					          	<div className="form-group mensajesweaghe">
					          		{this.state.mensaje}
					          	</div>
					          	<button type="submit" className="btn btn-primary">Registrar</button>
							</form>
						</div>
					</div>
				</div>
			);
		}else{
			return (
				<div className="container containersweaghe">
					<div className="row justify-content-center rowsweaghe p-4">
						<Invalid onAddName={this.state.validar} onAddTexto={'¡Lo sentimos, la invitación no existe!'} />
					</div>
				</div>
			);
		}
	}
}

export default withCookies(Invitation);