import React, { Component } from 'react';

import Publico from './Publico';
import Invalid from './Invalid';
import Page404 from '../Page404';
import '../../App.css';
import '../../css/formulario.css';

class Consulta extends Component{
	constructor(props){
		super(props);

		this.state = {
			name: '',
			perfil: '',
			existes: '',
			session: '',
			msnunique: ''
		};

		this.handlerSharepMas = this.handlerSharepMas.bind(this);
		this.handlerCambioOpcion2 = this.handlerCambioOpcion2.bind(this);
		this.handlerPostselect = this.handlerPostselect.bind(this);

	}

	componentDidMount() {
		const input = { unique: this.props.onAddXYyz, estado: this.props.onAddUserId };
		fetch("/user", {
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify(input), 
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.setState({ name: response.name, perfil: response.perfil, existes: response.existe, session: response.session, msnunique: response.msnunique }))
		.catch(error => console.error('Error:', error));

		if(this.props.onAddSession === 'true'){
			this.props.onAddPostPublicos("false", this.props.onAddUserId);
		}else{
			this.props.onAddPostPublicos("terminar", this.props.onAddUserId);
		}
  	}

	handlerSharepMas(count){
        this.props.onAddSharepMas({count: count.count, contador: count.contador, ultimateid: count.ultimateid });
    }

    handlerCambioOpcion2(e){
        this.props.onAddNuevs(e);
    }

    handlerPostselect(e){
        this.props.onAddPostNews(e);
    }

	render (){
		if(this.state.name !== 'false' && this.state.name !== ''){
			return (
				<div className="container-fluid sinpadding">
			        <Publico onAddPerfil={this.state.perfil} onAddName={this.state.name} onAddExiste={this.state.existes} onAddSessiones={this.state.session} 
			        	onAddSharep={this.props.onAddSharep} onAddSharestotal={this.props.onAddSharestotal} onAddUltimateid={this.props.onAddUltimateid} 
		          		onAddSharepMas={this.handlerSharepMas} onAddContador={this.props.onAddContador} onAddNuevs={this.handlerCambioOpcion2} 
		          		onAddPostNews={this.handlerPostselect} onAddPostselect={this.props.onAddPostselect} onAddUnique={this.state.msnunique} />
			    </div>
			);
		}else{
			return (
				<div className="container containersweaghe">
					<div className="row justify-content-center rowsweaghe p-4">
						<Invalid onAddName={this.state.name} onAddTexto={'-_- lo sentimos no se encontro el usuario'} />
					</div>
				</div>
			);
		}
	}
}

export default Consulta;