import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';

@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.page.html',
  styleUrls: ['./cliente-edit.page.scss'],
})
export class ClienteEditPage implements OnInit {
  @ViewChild('nombreyapellido') nombreyapellidoInput!: NgModel;
  @ViewChild('fechanacimiento') fechanacimientoInput!: NgModel;
  @ViewChild('bienasegurado') bienaseguradoInput!: NgModel;
  @ViewChild('montoasegurado') montoaseguradoInput!: NgModel;
  @ViewChild('cedula') cedulaInput!: NgModel;
  @ViewChild('direccion') direccionInput!: NgModel;

  cliente : any = {};
  id: any;
  isNew: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private readonly firestore: Firestore,
    private router: Router,
  ) { }

  
  ngOnInit() {
    this.route.params.subscribe((params:any)=>{
      console.log('params',params);
      this.id = params.id;
      if(params.id=='new'){
        this.isNew=true;
      }else{
        this.obtenerCliente(this.id);
      }
    });
  }

  editarCliente  =() => {
      const document = doc(this.firestore, "cliente", this.id);
      updateDoc(document,{
        nombreyapellido : this.cliente.nombreyapellido,
        fechanacimiento : this.cliente.fechanacimiento,
        bienasegurado : this.cliente.bienasegurado,
        montoasegurado : this.cliente.montoasegurado,
        cedula : this.cliente.cedula,
        direccion : this.cliente.direccion,
        

        
      }).then(() => {
        console.log("Fue Modificado con Éxito!!");
        this.router.navigate(['/cliente-list']);
      }).catch(error => {
        console.error("Error al editar la cliente:", error);
      });
  }
  
 guardarCliente() {
  if (this.isNew) {
    this.incluirCliente();
  } else {
    this.editarCliente();
  }
}

  incluirCliente = () =>{
    let clienteRef = collection(this.firestore, "cliente");
    
    addDoc(clienteRef,{
      nombreyapellido : this.cliente.nombreyapellido,
      fechanacimiento : this.cliente.fechanacimiento,
      bienasegurado : this.cliente.bienasegurado,
      montoasegurado : this.cliente.montoasegurado,
      cedula : this.cliente.cedula,
      direccion : this.cliente.direccion,
      
    }).then(doc=>{
      console.log("Registro Incluido");
      this.router.navigate(['/cliente-list']);
    }).catch(error =>{
      console.error("no se pudo registrar", error);
    })
  }

  obtenerCliente = async (id: string) => {
    const document = doc(this.firestore, "cliente", id);
    getDoc(document).then(doc =>{
      console.log("Registro a editar", doc.data());
      this.cliente = doc.data();
    })
  }

  eliminarCliente = () =>{
    const document = doc(this.firestore, "cliente", this.id);
    
    deleteDoc(document).then(doc => {
      console.log("Registro Eliminado");
      this.router.navigate(['/cliente-list']);
    }).catch(error => {
      console.error("Error al eliminar el registro:", error);
    });
  }
  
}