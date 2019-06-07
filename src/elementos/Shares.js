import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../css/shares.css';

function isInPage(node) { return (node === document.body) ? false : document.body.contains(node); }
function _xcreate(a){ return document.createElement(a); }
function _xuma(a){ return document.getElementById(a); }

function HandlerTA(){
	if(typeof _xuma('imagecompart').files[0] !== null){
		var archivo = _xuma('imagecompart').files[0].size || '';
		return archivo;
	}else{
		_xuma('imagecompart').value = "";
	}
}

function HandlerExtension() {
	if(typeof _xuma('imagecompart').files[0] !== null){
		var extensiones = _xuma('imagecompart').files[0].type || '';
		return extensiones;
	}else{
		_xuma('imagecompart').value = "";
	}
}

class Shares extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor(props){
		super(props);

		this.state = {
			name: this.props.onAddPName?this.props.onAddPName: '',
			email: this.props.onAddPEmail?this.props.onAddPEmail: '',
			contens: '',
			mensaje: '',
			cambio: 'c1',
			botonerror: false,
			code: this.props.onAddCode?this.props.onAddCode: '',
			perfil: this.props.onAddPPerfil?this.props.onAddPPerfil: '',
		}

		this.handlerPublicar = this.handlerPublicar.bind(this);
		this.handlerChangeInput = this.handlerChangeInput.bind(this);
		this.handlerCambiarImagenShares = this.handlerCambiarImagenShares.bind(this);
		this.handlerCambio = this.handlerCambio.bind(this);
	}

	handlerPublicar(e){
		e.preventDefault();
		var contensform = this.state.contens;
		var contensformsimple = contensform.replace(/(<([^>]+)>)/ig, '');
		var archivoform = _xuma("imagecompart").value;

		if(contensform !== ' ' && contensformsimple !== ''){
			if(archivoform !== ' ' && archivoform !== ''){
				if(_xuma('imagecompart').files[0]) {
			        if(HandlerTA() !== ''){
						if(HandlerTA() < 3000000){
							if(HandlerExtension() !== ''){
								if(HandlerExtension() === 'image/jpeg' || HandlerExtension() === 'image/png'){
									this.setState({
										botonerror: true,
										mensaje: '[ publicando ... ]'
									});
									fetch("/share", {
										method: 'POST', 
										body: new FormData(e.target)
									}).then(res => res.json())
									.then(response => this.handlerContenido(response.alerta, response.state, response.publication) )
									.catch(error => console.error('Error:', error));
								}else{
									this.setState({ mensaje: '[ elige imagenes JPG y PNG ]'});
								}
							}else{
								this.setState({ mensaje: '[ elige imagenes JPG y PNG ]'});
							}
						}else{
							this.setState({ mensaje: '[ elige una imagen menor a 3MB ]'});
						}
					}else{
						this.setState({ mensaje: '[ elige una imagen menor a 3MB ]'});
					}
				}else{
					this.setState({ mensaje: '[ selecciona una imagen ]'});
					var imagenshare = _xuma("imagenshare");
					imagenshare.setAttribute("style", "width: 45px; height: 45px;");
				}
			}else{
				this.setState({ mensaje: '[ elige un archivo ]'});
			}
		}else{
			this.setState({ mensaje: '[ ingresa un comentario ]'});
		}
	}

	handlerContenido(e, a, b){
		if(e == 'false'){
			this.setState({ mensaje: 'intentalo de nuevo', botonerror: false });
		}else{
			if(b.entregado == "true"){
				if(a === 'true'){
					this.props.onAddCambio(this.state.cambio, b);
					this.setState({ contens: '', mensaje: e, botonerror: false });
					_xuma('contens').value = "";
					_xuma('imagecompart').value = "";
					var imagenshare = _xuma("imagenshare");
					imagenshare.setAttribute("style", "width: 45px; height: 45px;");

					var caja = _xuma("unique");
					var caja2 = _xuma("name");
					var caja3 = _xuma("perfil");
					if (typeof caja.remove === 'function'){
						caja.remove();
					}else{
						caja.parentNode.removeChild(caja);
					}

					if (typeof caja2.remove === 'function'){
						caja2.remove();
					}else{
						caja2.parentNode.removeChild(caja2);
					}

					if (typeof caja3.remove === 'function'){
						caja3.remove();
					}else{
						caja3.parentNode.removeChild(caja3);
					}
				}else{
					this.setState({ mensaje: e });
				}
			}
		}
	}

	handlerChangeInput(e){
		const {value, name} = e.target;
		var contensform = value;
		var contensformsimple = contensform.replace(/(<([^>]+)>)/ig, '');

		this.setState({
			[name]: contensformsimple
		});
	}

	handlerCambiarImagenShares(e){
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			if(HandlerTA() !== ''){
				if(HandlerTA() < 3000000){
					if(HandlerExtension() !== ''){
						if(HandlerExtension() === 'image/jpeg' || HandlerExtension() === 'image/png'){
							var reader = new FileReader();

							reader.onload = function (e) {
								var imagenshare = _xuma("imagenshare");
								imagenshare.setAttribute("style", "width: 45px; height: 45px; border-radius: 50%; background: url(" + e.target.result + ") center center / cover no-repeat rgb(255, 255, 255);");
							}

							reader.readAsDataURL(e.target.files[0]);

							this.setState({ mensaje: ''});

							if(isInPage(_xuma("unique")) && isInPage(_xuma("name")) && isInPage(_xuma("perfil"))){}else{
								var caja = _xuma("sharex");
								var input = _xcreate("input");
								input.setAttribute("type", "text");
						        input.setAttribute("id", "unique");
						        input.setAttribute("name", "unique");
						        input.setAttribute("style", "display: none;");
						        input.setAttribute("value", this.state.code);
						        caja.appendChild(input);

						        var input2 = _xcreate("input");
								input2.setAttribute("type", "text");
						        input2.setAttribute("id", "name");
						        input2.setAttribute("name", "name");
						        input2.setAttribute("style", "display: none;");
						        input2.setAttribute("value", this.state.name);
						        caja.appendChild(input2);

						        var input3 = _xcreate("input");
								input3.setAttribute("type", "text");
						        input3.setAttribute("id", "perfil");
						        input3.setAttribute("name", "perfil");
						        input3.setAttribute("style", "display: none;");
						        input3.setAttribute("value", this.state.perfil);
						        caja.appendChild(input3);
						    }
						}else{
							this.setState({ mensaje: '[ elige imagenes JPG y PNG ]'});
						}
					}else{
						this.setState({ mensaje: '[ elige imagenes JPG y PNG ]'});
					}
				}else{
					this.setState({ mensaje: '[ elige una imagen menor a 3MB ]'});
				}
			}else{
				this.setState({ mensaje: '[ elige una imagen menor a 3MB ]'});
			}
		}else{
			this.setState({ mensaje: '[ selecciona una imagen ]'});
			var imagenshare = _xuma("imagenshare");
			imagenshare.setAttribute("style", "width: 45px; height: 45px;");
		}
	}

	handlerCambio(){
  		this.props.onAddCambio(this.state.cambio);
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
		return (
			<div className="formularioshares" style={{ display: this.props.onAddActivador }}>
				<form id="sharex" onSubmit={this.handlerPublicar} className="row sinmarging">
					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-4 p-2 pb-3 fondocompartir align-self-center sinpadding">
						<div className="row sinmarging">
							<textarea id="contens" name="contens" value={this.state.contens} onChange={this.handlerChangeInput} placeholder="Ingresa un comentario" />
						</div>

						<div className="row sinmarging">
							<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2 mb-2 mensaje sinpadding">{this.state.mensaje}</div>
							<div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 fondocompartir sinpadding align-self-center">
								<div className="row sinmarging">
									<label className="sinpadding sinmarging" htmlFor="imagecompart"></label>
									<div id="imagenshare" className="imgmini"></div>
									<input type="file" id="imagecompart" name="imagecompart" className="perfil" accept=".png, .jpg, .jpeg" onChange={this.handlerCambiarImagenShares} />
								</div>
							</div>
							<div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 fondocompartir sinpadding">
								<select id="privacity" name="privacity" className="custom-select shares">
								  	<option value="0">Publico</option>
								  	<option value="1">Privado</option>
								</select>
								<button type="submit" className="shares mt-3 btn btn-primary" disabled={this.state.botonerror}>Publicar</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withCookies(Shares);