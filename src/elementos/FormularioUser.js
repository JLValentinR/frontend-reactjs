import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import '../css/formulario.css';

let textform = '', textformsimple = '';

class FormularioUser extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor() {
		super();
		this.state = {
			email: '',
			name: '',
			perfil: '',
			password: '',
			mensaje: '',
			restablecer: '1',
			emailcode: '',
			mensajecorreo: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlerCode = this.handlerCode.bind(this);
		this.handlerRestablecer = this.handlerRestablecer.bind(this);
		this.handlerMensajeEmail= this.handlerMensajeEmail.bind(this);
		this.handleInputChangeEmail = this.handleInputChangeEmail.bind(this);
		this.handleInputChangePassword = this.handleInputChangePassword.bind(this);
	}

	handleSubmit(e){
		e.preventDefault();
		var emailform = this.state.email;
		var emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
		var passwordform = this.state.password;
		var passwordformsimple = passwordform.replace(/(<([^>]+)>)/ig, '');
		var expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if(emailform !== ' ' && emailformsimple !== ''){
			if(passwordform !== ' ' && passwordformsimple !== ''){
				if(expresion_correo.test(emailformsimple)){
					this.setState({
						mensaje: '[ procesando ... ]'
					});
					const valores = {email: emailformsimple, password: passwordformsimple }
				 	fetch("/users", {
						method: 'POST',
						body: JSON.stringify(valores),  
						headers:{
						  'Content-Type': 'application/json'
					 	}
					}).then(res => res.json())
				  	.then(response => this.handlerCode(response.code, response.unique, response.tokens))
				  	.catch(error => console.error('Error:', error));

				  	this.props.onAddSessionFunction('false');
			  	}else{
			  		this.setState({ mensaje: '[ ingresa un correo valido ]'});
			  	}
			}else{
				this.setState({ mensaje: '[ ingresa un contraseña ]' });
			}
		}else{
			this.setState({ mensaje: '[ ingresa un correo ]' });
		}
	}

	handlerCode(e, h, c){
		if(e !== 'false'){
			var expiresdate = new Date(2020, 1, 2, 11, 20);
			expiresdate.toUTCString();

			const { cookies } = this.props;
			cookies.set('xyz', h + "_" + c, { path: '/', expires: expiresdate });
			cookies.set('estado', 'yes', { path: '/', expires: expiresdate });
			this.props.onAddActivar(this.state);
		}else{
			this.setState({ mensaje: '[ el usuario y/o contraseña incorrectos ]' });
		}
	}

	handlerRestablecer(e){
		e.preventDefault();
		var emailform = this.state.emailcode;
		var emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
		var expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if(emailform !== ' ' && emailformsimple !== ''){
			if(expresion_correo.test(emailformsimple)){
				this.setState({
					mensajecorreo: '[ procesando ... ]'
				});

				const valores = {email: emailformsimple }
				 fetch("/restablecer", {
					method: 'POST',
					body: JSON.stringify(valores),  
					headers:{
						'Content-Type': 'application/json'
					}
				}).then(res => res.json())
				.then(response => this.handlerMensajeEmail(response.estado))
				.catch(error => console.error('Error:', error));

				this.props.onAddSessionFunction('false');
			}else{
			  	this.setState({ mensajecorreo: '[ ingresa un correo valido ]'});
			}
		}else{
			this.setState({ mensajecorreo: '[ ingresa un correo ]' });
		}
	}

	handlerMensajeEmail(k){
		this.setState({ mensajecorreo: k });
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

	handlerOpcion(a, b){
		this.setState({
			restablecer: b
		});
	}

	render(){
		const iniciarsesion = (function (){
			if(this.state.restablecer == '1'){
				return (
					<div className="row justify-content-center rowsweaghe p-4">
						<form onSubmit={this.handleSubmit} className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-6 p-2 align-self-center formsweaghe" style={{ display: this.state.display }}>
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
						    <button type="submit" className="btn btn-primary">Iniciar sesión</button>
						    <button type="button" className="btn btn-info mt-2" onClick={(e) => {this.handlerOpcion(e, '2')}}>Restablecer contraseña</button>
						</form>
					</div>
				);
			}else{
				return (
					<div className="row justify-content-center rowsweaghe p-4">
						<form onSubmit={this.handlerRestablecer} className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-6 p-2 align-self-center formsweaghe" style={{ display: this.state.display }}>
							<div className="form-group">
						        <input
						            type="email"
						            name="emailcode"
						            className="form-control"
						            value={this.state.emailcode}
						            onChange={this.handleInputChangeEmail}
						            placeholder="Ingresa un correo"
						            required
						        />
					        </div>
						    <div className="form-group mensajesweaghe">
						        {this.state.mensajecorreo}
						    </div>
						    <button type="submit" className="btn btn-primary">Enviar código</button>
						    <button type="button" className="btn btn-danger mt-2" onClick={(e) => {this.handlerOpcion(e, '1')}}>Cancelar</button>
						</form>
					</div>
				);
			}
		}).bind(this)();

		return (
			<div className="container containersweaghe">
				{iniciarsesion}
			</div>
		);
	}
}

export default withCookies(FormularioUser);