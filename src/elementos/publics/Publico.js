import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import '../../css/info.css';
import buscar from '../../buscar.png';
import foto from '../../cerrar.png';

import SocketIo from '../publics/SocketIo';
import History from '../publics/History';

const { resultado } = {"resultado":[{"msnunique":"","msnname":"","msnperfil":""}]};

class Publico extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor(props){
		super(props);

		this.state = {
			name: this.props.onAddName?this.props.onAddName: '',
			perfil: this.props.onAddPerfil + "?" + Math.random(),
			cambio: 'c1',
			img: '',
			content: '',
			activador: 'block',
			quitador: 'none',
			existes: this.props.onAddExiste?this.props.onAddExiste: '',
			session: this.props.onAddSessiones?this.props.onAddSessiones: '',
			ocultar: '',
			palabra: '',
			resultado,
			display: 'none'
		}

		this.handlerSharepMas = this.handlerSharepMas.bind(this);
		this.handlerPostselect = this.handlerPostselect.bind(this);
		this.handlerAgregarContactos = this.handlerAgregarContactos.bind(this);
		this.handlerQuitarContactos = this.handlerQuitarContactos.bind(this);
		this.handlerRespuestaServidor = this.handlerRespuestaServidor.bind(this);
		this.handlerRespuestaServidoress = this.handlerRespuestaServidoress.bind(this);
		this.handlerContactosCambiar = this.handlerContactosCambiar.bind(this);
		this.handlerSession = this.handlerSession.bind(this);
		this.handlerSalirApp = this.handlerSalirApp.bind(this);
		this.handlerBuscarse = this.handlerBuscarse.bind(this);
		this.handlerChange = this.handlerChange.bind(this);
		this.handlerUsuariosBuscados = this.handlerUsuariosBuscados.bind(this);
		this.handlerBusqueda = this.handlerBusqueda.bind(this);
		this.handlerOcultarBusqueda = this.handlerOcultarBusqueda.bind(this);
	}

	handlerAgregarContactos(a){
		if(this.state.session != 'false'){
			const input = { secret: this.state.session, secretcontact: this.props.onAddUnique };
			fetch("/add", {
				method: 'POST',
				credentials: 'same-origin',
				body: JSON.stringify(input), 
				headers:{
					'Content-Type': 'application/json'
				}
			}).then(res => res.json())
			.then(response => this.handlerRespuestaServidoress(response.message))
			.catch(error => console.error('Error:', error));
		}else{
			this.handlerCerrarSesiones("true");
		}
	}

	handlerQuitarContactos(b){
		if(this.state.session != 'false'){
			const input = { secret: this.state.session, secretcontact: this.props.onAddUnique };
			fetch("/delete", {
				method: 'POST',
				credentials: 'same-origin',
				body: JSON.stringify(input), 
				headers:{
					'Content-Type': 'application/json'
				}
			}).then(res => res.json())
			.then(response => this.handlerRespuestaServidor(response.message))
			.catch(error => console.error('Error:', error));
		}else{
			this.handlerCerrarSesiones("true");
		}
	}

	handlerRespuestaServidor(c){
		if(c.conexion == 'true'){
			this.setState({
				ocultar: 'false',
				existes: 'false'
			});
		}
	}

	handlerRespuestaServidoress(c){
		if(c.conexion == 'true'){
			this.setState({
				ocultar: 'false',
				existes: 'true'
			});
		}
	}

	handlerContactosCambiar(count){
		this.setState({
			ocultar: count
		});
	}

	handlerSession(count){
		this.setState({
			session: count
		});
	}

	handlerSalirApp(){
		const valores = { email: '', password: '' }
		fetch("/exit", {
			method: 'POST',
			body: JSON.stringify(valores),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerCerrarSesiones(response.session))
		.catch(error => console.error('Error:', error));
	}

	handlerCerrarSesiones(e){
		if(e == 'true'){
			var expiresdate = new Date(1970, 1, 2, 11, 20);
			expiresdate.toUTCString();

			const { cookies } = this.props;
			cookies.set('xyz', '', { path: '/', expires: expiresdate });
			cookies.set('estado', '', { path: '/', expires: expiresdate });

		    window.location =  "/";
		}
	}

	handlerBuscarse(e){
		e.preventDefault();
	}

	handlerChange(e){
    	const {value, name} = e.target;
		var contensform = value;
		var contensformsimple = contensform.replace(/(<([^>]+)>)/ig, '');

    	this.setState({
			[name]: contensformsimple
		});

		const input = { usuarios: contensformsimple };
		fetch("/buscadores", {
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify(input), 
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerUsuariosBuscados(response.resultado))
		.catch(error => console.error('Error:', error));
    }

    handlerUsuariosBuscados(l){
    	this.setState({
    		resultado: l
    	})
    }

    handlerBusqueda(){
    	this.setState({
    		display: 'block'
    	});
    }

    handlerOcultarBusqueda(){
    	this.setState({
    		display: 'none'
    	});
    }

	handlerSharepMas(count){
		this.props.onAddSharepMas({count: count.a, contador: count.contador, ultimateid: count.ultimateid });
	}

	handlerPostselect(e){
        this.props.onAddPostNews(e);
    }

	render() {
		let imagenuser = { background: 'url(' + this.state.perfil + ') center center / cover no-repeat' };
		let imagenbuscar = { width: '20px', height: '20px', float: 'right', margin: '5px', color: "#000000", background: 'url(' + buscar + ') center center / cover no-repeat' };

		const existecontactos = (function (){
			if(this.props.onAddUnique != this.state.session){
				if(this.state.existes == 'true'){
					return (
						<button type="button" className="datosuser btn btn-danger" style={{ width: 'auto' }} onClick={(e) => {this.handlerQuitarContactos(e)}}>Dejar de seguir</button>
					);
				}else{
					return (
						<button type="button" className="datosuser btn btn-primary" style={{ width: 'auto' }} onClick={(e) => {this.handlerAgregarContactos(e)}}>Seguir</button>
					);
				}
			}
		}).bind(this)();

		const sockeriovalido = (function (){
			if(this.state.session != 'false'){
				return (
					<SocketIo onAddOcultar={this.state.ocultar} onAddQuitar={this.handlerContactosCambiar} onAddSession={this.handlerSession} />
				);
			}
		}).bind(this)();

		const sesionsalir = (function (){
			if(this.state.session != 'false'){
				return (
					<a href="#?" className="salir" onClick={this.handlerSalirApp}><div style={{ float: 'right', margin: '0px 15px 0px 15px' }}>Salir</div></a>
				);
			}
		}).bind(this)();

		const resultado = this.state.resultado.map((res, i) => {

			if(res.msnname != ''){
				return (
					<div key={i} className="fondobusqueda">
						<a href={"/users/" + res.msnunique} className="row sinmarging sinpadding m-2">
							<div style={{ width: '50px', height: '50px', background: 'url(' + res.msnperfil + ') center center / cover no-repeat', borderRadius: '50%' }}></div>
							<div style={{ width: 'calc(100% - 50px)', height: '50px', padding: '10px', color: '#000000' }}>{res.msnname}</div>
						</a>
					</div>
				)
			}
		});

		const mostrarbusqueda = (function (){
			if(this.state.display == 'block'){
				return (
					<div>
						<Link to="#?" onClick={this.handlerOcultarBusqueda}><div className="fondobuscar"></div></Link>
						<div className="container containerfblancos sinpadding">
							<div className="fondoblancolo">
								<div className="row titulocontactotitulo sinmarging sinpadding">
									<div className="anchoopcionestitulo">
										<Link to="#?" onClick={this.handlerOcultarBusqueda}>
											<img src={foto} className="imgopcionestitulo" />
										</Link>
									</div>
								</div>
								<form onSubmit={this.handlerBuscarse} className="row fondoformulario sinmarging" autoComplete="off">
									<div className="fondobuscarcaj">
										<input type="text" id="palabra" name="palabra" placeholder="Ingresa un nombre" defaultValue={this.state.palabra} onChange={this.handlerChange} />
									</div>
								</form>
								<div className="resulusuarios">
									{resultado}
								</div>
							</div>
						</div>
					</div>
				);
			}
		}).bind(this)();

		return (
			<div className="container-fluid sinpadding" style={{ background: '#FFFFFF'}}>
				<div className="container sinpadding">
					<div className="row fondouser sinmarging">
						<div className="container sinpadding">
							<div className="row fondoappuser sinmarging">
								<a href="/"><div className="imagenappuser"></div></a>
								<a href="/"><div className="barraderechauser"></div></a>
								<div className="marcauser">
									<a href="/"><div style={{ float: 'left', color: "#000000" }}>Xumita</div></a>
									{sesionsalir}
									<Link to="#?" onClick={this.handlerBusqueda}><div style={imagenbuscar}></div></Link>
								</div>
							</div>
							<div className="row rowuser sinmarging">
								<div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
									<div id="fotousuario" style={imagenuser} className="imagenuser3"></div>
								</div>
								<div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
									<div className="datosuser">
										{this.state.name}
									</div>
									{existecontactos}
								</div>
							</div>
							<History onAddPName={this.state.name} onAddActivador={this.state.activador} onAddSharepMas={this.handlerSharepMas} onAddShars={this.props.onAddSharep} onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} onAddContador={this.props.onAddContador} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect} onAddContactSecret={this.props.onAddUnique} />
						</div>
					</div>
				</div>
				{sockeriovalido}
				{mostrarbusqueda}
			</div>
		);
	}
}

export default withCookies(Publico);