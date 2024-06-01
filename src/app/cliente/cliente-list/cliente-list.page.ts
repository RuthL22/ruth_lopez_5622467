import { Component, OnInit } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
} from '@angular/fire/firestore';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.page.html',
  styleUrls: ['./cliente-list.page.scss'],
})


export class ClienteListPage implements OnInit {

  constructor( 
    private readonly firestore: Firestore,
    private alertCtrl: AlertController 
  ) { }

  listaCliente = new Array();
  maxResults = 15;
  ultimaClienteRecuperada: any = null;
  isSearch: boolean = false;
  query = '';


  ngOnInit() {
    this.listaCliente = new Array();
    this.ultimaClienteRecuperada = null;
    this.listarClienteSinFiltro();
  }


  ionViewWillEnter() {
    this.listaCliente = new Array();
    this.ultimaClienteRecuperada = null;
    this.listarClienteSinFiltro();
  }


  listarClienteSinFiltro = () => {
    console.log('Listar cliente sin filtro');
    const clientesRef = collection(this.firestore, 'cliente');

    let q;
    if (this.ultimaClienteRecuperada) {
      q = query(
        clientesRef,
        limit(this.maxResults),
        startAfter(this.ultimaClienteRecuperada)
      );
    } else {
      q = query(clientesRef, limit(this.maxResults));
    }



    const querySnapshot = getDocs(q).then((re) => {
      if (!re.empty) {
        this.ultimaClienteRecuperada = re.docs[re.docs.length - 1];

        re.forEach((doc) => {
          let cliente: any = doc.data();
          cliente.id = doc.id;
          if (!this.listaCliente.some((a) => a.id === cliente.id)) {
            this.listaCliente.push(cliente);
          }
        });
      } else {
        console.log('No hay más clientes para cargar.');
      }
    });

    console.log(this.listaCliente);
  };



  onIonInfinite(ev: any) {
    this.listarClienteSinFiltro();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }


  clickSearch = () => {
    this.isSearch = true;
  };

  clearSearch = () => {
    this.isSearch = false;
    this.query = '';

    this.listaCliente = new Array();
    this.ultimaClienteRecuperada = null;

    this.listarClienteSinFiltro();
  };

  buscarSearch = (e: any) => {
    this.isSearch = false;
    this.query = e.target.value;

    this.listaCliente = new Array();
    this.ultimaClienteRecuperada = null;
    this.listarCliente();
  };


  listarCliente = () =>{
    console.log("listar clientes");
    const clientesRef = collection(this.firestore, 'cliente');

    if ((this.query+"").length > 0){
      let q = undefined;
      if (this.ultimaClienteRecuperada){
        q= query(clientesRef,
          where ("nombreyapellido", ">=", this.query.toUpperCase()),
          where ("nombreyapellido", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.maxResults),
          startAfter(this.ultimaClienteRecuperada));
      } else {
        q= query(clientesRef,
          where ("nombreyapellido", ">=", this.query.toUpperCase()),
          where ("nombreyapellido", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.maxResults));
      }

      getDocs(q).then(re => {
        if (!re.empty){
          let listaCliente = new Array();

          for (let i= 0; i < re.docs.length; i++){
            const doc : any = re.docs[i].data();
            if(doc.nombreyapellido.toUpperCase().
                  startsWith(
                      this.query.toUpperCase().charAt(0) 
            )){
              listaCliente.push(re.docs[i])
            }

            
          }

          this.ultimaClienteRecuperada = re.docs[listaCliente.length-1];

            for(let i = 0; i < listaCliente.length; i++){
              const doc : any = listaCliente[i];
              let cliente : any = doc.data();
              cliente.id = doc.id;
              this.listaCliente.push(cliente);
            };

        }
      });

    } else {
      this.listarClienteSinFiltro();
    }
  }
}