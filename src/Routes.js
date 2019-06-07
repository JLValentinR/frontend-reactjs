import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { createBrowserHistory } from 'history';
import asyncComponent from './AsyncComponent';

const AppPrivates = asyncComponent(() =>
    import('./elementos/AppPrivates').then(module => module.default)
)

const Invitation = asyncComponent(() =>
    import('./elementos/publics/Invitation').then(module => module.default)
)

const Reset = asyncComponent(() =>
    import('./elementos/publics/Reset').then(module => module.default)
)

const AppPublics = asyncComponent(() =>
    import('./elementos/publics/AppPublics').then(module => module.default)
)

const Details = asyncComponent(() =>
    import('./elementos/Details').then(module => module.default)
)

const DetailsPublic = asyncComponent(() =>
    import('./elementos/publics/Details').then(module => module.default)
)

const Page404 = asyncComponent(() =>
    import('./elementos/Page404').then(module => module.default)
)

const history = createBrowserHistory();

const { sharep } = { "sharep": [] };

class AppRoutes extends Component {
	static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

	constructor(){
		super();

		this.state = {
			sharep,
			sharestotal: '',
			ultimateid: '',
			contador: 0,
			postselect: '',
			sesion: 'true',
			userpublico: 'gfhrtyrty'
		}

		this.handlerMostrarImagenes = this.handlerMostrarImagenes.bind(this);
		this.handlerRegresars = this.handlerRegresars.bind(this);
		this.handlerComponente = this.handlerComponente.bind(this);
		this.handlerSharepMas = this.handlerSharepMas.bind(this);
		this.handlerCambioOpcion2 = this.handlerCambioOpcion2.bind(this);
		this.handlerPostselect = this.handlerPostselect.bind(this);
		this.handlerSession = this.handlerSession.bind(this);
		this.handlerPostPublicos = this.handlerPostPublicos.bind(this);
		this.removeTodo = this.removeTodo.bind(this);
	}

	componentDidMount(){
		const { cookies } = this.props;
		const input = { unique: cookies.get('xyz') };
		fetch("/postales", {
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => this.handlerRegresars(response.sharep, response.registered, "yes", "vacio", 20))
		.catch(error => console.error('Error:', error));
	}

	handlerRegresars(a, b, j, x, l){
		if(j === 'yes'){
			if(b[0].total !== 'vacio' && b[0].ultimateid !== 'vacio'){
				if(l == 20){
					this.setState({ sharep: a, sharestotal: b[0].total, ultimateid: b[0].ultimateid, sesion: 'terminar', userpublico: x, contador: 20});
				}else{
					this.setState({ sharep: a, sharestotal: b[0].total, ultimateid: b[0].ultimateid, sesion: 'terminar', userpublico: x});
				}
			}else{
				this.setState({ sharep: sharep });
			}
		}else{
			if(b[0].total !== 'vacio' && b[0].ultimateid !== 'vacio'){
				this.setState({ sharep: a, sharestotal: b[0].total, ultimateid: b[0].ultimateid });
			}else{
				this.setState({ sharep: sharep });
			}
		}
	}

	handlerMostrarImagenes(){
		console.log(this.state.sharep, this.state.postselect, this.state.sesion, this.state.sharestotal, this.state.ultimateid, this.state.contador, this.state.userpublico);
	}

  	handlerSharepMas(count){
		this.setState({ sharep: [...this.state.sharep, ...count.count], contador: count.contador, ultimateid: count.ultimateid });
	}

	handlerCambioOpcion2(e){
		this.setState({
			sharep: [e, ...this.state.sharep]
		});
	}

	handlerPostselect(e){
		this.setState({
			postselect: e
		});
	}

  	handlerComponente(){
  		return (<AppPrivates onAddSharep={this.state.sharep} onAddSharestotal={this.state.sharestotal} 
  			onAddUltimateid={this.state.ultimateid} onAddSharepMas={this.handlerSharepMas} 
  			onAddContador={this.state.contador} onAddNuevs={this.handlerCambioOpcion2} onAddPostselect={this.state.postselect} 
  			onAddSession={this.state.sesion} onAddSessionFunction={this.handlerSession} onAddQuitar={this.removeTodo} />);
  	}

  	handlerSession(e){
  		if(e == 'false'){
  			const { cookies } = this.props;
  			const input = { estado: cookies.get('xyz') };
			fetch("/postales2", {
				method: 'POST',  
				body: JSON.stringify(input),  
				headers:{
					'Content-Type': 'application/json'
				}
			}).then(res => res.json())
			.then(response => this.handlerRegresars(response.sharep, response.registered, 'yes', 'vacio', 20))
			.catch(error => console.error('Error:', error));
  		}
  	}

  	handlerPostPublicos(e, i){
  		if(this.state.userpublico != i){
	  		const input = { estado: i };
			fetch("/postals", {
				method: 'POST',  
				body: JSON.stringify(input),  
				headers:{
					'Content-Type': 'application/json'
				}
			}).then(res => res.json())
			.then(response => this.handlerRegresars(response.sharep, response.registered, 'yes', i, 20))
			.catch(error => console.error('Error:', error));
		}
  	}

  	removeTodo(index) {
    	this.setState({
      		sharep: this.state.sharep.filter((e, i) => {
        		return i !== index
      		})
    	});
  	}

	render () {
        return (
			<Router history={history}>
				<div>
					<a href="#?" onClick={this.handlerMostrarImagenes} style={{ display: 'none', color: "#000000"}}>Mostrar</a>
					<Switch>
						<Route exact path="/users/:userId" render={(props) => <AppPublics {...props} onAddSharep={this.state.sharep} onAddSharestotal={this.state.sharestotal} 
																		  			onAddUltimateid={this.state.ultimateid} onAddSharepMas={this.handlerSharepMas} 
																		  			onAddContador={this.state.contador} onAddNuevs={this.handlerCambioOpcion2} onAddPostselect={this.state.postselect} 
																		  			onAddSession={this.state.sesion} onAddPostPublicos={this.handlerPostPublicos} /> } />
						<Route exact path="/posts/:postId" render={(props) => <Details {...props} onAddPostNews={this.handlerPostselect} />} />
						<Route exact path="/share/:postId" render={(props) => <DetailsPublic {...props} onAddPostNews={this.handlerPostselect} />} />
						<Route exact path="/email/:emailId" render={(props) => <Invitation {...props} onAddPostNews={this.handlerPostselect} />} />
						<Route exact path="/resetear/:restablecerId" render={(props) => <Reset {...props} onAddPostNews={this.handlerPostselect} />} />
						<Route exact path="/" component={this.handlerComponente} />
						<Route component={Page404} />
					</Switch>
				</div>
			</Router>
		)
    }
}

export default withCookies(AppRoutes);