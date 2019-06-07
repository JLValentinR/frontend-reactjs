import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import foto from '../../cerrar.png';
import regresar from '../../regresarizquierda.png';
import ampliar from '../../ampliar.png';
import connect from '../../connect.png';
import tono from '../../msn_msg.mp3';
import '../../css/chat.css';
import desenfocar2 from '../../desenfocar2.jpg';
import envio from '../../envio.png';
const socket = window.io();

const { contacts } = { "contacts": [] };
const { messagelists } = { "messagelists": [] };
const { presentes } = { "presentes": [] };
var ringtone = "";

function _xuma(a){ return document.getElementById(a); }
function isInPage(node) { return (node === document.body) ? false : document.body.contains(node); }
function fecha(params){
	if (params < 10) {
		params = '0' + params;
	}
	return params;
}

class SocketNew extends Component{
	static propTypes = {
    	cookies: instanceOf(Cookies).isRequired
  	};

	constructor (props){
		super(props);
		this.state = {
			secret: '',
			secretcontact: '',
			name: '',
			message: '',
			socketusername: '',
			contacts,
			contactselect: '',
			activador: 'block',
			desactivador: 'none',
			nameselects: 'Contactos',
			messagelists,
			presentes,
			escribiendo: '',
			minimizar: '',
			perfil: '',
			imagenconnect2: 1
		};

		this.handlerEnviar = this.handlerEnviar.bind(this);
		this.handlerMessage = this.handlerMessage.bind(this);
		this.handlerCerrar = this.handlerCerrar.bind(this);
		this.handlerAmpliar = this.handlerAmpliar.bind(this);
		this.handlerMostrarContactos = this.handlerMostrarContactos.bind(this);
		this.handlerTimer = this.handlerTimer.bind(this);
		this.handlerStop = this.handlerStop.bind(this);
		this.handlerCargarContactos = this.handlerCargarContactos.bind(this);
		this.handlerRegresars = this.handlerRegresars.bind(this);
	}

	controller = new AbortController();

