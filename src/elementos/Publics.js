import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../css/publics.css'

function isInPage(node) { return (node === document.body) ? false : document.body.contains(node); }
function _xcreate(a){ return document.createElement(a); }
function _xuma(a){ return document.getElementById(a); }

function HandlerTA(){
	if(typeof _xuma('image').files[0] !== null){
		var archivo = _xuma('image').files[0].size || '';
		return archivo;
	}else{
		_xuma('image').value = "";
	}
}

function HandlerExtension() {
	if(typeof _xuma('image').files[0] !== null){
		var extensiones = _xuma('image').files[0].type || '';
		return extensiones;
	}else{
		_xuma('image').value = "";
	}
}

class Publics extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor(props){
		super(props);

		this.state = {
			name: this.props.onAddPName?this.props.onAddPName: '',
			email: this.props.onAddPEmail?this.props.onAddPEmail: '',
			perfil: this.props.onAddPPerfil?this.props.onAddPPerfil: '',
			vista: '',
			mensaje: '',
			mensajeinvitacion: '',
			mensajecontrasena: '',
			valido: '',
			emailinvitacion: '',
			botonerror: false,
			passantiguo: '',
			passnuevo: '',
			code: this.props.onAddCode?this.props.onAddCode: '',
			mensajeimgperfiles: ''
		}

		this.handlerOnOver = this.handlerOnOver.bind(this);

