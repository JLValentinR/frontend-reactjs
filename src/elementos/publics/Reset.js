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

class Reset extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor(props){
		super(props);

		this.state = {
			invitaciones: 'false',
			validar: '',
			passantiguo: '',
			passnuevo: ''
		}

		this.handlerPost = this.handlerPost.bind(this);
		this.handleInputChangePassword = this.handleInputChangePassword.bind(this);
		this.handlerRegistrarUser = this.handlerRegistrarUser.bind(this);
		this.handlerCodes = this.handlerCodes.bind(this);
		this.handlerCerrarSesiones = this.handlerCerrarSesiones.bind(this);
		this.handlerRegresar = this.handlerRegresar.bind(this);
	}

	controller = new AbortController();

	componentDidMount() {
		const { match: {params} } = this.props;
		const input = { unicopost: params.restablecerId };
		fetch("/invitation2", {
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
		var antiguoform = this.state.passantiguo;
		var antiguoformsimple = antiguoform.replace(/(<([^>]+)>)/ig, '');
		var nuevoform = this.state.passnuevo;
		var nuevoformsimple = nuevoform.replace(/(<([^>]+)>)/ig, '');

		const { match: {params} } = this.props;

		if(antiguoformsimple !== ' ' && antiguoformsimple !== ''){
			if(nuevoformsimple !== ' ' && nuevoformsimple !== ''){
				if(antiguoformsimple == nuevoformsimple){
					const valores = { password: nuevoformsimple, unicopost: params.restablecerId }
					fetch("/changepasss", {
						method: 'POST',
						body: JSON.stringify(valores),  
						headers:{
							'Content-Type': 'application/json'
						}
					}).then(res => res.json())
					.then(response => this.handlerCodes(response.estado))
					.catch(error => console.error('Error:', error));
				}else{
					this.setState({ mensaje: '[ Las contraseñas no coinciden ]' });
				}
			}else{
				this.setState({ mensaje: '[ ingresa un correo ]' });
			}
		}else{
			this.setState({ mensaje: '[ ingresa un nombre ]' });
		}
	}

	handlerCodes(z){
		this.setState({ mensaje: z });
		this.handlerCerrarSesiones();
	}

	handlerCerrarSesiones(){
		var expiresdate = new Date(1970, 1, 2, 11, 20);
		expiresdate.toUTCString();

		const { cookies } = this.props;
	    cookies.set('xyz', "", { path: '/', expires: expiresdate });
		cookies.set('estado', "", { path: '/', expires: expiresdate });
	}

	handlerRegresar(){
		window.location =  "/";
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
						              type="password"
						              name="passantiguo"
						              className="form-control"
						              value={this.state.passantiguo}
						              onChange={this.handleInputChangePassword}
						              placeholder="Ingresa una contraseña"
						              required
						              />
					          	</div>
					          	<div className="form-group">
						            <input
						              type="password"
						              name="passnuevo"
						              className="form-control"
						              value={this.state.passnuevo}
						              onChange={this.handleInputChangePassword}
						              placeholder="Repite la contraseña"
						              required
						              />
					          	</div>
					          	<div className="form-group mensajesweaghe">
					          		{this.state.mensaje}
					          	</div>
					          	<button type="submit" className="btn btn-primary">Restablecer</button>
					          	&nbsp;&nbsp;<button type="button" className="btn btn-info" onClick={this.handlerRegresar}>Iniciar sesión</button>
							</form>
						</div>
					</div>
				</div>
			);
		}else{
			return (
				<div className="container containersweaghe">
					<div className="row justify-content-center rowsweaghe p-4">
						<Invalid onAddName={this.state.validar} onAddTexto={'¡Lo sentimos, la solicitud no existe!'} />
					</div>
				</div>
			);
		}
	}
}

export default withCookies(Reset);