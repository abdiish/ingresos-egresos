import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  // Obtener información del usuario activo
  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    });
  }

  crearUsuario(nombre: string, email: string, password:string) {

    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => { // Uso de desestructuración, extraer propiedades
        // Crear instancia de usuario
        const newUser = new Usuario( user?.uid, nombre, user?.email );

        return this.firestore.doc(`${ user?.uid }/usuario`).set({...newUser});
      });

  }

  loginUsuario(email: string, password: string) {

    return this.auth.signInWithEmailAndPassword(email, password);

  }

  logout() {

    return this.auth.signOut();

  }

  isAuth() {

    // Operador map, se toma el usuario de firebase
    // Se retorna un true o false
    // Si existe el usuario => true
    // Si no existe el usuario => false
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null)
    );

  }

}
