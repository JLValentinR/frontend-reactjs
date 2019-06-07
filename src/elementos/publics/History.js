import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../../css/history.css';

let lastScrollY = 0;
let lastHeight = 0;
let documentheight = 0;

class History extends Component{

	constructor(props){
		super(props);

		this.state = {
			sharep: this.props.onAddShars,
			name: this.props.onAddPName?this.props.onAddPName: 'Nada'
		}

		this.handlerSharesTwenty = this.handlerSharesTwenty.bind(this);
		this.handlerScroll = this.handlerScroll.bind(this);
	}

	componentDidMount(){
		window.location = "#" + this.props.onAddPostselect;
		window.addEventListener('scroll', this.handlerScroll);
	}

	removeTodo(index) {
    	this.setState({
      		sharep: this.state.sharep.filter((e, i) => {
        		return i !== index
      		})
    	});
  	}

  	componentWillReceiveProps(props){
  		this.setState({ sharep: props.onAddShars });
  	}

  	handlerSharesTwenty(){
  		const input = { idpublics: "" + this.props.onAddUltimateid + "", contactsecret: this.props.onAddContactSecret };
		fetch("/veinte", {
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
	}

	render (){
		let imagenuser = '', uno = 2;
		const sharep = this.state.sharep.map((share, i) => {
			imagenuser = { background: 'url(' + share.msnimage + ') center center / cover no-repeat' };

			if(parseInt(i) < 2){
				return (
			        <Link id={share.msncodeunique} to={"/share/" + share.msncodeunique} className="square" style={imagenuser} key={i}></Link>
			    )
			}else{
				if(parseInt(i) === uno){
					uno = (parseInt(uno) + 3);

					return (
						<Link id={share.msncodeunique} to={"/share/" + share.msncodeunique} className="square lastchild" style={imagenuser} key={i}></Link>
					)
				}else{
					return (
						<Link id={share.msncodeunique} to={"/share/" + share.msncodeunique} className="square" style={imagenuser} key={i}></Link>
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