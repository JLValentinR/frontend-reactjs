import React, { Component } from 'react';
import firebase from 'firebase/app';
import '@firebase/messaging';
import { Link } from 'react-router-dom';

import '../css/info.css';
import buscar from '../buscar.png';
import foto from '../cerrar.png';
import campanita from '../campanita.png';

import SocketNew from './SocketNew';
import History from './History';
import Shares from './Shares';
import Publics from './Publics';

const { resultado } = {"resultado":[{"msnunique":"","msnname":"","msnperfil":""}]};

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey("");

messaging.onMessage(function(payload) {
  	const notificationTitle = payload.data.title;
	const notificationOptions = {
		body: payload.data.body,
		icon: payload.data.icon,
		badge: payload.data.badge
	};
	var notification = new Notification(notificationTitle,notificationOptions);
});

function _xuma(a){ return document.getElementById(a); }

function getRegToken(argument) {
	navigator.serviceWorker.register('firebase-messaging-sw.js')
	.then(function (registration) {
	    messaging.useServiceWorker(registration);
	        
	    messaging.requestPermission()
	    .then(function() {
	      messaging.getToken()
	      .then(function(currentToken) {
	        if (currentToken) {
	          	saveToken(argument, currentToken);
	        } else {
	          	setTokenSentToServer(false);
	        }
	      })
	      .catch(function(err) {
	      		setTokenSentToServer(false);
	      });
	    })
	    .catch(function(err) {
	    });
	});

	messaging.onTokenRefresh(function() {
	  messaging.getToken()
	  .then(function(refreshedToken) {
	    setTokenSentToServer(false);
	    saveToken(argument, refreshedToken);
	  })
	  .catch(function(err) {
	  });
	});
}
function setTokenSentToServer(sent) {
	window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}
