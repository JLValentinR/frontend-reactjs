import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Invalid from './Invalid';

import atrasimg from '../../atras.png';
import '../../css/details.css';
import '../../App.css';
import '../../css/formulario.css';

import favorito from '../../ficono.png';
import favoritos2 from '../../ficono2.png';
import publicoiconos from '../../publico.png';
import privadoiconos from '../../privado.png';

function fecha(params){
	if (params < 10) {
		params = '0' + params; 
	}
	return params;
}

class Details extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor(props){
		super(props);

		this.state = {
			content: '',
			name: 'vacio',
			image: '',
			perfil: '',
			msnunique: '',
			valorfavo: '',
			agregado: 'false',
			postprivacity: '',
			dia: '',
			hora: ''
		}

		this.handlerPost = this.handlerPost.bind(this);
		this.handlerAgregar = this.handlerAgregar.bind(this);
		this.handlerFavorito = this.handlerFavorito.bind(this);
		this.handlerQuitarFavoritoss = this.handlerQuitarFavoritoss.bind(this);
		this.handlerFavoritoBorrar = this.handlerFavoritoBorrar.bind(this);
	}

	controller = new AbortController();

	componentDidMount() {
		const { match: {params} } = this.props;
		const { cookies } = this.props;
		const input = { unique: cookies.get('xyz'), unicopost: params.postId };
		fetch("/postal", {
			signal: this.controller.signal,
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify(input), 
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerPost(response.sharep, response.favoritos))
		.catch(error => console.error('Error:', error));

		this.props.onAddPostNews(params.postId);
  	}

  	componentWillUnmount(){
	    this.controller.abort();
	}

  	handlerPost(post, favoritos){
  		this.setState({
  			content: post[0].msnconten, 
  			name: post[0].msnname, 
  			image: post[0].msnimage, 
  			perfil: post[0].msnperfil,
  			msnunique: post[0].msnunique,
  			valorfavo: favoritos.cantidad,
  			agregado: favoritos.usuario,
  			postprivacity: post[0].msnprivacity,
  			dia: post[0].msnday,
  			hora: post[0].msntime
  		});
  	}

  	handlerAgregar(){
  		const { match: {params} } = this.props;
  		const { cookies } = this.props;
		const input = { unique: cookies.get('xyz'), unicopost: params.postId };
		fetch("/addfavorito", {
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify(input), 
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerFavorito(response.nuevo))
		.catch(error => console.error('Error:', error));
  	}

  	handlerFavorito(a){
  		if(a.sesion == 'true'){
	  		if(a.existe == 'true'){
	  			this.setState({
	  				agregado: 'true',
	  				valorfavo: (parseInt(this.state.valorfavo) + 1)
	  			});
	  		}
  		}else{
  			this.handlerCerrarSesiones();
  		}
  	}

  	handlerQuitarFavoritoss(){
  		const { match: {params} } = this.props;
  		const { cookies } = this.props;
		const input = { unique: cookies.get('xyz'), unicopost: params.postId };
		fetch("/deletefavorito", {
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify(input), 
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerFavoritoBorrar(response.nuevo))
		.catch(error => console.error('Error:', error));
  	}

  	handlerFavoritoBorrar(a){
  		if(a.sesion == 'true'){
	  		if(a.existe == 'true'){
	  			this.setState({
	  				agregado: 'false',
	  				valorfavo: (parseInt(this.state.valorfavo) - 1)
	  			});
	  		}
  		}else{
  			this.handlerCerrarSesiones();
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
		let perfil = { background: 'url(' + this.state.perfil + '?' + Math.random() + ') center center / cover no-repeat' };
		let atras = { background: 'url(' + atrasimg + ') center center / cover no-repeat' };
		let publico = { background: 'url(' + publicoiconos + ') center center / cover no-repeat', width: '20px', height: '20px', margin: '15px' };
		let privado = { background: 'url(' + privadoiconos + ') center center / cover no-repeat', width: '20px', height: '20px', margin: '15px' };

		const agregado = (function (){
			if(this.state.agregado == 'false'){
				return (
					<Link to="#?"><img src={favorito} onClick={this.handlerAgregar} className="favorito" /></Link>
				);
			}else{
				return (
					<Link to="#?"><img src={favoritos2} onClick={this.handlerQuitarFavoritoss} className="favorito" /></Link>
				);
			}
		}).bind(this)();

		const privacidadess = (function (){
			if(this.state.postprivacity == 1){
				return (
					<div style={privado}></div>
				);
			}else{
				return (
					<div style={publico}></div>
				);
			}
		}).bind(this)();

		if(this.state.name != 'vacio'){
			return (
				<div className="fondetails">
					<div className="row justify-content-center" style={{ margin: 0, padding: 0 }}>
						<div className="col-12 col-sm-12 col-md-9 col-lg-7 col-xl-5 colzoom" style={{ padding: '0', margin: '0' }}>
							<div className="wrapper2">
								<Link to={"/users/" + this.state.msnunique} className="row m-1" style={{ textDecoration: "none" }}>
									<div className="atrasdetails" style={atras}></div>
									<div className="atrasdetailstitulo align-self-center">Fotos</div>
								</Link>
								<div className="row m-2" style={{ color: "#000000" }}>
									<Link to={"/users/" + this.state.msnunique} className="row ml-2" style={{ color: "#000000", textDecoration: "none", width: 'calc(100% - 50px)' }}>
										<div className="perfildetails" style={perfil}></div>
										<div className="col align-self-center p-0 pl-2">{this.state.name}</div>
									</Link>
									{privacidadess}
								</div>
								<img src={this.state.image} className="square2" />
								<div className="anchofavoritos ml-2" style={{ lineHeight: '50px' }}>
									{this.state.dia}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.hora}
								</div>
								<div className="anchofavoritos ml-2 mr-2">
									<div className="row" style={{ padding: '0', margin: '0' }}>
										{agregado}
										<div className="favototal">{this.state.valorfavo}</div>
									</div>
								</div>
								<h5 className="m-2">{this.state.content}</h5>
								<div className="piesmargin"></div>
							</div> 
						</div>
					</div>
				</div>
			);
		}else{
			return (
				<div className="container containersweaghe">
					<div className="row justify-content-center rowsweaghe p-4">
						<Invalid onAddName={this.state.image} onAddTexto={'-_- lo sentimos no se encontro el post'} />
					</div>
				</div>
			);
		}
	}
}

export default withCookies(Details);