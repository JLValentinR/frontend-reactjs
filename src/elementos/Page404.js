import React, { Component } from 'react';
import '../App.css';
import '../css/formulario.css';

class Page404 extends Component{

	constructor(){
		super();
	}

	render(){
		return (
			<div className="container containersweaghe">
				<div className="row justify-content-center rowsweaghe p-4">
					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2 align-self-center fondoinvalido">
						<h2 style={{ color: '#000000' }}>Page404</h2>
					</div>
				</div>
			</div>
		);
	}
}

export default Page404;