		this.handlerEnviar = this.handlerEnviar.bind(this);
		this.handlerCambiarPassword = this.handlerCambiarPassword.bind(this);
		this.handlerInvitacion = this.handlerInvitacion.bind(this);
		this.handlerCambiarPass = this.handlerCambiarPass.bind(this);
		this.handlerCambiarImagen = this.handlerCambiarImagen.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handlerAlertaInvitados = this.handlerAlertaInvitados.bind(this);
	}

	handlerOnOver(){
		this.setState({
			vista: 'ok'
		});
	}

	handlerEnviar(e){
		e.preventDefault();
		var nameform = this.state.name;
		var nameformsimple = nameform.replace(/(<([^>]+)>)/ig, '');
		var emailform = this.state.email;
		var emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
		var expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if(nameform !== ' ' && nameformsimple !== ''){
			if(emailform !== ' ' && emailformsimple !== ''){
				if(expresion_correo.test(emailformsimple)){
					this.setState({
						botonerror: true,
						mensaje: '[ guardando ... ]'
					});

					const valores = { unique: this.state.code, msnname: nameformsimple, msnemail: emailformsimple };
					fetch("/update", {
						method: 'POST',  
						body: JSON.stringify(valores),  
						headers:{
							'Content-Type': 'application/json'
						}
					}).then(res => res.json())
					.then(response => this.handlerCambiar(response.mensaje, response.valido, response.entregado))
					.catch(error => console.error('Error:', error));

					this.props.onAddCambio(this.state);
				}else{
					this.setState({ mensaje: '[ ingresa un correo valido ]' });
				}
			}else{
				this.setState({ mensaje: '[ ingresa un correo ]' });
			}
		}else{
			this.setState({ mensaje: '[ ingresa un nombre ]' });
		}
	}

	handlerCambiarPassword(e){
		e.preventDefault();
		var passantiguoform = this.state.passantiguo;
		var passantiguoformsimple = passantiguoform.replace(/(<([^>]+)>)/ig, '');
		var passnuevoform = this.state.passnuevo;
		var passnuevoformsimple = passnuevoform.replace(/(<([^>]+)>)/ig, '');

		if(passantiguoform !== ' ' && passantiguoformsimple !== ''){
			if(passnuevoform !== ' ' && passnuevoformsimple !== ''){
				this.setState({
					botonerror: true,
					mensajecontrasena: '[ validando ... ]'
				});

				const valores = { unique: this.state.code, antiguo: passantiguoformsimple, nuevos: passnuevoformsimple };
				fetch("/changepass", {
					method: 'POST',  
					body: JSON.stringify(valores),  
					headers:{
						'Content-Type': 'application/json'
					}
				}).then(res => res.json())
				.then(response => this.handlerCambiarPass(response.estado, response.sesion, response.entregado))
				.catch(error => console.error('Error:', error));

				this.props.onAddCambio(this.state);
			}else{
				this.setState({ mensajecontrasena: '[ ingresa una contraseña ]' });
			}
		}else{
			this.setState({ mensajecontrasena: '[ ingresa una contraseña ]' });
		}
	}

	handlerInvitacion(e){
		e.preventDefault();
		var nameform = this.state.name;
		var nameformsimple = nameform.replace(/(<([^>]+)>)/ig, '');
		var emailform = this.state.emailinvitacion;
		var emailformsimple = emailform.replace(/(<([^>]+)>)/ig, '');
		var emailforms = this.state.email;
		var emailformsimples = emailforms.replace(/(<([^>]+)>)/ig, '');
		var expresion_correo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if(emailform !== ' ' && emailformsimple !== ''){
			if(emailforms !== ' ' && emailformsimple !== ''){
				if(expresion_correo.test(emailformsimple)){
					this.setState({
						botonerror: true,
						mensajeinvitacion: '[ procesando ... ]'
					});

					const valores = { unique: this.state.code, name: nameformsimple, emailunico: emailformsimples, msnemail: emailformsimple };
					fetch("/sendinvitations", {
						method: 'POST',  
						body: JSON.stringify(valores),  
						headers:{
							'Content-Type': 'application/json'
						}
					}).then(res => res.json())
					.then(response => this.handlerAlertaInvitados(response.estado, response.sesion, response.entregado))
					.catch(error => console.error('Error:', error));

					this.props.onAddCambio(this.state);
				}else{
					this.setState({ mensajeinvitacion: '[ ingresa un correo valido ]' });
				}
			}else{
				this.setState({ mensajeinvitacion: '[ ¡Lo sentimos, intentalo más tarde! ]' });
			}
		}else{
			this.setState({ mensajeinvitacion: '[ ingresa un correo ]' });
		}
	}

	handleInputChange(e) {
		const {value, name} = e.target;
		var nameform = value;
		var nameformsimple = nameform.replace(/(<([^>]+)>)/ig, '');

		this.setState({
		    [name]: nameformsimple
		});
	}

	handlerCambiarImagen(e){
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
	        if(HandlerTA() !== ''){
				if(HandlerTA() < 3000000){
					if(HandlerExtension() !== ''){
						if(HandlerExtension() === 'image/jpeg' || HandlerExtension() === 'image/png'){
							this.setState({
								botonerror: true,
								mensajeimgperfiles: '[ subiendo ... ]'
							});

							if(isInPage(_xuma("unique"))){}else{
								var formulario = _xuma("imagencontacto");
								var input = _xcreate("input");
								input.setAttribute("type", "text");
						        input.setAttribute("id", "unique");
						        input.setAttribute("name", "unique");
						        input.setAttribute("style", "display: none;");
						        input.setAttribute("value", this.state.code);
						        formulario.appendChild(input);
					    	}

					        var formulario2 = _xuma("imagencontacto");

							fetch("/upload", {
								method: 'POST',  
								body: new FormData(formulario2)
							}).then(res => res.json())
							.then(response => this.handlerValidar(response.message, response.texto))
							.catch(error => console.error('Error:', error));
							var reader = new FileReader();

					        reader.onload = function (e) {
					            var perfilimg = _xuma("perfilimg");
						        var fotousuario = _xuma("fotousuario");
						        perfilimg.setAttribute("style", "width: 150px; height: 150px; border-radius: 50%; background: url(" + e.target.result + ") center center / cover no-repeat rgb(255, 255, 255); margin: auto;");
						        fotousuario.setAttribute("style", "width: 150px; height: 150px; border-radius: 50%; background: url(" + e.target.result + ") center center / cover no-repeat rgb(255, 255, 255); margin: auto;");
					        }

					        reader.readAsDataURL(e.target.files[0]);

					        _xuma('image').value = "";
						}else{
							this.setState({ mensajeimgperfiles: '[ elige imagenes JPG y PNG ]'});
						}
					}else{
						this.setState({ mensajeimgperfiles: '[ elige imagenes JPG y PNG ]'});
					}
				}else{
					this.setState({ mensajeimgperfiles: '[ elige una imagen menor a 3MB ]'});
				}
			}else{
				this.setState({ mensajeimgperfiles: '[ elige una imagen menor a 3MB ]'});
			}
	    }else{
	    	this.setState({ mensajeimgperfiles: '[ selecciona una imagen ]'});
	    }
	}

	handlerValidar(b, i){
		console.log(b, i);
		if(b == 'false'){
			var caja = _xuma("unique");
			if (typeof caja.remove === 'function'){
				caja.remove();
			}else{
				caja.parentNode.removeChild(caja);
			}

			this.setState({
				botonerror: false,
				mensajeimgperfiles: 'intentalo de nuevo'
			});
		}else{
			var caja = _xuma("unique");
			if (typeof caja.remove === 'function'){
				caja.remove();
			}else{
				caja.parentNode.removeChild(caja);
			}

			this.setState({
				botonerror: false,
				mensajeimgperfiles: i
			});
		}
	}

	handlerCambiar(a, b, z){
		if(b == 'false'){
			this.setState({ mensaje: 'intentalo de nuevo', botonerror: false });
		}else{
			if(z == "true"){
				this.setState({ mensaje: a, valido: b, botonerror: false });
			}
		}
	}

	handlerAlertaInvitados(t, b, c){
		if(b == "false"){
			this.setState({ mensajeinvitacion: 'intentalo de nuevo', botonerror: false });
		}else{
			if(c == "true"){
				this.setState({
					mensajeinvitacion: t,
					botonerror: false,
					emailinvitacion: ''
				});
			}
		}
	}

	handlerCambiarPass(t, b, c){
		if(b == "false"){
			this.setState({ mensajecontrasena: 'intentalo de nuevo', botonerror: false });
		}else{
			if(c == "true"){
				this.setState({
					mensajecontrasena: t,
					botonerror: false
				});
			}
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

	render (){
		let imagenuser = { background: 'url(' + this.state.perfil + ') center center / cover no-repeat' };

		const mostrarcontenedor = (function (){
			if(this.state.vista !== ''){
				return (
					<div className="cpfondo">
						<div className="cp"></div>
						<div className="cptexto">Cambiar</div>
						<input type="file" id="image" name="image" className="perfil" accept=".png, .jpg, .jpeg" onChange={this.handlerCambiarImagen} />
					</div>
				);
			}
		}).bind(this)();

		return (
			<div className="formulariopublics" style={{ display: this.props.onAddActivador }}>
				<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 align-self-center sinpadding">
					<h5><b>Ajustes del perfil</b></h5>
				</div>
				<form id="imagencontacto" className="row sinmarging">
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 sinpadding align-self-center">
						<h5>Imagen: </h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 align-self-center sinpadding">
						<div id="perfilimg" style={imagenuser} className="imagenuser3" onMouseOver={this.handlerOnOver}></div>
						{mostrarcontenedor}
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding"></div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding">
						<div id="mensajepublics">{this.state.mensajeimgperfiles}</div>
					</div>
				</form>
				<form onSubmit={this.handlerEnviar} className="row sinmarging">
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 align-self-center sinpadding">
						<h5>Nombre: </h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 sinpadding">
						<input type="text" id="name" name="name" value={this.state.name} onChange={this.handleInputChange} />
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 align-self-center sinpadding">
						<h5>Correo: </h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 sinpadding">
						<input type="email" id="email" name="email" value={this.state.email} onChange={this.handleInputChange} />
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding"></div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding">
						<div id="mensajepublics">{this.state.mensaje}</div>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 sinpadding"></div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 sinpadding align-self-center">
						<button type="submit" className="datosuser btn btn-primary" disabled={this.state.botonerror}>Modificar</button>
					</div>
				</form>
				<form onSubmit={this.handlerCambiarPassword} className="row sinmarging mt-5">
					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 align-self-center sinpadding">
						<h5><b>Actualizar contraseña</b></h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 align-self-center sinpadding">
						<h5>Contraseña antigua: </h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 sinpadding">
						<input type="password" id="passantiguo" name="passantiguo" value={this.state.passantiguo} onChange={this.handleInputChange} />
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 align-self-center sinpadding">
						<h5>Contraseña nueva: </h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 sinpadding">
						<input type="password" id="passnuevo" name="passnuevo" value={this.state.passnuevo} onChange={this.handleInputChange} />
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding"></div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding">
						<div id="mensajepublics">{this.state.mensajecontrasena}</div>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 sinpadding"></div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 sinpadding align-self-center">
						<button type="submit" className="datosuser btn btn-primary" disabled={this.state.botonerror}>Actualizar contraseña</button>
					</div>
				</form>
				<form onSubmit={this.handlerInvitacion} className="row sinmarging mt-5">
					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 align-self-center sinpadding">
						<h5><b>Enviar invitación</b></h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 align-self-center sinpadding">
						<h5>Correo: </h5>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-4 sinpadding">
						<input type="email" id="emailinvitacion" name="emailinvitacion" value={this.state.emailinvitacion} onChange={this.handleInputChange} placeholder="Ingresa un correo" />
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding"></div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-2 sinpadding">
						<div id="mensajepublics">{this.state.mensajeinvitacion}</div>
					</div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 sinpadding"></div>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 sinpadding align-self-center">
						<button type="submit" className="datosuser btn btn-primary" disabled={this.state.botonerror}>Enviar invitación</button>
					</div>
				</form>
			</div>
		);
	}
}

export default withCookies(Publics);