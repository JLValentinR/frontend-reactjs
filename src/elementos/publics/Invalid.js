import React, { Component } from 'react';

class Content extends Component{
	constructor(props){
		super(props);
	}
	render(){
		if(this.props.onAddName !== ''){
			return (
				<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2 align-self-center fondoinvalido">
					<h2 style={{ color: '#000000' }}>{this.props.onAddTexto}</h2>
				</div>
			);
		}else{
			return (
				<div>
				</div>
			);
		}
	}
}

export default Content;