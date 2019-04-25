import React, { Component } from 'react';
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state={
      tokenacces:'QJPEA4FGLS6UXXRQAWTO',
      categoriasList:[],
      resultadoList:[],
      filterget:{categoriaid:"103",buscar:" "}
    }    
    this.handleChangecategoria = this.handleChangecategoria.bind(this)
    this.handlerChange = this.handlerChange.bind(this)
  }

  componentDidMount(){
    this.cargarCategoria();
  }

  cargarCategoria(){
    const urlcat=`https://www.eventbriteapi.com/v3/categories/?token=${this.state.tokenacces}`
    fetch(urlcat)
    .then((response)=>{
      return response.json(); 
    }). then(function(resultado){      
      this.setState({categoriasList:resultado.categories})      
    }.bind(this))
    .catch(error=>{
      alert('error CAT',error);
    })
  }  
  handleChangecategoria(event){    
    var idcat=event.target.value
    var filterget={
      categoriaid:idcat
    }
    this.setState({filterget:filterget})
  }

  handlerChange(event){
    const { value } = event.target;
    var idcat=this.state.filterget.categoriaid

    var filterget={
      categoriaid:idcat,
      buscar:value
    }
    this.setState({filterget:filterget})
    
  }

  buscarData =(e)=>{
    e.preventDefault();
    this.mostrarResultado();
  }

  mostrarResultado(){
    
    alert("Buscar",this.state.filterget.buscar,">>> id",this.state.filterget.categoriaid)
    if(this.state.filterget.buscar===undefined)return
    const urlsearch=`https://www.eventbriteapi.com/v3/events/search/?q=${this.state.filterget.buscar}&categories=${this.state.filterget.categoriaid}&token=${this.state.tokenacces}`
    fetch(urlsearch)
    .then((response)=>{
      return response.json(); 
    }). then(function(resultado){
      console.log("resultado",resultado.events);
      var arreglo=[];
      var resultadoList=[]
      var cantidad=1;
      var cantidadrecorrida=1;
      var cantidadmax=resultado.events.length
      var cantidaarray=0;
      resultado.events.forEach(element => {        
        
        if(cantidad<4){
          if(element.logo===undefined){
            element.logo={
              original:{url:''}
            }
          }
          arreglo.push(element)
          cantidad++;
        }else{
          resultadoList[cantidaarray]=arreglo
          arreglo=[]
          arreglo.push(element)
          cantidaarray++;
          cantidad=2;
        }
        if(cantidadmax===cantidadrecorrida){
          if(cantidad<4){
            resultadoList[cantidaarray]=arreglo
          }
        }
        cantidadrecorrida++;        
      });
      console.log(resultadoList)

      this.setState({resultadoList:resultadoList})
      
    }.bind(this))
    .catch(error=>{
      alert('error Res',error);
    })    
  }

  render() {
    const { resultadoList } = this.state;
    return (
      <form onSubmit={this.buscarData}>
        <div className="backgroudsvg">        
          <div className="content">                     
            <table>
             <thead>
               <tr className="bcg">
            <td>
                 <input placeholder="Buscar por evento o ciudad"  
                    name="buscar"
                    value={this.state.filterget.buscar}
                    onChange={this.handlerChange}
                    type="text"
                  ></input>
                 </td>
                 <td>                
                <select name="categoria"  onChange={this.handleChangecategoria} >
                        {this.state.categoriasList.map(item=>(
                            <option key={item.id} value={item.id} >{item.name}</option>            
                        ))}
                    </select>
                 </td>
                 <td>                 
                 <button type="submit"  className="button" ><span>Buscar </span></button>
                 </td>
               </tr>
               {resultadoList.map(itemuno=>(
                <tr className="bcg">
                {itemuno.map(item=>(
                  <td >
                      <div className="contettable">
                      <div className="head"><img src={item.logo.original.url}></img> </div>
                      <div className="body">
                          <div className="title">{item.name.text}</div>
                          <div className="content">{item.summary}</div>
                      </div>
                      </div>                  
                  </td>
                ))}
                  
                </tr>
               ))}
             </thead>
             <tbody>

             </tbody>
           </table>
           
          </div>
        </div>
        <div className="content">
        </div>
      </form>
    );
  }
}

export default App;