function isTokenSentToServer() {
	return window.localStorage.getItem('sentToServer') == 1;
}
function saveToken(code, currentToken) {
	const input = { unique: code, unicopost: currentToken };
	fetch("/addcodigo", {
		method: 'POST',
		credentials: 'same-origin',
		body: JSON.stringify(input), 
		headers:{
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())
	.then(response => response)
	.catch(error => console.error('Error:', error));
}

class InfoUser extends Component{
	constructor(props){
		super(props);

		this.state = {
			email: this.props.onAddEmail?this.props.onAddEmail: '',
			name: this.props.onAddName?this.props.onAddName: '',
			perfil: this.props.onAddPerfil + "?" + Math.random(),
			btnanterior: '',
			btn1: { background: '#3E9CF9', padding: '20px', border: '0' },
			btn2: { background: '#FFFFFF', padding: '20px', border: '0' },
			btn3: { background: '#FFFFFF', padding: '20px', border: '0' },
			contactos: 'none',
			cambio: 'c1',
			activador: 'block',
			quitador: 'none',
			palabra: '',
			resultado,
			display: 'none',
			mostrarbotonnotifi: '',
			instalaraplicacion: '',
			valido: 'false',
			code: this.props.onAddCode?this.props.onAddCode: ''
		}

		this.handlerCerrarse = this.handlerCerrarse.bind(this);
		this.handlerCambio = this.handlerCambio.bind(this);
		this.handlerBuscarse = this.handlerBuscarse.bind(this);
		this.handlerCambioOpcion2 = this.handlerCambioOpcion2.bind(this);
		this.handlerSalirApp = this.handlerSalirApp.bind(this);
		this.handlerSharepMas = this.handlerSharepMas.bind(this);
		this.handlerPostselect = this.handlerPostselect.bind(this);
		this.handlerChange = this.handlerChange.bind(this);
		this.handlerUsuariosBuscados = this.handlerUsuariosBuscados.bind(this);
		this.handlerBusqueda = this.handlerBusqueda.bind(this);
		this.handlerOcultarBusqueda = this.handlerOcultarBusqueda.bind(this);
		this.handlerActivarNotificaciones = this.handlerActivarNotificaciones.bind(this);
		this.removeTodo = this.removeTodo.bind(this);
		this.handlerSession = this.handlerSession.bind(this);
	}

	installPrompt = null;
	
	componentDidMount(){
		if (Notification.permission != "granted") {
			this.setState({
		        mostrarbotonnotifi: true
		    });
		}else if(Notification.permission == "denied") {
			this.setState({
		        mostrarbotonnotifi: true
		    });
		}else{
			/*messaging.onMessage(function(payload) {
				var notificationTitle = payload.data.title;
				var notificationOptions = {
				body: payload.data.body,
				icon: payload.data.icon,
				badge: payload.data.badge
				};
				var notification = new Notification(notificationTitle,notificationOptions);
				notification.onclick = function(event) {
				  	event.preventDefault();
				  	window.open('https://sweaghe.herokuapp.com');
				}
			});*/
		}

	    window.addEventListener('beforeinstallprompt',e=>{
	      e.preventDefault();
	      this.installPrompt = e;
	      if((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true){
	        return false;
	      }
	      this.setState({
	        instalaraplicacion: true
	      })
	    })
	}

	handlerCambiar(e, a, b){
		if(this.state.btnanterior !== ''){
			this.setState({
				[this.state.btnanterior]: { background: '#FFFFFF', padding: '20px', border: '0' },
				btnanterior: a,
				[a]: { background: '#3E9CF9', padding: '20px', border: '0' },
				cambio: b,
				valido: 'false'
			});
		}else{
			if(a !== 'btn1'){
				this.setState({
					btnanterior: a,
					btn1: { background: '#FFFFFF', padding: '20px', border: '0' },
					[a]: { background: '#3E9CF9', padding: '20px', border: '0' },
					cambio: b,
					valido: 'false'
				});
			}else{
				this.setState({
					btnanterior: a,
					[a]: { background: '#3E9CF9', padding: '20px', border: '0' },
					cambio: b,
					valido: 'false'
				});
			}
		}
	}

	handlerContactos(){
		this.setState({
			contactos: 'block',
			valido: 'true'
		});
	}

	handlerCerrarse(count, y){
		this.setState({
			contactos: count,
			valido: y
		});
	}

	handlerCambio(count){
		this.setState({
			name: count.name,
			email: count.email
		});
	}

	handlerBuscarse(e){
		e.preventDefault();
	}

	handlerCambioOpcion2(count, e){
		this.setState({
			btnanterior: "btn1",
			btn2: { background: '#FFFFFF', padding: '20px', border: '0' },
			btn1: { background: '#3E9CF9', padding: '20px', border: '0' },
			cambio: count
		});

		this.props.onAddNuevs(e);
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
			var cookies = document.cookie.split(";");

		    for (var i = 0; i < cookies.length; i++) {
		        var cookie = cookies[i];
		        var eqPos = cookie.indexOf("=");
		        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		    }

		    window.location =  "/";
		}
	}

	handlerSharepMas(count){
		this.props.onAddSharepMas({count: count.a, contador: count.contador, ultimateid: count.ultimateid });
	}

	handlerPostselect(e){
        this.props.onAddPostNews(e);
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

    handlerActivarNotificaciones(){
    	var codes = this.state.code;

    	getRegToken(codes);
    }

    installApp = async ()=>{
	    if(!this.installPrompt) return false;
	    this.installPrompt.prompt();
	    let outcome = await this.installPrompt.userChoice;
	    if(outcome.outcome=='accepted'){
	    }else{
	    }
	    this.installPrompt=null;
	    this.setState({
	      instalaraplicacion: false
	    })
	}

	removeTodo(index) {
        this.props.onAddQuitar(index);
    }

    handlerSession(e){
        this.props.onAddSessionFunction(e);
    }

	render() {
		let imagenuser = { background: 'url(' + this.state.perfil + ') center center / cover no-repeat' };
		let imagenbuscar = { width: '20px', height: '20px', float: 'right', margin: '5px', color: "#000000", background: 'url(' + buscar + ') center center / cover no-repeat' };

		const mostrarcomponent = (function (){
			if(this.state.cambio === 'c1'){
				return (
					<div>
						<History onAddPName={this.state.name} onAddActivador={this.state.activador} onAddSharepMas={this.handlerSharepMas} onAddShars={this.props.onAddSharep} onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} onAddContador={this.props.onAddContador} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect} onAddQuitar={this.removeTodo} onAddSession={this.props.onAddSession} onAddSessionFunction={this.handlerSession} onAddCode={this.state.code} />
						<Shares onAddPName={this.state.name} onAddPEmail={this.state.email} onAddCambio={this.handlerCambioOpcion2} onAddActivador={this.state.quitador} onAddCode={this.state.code} onAddPPerfil={this.props.onAddPerfil} />
						<Publics onAddCambio={this.handlerCambio} onAddPName={this.state.name} onAddPEmail={this.state.email} onAddPPerfil={this.state.perfil} onAddActivador={this.state.quitador} onAddCode={this.state.code} />
					</div>
				);
			}if(this.state.cambio === 'c2'){
				return (
					<div>
						<History onAddPName={this.state.name} onAddActivador={this.state.quitador} onAddSharepMas={this.handlerSharepMas} onAddShars={this.props.onAddSharep} onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} onAddContador={this.props.onAddContador} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect} onAddQuitar={this.removeTodo} onAddSession={this.props.onAddSession} onAddSessionFunction={this.handlerSession} onAddCode={this.state.code} />
						<Shares onAddPName={this.state.name} onAddPEmail={this.state.email} onAddCambio={this.handlerCambioOpcion2} onAddActivador={this.state.activador} onAddCode={this.state.code} onAddPPerfil={this.props.onAddPerfil} />
						<Publics onAddCambio={this.handlerCambio} onAddPName={this.state.name} onAddPEmail={this.state.email} onAddPPerfil={this.state.perfil} onAddActivador={this.state.quitador} onAddCode={this.state.code} />
					</div>
				);
			}if(this.state.cambio === 'c3'){
				return (
					<div>
						<History onAddPName={this.state.name} onAddActivador={this.state.quitador} onAddSharepMas={this.handlerSharepMas} onAddShars={this.props.onAddSharep} onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} onAddContador={this.props.onAddContador} onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect} onAddQuitar={this.removeTodo} onAddSession={this.props.onAddSession} onAddSessionFunction={this.handlerSession} onAddCode={this.state.code} />
						<Shares onAddPName={this.state.name} onAddPEmail={this.state.email} onAddCambio={this.handlerCambioOpcion2} onAddActivador={this.state.quitador} onAddCode={this.state.code} onAddPPerfil={this.props.onAddPerfil} />
						<Publics onAddCambio={this.handlerCambio} onAddPName={this.state.name} onAddPEmail={this.state.email} onAddPPerfil={this.state.perfil} onAddActivador={this.state.activador} onAddCode={this.state.code} />
					</div>
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

		const botonnotificacion = (function (){
			if(this.state.mostrarbotonnotifi){
				return (
					<Link to="#?" onClick={this.handlerActivarNotificaciones}><img src={campanita} className="publico" style={{ width: '35px', height: '35px', borderRadius: '50%' }} /></Link>
				);
			}
		}).bind(this)();

		const botoninstalacion = (function (){
			if(this.state.instalaraplicacion){
				return (
					<Link to="#?" onClick={this.installApp} className="publico btn btn-light">Instalar</Link>
				);
			}
		}).bind(this)();

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
									<a href="#?" className="salir" onClick={this.handlerSalirApp}><div style={{ float: 'right', margin: '0px 15px 0px 15px' }}>Salir</div></a>
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
									<div className="datosuser">
										{this.state.email}
									</div>
									<button type="button" className="datosuser btn btn-primary" style={{ width: 'auto' }} onClick={(e) => {this.handlerContactos(e)}}>Contactos</button>
									&nbsp;&nbsp;&nbsp;<a href={"/users/" + this.props.onAddCode} className="publico btn btn-light">Publico</a>
									&nbsp;&nbsp;&nbsp;{botonnotificacion}
									&nbsp;&nbsp;&nbsp;{botoninstalacion}
								</div>
							</div>
							<div className="row textoalineados justify-content-center sinmarging">
								<div id="msnno" className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 sinmarging sinpadding"></div>
							</div>
							<div className="row opcionesuser justify-content-center sinmarging">
								<button className="col-4 col-sm-4 col-md-4 col-lg-3 col-xl-2" style={this.state.btn1} onClick={(e) => {this.handlerCambiar(e, 'btn1', 'c1')}}><img src="https://maxcdn.icons8.com/app/uploads/2016/03/Home-300-1.png" width="30px" height="30px" /></button>
								<button className="col-4 col-sm-4 col-md-4 col-lg-3 col-xl-2" style={this.state.btn2} onClick={(e) => {this.handlerCambiar(e, 'btn2', 'c2')}}><img src="https://image.flaticon.com/icons/png/512/12/12656.png" width="30px" height="30px" /></button>
								<button className="col-4 col-sm-4 col-md-4 col-lg-3 col-xl-2" style={this.state.btn3} onClick={(e) => {this.handlerCambiar(e, 'btn3', 'c3')}}><img src="https://image.flaticon.com/icons/svg/19/19811.svg" width="30px" height="30px" /></button>
							</div>
							{mostrarcomponent}
						</div>
					</div>
				</div>
				<SocketNew onAddQuitar={this.handlerCerrarse} onAddName={this.state.name} onAddPerfil={this.state.perfil} onAddSecret={this.state.code} onAddValor={this.state.contactos} onAddValido={this.state.valido} onAddCambio={this.state.cambio} />
				{mostrarbusqueda}
			</div>
		);
	}
}

export default InfoUser;