	componentDidMount(){
		const { cookies } = this.props;
		const input = { token: cookies.get('xyz') };
		fetch("/invitados", {
			signal: this.controller.signal,
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerRegresar(response))
		.catch(error => console.error('Error:', error));

		this.setupBeforeUnloadListener();
	}

	componentWillUnmount(){
	    this.controller.abort();
	}

	handlerCargarContactos(){
		const { cookies } = this.props;
		const input = { unique: cookies.get('xyz') };
		fetch("/invitados2", {
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerRegresars(response.contacts, response.information))
		.catch(error => console.error('Error:', error));

		this.setupBeforeUnloadListener();
	}

	handlerRegresars(a, b){
		if(b.existe == 'true'){
			this.setState({ contacts: a, minimizar: 'true', imagenconnect2: 1 });
		}else{
			this.props.onAddSession("false");
		}
	}

	handlerRegresar(c){
		this.setState({ name: c.name, secret: c.code, perfil: c.perfil });

		socket.on('chat:' + this.state.secret, function (data){
			if(isInPage(_xuma("xuma" + data.idcontacto[0].secretcontact))){
				_xuma("xuma" + data.idcontacto[0].secretcontact).setAttribute("class", "usuariosestado2");
			}
			if(this.state.secretcontact == data.idcontacto[0].secretcontact){
				this.setState({
					messagelists: [...data.messagelists, ...this.state.messagelists],
					escribiendo: ''
				});

				window.location = "#anclafinal";
			}
			if(data.idcontacto[0].secretcontact == data.messagelists[0].msnunique){
				ringtone.play();
			}else{
				if(isInPage(_xuma("xuma" + data.idcontacto[0].secretcontact))){
					_xuma("xuma" + data.idcontacto[0].secretcontact).setAttribute("class", "usuariosestado1");
				}
			}
		}.bind(this));

		socket.emit('chat:activo', {
			secret: this.state.secret,
			inicio: 'true'
		});

		socket.on('chat:activo', function (data){
			if(data.estado[0].inicio === "true"){
				if(isInPage(_xuma(data.estado[0].msnunique))){
					_xuma(data.estado[0].msnunique).innerHTML = "<div class='imagenconnect'></div>";
				}if(this.state.secretcontact == data.estado[0].msnunique){
					this.setState({
						imagenconnect2: 2
					});
				}
			}if(data.estado[0].inicio === "false"){
				if(isInPage(_xuma(data.estado[0].msnunique))){
					_xuma(data.estado[0].msnunique).innerHTML = "";
				}if(this.state.secretcontact == data.estado[0].msnunique){
					this.setState({
						imagenconnect2: 1
					});
				}	
			}
		}.bind(this));

		socket.on('typing:' + this.state.secret, function (data){

			if(this.state.secretcontact === data.secret){
				this.setState({
					escribiendo: data.message
				});
			}
		}.bind(this));
	}

	handlerEnviar(e){
		e.preventDefault();

		if(this.state.message !== ""){
			var messageform = this.state.message;
			var messageformsimple = messageform.replace(/(<([^>]+)>)/ig, '');

			let hoy = '', dd = '', mm = '', yyyy = '', hh = '', mmm = '', ss = '';
			hoy = new Date();
		    dd = hoy.getDate();
		    mm = hoy.getMonth()+1;
		    yyyy = hoy.getFullYear();
		    hh = hoy.getHours();
		    mmm = hoy.getMinutes();
		    ss = hoy.getSeconds();

		    let dia = yyyy + '-' + fecha(mm) + '-' + fecha(dd);
		    let hora = fecha(hh) + ':' + fecha(mmm) + ':' + fecha(ss);

			socket.emit('chat:message', {
				secret: this.state.secret,
				secretcontact: this.state.secretcontact,
				message: messageformsimple,
				name: this.state.name,
				perfil: this.state.perfil,
				fechas: dia,
				horas: hora
			});

			const { mensajenuevo } = { "mensajenuevo": [{ "msnunique": this.state.secret, "msnmessage": messageformsimple, "msnday": dia, "msntime": hora }] };
			this.setState({
				message: '',
				messagelists: [...mensajenuevo, ...this.state.messagelists]
			});

			_xuma("message").value = "";
			if(isInPage(_xuma("xuma" + this.state.secretcontact))){
				_xuma("xuma" + this.state.secretcontact).setAttribute("class", "usuariosestado1");
			}

			window.location = "#anclafinal";
		}
	}

	componentWillReceiveProps(props){
		if(props.onAddOcultar == 'false'){
			this.setState({
				minimizar: ''
			});

			this.props.onAddQuitar("true");
		}
	}

	handlerMessage(e){
		const {value} = e.target;
		var messageform = value;
		var messageformsimple = messageform.replace(/(<([^>]+)>)/ig, '');

		this.setState({
			message: messageformsimple
		});

		socket.emit('chat:typing', {
			secret: this.state.secret,
			secretcontact: this.state.secretcontact,
			message: 'escribiendo ...'
		});
	}

	handlerCerrar(){
		this.setState({
			activador: 'block',
			desactivador: 'none',
			nameselects: 'Contactos',
			minimizar: '',
			imagenconnect2: 1,
			secretcontact: ''
		});

		socket.emit('chat:activo', {
			secret: this.state.secret,
			inicio: 'true'
		});
	}

	handlerAmpliar(){
		this.handlerCargarContactos();
	}

	handlerCInvitado(e, a, j){
		const { cookies } = this.props;
		const input = { unique: cookies.get('xyz'), secretcontact: "" + j + "" };
		fetch("/messages", {
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerRegresarMessage(e, a, j, response.message, response.conexion))
		.catch(error => console.error('Error:', error));

		socket.emit('chat:activo', {
			secret: this.state.secret,
			inicio: 'true'
		});
	}

	handlerRegresarMessage(e, a, j, b, yv){
		if(yv == 'false'){
			this.handlerCerrarSesiones();
		}else{
			this.setState({
				activador: 'none',
				desactivador: 'block',
				nameselects: a,
				secretcontact: j,
				messagelists: [...b],
				escribiendo: ''
			});

			if(isInPage(_xuma("xuma" + j))){
				_xuma("xuma" + j).setAttribute("class", "usuariosestado1");
			}

			window.location = "#anclafinal";
		}
	}

	handlerMostrarContactos(){
		this.setState({
			activador: 'block',
			desactivador: 'none',
			nameselects: 'Contactos',
			secretcontact: '',
			imagenconnect2: 1,
			secretcontact: ''
		});
	}

	doSomethingBeforeUnload = () => {
        socket.emit('chat:activo', {
			secret: this.state.secret,
			inicio: 'false'
		});
    }

    setupBeforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {
            return this.doSomethingBeforeUnload();
        });
    };

    componentDidUpdate(){
    	ringtone = _xuma('miAudio');
    	window.addEventListener('focus', this.handlerTimer);
    	window.addEventListener('blur', this.handlerStop);
    }

    handlerTimer(){
    	socket.emit('chat:activo', {
			secret: this.state.secret,
			inicio: 'true'
		});
    }

    handlerStop(){
    	socket.emit('chat:activo', {
			secret: this.state.secret,
			inicio: 'false'
		});
    }

    handlerCerrarSesiones(){
    	this.props.onAddSession("false");
	}

	render() {
		let imagenuser = '';
		var hoy = '', dd = '', mm = '', yyyy = '', dia = '';
		var pattern = /^(ftp|http|https):\/\/[^ "]+$/;
		var regex = new RegExp(pattern);

		const contacts = this.state.contacts.map((contact, i) => {
			imagenuser = { background: 'url(' + contact.msnperfil + ') center center / cover no-repeat' };

			if(contact.msnalerta == 1){
				return (
					<div className="acontactos1" key={i}>
						<div className="row fondocontacto sinmarging sinpadding">
							<a href={"/users/" + contact.msnuniquecontact} className="acontactos">
								<div className="imagencontacto" style={ imagenuser }></div>
							</a>
							<Link to="#?" className="acontactos2" onClick={(e) => {this.handlerCInvitado(e, contact.msnname, contact.msnuniquecontact)}}>
								<div className="row sinmarging sinpadding">
									<div className="nombrecontacto align-self-center">{contact.msnname}</div>
									<div id={"xuma" + contact.msnuniquecontact} className="usuariosestado2">1</div>
									<div id={contact.msnuniquecontact} className="usuariosestado"></div>
								</div>
							</Link>
						</div>
					</div>
				);
			}else{
				return (
					<div className="acontactos1" key={i}>
						<div className="row fondocontacto sinmarging sinpadding">
							<a href={"/users/" + contact.msnuniquecontact} className="acontactos">
								<div className="imagencontacto" style={ imagenuser }></div>
							</a>
							<Link to="#?" className="acontactos2" onClick={(e) => {this.handlerCInvitado(e, contact.msnname, contact.msnuniquecontact)}}>
								<div className="row sinmarging sinpadding">
									<div className="nombrecontacto align-self-center">{contact.msnname}</div>
									<div id={"xuma" + contact.msnuniquecontact} className="usuariosestado1">1</div>
									<div id={contact.msnuniquecontact} className="usuariosestado"></div>
								</div>
							</Link>
						</div>
					</div>
				);
			}
		});

		const messagelists = this.state.messagelists.map((messagelist, i) => {
			if(messagelist.msnunique == this.state.secret){
				if(regex.test(messagelist.msnmessage)){
					return (
						<div key={i}>
							<div className="row justify-content-center m-0 mb-2 fechafondos">
								<div className="col fechamensajes">
									{messagelist.msnday}
								</div>
							</div>
							<div className="right">
								<div className="anchotextoright">
									<div className="msnright">
										<a href={messagelist.msnmessage} className="achat" target="_blank">{messagelist.msnmessage}</a>
										<div className="horaright">{messagelist.msntime}</div>
									</div>
								</div>
								<div className="espacio"></div>
							</div>
						</div>
					);
				}else{
					return (
						<div key={i}>
							<div className="row justify-content-center m-0 mb-2 fechafondos">
								<div className="col fechamensajes">
									{messagelist.msnday}
								</div>
							</div>
							<div className="right">
								<div className="anchotextoright">
									<div className="msnright">
										<div>{messagelist.msnmessage}</div>
										<div className="horaright">{messagelist.msntime}</div>
									</div>
								</div>
								<div className="espacio"></div>
							</div>
						</div>
					);
				}
			}else{
				if(regex.test(messagelist.msnmessage)){
					return (
						<div key={i}>
							<div className="row justify-content-center m-0 mb-2 fechafondos">
								<div className="col fechamensajes">
									{messagelist.msnday}
								</div>
							</div>
							<div className="left">
								<div className="anchotextoleft">
									<div className="msnleft">
										<a href={messagelist.msnmessage} className="achat" target="_blank">{messagelist.msnmessage}</a>
										<div className="horaleft">{messagelist.msntime}</div>
									</div>
								</div>
								<div className="espacio"></div>
							</div>
						</div>
					);
				}else{
					return (
						<div key={i}>
							<div className="row justify-content-center m-0 mb-2 fechafondos">
								<div className="col fechamensajes">
									{messagelist.msnday}
								</div>
							</div>
							<div className="left">
								<div className="anchotextoleft">
									<div className="msnleft">
										<div>{messagelist.msnmessage}</div>
										<div className="horaleft">{messagelist.msntime}</div>
									</div>
								</div>
								<div className="espacio"></div>
							</div>
						</div>
					);
				}
			}
		}).reverse();

		const nameselectss = (function (){
			if(this.state.imagenconnect2 == 1){
				return (
					<div id="nameselectss">{this.state.nameselects}</div>
				);
			}else{
				return (
					<div id="nameselectss">{this.state.nameselects}&nbsp;&nbsp;<div className='imagenconnect2'></div></div>
				);
			}
		}).bind(this)();

		if(this.state.minimizar !== ''){
			return (
				<div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3 chat-container sinmarging sinpadding">
					<div className="contenedorprincipio">
						<div className="row titulocontacto sinmarging sinpadding">
							<div className="row anchotitulo sinmarging sinpadding">
								<a href="#?" onClick={this.handlerMostrarContactos} style={{ display: this.state.desactivador }}>
									<img src={regresar} className="imgopciones" />
								</a>
								{nameselectss}
							</div>
							<div className="anchoopciones">
								<a href="#?" onClick={this.handlerCerrar}>
									<img src={foto} className="imgopciones23" />
								</a>
							</div>
						</div>
						<div className="listacontactos" style={{ display: this.state.activador }}>{contacts}</div>

						<form onSubmit={this.handlerEnviar} style={{ display: this.state.desactivador, position: 'relative', height: '100%' }} autoComplete="off">
							<div className="fondosimagen" style={{ background: 'url("' + desenfocar2 + '") center center / cover no-repeat rgb(32, 75, 101)' }}></div>
							<div id="chat-window">
								<div id="output">
									{messagelists}
									<div id="anclafinal"></div>
								</div>
							</div>
							<div style={{ position: 'relative' }}>
								<div className="actions"><b>{this.state.escribiendo}</b></div>
								<div className="row sinmarging sinpadding">
									<input type="text" id="message" defaultValue={this.state.message} placeholder="Message" onChange={this.handlerMessage} />
									<button id="submitmensajes" type="submit" style={{ background: 'url("' + envio + '") center center / cover no-repeat rgb(255, 255, 255)' }}></button>
								</div>
							</div>
						</form>
					</div>
					<audio id="miAudio" src={tono} className="anclafinal"></audio>
				</div>
			);
		}else{
			return(
				<div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3 chat-containercontacto sinmarging sinpadding">
					<div className="contenedorprincipio">
						<div className="row titulocontacto sinmarging sinpadding">
							<div className="row anchotitulo sinmarging sinpadding">
								{this.state.nameselects}
							</div>
							<div className="anchoopciones">
								<a href="#?" onClick={this.handlerAmpliar}>
									<img src={ampliar} className="imgopciones23" />
								</a>
							</div>
						</div>
					</div>
					<audio id="miAudio" src={tono} className="anclafinal"></audio>
				</div>
			);
		}
	}
}

export default withCookies(SocketNew);