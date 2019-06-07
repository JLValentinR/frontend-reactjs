import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../css/history.css';
import foto from '../cerrar.png';

let lastScrollY = 0;
let lastHeight = 0;
let documentheight = 0;

class History extends Component{

	constructor(props){
		super(props);

		this.state = {
			sharep: this.props.onAddShars,
			name: this.props.onAddPName?this.props.onAddPName: '',
			code: this.props.onAddCode?this.props.onAddCode: ''
		}

		this.handlerSharesTwenty = this.handlerSharesTwenty.bind(this);
		this.handlerScroll = this.handlerScroll.bind(this);
		this.removeTodo = this.removeTodo.bind(this);
		this.handlerAlertaServidor = this.handlerAlertaServidor.bind(this);
	}

	componentDidMount(){
  		window.location = "#" + this.props.onAddPostselect;
		window.addEventListener('scroll', this.handlerScroll);
	}

	removeTodo(index, v) {
		const input = { unique: this.state.code, unicopost: v };
		fetch("/deletepost", {
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerAlertaServidor(index, response.resultado, response.validarse))
		.catch(error => console.error('Error:', error));
  	}

  	handlerAlertaServidor(cantidad, k, h){
  		if(h != 'false'){
  			if(k == 'true'){
  				this.props.onAddQuitar(cantidad);
  				if(this.props.onAddSession === 'terminar'){
					this.props.onAddSessionFunction('false');
				}else{
					this.props.onAddSessionFunction('terminar');
				}
  			}
  		}else{
  			this.handlerCerrarSesiones();
  		}
  	}

  	componentWillReceiveProps(props){
  		this.setState({ sharep: props.onAddShars });
  	}

  	handlerSharesTwenty(){
  		const input = { unique: this.state.code, idpublics: "" + this.props.onAddUltimateid + "" };
		fetch("/twenty", {
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerMas(response.sharep, response.registered))
		.catch(error => console.error('Error:', error));
  	}

  	handlerMas(a, b){
  		if(b[0].ultimateid === 'vacio'){
  			this.handlerCerrarSesiones();
  		}else{
	  		this.props.onAddSharepMas({a: a, contador: (this.props.onAddContador + 20), ultimateid: b[0].ultimateid });
  		}
  	}

  	componentWillUnmount() {
    	window.removeEventListener('scroll', this.handlerScroll);
  	}

  	div = React.createRef();

  	handlerScroll(){
  		lastScrollY = window.scrollY;
  		lastHeight = window.innerHeight;
  		documentheight = document.documentElement.scrollHeight;

  		if(lastScrollY + lastHeight === documentheight){
  			if(this.props.onAddContador < this.props.onAddSharestotal){
  				this.handlerSharesTwenty();
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

	handlerVisualPost(a, b){

	}

	render (){
		let imagenuser = '', uno = 2;
		const sharep = this.state.sharep.map((share, i) => {
			imagenuser = { background: 'url(' + share.msnimage + ') center center / cover no-repeat' };

			if(parseInt(i) < 2){
				return (
					<div id={share.msncodeunique} className="square" style={imagenuser} key={i}>
				        <Link to={"/posts/" + share.msncodeunique} style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%' }}></Link>
				        <Link to="#?" onClick={this.removeTodo.bind(this, i, share.msncodeunique)} style={{ position: 'absolute', top: '0px', right: '0px' }}>
				        	<img src={foto} className="imgopcionestitulo" />
				        </Link>
				    </div>
			    )
			}else{
				if(parseInt(i) === uno){
					uno = (parseInt(uno) + 3);

					return (
						<div id={share.msncodeunique} className="square lastchild" style={imagenuser} key={i}>
							<Link to={"/posts/" + share.msncodeunique} style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%' }}></Link>
							<Link to="#?" onClick={this.removeTodo.bind(this, i, share.msncodeunique)} style={{ position: 'absolute', top: '0px', right: '0px' }}>
					        	<img src={foto} className="imgopcionestitulo" />
					        </Link>
						</div>
					)
				}else{
					return (
						<div id={share.msncodeunique} className="square" style={imagenuser} key={i}>
							<Link to={"/posts/" + share.msncodeunique} style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%' }}></Link>
							<Link to="#?" onClick={this.removeTodo.bind(this, i, share.msncodeunique)} style={{ position: 'absolute', top: '0px', right: '0px' }}>
				        		<img src={foto} className="imgopcionestitulo" />
				        	</Link>
						</div>
					)
				}
			}
		});

		return (
			<div className="formulariohistory" style={{ display: this.props.onAddActivador }}>
				<div className="row justify-content-center sinmarging sinpadding">
					<div id="cs" className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 scrolldiv sinmarging sinpadding" ref={this.div}>
						<div className="wrapper">
							{sharep}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default History;